# Foundry OpenAPI Tool Path

Microsoft Foundry Agent Service can connect agents to custom HTTP APIs through OpenAPI tools. Godspeed exposes a Microsoft-oriented API surface for that path.

## Tool Contract

Use:

- `microsoft/godspeed-mission.openapi.yaml`
- operation: `createGodspeedCopilotMission`
- method: `POST`
- path: `/api/microsoft/copilot/mission`

This operation returns a compact response suitable for an agent tool call:

- selected specialist agents;
- approval gates;
- action plan;
- defense package;
- integration profile and safety boundary;
- local integration approval ladder;
- Microsoft IQ layer status through `microsoftIqLayer` with type `Foundry IQ`;
- manual tenant proof steps;
- artifact location.

## Local Test

```bash
npm run check:microsoft
npm start
```

Then call:

```bash
curl -fsS \
  -X POST http://127.0.0.1:8088/api/microsoft/copilot/mission \
  -H 'content-type: application/json' \
  --data '{"description":"A critical zero-day affects an internet-facing remote access service.","urgency":"Critical"}'
```

## Foundry Deployment Shape

1. Deploy the Godspeed API behind HTTPS.
2. Update the `servers` section in `microsoft/godspeed-mission.openapi.yaml`.
3. In Foundry, configure an OpenAPI tool using the updated spec.
4. Attach the tool to a prompt agent or a hosted Agent Framework implementation.
5. Use managed identity, API key or OAuth depending on deployment boundary.
6. Keep production action tools separate from the mission-planning tool.
7. Use `microsoft/manual-tenant-proof-checklist.md` for live tenant evidence capture after Walter approval.
8. Keep `block-production-customer-security-tool-connections` blocked until a separate approval package exists.
9. Use `microsoft/foundry-iq-integration-runbook.md` before claiming a live Foundry IQ integration.

## Agent Instructions

The Foundry agent should:

- use the tool when the user asks for security mission planning, incident response, vulnerability triage, phishing response, ransomware containment or cloud exposure analysis;
- ask for missing scenario context only when necessary;
- never claim production remediation has occurred;
- present approval gates before risky actions;
- produce a final evidence-oriented decision package.

## Boundary

The current repository implements the planning/orchestration tool. Real Defender, Sentinel, Intune, GitHub, ticketing or endpoint-response tools should be added later as separately scoped and approval-gated tools.
