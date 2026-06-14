# Submission Assets

Use these fields for the hackathon form.

## Project

- Title: Godspeed Agentic Defense
- Track: Reasoning Agents
- Short description: Godspeed turns an urgent security scenario into a governed defense mission with specialist agents, lab-first reasoning, evidence artifacts and human approval gates.

## Repository

- Public repository URL: https://github.com/SupaYoshi/godspeed-agentic-defense-demo
- Main README: `README.md`
- Submission text: `docs/submission-draft.md`

## Demo Video

- Demo video URL: https://www.youtube.com/watch?v=U9ZP6s9Y73s
- Suggested title: Godspeed Agentic Defense - Hackathon Demo
- Suggested visibility: unlisted.

## Copy-Paste Submission Links

- GitHub repository: https://github.com/SupaYoshi/godspeed-agentic-defense-demo
- Live demo: https://godspeed.battlecruiser.nl/
- Architecture diagram: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/architecture/godspeed-architecture.svg
- Technical background: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/docs/technical-background.md
- Microsoft implementation path: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/docs/microsoft-implementation-path.md
- Copilot Studio OpenAPI import file: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/microsoft/copilot-studio-openapi-v2.json
- Foundry OpenAPI tool path: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/microsoft/foundry-openapi-tool.md
- Judging rubric response: https://github.com/SupaYoshi/godspeed-agentic-defense-demo/blob/main/docs/judging-rubric.md

## Architecture

- Architecture diagram: `architecture/godspeed-architecture.svg`
- Technical background: `docs/technical-background.md`
- Microsoft implementation path: `docs/microsoft-implementation-path.md`
- Copilot Studio REST API tool contract: `microsoft/godspeed-mission.openapi.yaml`
- Copilot Studio OpenAPI v2 import file: `microsoft/copilot-studio-openapi-v2.json`
- Foundry OpenAPI tool path: `microsoft/foundry-openapi-tool.md`
- Website-to-Foundry bridge: `microsoft/foundry-website-agent-bridge.md`
- Foundry agent definition intent: `microsoft/foundry-agent-definition.json`
- Foundry / Agent Framework bridge: `microsoft/foundry-agent-framework-bridge.md`

## Architecture Overview

Godspeed uses Microsoft 365 Copilot or Copilot Studio as the enterprise front door. The Godspeed Mission Orchestrator turns the request into a structured defense mission with selected specialist agents, facts, assumptions, unknowns, premortem risks, lab-first validation, owner-assigned actions and approval gates. The live dev/test demo now routes `Run Mission` through the Godspeed backend to Azure AI Foundry agent `Godspeed-Agentic-Defense` v6, where the agent uses the `godspeed_mission_api` OpenAPI tool and `godspeed-defense-mission-knowledge` knowledge layer. The production path maps to Microsoft Foundry Agent Service and Microsoft Agent Framework for managed agent runtime, tool-backed workflows, state, telemetry and evaluation.

## Safety Statement

Godspeed is intentionally sandbox-first. It plans risky security actions, but does not execute them. Production changes, containment, patching, credential resets and external communication remain blocked until an explicit human approval gate is satisfied.

## Short Discord / Community Vote Post

Godspeed Agentic Defense is our Microsoft Agents League Reasoning Agents submission. It turns an urgent cyber incident prompt into a governed multi-agent defense mission: specialist agents, multi-step reasoning, premortem, lab-first validation, human approval gates and an evidence package.

Demo: https://www.youtube.com/watch?v=U9ZP6s9Y73s
Live demo: https://godspeed.battlecruiser.nl/
Repo: https://github.com/SupaYoshi/godspeed-agentic-defense-demo
