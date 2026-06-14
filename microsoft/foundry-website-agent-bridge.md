# Foundry Website Agent Bridge

This bridge lets the public Godspeed website send a scenario to the configured Azure AI Foundry agent without exposing Azure credentials in browser JavaScript.

## Flow

1. Browser sends the scenario to `POST /api/foundry/agent`.
2. The Godspeed Node backend builds a Foundry prompt that asks the agent to call the Godspeed OpenAPI tool.
3. The backend invokes `scripts/foundry-agent-response.py`.
4. The Python helper uses `AIProjectClient` with either `DefaultAzureCredential`, a tenant-approved service principal, or the dev/test MSAL device-code cache.
5. The website renders the Foundry response and the local Godspeed mission fallback package.

## Server Environment

Set these on the server process:

```bash
FOUNDRY_PROJECT_ENDPOINT="<Azure AI project endpoint>"
FOUNDRY_AGENT_NAME="Godspeed-Agentic-Defense"
FOUNDRY_AGENT_VERSION="6"
PYTHON="/path/to/python-with-azure-sdk"
```

Install the Python dependencies into the Python environment referenced by `PYTHON`:

```bash
pip install -r requirements-foundry.txt
```

For production, use a tenant-approved service principal or managed identity. Do not place credentials in `public/` files or browser JavaScript.

For dev/test proof only, the bridge can use a local MSAL device-code cache:

```bash
AZURE_USE_MSAL_CACHE=1
AZURE_FORCE_IPV4=1
scripts/foundry-msal-login.py
```

The token cache is stored outside the repository by default at `~/.cache/godspeed-foundry-msal.json` and must not be committed.

## Public Error Handling

The route intentionally returns sanitized public errors for missing SDKs, missing Azure authentication, timeouts and bridge failures. Detailed credential traces should stay server-side.
