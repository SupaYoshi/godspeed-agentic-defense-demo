# Judging Rubric Response

This page maps Godspeed Agentic Defense to the Microsoft Agents League Hackathon judging categories.

## Accuracy & Relevance - 20%

Godspeed is a working dev/test Foundry-connected prototype for the Reasoning Agents track. It runs as a browser UI, REST API and CLI workflow, and the live website calls Azure AI Foundry agent `Godspeed-Agentic-Defense` v6 to turn a security scenario into a governed defense mission.

The repository includes source code, architecture, a submission draft, technical background, Microsoft bridge endpoints, Copilot Studio OpenAPI contracts, a repo-local Foundry IQ knowledge-layer path, a website-to-Foundry bridge and Foundry / Agent Framework implementation artifacts.

Relevant Microsoft-facing artifacts:

- `POST /api/microsoft/copilot/mission`
- `POST /api/microsoft/agent-framework/event`
- `POST /api/foundry/agent`
- `POST /api/foundry/ask`
- `microsoft/copilot-studio-openapi-v2.json`
- `microsoft/godspeed-mission.openapi.yaml`
- `microsoft/foundry-openapi-tool.md`
- `microsoft/foundry-agent-definition.json`
- `microsoft/foundry-agent-framework-bridge.md`
- `microsoft/foundry-iq-knowledge-layer.json`
- `microsoft/foundry-iq-integration-runbook.md`
- `microsoft/foundry-website-agent-bridge.md`
- `microsoft/knowledge/`

Foundry status is deliberately honest: dev/test knowledge-grounding proof has been captured with `godspeed-defense-mission-knowledge` attached to the Godspeed Foundry Agent, and the `godspeed_mission_api` OpenAPI tool is configured for mission package creation. This remains dev/test proof, not production remediation or production security-tool integration.

## Reasoning & Multi-step Thinking - 20%

Godspeed is built around multi-step reasoning under operational risk. A single urgent security prompt becomes a staged mission:

- classify the scenario;
- separate facts, assumptions and unknowns;
- select the right specialist agents;
- create a premortem;
- plan lab-first validation;
- assign action owners and supporting agents;
- block risky steps behind approval gates;
- produce an evidence package for review.

The demo shows this reasoning flow end to end instead of returning a single chatbot answer.

## Creativity & Originality - 15%

Godspeed's core idea is that Copilot should not only answer security questions. It should be able to launch a governed defense mission.

The original contribution is the command layer between an enterprise Copilot surface and specialist security agents: a structured mission plan, explicit uncertainty, safe validation, human approval gates and evidence that can be replayed.

## User Experience & Presentation - 15%

The browser interface is designed for a clear demo. It starts from one realistic incident prompt and shows:

- the selected agents;
- the reasoning phases;
- the premortem;
- the approval gates;
- the action plan;
- the executive summary.

The output is readable by both technical responders and decision-makers.

## Reliability & Safety - 20%

Godspeed is sandbox-first by design. The live proof uses a dev/test Foundry agent and does not use production access, browser-exposed tenant secrets, customer data, real remediation, external messaging or automatic patching.

Risky actions are planned, not executed. Production changes, containment, patching, credential resets and communications remain blocked until explicit human approval gates are satisfied.

The repository includes validation checks:

```bash
npm run check
npm run check:microsoft
```

The same checks run in GitHub Actions.

## Community Vote - 10%

Short community pitch:

> Godspeed Agentic Defense turns an urgent cyber incident prompt into a governed multi-agent defense mission: specialist agents, multi-step reasoning, premortem, lab-first validation, human approval gates and an evidence package.

Links:

- Demo video: `https://www.youtube.com/watch?v=U9ZP6s9Y73s`
- Repository: `https://github.com/SupaYoshi/godspeed-agentic-defense-demo`
