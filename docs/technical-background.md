# Technical Background

Godspeed is a governed mission-orchestration layer for security work.

The demo in this repository is a dev/test Foundry-connected sandbox. It proves the workflow without browser-exposed Microsoft credentials, production security tools, customer data or production remediation.

## Current Working Components

- Browser mission UI in `public/`.
- Local API in `src/server.mjs`.
- Live website-to-Foundry bridge at `POST /api/foundry/agent`.
- Direct Foundry Q&A route at `POST /api/foundry/ask`.
- Mission engine in `src/godspeed.mjs`.
- Evidence artifact writer for `artifacts/last-run/`.
- Scenario-aware specialist-agent selection.
- Human approval gates for high-impact actions.
- Action plan with owners, support agents and reasoning.
- Microsoft implementation bridge in `microsoft/`.
- Azure AI Foundry agent `Godspeed-Agentic-Defense` v6 used for the live dev/test proof.
- Foundry knowledge layer `godspeed-defense-mission-knowledge` and OpenAPI tool `godspeed_mission_api` used in the live mission flow.

## API Flow

```text
POST /api/mission
  input: mission scenario, urgency, boundary, approval owner
  output: selected agents, gates, action plan, defense package

POST /api/foundry/agent
  input: mission scenario
  output: Foundry agent response plus local mission fallback package

POST /api/foundry/ask
  input: direct question
  output: concise Foundry agent answer
```

The same API can be used by:

- the local browser demo;
- a Copilot Studio REST API tool;
- a Foundry-hosted orchestrator agent;
- an Agent Framework workflow.

## Why The Demo Is Sandbox-First

Security automation is risky. A hackathon demo should not require:

- production tenant access;
- customer data;
- live vulnerability scanners;
- real endpoint isolation;
- external communications;
- hidden credentials.

Godspeed therefore separates mission reasoning from action execution. Risky actions are planned and approval-gated, not automatically executed.

## Microsoft Integration Path

### Copilot Front Door

Copilot Studio or Microsoft 365 Copilot collects the scenario and calls the Godspeed Mission API using the OpenAPI contract in `microsoft/godspeed-mission.openapi.yaml`.

### Foundry Runtime

Foundry Agent Service is the managed runtime target for hosting the orchestrator agent, model selection, tool configuration, tracing and evaluation.

### Agent Framework Workflow

Microsoft Agent Framework is the code-first target for the workflow graph: intake, classification, specialist-agent routing, approval gates and evidence output.

## Production Hardening Still Needed

- Entra ID authentication and authorization.
- Tenant-specific tool scopes.
- Durable mission store.
- Human approval UI and audit trail.
- Logging/tracing integration.
- Real connector adapters for Defender, Sentinel, Intune, GitHub and ticketing systems.
- Evaluation set for mission quality and unsafe-action prevention.

## Submission Framing

Use this wording:

> Godspeed is a working dev/test Foundry-connected prototype of a governed agentic defense orchestrator. It demonstrates mission intake, specialist-agent selection, OpenAPI tool-backed mission creation, knowledge grounding, approval gates, action ownership and evidence packaging. The production path is Microsoft Copilot as front door, with Foundry Agent Service and Microsoft Agent Framework as the managed agent runtime and workflow layer.
