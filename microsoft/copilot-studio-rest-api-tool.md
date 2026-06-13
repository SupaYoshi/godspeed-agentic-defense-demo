# Copilot Studio REST API Tool Bridge

This file describes how the local Godspeed mission API maps to a Copilot Studio or Microsoft 365 Copilot front door.

## Intent

Copilot is the user-facing surface. Godspeed is the governed mission orchestrator.

The Copilot agent should collect scenario context, then call the Godspeed mission API through a REST API tool. The tool returns selected agents, approval gates, actions and evidence package data that Copilot can summarize back to the user.

## Tool Contract

Use:

- `microsoft/godspeed-mission.openapi.yaml`
- operation: `createGodspeedMission`
- method: `POST`
- path: `/api/mission`

## Copilot Agent Instructions

1. Ask for missing mission context only when needed.
2. Do not request credentials, secrets or customer data.
3. Do not claim remediation has happened.
4. Call `createGodspeedMission` with the user scenario.
5. Present the result as:
   - mission summary;
   - selected specialist agents;
   - approval-gated actions;
   - recommended next decisions;
   - evidence package.

## Security Boundary

The Copilot tool call is read-only in the sandbox profile.

Production implementations should require:

- Entra ID authentication;
- scoped app registration or managed identity;
- tenant-specific authorization;
- audit logging for every mission request;
- explicit human approval before high-impact tools.

## Current Demo Status

The browser demo uses the same `/api/mission` contract locally. It is not connected to a live Copilot tenant in this repository because the public hackathon repo must not contain tenant IDs, secrets or production permissions.
