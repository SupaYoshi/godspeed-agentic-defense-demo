#!/usr/bin/env python3
"""Call the configured Microsoft Foundry agent from the Godspeed web backend."""

import json
import os
import socket
import sys
import time


MSAL_CLIENT_ID = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
MSAL_CACHE_PATH = os.environ.get("FOUNDRY_MSAL_CACHE_PATH", os.path.expanduser("~/.cache/godspeed-foundry-msal.json"))


def force_ipv4_if_requested():
    if os.environ.get("AZURE_FORCE_IPV4", "1") != "1":
        return
    original_getaddrinfo = socket.getaddrinfo

    def getaddrinfo_ipv4(*args, **kwargs):
        return [item for item in original_getaddrinfo(*args, **kwargs) if item[0] == socket.AF_INET]

    socket.getaddrinfo = getaddrinfo_ipv4


class MsalCacheCredential:
    def __init__(self):
        from azure.core.credentials import AccessToken
        import msal

        self._access_token = AccessToken
        self._msal = msal
        self._cache = msal.SerializableTokenCache()
        if os.path.exists(MSAL_CACHE_PATH):
            with open(MSAL_CACHE_PATH, "r", encoding="utf-8") as handle:
                self._cache.deserialize(handle.read())
        authority = f"https://login.microsoftonline.com/{os.environ.get('AZURE_TENANT_ID') or 'organizations'}"
        self._app = msal.PublicClientApplication(
            MSAL_CLIENT_ID,
            authority=authority,
            token_cache=self._cache,
            instance_discovery=False,
            timeout=15,
        )

    def get_token(self, *scopes, **_kwargs):
        scope_list = list(scopes) or ["https://ai.azure.com/.default"]
        result = None
        for account in self._app.get_accounts():
            result = self._app.acquire_token_silent(scope_list, account=account)
            if result:
                break
        if not result or "access_token" not in result:
            raise RuntimeError("No cached Foundry token. Run scripts/foundry-msal-login.py first.")
        if self._cache.has_state_changed:
            os.makedirs(os.path.dirname(MSAL_CACHE_PATH), exist_ok=True)
            with open(MSAL_CACHE_PATH, "w", encoding="utf-8") as handle:
                handle.write(self._cache.serialize())
        expires_on = int(result.get("expires_on") or (time.time() + int(result.get("expires_in", 3600))))
        return self._access_token(result["access_token"], expires_on)


def main():
    force_ipv4_if_requested()
    payload = json.load(sys.stdin)
    endpoint = payload.get("endpoint") or os.environ.get("FOUNDRY_PROJECT_ENDPOINT")
    agent_name = payload.get("agentName") or os.environ.get("FOUNDRY_AGENT_NAME") or "Godspeed-Agentic-Defense"
    agent_version = payload.get("agentVersion") or os.environ.get("FOUNDRY_AGENT_VERSION") or "4"
    input_text = payload.get("input") or ""

    if not endpoint:
        raise RuntimeError("FOUNDRY_PROJECT_ENDPOINT is required")
    if not input_text.strip():
        raise RuntimeError("input is required")

    try:
        from azure.ai.projects import AIProjectClient
        from azure.identity import DefaultAzureCredential, DeviceCodeCredential, TokenCachePersistenceOptions
    except ImportError as exc:
        raise RuntimeError(
            "Missing Python dependencies. Install with: pip install 'azure-ai-projects>=2.1.0' azure-identity"
        ) from exc

    if os.environ.get("AZURE_USE_MSAL_CACHE") == "1":
        credential = MsalCacheCredential()
    elif os.environ.get("AZURE_USE_DEVICE_CODE_CACHE") == "1":
        credential = DeviceCodeCredential(
            tenant_id=os.environ.get("AZURE_TENANT_ID"),
            disable_instance_discovery=True,
            cache_persistence_options=TokenCachePersistenceOptions(
                name="godspeed-foundry",
                allow_unencrypted_storage=True,
            ),
        )
    else:
        credential = DefaultAzureCredential(exclude_interactive_browser_credential=True)

    project_client = AIProjectClient(endpoint=endpoint, credential=credential)

    openai_client = project_client.get_openai_client()
    response = openai_client.responses.create(
        input=[{"role": "user", "content": input_text}],
        extra_body={
            "agent_reference": {
                "name": agent_name,
                "version": agent_version,
                "type": "agent_reference",
            }
        },
    )

    print(
        json.dumps(
            {
                "ok": True,
                "agent": {
                    "name": agent_name,
                    "version": agent_version,
                    "endpointConfigured": True,
                },
                "outputText": getattr(response, "output_text", ""),
            }
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": str(exc),
                    "errorType": exc.__class__.__name__,
                }
            )
        )
        sys.exit(1)
