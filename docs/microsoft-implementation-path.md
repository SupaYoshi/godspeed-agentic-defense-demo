# Microsoft Implementation Path

This document explains how the local Godspeed demo maps to Microsoft products for the hackathon submission.

## Front Door

Microsoft 365 Copilot or Copilot Studio can be used as the enterprise user interface.

User asks:

```text
A critical vulnerability affects a remote access component. Build a safe defense mission.
```

Copilot collects missing context and passes the mission request to Godspeed.

The concrete bridge is documented in:

- `microsoft/copilot-studio-rest-api-tool.md`
- `microsoft/godspeed-mission.openapi.yaml`

## Orchestration

Microsoft Agent Framework is the code-first implementation path for:

- multi-agent routing;
- workflow state;
- human-in-the-loop gates;
- telemetry and filters;
- tool execution boundaries.

Godspeed becomes the orchestrator agent. The specialist defense agents become sub-agents or workflow nodes.

The concrete production workflow mapping is documented in:

- `microsoft/foundry-agent-framework-bridge.md`
- `microsoft/foundry-workflow-concept.yaml`

## Current Live Proof

The current live proof is no longer only a local mapping. The public website at `https://godspeed.battlecruiser.nl/` has two Foundry-backed routes:

- `POST /api/foundry/agent` for governed mission creation.
- `POST /api/foundry/ask` for direct questions to the agent.

The live dev/test agent is `Godspeed-Agentic-Defense` version `6`. It uses the `godspeed_mission_api` OpenAPI tool and the `godspeed-defense-mission-knowledge` knowledge layer.

## Intelligence Layer

Microsoft Foundry IQ is the planned Microsoft IQ layer for Godspeed. The repo-local state is:

- `type`: `Foundry IQ`
- `integrationStatus`: `approval-gated`
- `tenantProofStatus`: `dev/test Foundry proof captured with knowledge grounding and OpenAPI tool-backed mission creation`

The Foundry IQ path is documented in:

- `microsoft/foundry-iq-knowledge-layer.json`
- `microsoft/foundry-iq-integration-runbook.md`
- `microsoft/knowledge/`

These artifacts define safe grounding sources for mission doctrine, approval boundaries and evidence expectations. Dev/test Foundry IQ knowledge-grounding proof and Foundry OpenAPI tool-call proof are captured; production Microsoft integrations remain separate and approval-gated.

## Runtime

Microsoft Foundry Agent Service is the managed runtime path for:

- deploying the agent workflow;
- using supported Foundry models;
- connecting tools securely;
- identity and scoped permissions;
- monitoring and evaluation.

## Demo Boundary

The current live demo uses a server-side dev/test Foundry bridge, not browser-side credentials. It still keeps production boundaries explicit through:

- architecture diagram;
- README track positioning;
- Copilot front door contract;
- Foundry workflow concept;
- Agent Framework implementation notes;
- OpenAPI contracts for Copilot Studio and Foundry tools;
- website-to-Foundry bridge documentation;
- bridge responses with `integrationProfile`, `safetyBoundary`, `localApprovalLadder`, `microsoftIqLayer`, `suggestedCopilotReply` and manual tenant proof steps;
- UI proof points.

## Next Build Step

The hackathon proof is now working. The practical next build step after submission is production hardening:

1. Replace the dev/test MSAL token cache with a tenant-approved service principal or managed identity.
2. Add durable mission storage and audit history.
3. Add a production human-approval UI.
4. Add scoped connectors only after explicit approval.
5. Build evaluation sets for mission quality and unsafe-action prevention.

Use `microsoft/manual-tenant-proof-checklist.md` for the exact approval-gated tenant proof sequence and screenshot/evidence captures.

Use `microsoft/integration-approval-ladder.json` and `microsoft/integration-approval-ladder-runbook.md` to model the Microsoft rollout gates locally before any live tenant automation exists.

Use `microsoft/foundry-iq-integration-runbook.md` for the exact Foundry IQ tenant-proof path after Walter approves the dev/test tenant.
