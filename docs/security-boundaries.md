# Security Boundaries

Godspeed is intentionally built around controlled autonomy.

## Allowed In Demo Mode

- Use sample asset data.
- Produce mission plans.
- Generate evidence artifacts.
- Draft approval requests.
- Draft executive summaries.
- Show simulated specialist-agent findings.

## Blocked In Demo Mode

- No production scans.
- No real tenant secrets.
- No customer data.
- No external messages.
- No patch execution.
- No host isolation.
- No credential rotation.
- No direct remediation.

## Approval Gates

The demo blocks these classes of actions by default:

- production vulnerability scans;
- production patch deployment;
- host isolation;
- external communication;
- customer or executive notification;
- high-impact containment.

## Why This Matters

Security teams do not need an agent that acts fast and uncontrolled. They need an agent that can reason quickly, assemble specialists, prepare evidence, and ask for approval before crossing operational boundaries.

