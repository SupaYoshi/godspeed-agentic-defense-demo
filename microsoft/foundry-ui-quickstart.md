# Foundry UI Quickstart For Walter

Use this when the Foundry project/agent is already open.

Current tenant context from Walter:

- Project/agent: `Godspeed-Agentic-Defense`
- Region: `Sweden Central`
- Available model: `GPT-4.1`
- Status: acceptable for hackathon proof

## What Walter Must Click

1. Keep `GPT-4.1` as the model. It is acceptable for the hackathon proof because Godspeed is demonstrating governed reasoning, grounding, approval gates and evidence flow, not a model benchmark.
2. Open the agent instructions/system prompt area.
3. Paste the instructions from `microsoft/foundry-agent-instructions.md`.
4. Open Knowledge or Foundry IQ.
5. Create or select knowledge base `godspeed-defense-mission-knowledge`.
6. Upload or link these safe files:
   - `microsoft/knowledge/godspeed-iq-grounding-overview.md`
   - `microsoft/knowledge/godspeed-approval-boundaries.json`
   - `microsoft/foundry-iq-knowledge-layer.json`
7. Attach that knowledge base to the `Godspeed-Agentic-Defense` agent.
8. Save/publish the agent if the UI asks for it.
9. Run the test prompt from `microsoft/foundry-iq-tenant-evidence-checklist.md`.
10. Capture the minimum screenshots listed in `microsoft/foundry-iq-tenant-evidence-checklist.md`.
11. Open Tools only if an approved HTTPS endpoint exists.
12. If an approved HTTPS endpoint exists, add the OpenAPI tool from `microsoft/godspeed-mission.openapi.yaml` and select `createGodspeedCopilotMission`.
13. If no approved HTTPS endpoint exists yet, skip the tool and capture Foundry IQ grounding proof first. Do not claim OpenAPI tool proof.

## Do Not Do In The Tenant

- Do not paste secrets.
- Do not connect production Defender, Sentinel, Intune, endpoint-response, ticketing or customer data.
- Do not execute remediation.
- Do not claim live OpenAPI tool integration until the approved endpoint and tool call work.
- Do not claim Foundry IQ proof complete until the screenshots exist.

## Fast Success Criteria

The minimum live proof is:

- Foundry project visible.
- `Godspeed-Agentic-Defense` agent uses `GPT-4.1`.
- Foundry IQ knowledge base `godspeed-defense-mission-knowledge` exists.
- Safe Godspeed knowledge files are attached.
- Test response references Godspeed safety boundaries or approval gates from the knowledge source.
- Screenshots show the evidence.
- OpenAPI tool proof is optional under deadline pressure and should only be claimed after the endpoint/tool call works.
