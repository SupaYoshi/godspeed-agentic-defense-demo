# Microsoft Implementation Checklist

This checklist turns the local sandbox into a Microsoft-connected implementation without putting tenant data or secrets in the public repository.

## Local Bridge

- Run `npm run check`.
- Run `npm run check:microsoft`.
- Start the API with `npm start`.
- Call `POST /api/microsoft/copilot/mission` with a security scenario.
- Confirm the response includes `integrationProfile`, `safetyBoundary`, `localApprovalLadder`, `selectedAgents`, `approvalGates`, `actionPlan`, `defensePackage`, `suggestedCopilotReply` and `manualTenantProofSteps`.
- Call `POST /api/microsoft/agent-framework/event` and confirm it returns `GodspeedMissionCreated`.
- Review `microsoft/integration-approval-ladder.json` before any live Microsoft setup.

## Copilot Studio REST API Tool

- Expose the API over HTTPS.
- Update the `host` value in `microsoft/copilot-studio-openapi-v2.json`.
- In Copilot Studio, add a REST API tool.
- Upload `microsoft/copilot-studio-openapi-v2.json`.
- Select operation `createGodspeedCopilotMission`.
- Add the instructions from `microsoft/copilot-studio-agent-instructions.md`.
- Keep the sandbox unauthenticated only for local demo use.
- For deployment, use API key or OAuth/Entra-backed auth and scoped tenant access.
- Capture proof screenshots listed in `microsoft/manual-tenant-proof-checklist.md`.
- Do not import until the matching gate in `microsoft/integration-approval-ladder.json` has explicit approval.

## Foundry / Agent Framework

- Use `microsoft/godspeed-mission.openapi.yaml` as the Foundry OpenAPI tool contract.
- Use `microsoft/foundry-agent-definition.json` as the version-controlled agent definition intent.
- Use `/api/microsoft/agent-framework/event` as the workflow seed.
- Map `specialists` to agent or function nodes.
- Map `approvalGates` to human-in-the-loop workflow steps.
- Keep production actions disabled until approvals are explicit and auditable.
- Add Foundry tracing/evaluation once real project credentials are available.
- Use `microsoft/manual-tenant-proof-checklist.md` for the exact tenant-proof sequence and evidence captures.
- Keep production/customer/security-tool connections blocked unless a separate scoped approval package exists.

## Safety Gates

- Do not store tenant IDs, app secrets, connection strings or API keys in the repo.
- Do not connect production Defender, Sentinel, Intune, GitHub or ticketing tools in the public demo.
- Do not execute remediation from the sandbox profile.
- Keep the public submission wording honest: working sandbox prototype plus Microsoft-ready bridge path.
