# Microsoft Integration Approval Ladder Runbook

This runbook answers the practical question: it is too early to automate live tenant approvals, but it is the right time to model the integration gates locally.

The ladder is a demo-safe governance artifact. It shows judges and reviewers how Godspeed would move from local sandbox proof to Microsoft Copilot Studio, Foundry and Agent Framework evidence without pretending that live tenant actions have already happened.

## Structured Artifact

Use:

- `microsoft/integration-approval-ladder.json`

The bridge includes the same artifact in `localApprovalLadder` on `POST /api/microsoft/copilot/mission`, so Copilot or Foundry can display the pending gates beside the mission plan.

## Ladder States

- `not-approved`: the gate is modeled but no live action may be taken yet.
- `blocked`: the capability is explicitly prohibited in the public demo.
- `manual-approval`: Walter or a delegated tenant owner must approve the step outside the repo.
- `hard-block`: the step cannot proceed as part of this demo and needs a separate scoped approval package.

## Gate Order

1. Approve public HTTPS endpoint choice.
2. Approve sandbox authentication mode.
3. Approve Copilot Studio OpenAPI import.
4. Approve Foundry OpenAPI tool configuration.
5. Approve test prompts and screenshots.
6. Block production, customer and security-tool connections until separate approval.

## How To Use In The Demo

1. Run `npm run check:microsoft`.
2. Start the local API with `npm start`.
3. Call `POST /api/microsoft/copilot/mission`.
4. Show `localApprovalLadder.gates` alongside `approvalGates`.
5. Explain that mission approvals govern security actions, while the integration ladder governs Microsoft rollout steps.
6. Keep all gates in `not-approved` or `blocked` state unless Walter has explicitly approved the live tenant action.

## Validation

`npm run check:microsoft` validates that:

- the ladder JSON exists and parses;
- required gate IDs are present;
- gate sequence numbers are ordered;
- live tenant automation is not represented as enabled;
- production/customer/security-tool connections remain hard-blocked;
- the Copilot response contains `localApprovalLadder`;
- the OpenAPI v2 and OpenAPI 3 contracts include the ladder schemas.

## Boundary

Do not use this ladder to create Azure resources, change tenant settings, store secrets, deploy public endpoints, connect production tools, ingest customer data or post externally. It is a local/demo governance model until Walter gives explicit approval for a specific live step.
