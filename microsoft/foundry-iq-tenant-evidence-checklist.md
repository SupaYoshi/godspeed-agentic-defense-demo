# Foundry IQ Tenant Evidence Checklist

Use this checklist only after Walter approves live dev/test tenant work. The current hackathon proof has captured the Foundry knowledge layer and a successful OpenAPI tool-backed mission call. Keep production claims separate from dev/test proof.

## Minimum Screenshot Set

Capture these screenshots in order:

1. Foundry project overview for the approved dev/test project.
2. Agent model/configuration showing `GPT-4.1` selected in `Sweden Central`.
3. Foundry IQ or Knowledge detail showing `godspeed-defense-mission-knowledge`.
4. Knowledge source list showing the safe Godspeed sources from `microsoft/knowledge/`.
5. Agent configuration showing the Foundry IQ knowledge base attached to the Godspeed agent.
6. Test prompt result for at least one zero-day or phishing mission.
7. Grounded or cited answer evidence showing the response used the Foundry IQ knowledge layer, if the tenant UI exposes citations or retrieval traces.
8. Safety boundary or approval gates in the final answer.

Optional supporting screenshots:

- OpenAPI tool configuration showing `createGodspeedCopilotMission` against the approved HTTPS endpoint.
- Copilot Studio OpenAPI import showing the same approved endpoint and operation.

## Minimal Live Test Prompt

```text
Use Godspeed to create a governed defense mission for a critical remote access zero-day. Ground the answer in the Godspeed safety boundary and approval gate knowledge, then return the selected agents, approval gates, evidence package and any unresolved unknowns.
```

## Submission Wording

Use this wording after the required knowledge-grounding screenshots exist and the OpenAPI tool has been configured and tested:

> Godspeed integrates Microsoft Foundry IQ in a dev/test tenant by attaching the `godspeed-defense-mission-knowledge` knowledge base to the Godspeed Foundry agent. The knowledge layer grounds responses in Godspeed mission doctrine, approval boundaries and evidence expectations, while the OpenAPI tool creates the governed defense mission package.

Short version:

> Foundry dev/test proof completed with knowledge-base grounding and OpenAPI tool-backed mission output.

Only claim the OpenAPI tool path after a separate screenshot shows `createGodspeedCopilotMission` configured and a test call succeeds.

## Current Hackathon Status

As of the live website proof, `Godspeed-Agentic-Defense` version `6` is reachable through the Godspeed backend. The live route uses the `godspeed_mission_api` OpenAPI tool and `godspeed-defense-mission-knowledge` knowledge layer for governed mission creation. This is dev/test proof only, not production remediation.

## Do Not Claim

- Do not claim production deployment.
- Do not claim production/customer/security-tool data grounding.
- Do not claim Defender, Sentinel, Intune or endpoint-response integration.
- Do not claim remediation execution.
- Do not claim tenant proof completed without screenshots.
