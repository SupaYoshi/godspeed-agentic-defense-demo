# Godspeed Architecture

Godspeed is a command layer for governed defense missions.

The architecture separates the user-facing enterprise front door from the orchestration layer, the specialist agent layer, and the evidence/approval layer.

## Layers

1. Microsoft 365 Copilot or Copilot Studio

   The user starts with a natural-language security scenario. Copilot is the familiar enterprise surface and can collect missing context, ask clarifying questions and show the final defense package.

2. Godspeed Mission Orchestrator

   Godspeed converts the request into a structured mission: goal, non-goals, known facts, assumptions, unknowns, safety boundaries, selected specialist agents, and approval gates.

3. Microsoft Foundry Agent Service / Microsoft Agent Framework

   The Microsoft-native path hosts and coordinates the agent workflow. Agent Framework is the code-first path for multi-agent orchestration, state, telemetry and tool calls. Foundry Agent Service is the managed runtime path for production-grade deployment.

4. Specialist Defense Agents

   Specialist agents handle threat intelligence, exposure, vulnerability prioritisation, log coverage, simulation, patch/change planning, containment, communications and evidence.

5. Evidence Package and Approval Gates

   Every mission produces artifacts. Risky actions stay blocked until approved by a human owner.

## Runtime Profiles

The repository contains two profiles:

- `dev-test-foundry-connected`: the working hackathon demo. The public website calls the Godspeed backend, which calls the dev/test Foundry agent and OpenAPI tool, while still using sample data and approval-gated outputs.
- `microsoft-native-target`: the implementation path for Microsoft 365 Copilot, Foundry Agent Service and Agent Framework.

The local demo intentionally avoids tenant credentials, production tools, secrets and customer data.
