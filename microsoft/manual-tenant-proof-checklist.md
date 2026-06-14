# Manual Microsoft Tenant Proof Checklist

Use this checklist only after Walter explicitly approves live Microsoft tenant work. The repository is already prepared for these steps, but they are not executed from the local sandbox.

## Approval Required First

- Review the local/demo ladder in `microsoft/integration-approval-ladder.json`.
- Approve the HTTPS endpoint that will host the Godspeed API.
- Approve the target Microsoft tenant, Copilot Studio environment and Foundry project.
- Approve the authentication mode: no auth for a temporary sandbox only, otherwise API key, OAuth or Entra-backed access.
- Confirm no production Defender, Sentinel, Intune, endpoint-response, ticketing or customer-data tools will be connected during the proof.

## Local Evidence Before Tenant Work

Run:

```bash
npm run check
npm run check:microsoft
npm start
```

Capture:

- `/api/health` response.
- `POST /api/microsoft/copilot/mission` response showing `selectedAgents`, `approvalGates`, `actionPlan`, `defensePackage`, `safetyBoundary`, `localApprovalLadder`, `microsoftIqLayer` and `manualTenantProofSteps`.
- `POST /api/microsoft/agent-framework/event` response showing `GodspeedMissionCreated`.

## Foundry IQ Proof

1. Create or select Walter's approved Microsoft Foundry dev/test project.
2. Create a Foundry IQ knowledge base named `godspeed-defense-mission-knowledge`.
3. Upload or link the safe files listed in `microsoft/foundry-iq-knowledge-layer.json`.
4. Attach the Foundry IQ knowledge base to the Godspeed Foundry Agent Service agent.
5. Confirm the live response can use the knowledge layer for Godspeed doctrine, safety boundaries and evidence expectations.
6. Capture screenshots of the Foundry project, Foundry IQ knowledge base, knowledge source list, agent attachment and grounded response.

## Copilot Studio Proof

1. Expose or deploy the Godspeed API over an approved HTTPS endpoint.
2. Update `host` in `microsoft/copilot-studio-openapi-v2.json`.
3. In Copilot Studio, add a REST API tool from that OpenAPI v2 file.
4. Select operation `createGodspeedCopilotMission`.
5. Add `microsoft/copilot-studio-agent-instructions.md` to the agent instructions.
6. Ask Copilot for a zero-day, phishing, ransomware and cloud exposure mission.
7. Capture screenshots of the imported tool, test call response, selected agents, approval gates and final evidence-oriented answer.

## Foundry / Agent Framework Proof

1. Update the `servers` section in `microsoft/godspeed-mission.openapi.yaml` to the approved HTTPS endpoint.
2. Configure an OpenAPI tool in Foundry using `createGodspeedCopilotMission`.
3. Use `microsoft/foundry-agent-definition.json` as the target definition intent.
4. Use `POST /api/microsoft/agent-framework/event` as the workflow seed shape for a code-first Agent Framework implementation.
5. Map `workflow.specialists` to specialist nodes and `workflow.approvalGates` to human-in-the-loop steps.
6. Capture screenshots of the Foundry tool config, agent instructions, workflow seed event and approval-gated output.

## Do Not Do In The Proof

- Do not store tenant IDs, secrets, connection strings or API keys in this repository.
- Do not connect production security tools.
- Do not run production scans, patching, isolation, account resets or tenant-wide policy changes.
- Do not claim remediation occurred unless a separate approved execution tool reports success.
