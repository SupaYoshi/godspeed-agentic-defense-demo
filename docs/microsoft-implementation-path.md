# Microsoft Implementation Path

This document explains how the local Godspeed demo maps to Microsoft products for the hackathon submission.

## Front Door

Microsoft 365 Copilot or Copilot Studio can be used as the enterprise user interface.

User asks:

```text
A critical vulnerability affects a remote access component. Build a safe defense mission.
```

Copilot collects missing context and passes the mission request to Godspeed.

## Orchestration

Microsoft Agent Framework is the code-first implementation path for:

- multi-agent routing;
- workflow state;
- human-in-the-loop gates;
- telemetry and filters;
- tool execution boundaries.

Godspeed becomes the orchestrator agent. The specialist defense agents become sub-agents or workflow nodes.

## Runtime

Microsoft Foundry Agent Service is the managed runtime path for:

- deploying the agent workflow;
- using supported Foundry models;
- connecting tools securely;
- identity and scoped permissions;
- monitoring and evaluation.

## Demo Boundary

The current demo runs without Microsoft tenant credentials so it can be reviewed safely. It still makes the Microsoft integration explicit through:

- architecture diagram;
- README track positioning;
- Copilot front door contract;
- Foundry workflow concept;
- Agent Framework implementation notes;
- UI proof points.

## Next Build Step

After registration and platform access are confirmed, the practical next build step is:

1. Create a Foundry project.
2. Create a Godspeed orchestrator agent.
3. Add specialist agents as workflow nodes.
4. Add human approval nodes before production actions.
5. Connect the existing `/api/mission` contract as either a tool or backend service.

