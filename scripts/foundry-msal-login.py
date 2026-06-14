#!/usr/bin/env python3
"""Login with MSAL device code and persist a token cache for the Foundry bridge."""

import json
import os
import socket
import sys

import msal


CLIENT_ID = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
CACHE_PATH = os.environ.get("FOUNDRY_MSAL_CACHE_PATH", os.path.expanduser("~/.cache/godspeed-foundry-msal.json"))
TENANT = os.environ.get("AZURE_TENANT_ID") or "organizations"
SCOPES = ["https://ai.azure.com/.default"]

original_getaddrinfo = socket.getaddrinfo
socket.getaddrinfo = lambda *args, **kwargs: [
    item for item in original_getaddrinfo(*args, **kwargs) if item[0] == socket.AF_INET
]

cache = msal.SerializableTokenCache()
if os.path.exists(CACHE_PATH):
    with open(CACHE_PATH, "r", encoding="utf-8") as handle:
        cache.deserialize(handle.read())

app = msal.PublicClientApplication(
    CLIENT_ID,
    authority=f"https://login.microsoftonline.com/{TENANT}",
    token_cache=cache,
    instance_discovery=False,
    timeout=15,
)

flow = app.initiate_device_flow(scopes=SCOPES)
if "user_code" not in flow:
    print(json.dumps({"ok": False, "error": "Failed to create device flow", "details": flow}), flush=True)
    sys.exit(1)

print(
    json.dumps(
        {
            "ok": True,
            "verificationUri": flow["verification_uri"],
            "userCode": flow["user_code"],
            "message": flow.get("message"),
            "expiresIn": flow.get("expires_in"),
        }
    ),
    flush=True,
)

result = app.acquire_token_by_device_flow(flow)
if cache.has_state_changed:
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as handle:
        handle.write(cache.serialize())
    os.chmod(CACHE_PATH, 0o600)

if "access_token" not in result:
    print(json.dumps({"ok": False, "error": result.get("error"), "description": result.get("error_description")}))
    sys.exit(1)

print(
    json.dumps(
        {
            "ok": True,
            "account": result.get("id_token_claims", {}).get("preferred_username"),
            "tenant": result.get("id_token_claims", {}).get("tid"),
            "cachePath": CACHE_PATH,
            "expiresIn": result.get("expires_in"),
        }
    )
)
