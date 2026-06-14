# Foundry Agent Service / Agent Framework Bridge

Godspeed is designed as a two-profile system:

- `local-sandbox`: deterministic demo runtime in this repository.
- `microsoft-native-target`: production path using Microsoft Copilot, Foundry Agent Service and Microsoft Agent Framework.

## Production Shape

```text
Microsoft 365 Copilot or Copilot Studio
  -> REST API tool / connector
  -> Godspeed Orchestrator Agent
  -> Agent Framework workflow
  -> Specialist defense agents
  -> Human approval gates
  -> Evidence package
```

## Agent Framework Mapping

| Godspeed concept | Agent Framework production mapping |
| --- | --- |
| Mission intake | Workflow input / typed event |
| Scenario classifier | Orchestrator agent or deterministic workflow step |
| Specialist agents | Agent nodes or tool-backed workflow nodes |
| Approval gates | Human-in-the-loop workflow steps |
| Action plan | Structured workflow output |
| Evidence package | Persisted artifact and audit record |

## Foundry Agent Service Mapping

| Requirement | Foundry target |
| --- | --- |
| Managed runtime | Foundry Agent Service |
| Model selection | Foundry model catalog |
| API/tool calling | Foundry tools calling Godspeed backend APIs |
| Authentication | Entra ID, managed identity or scoped service principal |
| Monitoring | Foundry tracing/evaluation plus Godspeed audit artifacts |
| Governance | Approval nodes before high-impact actions |

## Local Bridge Endpoints

The repository exposes two Microsoft-oriented endpoints in addition to the browser demo endpoint:

- `POST /api/microsoft/copilot/mission` - returns a Copilot-friendly tool response with selected agents, approval gates, action plan and defense package.
- `POST /api/microsoft/agent-framework/event` - returns a workflow seed event that maps the mission to Agent Framework concepts.

Run:

```bash
npm run check:microsoft
```

This validates that the OpenAPI v2 import file and bridge response shape stay aligned.

## Foundry Tool Artifacts

- `microsoft/godspeed-mission.openapi.yaml` - OpenAPI 3.0 tool contract for Foundry-style API tooling.
- `microsoft/foundry-openapi-tool.md` - setup and boundary notes for the Foundry OpenAPI tool path.
- `microsoft/foundry-agent-definition.json` - version-controlled target agent definition intent.
- `microsoft/foundry-iq-knowledge-layer.json` - approval-gated Foundry IQ knowledge-layer manifest.
- `microsoft/foundry-iq-integration-runbook.md` - tenant-proof steps for connecting the knowledge layer later.
- `microsoft/knowledge/` - safe sample grounding sources for the Foundry IQ proof.
- `microsoft/integration-approval-ladder.json` - local/demo gate model for Microsoft rollout approvals.
- `microsoft/integration-approval-ladder-runbook.md` - operator runbook for using the ladder without live tenant automation.

## Tool Boundary

The production Godspeed orchestrator should expose tools in tiers:

1. `read_context`: safe context retrieval and sample-data lookup.
2. `plan_mission`: create plan, agents, gates and evidence requirements.
3. `draft_actions`: draft changes without executing them.
4. `request_approval`: ask a human owner for decision.
5. `execute_approved_action`: only enabled after explicit approval and only for scoped actions.

The public demo only implements tiers 1-3.

## Integration Approval Ladder

Live tenant approval automation is intentionally out of scope for the public demo. The local ladder models the sequence that must be approved before a Microsoft integration proof proceeds:

1. Approve public HTTPS endpoint choice.
2. Approve sandbox authentication mode.
3. Approve Copilot Studio OpenAPI import.
4. Approve Foundry OpenAPI tool configuration.
5. Approve Foundry IQ knowledge layer.
6. Approve test prompts and screenshots.
7. Keep production, customer and security-tool connections blocked until separate approval exists.

`POST /api/microsoft/copilot/mission` returns this model as `localApprovalLadder` and returns the Foundry IQ target as `microsoftIqLayer`. `npm run check:microsoft` validates both.

## Foundry IQ Layer

Godspeed uses Foundry IQ as the Microsoft IQ intelligence layer for the captured dev/test proof. The repository does not create live tenant resources itself; it records the public-safe evidence after the `godspeed-defense-mission-knowledge` knowledge base was attached to the Godspeed Foundry Agent. The Foundry OpenAPI tool-call proof remains separate and pending.

The intended knowledge layer grounds the agent on:

- Godspeed mission doctrine;
- approval boundaries;
- evidence expectations;
- non-claims about production remediation.

## Agent Framework Workflow Seed

`/api/microsoft/agent-framework/event` returns:

- `GodspeedMissionCreated` event type;
- mission intake fields;
- specialist node list;
- approval gates;
- output artifact names.

That gives a code-first Agent Framework implementation a deterministic entrypoint before adding real Foundry credentials, tool bindings, checkpointing or approval UI.

## Why This Still Counts As A Working Demo

The hackathon demo is intentionally sandboxed. It demonstrates the core agentic behavior: transform a scenario into a governed mission, select specialist agents, create approval gates and produce an evidence package.

The Microsoft bridge is documented as the deployment path, not falsely claimed as already deployed in a tenant.
