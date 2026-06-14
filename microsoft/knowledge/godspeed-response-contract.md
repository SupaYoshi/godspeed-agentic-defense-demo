# Godspeed Response Contract

Use this contract when the Godspeed Foundry agent answers a security mission prompt.

The response must be reviewable by a security incident owner and screenshot-ready for the hackathon proof.

## Required Sections

Return these sections in order:

1. Mission summary.
2. Scenario profile.
3. Selected specialist agents.
4. Facts, assumptions and unknowns.
5. Premortem.
6. Approval gates.
7. Action plan.
8. Evidence package.
9. Safety boundary.
10. Microsoft IQ status.

## Mission Summary

Explain the mission in two or three sentences. State the goal, the immediate risk and the decision the human owner must make next.

## Scenario Profile

Classify the scenario, urgency, affected environment and operational boundary. If details are missing, mark them as unknown instead of inventing them.

## Selected Specialist Agents

Select only the specialist agents needed for the scenario. For each selected agent, explain why it is needed and what evidence it should produce.

## Facts, Assumptions And Unknowns

Keep facts separate from assumptions. Use unknowns to show what the agent cannot safely conclude yet.

## Premortem

List the most likely ways the mission could fail, including false positives, missing logs, unsafe remediation, unclear ownership and overclaiming results.

## Approval Gates

Risky actions must be blocked or pending human approval. Production scans, patching, host isolation, credential resets, tenant-wide policy changes, external communications and customer-data access require explicit approval and a scoped execution tool.

## Action Plan

Use lab-first validation before production action. Assign owners, expected evidence and approval status to each action.

## Evidence Package

Include screenshot-ready proof points, source references, unresolved unknowns and next decisions. A mission package is not evidence that remediation happened.

## Safety Boundary

State that the public demo uses sample or dev/test data only. Do not request secrets, tenant IDs, API keys, customer data or production telemetry.

## Microsoft IQ Status

Before live screenshots exist, use this wording:

```text
Foundry IQ integration status: approval-gated.
Tenant proof status: tenant-proof pending.
```

After live knowledge-grounding screenshots exist, but before the OpenAPI tool is configured and tested, use this narrower wording:

```text
Foundry IQ knowledge-grounding proof captured; OpenAPI tool proof pending.
```

Only after a separate OpenAPI tool screenshot and successful tool call exist, use:

```text
Foundry IQ dev/test tenant proof completed with knowledge-base grounding and approval-gated mission output.
```

## Do Not Claim

- Do not claim production deployment.
- Do not claim Work IQ, Fabric IQ, Microsoft Graph, Defender, Sentinel, Intune, endpoint-response or ticketing integration.
- Do not claim remediation, isolation, patching, credential reset, tenant policy change, external communication or production scanning occurred.
- Do not claim customer or production security data was used.
- Do not claim OpenAPI tool proof until `createGodspeedCopilotMission` is configured and a test call succeeds.
