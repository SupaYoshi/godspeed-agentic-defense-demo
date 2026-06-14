# Submission Final Draft

## Project Name

Godspeed Agentic Defense

## Track

Reasoning Agents

## Short Description

Godspeed turns an urgent security scenario into a governed defense mission with specialist agents, lab-first reasoning, evidence artifacts and human approval gates.

## One-Line Pitch

Godspeed makes Copilot operationally useful for security by converting a vague, urgent scenario into a governed defense mission with specialist agents, approval gates and evidence.

## Problem

Security teams are flooded with alerts, vulnerabilities, tool outputs and urgent requests. The hardest part is often not one answer. The hard part is deciding which specialists should work on the mission, which evidence is missing, what should be tested safely first, and which actions are too risky to automate.

## Solution

Godspeed acts as an agentic command layer. A user describes a security scenario in natural language. Godspeed converts it into a structured mission, selects specialist agents in waves, creates a premortem, plans lab-first validation, blocks risky actions behind human approval, and produces an evidence package.

The current build is a working sandbox prototype. It runs locally, accepts a real mission prompt, reasons over the scenario profile, selects the relevant specialist agents, creates owner-assigned actions, and writes evidence artifacts. It deliberately avoids tenant secrets, production access, customer data, real remediation and external messaging.

## Microsoft Technology Use

- Microsoft 365 Copilot or Copilot Studio as the enterprise front door.
- Microsoft Copilot Studio REST API tools as the bridge into the Godspeed Mission API.
- Microsoft Foundry Agent Service as the managed runtime path for hosting the orchestrator and tool-backed agents.
- Microsoft Agent Framework as the multi-agent workflow path for routing, state, telemetry and human approval gates.
- GitHub Copilot as the development acceleration story.

The current repository runs in `local-sandbox` mode for safe review. It contains the production bridge artifacts for the `microsoft-native-target` profile:

- `microsoft/godspeed-mission.openapi.yaml`
- `microsoft/copilot-studio-rest-api-tool.md`
- `microsoft/foundry-agent-framework-bridge.md`
- `microsoft/foundry-workflow-concept.yaml`

## Architecture Overview

The architecture has five layers:

1. Microsoft 365 Copilot or Copilot Studio captures the scenario and presents the final defense package.
2. The Godspeed Mission Orchestrator converts the request into goals, non-goals, facts, assumptions, unknowns, selected agents and approval gates.
3. Microsoft Foundry Agent Service and Microsoft Agent Framework provide the production runtime path for hosted agents, tool calls, workflow state, telemetry and evaluation.
4. Specialist defense agents reason over threat intelligence, exposure, vulnerability priority, log coverage, simulation, patch/change planning, containment, communication and evidence.
5. The evidence and approval layer produces artifacts and blocks high-impact actions until a human owner approves them.

Architecture asset:

- `architecture/godspeed-architecture.svg`
- `docs/technical-background.md`

## Features

- Mission intake.
- Scenario-aware specialist-agent selection.
- Facts, assumptions and unknowns.
- Premortem analysis.
- Lab-first simulation plan.
- Human-in-the-loop approval gates.
- Owner-assigned action plan.
- Evidence artifacts.
- Executive summary.

## Safety

The demo uses sample data only. It does not use production access, tenant secrets, customer data, real remediation, external messaging or automatic patching. Risky actions are blocked by default.

Recommended framing:

> Godspeed is a working sandbox prototype of a governed agentic defense orchestrator. It demonstrates mission intake, specialist-agent selection, approval gates, action ownership and evidence packaging. The production path is Microsoft Copilot as front door, with Foundry Agent Service and Microsoft Agent Framework as the managed agent runtime and workflow layer.

## Demo Video URL

To be added after recording.

## Public Repository URL

https://github.com/SupaYoshi/godspeed-agentic-defense-demo

## Track

Reasoning Agents.

Why this track: the core value is multi-step reasoning under operational risk. Godspeed separates facts from assumptions, selects the right specialist agents, plans safe validation, identifies unknowns, and blocks unsafe actions until a human approves them.
