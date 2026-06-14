# Foundry IQ Integration Runbook

Godspeed currently has a local sandbox plus an approval-gated Foundry IQ integration path. The live Foundry IQ tenant proof is tenant-proof pending.

## Why Foundry IQ

Foundry IQ is the Microsoft intelligence layer that best matches Godspeed's Reasoning Agents story: a reusable knowledge layer for a Foundry Agent Service agent. Godspeed uses it as the planned grounding layer for mission doctrine, approval boundaries and evidence expectations before the agent calls the OpenAPI planning tool.

Official references:

- What is Foundry IQ: <https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq>
- Connect agents to Foundry IQ knowledge bases: <https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/foundry-iq-connect>
- Foundry Agent Service overview: <https://learn.microsoft.com/en-us/azure/foundry/agents/overview>

## Local Repo Artifacts

- `microsoft/foundry-iq-knowledge-layer.json` - structured Foundry IQ target manifest.
- `microsoft/foundry-ui-quickstart.md` - exact Foundry UI click path for Walter.
- `microsoft/foundry-agent-instructions.md` - copy/paste agent instructions.
- `microsoft/foundry-iq-tenant-evidence-checklist.md` - required screenshot set and submission wording.
- `microsoft/knowledge/godspeed-iq-grounding-overview.md` - safe grounding document.
- `microsoft/knowledge/godspeed-approval-boundaries.json` - safe approval-boundary grounding data.
- `microsoft/integration-approval-ladder.json` - gate model that blocks live work until approval.

## Current State

- `type`: `Foundry IQ`
- `integrationStatus`: `approval-gated`
- `tenantProofStatus`: `tenant-proof pending`
- Live tenant resources: not created from this repo.
- Secrets: not used or stored.
- Production/customer/security-tool data: not connected.

## Manual Tenant Proof Steps

Only after Walter explicitly approves the dev/test tenant work:

1. Create or select the approved Microsoft Foundry dev/test project.
2. Use `microsoft/foundry-ui-quickstart.md` for the shortest UI path.
3. Paste `microsoft/foundry-agent-instructions.md` into the agent instructions.
4. Create a Foundry IQ knowledge base named `godspeed-defense-mission-knowledge`.
5. Upload or link the safe files under `microsoft/knowledge/`.
6. Attach the Foundry IQ knowledge base to the Godspeed Foundry Agent Service agent.
7. Connect the Godspeed OpenAPI tool after endpoint and auth gates are approved.
8. Run these sample prompts:
   - zero-day remote access exposure mission;
   - phishing and token theft mission;
   - ransomware recovery evidence mission;
   - cloud exposure mission.
9. Capture screenshots of:
   - Foundry project;
   - Foundry IQ knowledge base;
   - knowledge source list;
   - Godspeed agent instructions/tool config;
   - grounded answer or retrieval trace;
   - approval gates in the final response.
10. Use `microsoft/foundry-iq-tenant-evidence-checklist.md` to confirm the complete screenshot set and switch from pending wording to proof-complete wording only when evidence exists.

## What Not To Claim Yet

Do not claim that Foundry IQ is live, connected, retrieved citations, or grounded a production response until the dev/test tenant proof screenshots exist.

Use this wording until then:

> Godspeed includes a repo-local, approval-gated Foundry IQ knowledge-layer path. Live Foundry IQ tenant proof is pending Walter's dev/test tenant approval.

Use `microsoft/foundry-iq-tenant-evidence-checklist.md` for exact wording before and after tenant proof.
