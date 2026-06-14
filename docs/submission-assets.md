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

- Demo video URL: to be added after upload.
- Suggested title: Godspeed Agentic Defense - Hackathon Demo

## Architecture

- Architecture diagram: `architecture/godspeed-architecture.svg`
- Technical background: `docs/technical-background.md`
- Microsoft implementation path: `docs/microsoft-implementation-path.md`
- Copilot Studio REST API tool contract: `microsoft/godspeed-mission.openapi.yaml`
- Foundry / Agent Framework bridge: `microsoft/foundry-agent-framework-bridge.md`

## Architecture Overview

Godspeed uses Microsoft 365 Copilot or Copilot Studio as the enterprise front door. The Godspeed Mission Orchestrator turns the request into a structured defense mission with selected specialist agents, facts, assumptions, unknowns, premortem risks, lab-first validation, owner-assigned actions and approval gates. The production path maps to Microsoft Foundry Agent Service and Microsoft Agent Framework for managed agent runtime, tool-backed workflows, state, telemetry and evaluation. The current demo runs in a local sandbox with sample data and no tenant secrets, production access or customer data.

## Safety Statement

Godspeed is intentionally sandbox-first. It plans risky security actions, but does not execute them. Production changes, containment, patching, credential resets and external communication remain blocked until an explicit human approval gate is satisfied.
