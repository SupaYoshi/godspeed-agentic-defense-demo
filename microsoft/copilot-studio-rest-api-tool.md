# Copilot Studio REST API Tool Bridge

This file describes how the local Godspeed mission API maps to a Copilot Studio or Microsoft 365 Copilot front door.

## Intent

Copilot is the user-facing surface. Godspeed is the governed mission orchestrator.

The Copilot agent should collect scenario context, then call the Godspeed mission API through a REST API tool. The tool returns selected agents, approval gates, actions and evidence package data that Copilot can summarize back to the user.

## Tool Contract

Use:

- `microsoft/copilot-studio-openapi-v2.json`
- operation: `createGodspeedCopilotMission`
- method: `POST`
- path: `/api/microsoft/copilot/mission`

The repository also keeps `microsoft/godspeed-mission.openapi.yaml` as the broader OpenAPI 3.0 API description. The Copilot Studio import artifact is the OpenAPI v2 JSON file because Copilot Studio REST API tools are processed through the Power Platform OpenAPI v2 flow.

## Copilot Agent Instructions

1. Ask for missing mission context only when needed.
2. Do not request credentials, secrets or customer data.
3. Do not claim remediation has happened.
4. Call `createGodspeedCopilotMission` with the user scenario.
5. Present the result as:
   - mission summary;
   - selected specialist agents;
   - approval-gated actions;
   - recommended next decisions;
   - evidence package.

## Security Boundary

The Copilot tool call is read-only in the sandbox profile.

Production implementations should require:

- Entra ID authentication;
- scoped app registration or managed identity;
- tenant-specific authorization;
- audit logging for every mission request;
- explicit human approval before high-impact tools.

## Current Demo Status

The browser demo uses `/api/mission`. Copilot Studio should use `/api/microsoft/copilot/mission`, which returns the same mission reasoning in a tool-friendly response shape:

- `selectedAgents`
- `approvalGates`
- `actionPlan`
- `defensePackage`
- `integrationProfile`
- `safetyBoundary`
- `localApprovalLadder`
- `microsoftIqLayer`
- `suggestedCopilotReply`
- `manualTenantProofSteps`

It is not connected to a live Copilot tenant in this repository because the public hackathon repo must not contain tenant IDs, secrets or production permissions.

## Import Steps

1. Publish or tunnel the local API over HTTPS.
2. Update the `host` in `microsoft/copilot-studio-openapi-v2.json`.
3. In Copilot Studio, add a REST API tool and upload `microsoft/copilot-studio-openapi-v2.json`.
4. Select `createGodspeedCopilotMission`.
5. Use no authentication for the local sandbox, or API key/OAuth for a deployed environment.
6. Add `microsoft/copilot-studio-agent-instructions.md` to the agent instructions.
7. Test with a zero-day, phishing, ransomware and cloud exposure scenario.
8. Use `microsoft/manual-tenant-proof-checklist.md` for approval-gated live tenant evidence capture.
9. Use `microsoft/integration-approval-ladder.json` to show which Microsoft rollout gate is still pending or blocked.
10. Treat `microsoftIqLayer.tenantProofStatus` as knowledge-grounding proof captured, with OpenAPI tool proof pending until a separate tool configuration and test call are captured.
