import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SCENARIO = {
  title: "Critical remote access vulnerability",
  description:
    "A critical vulnerability has been disclosed in a widely used remote access component. The organisation needs to know whether it is exposed, whether existing logs can detect exploitation, what should be tested in a lab first, and what actions require approval.",
  urgency: "High",
  boundary:
    "Demo mode only. Sample data, no production access, no external communication, no destructive actions.",
};

const microsoftFit = [
  {
    layer: "Microsoft 365 Copilot / Copilot Studio",
    role: "Enterprise front door where a security owner starts a mission in natural language.",
  },
  {
    layer: "Microsoft Foundry Agent Service",
    role: "Managed runtime path for production agent hosting, tools, identity, memory and observability.",
  },
  {
    layer: "Microsoft Agent Framework",
    role: "Implementation path for multi-agent orchestration, workflows, state and telemetry.",
  },
  {
    layer: "GitHub Copilot",
    role: "Developer acceleration and repo-based explanation of the agent workflow.",
  },
];

const judgingFit = [
  "Clear target user: security teams and incident owners.",
  "Reasoning workflow: mission intake, specialist selection, premortem, actions and gates.",
  "Security and safety: read-only first, lab-first simulation and explicit approvals.",
  "Working demo: local browser app plus generated evidence artifacts.",
  "Microsoft path: Copilot front door, Foundry runtime, Agent Framework orchestration.",
];

const specialists = [
  {
    id: "mission-analyst",
    name: "Mission Analyst",
    wave: 1,
    defaultStatus: "selected",
    action: "Turn the intake into mission goals, boundaries, unknowns and decision points.",
    finding:
      "Scope the mission around exposure, detection, safe validation and approval gates. Production changes are out of scope until explicit approval exists.",
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence Agent",
    wave: 1,
    defaultStatus: "selected",
    action: "Map likely attacker behavior and separate public claims from validated evidence.",
    finding:
      "Likely risk pattern: internet-facing access path, credential abuse after exploit, and rapid opportunistic scanning. Treat external indicators as untrusted until validated.",
  },
  {
    id: "asset-exposure",
    name: "Asset & Exposure Agent",
    wave: 1,
    defaultStatus: "selected",
    action: "Build a shortlist of exposed assets and high-risk ownership paths.",
    finding:
      "Prioritise externally reachable services, privileged management paths, remote access brokers and systems with weak segmentation.",
  },
  {
    id: "vulnerability",
    name: "Vulnerability Prioritisation Agent",
    wave: 1,
    defaultStatus: "selected",
    action: "Rank remediation by exploitability, exposure and operational risk.",
    finding:
      "Rank systems by exploitability, exposure, business criticality, compensating controls and rollback complexity.",
  },
  {
    id: "log-coverage",
    name: "Log Coverage Agent",
    wave: 1,
    defaultStatus: "selected",
    action: "Check which telemetry proves exposure, exploitation attempts and containment progress.",
    finding:
      "Required signals: authentication events, remote access logs, process execution, network egress, admin changes and endpoint telemetry.",
  },
  {
    id: "evidence-audit",
    name: "Evidence & Audit Agent",
    wave: 1,
    defaultStatus: "selected",
    action: "Capture facts, assumptions, source data, unresolved unknowns and approvals.",
    finding:
      "Record assumptions, source data, tests, approval gates and unresolved unknowns in the evidence package.",
  },
  {
    id: "simulation",
    name: "Cyber Range / Simulation Agent",
    wave: 2,
    defaultStatus: "standby",
    action: "Design a lab-first validation before production systems are touched.",
    finding:
      "Build a lab-first validation path using sample assets and copied configuration patterns, not production access.",
  },
  {
    id: "patch-change",
    name: "Patch & Change Agent",
    wave: 2,
    defaultStatus: "standby",
    action: "Prepare patch sequence, rollback checks and maintenance-window decision points.",
    finding:
      "Prepare patch order, maintenance windows, smoke tests and rollback checks. Do not execute change automatically.",
  },
  {
    id: "containment",
    name: "Containment Agent",
    wave: 2,
    defaultStatus: "standby",
    action: "Prepare isolation and credential-rotation options behind approval gates.",
    finding:
      "Prepare isolation and credential rotation options as approval-gated actions only.",
  },
  {
    id: "communications",
    name: "Communications Draft Agent",
    wave: 3,
    defaultStatus: "standby",
    action: "Draft internal updates without sending anything externally.",
    finding:
      "Draft internal status updates and executive briefings. External sends stay blocked until approved.",
  },
  {
    id: "identity-access",
    name: "Identity & Access Agent",
    wave: 1,
    defaultStatus: "standby",
    action: "Check privileged accounts, sign-in anomalies and conditional-access impact.",
    finding:
      "Identity risk is treated as a first-class part of the mission when the scenario mentions accounts, email, tokens, VPN or cloud access.",
  },
  {
    id: "mail-security",
    name: "Mail Security Agent",
    wave: 1,
    defaultStatus: "standby",
    action: "Review mail-flow, reported messages, URLs, attachments and user impact.",
    finding:
      "Email-driven scenarios prioritise message trace, sender authentication, affected users and safe takedown steps.",
  },
  {
    id: "cloud-posture",
    name: "Cloud Posture Agent",
    wave: 1,
    defaultStatus: "standby",
    action: "Review cloud exposure, tenant controls, workload identity and storage risk.",
    finding:
      "Cloud scenarios prioritise identity, public endpoints, secrets, storage permissions and managed detection coverage.",
  },
  {
    id: "backup-recovery",
    name: "Backup & Recovery Agent",
    wave: 2,
    defaultStatus: "standby",
    action: "Check recovery points, restore confidence and business continuity options.",
    finding:
      "Ransomware and destructive-risk scenarios require recovery evidence before containment or rebuild decisions are made.",
  },
];

const approvals = [
  {
    action: "Run production vulnerability scan",
    reason: "Could affect sensitive systems or create operational noise.",
    defaultState: "blocked",
  },
  {
    action: "Apply patch to internet-facing systems",
    reason: "Requires rollback plan, maintenance window and owner approval.",
    defaultState: "blocked",
  },
  {
    action: "Isolate suspected hosts",
    reason: "Can interrupt service and business workflows.",
    defaultState: "blocked",
  },
  {
    action: "Send external status update",
    reason: "Must be reviewed for accuracy, scope and legal/compliance impact.",
    defaultState: "blocked",
  },
];

const scenarioProfiles = {
  vulnerability: {
    label: "Vulnerability / zero-day response",
    keywords: ["zero-day", "vulnerability", "cve", "patch", "remote access", "exploit"],
    selectedAgents: [
      "mission-analyst",
      "threat-intel",
      "asset-exposure",
      "vulnerability",
      "log-coverage",
      "evidence-audit",
      "simulation",
      "patch-change",
      "containment",
      "communications",
    ],
    extraFacts: ["The scenario is driven by vulnerability exposure and patch-risk decisions."],
  },
  phishing: {
    label: "Phishing / identity compromise",
    keywords: ["phishing", "mail", "email", "m365", "account", "token", "credential", "inbox"],
    selectedAgents: [
      "mission-analyst",
      "mail-security",
      "identity-access",
      "threat-intel",
      "log-coverage",
      "evidence-audit",
      "containment",
      "communications",
    ],
    extraFacts: ["The scenario is driven by identity, mail-flow and user-impact evidence."],
    approvals: [
      {
        action: "Disable or reset user accounts",
        reason: "Can interrupt legitimate access and must be scoped to affected identities.",
        defaultState: "blocked",
      },
      {
        action: "Purge messages from mailboxes",
        reason: "Requires evidence that the message is malicious and removal is proportionate.",
        defaultState: "blocked",
      },
      {
        action: "Revoke sessions or tokens tenant-wide",
        reason: "Can disrupt active business workflows.",
        defaultState: "blocked",
      },
      approvals[3],
    ],
  },
  ransomware: {
    label: "Ransomware / containment",
    keywords: ["ransomware", "encrypted", "encrypt", "locker", "wiper", "backup", "restore"],
    selectedAgents: [
      "mission-analyst",
      "asset-exposure",
      "log-coverage",
      "identity-access",
      "containment",
      "backup-recovery",
      "evidence-audit",
      "communications",
    ],
    extraFacts: ["The scenario is driven by containment, recovery evidence and business continuity."],
    approvals: [
      approvals[2],
      {
        action: "Start restore or rebuild workflow",
        reason: "Requires owner approval, recovery-point validation and data-loss assessment.",
        defaultState: "blocked",
      },
      {
        action: "Rotate privileged credentials",
        reason: "Can break automation and service accounts if not sequenced.",
        defaultState: "blocked",
      },
      approvals[3],
    ],
  },
  cloud: {
    label: "Cloud / SaaS exposure",
    keywords: ["cloud", "azure", "entra", "tenant", "storage", "s3", "saas", "container"],
    selectedAgents: [
      "mission-analyst",
      "cloud-posture",
      "identity-access",
      "log-coverage",
      "threat-intel",
      "simulation",
      "evidence-audit",
      "communications",
    ],
    extraFacts: ["The scenario is driven by cloud exposure, identity boundaries and managed telemetry."],
    approvals: [
      {
        action: "Change tenant-wide conditional access policy",
        reason: "Can lock out users or service principals if not tested.",
        defaultState: "blocked",
      },
      {
        action: "Restrict public cloud storage or workload endpoint",
        reason: "May interrupt production integrations.",
        defaultState: "blocked",
      },
      approvals[0],
      approvals[3],
    ],
  },
};

function chooseScenarioProfile(scenario) {
  const haystack = `${scenario.title} ${scenario.description}`.toLowerCase();
  return (
    Object.values(scenarioProfiles).find((profile) =>
      profile.keywords.some((keyword) => haystack.includes(keyword)),
    ) || scenarioProfiles.vulnerability
  );
}

function findAgentName(id) {
  return specialists.find((agent) => agent.id === id)?.name || id;
}

export function runGodspeedMission(input = {}) {
  const scenario = {
    ...DEFAULT_SCENARIO,
    ...input,
  };
  const profile = chooseScenarioProfile(input.description ? { title: "", description: input.description } : scenario);
  const selectedAgentIds = new Set(profile.selectedAgents);
  const selectedSpecialists = specialists
    .filter((agent) => selectedAgentIds.has(agent.id))
    .map((agent) => ({
      ...agent,
      status: "selected",
    }));

  const now = new Date();
  const missionId = `godspeed-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;

  const knownFacts = [
    "A critical security scenario has been reported.",
    "Exposure and detection coverage are not yet proven.",
    "The mission must avoid production changes until approval exists.",
    "Sample data is safe to use for demo validation.",
    ...profile.extraFacts,
  ];

  const assumptions = [
    "Some assets may be externally reachable.",
    "Existing logs may be incomplete or unevenly retained.",
    "Urgency is high, but uncontrolled remediation is a larger risk.",
  ];

  const unknowns = [
    "Which exact assets are exposed?",
    "Can current telemetry detect exploitation attempts?",
    "Which mitigations can be validated safely in a lab?",
    "Who approves production patching or containment?",
  ];

  const premortem = [
    "A vulnerable remote access path remained exposed after disclosure.",
    "Logs existed but were not mapped to the scenario quickly enough.",
    "Patch order followed generic severity instead of exposure and business impact.",
    "Emergency containment options were not pre-approved.",
    "Evidence was scattered across tools and could not support a fast decision.",
  ];

  const actions = [
    {
      horizon: "Immediate",
      action: `Create a ${profile.label.toLowerCase()} mission brief from the intake.`,
      ownerAgent: findAgentName("mission-analyst"),
      supportAgents: [findAgentName("evidence-audit"), findAgentName("threat-intel")],
      reason: "The mission needs a governed scope before any specialist work can become an operational task.",
      approval: "No, read-only sample/demo analysis.",
      evidence: "mission-brief.md and scenario-focus.md",
    },
    {
      horizon: "Immediate",
      action: "Map required evidence sources and identify detection gaps.",
      ownerAgent: findAgentName("log-coverage"),
      supportAgents: selectedAgentIds.has("identity-access")
        ? [findAgentName("identity-access"), findAgentName("evidence-audit")]
        : [findAgentName("asset-exposure"), findAgentName("evidence-audit")],
      reason: "Reasoning is only useful when it is grounded in telemetry that can prove or disprove exposure.",
      approval: "No, read-only sample/demo analysis.",
      evidence: "log-coverage.md",
    },
    {
      horizon: "Short-term",
      action: "Build lab-first validation plan for mitigation and rollback.",
      ownerAgent: selectedAgentIds.has("simulation")
        ? findAgentName("simulation")
        : findAgentName("mission-analyst"),
      supportAgents: selectedAgentIds.has("backup-recovery")
        ? [findAgentName("backup-recovery"), findAgentName("containment")]
        : [findAgentName("patch-change"), findAgentName("containment")],
      reason: "Godspeed keeps risky actions out of production until a safe test or rollback path exists.",
      approval: "No for plan, yes before production execution.",
      evidence: "simulation-plan.md",
    },
    {
      horizon: "Short-term",
      action: "Draft approval request for patch or containment actions.",
      ownerAgent: findAgentName("evidence-audit"),
      supportAgents: selectedAgentIds.has("patch-change")
        ? [findAgentName("patch-change"), findAgentName("containment")]
        : [findAgentName("containment"), findAgentName("communications")],
      reason: "Human approval needs a concise packet with impact, risk, rollback and unresolved unknowns.",
      approval: "Yes, explicit human approval required.",
      evidence: "approval-gates.md",
    },
    {
      horizon: "30 days",
      action: "Convert lessons learned into a repeatable defense playbook.",
      ownerAgent: findAgentName("communications"),
      supportAgents: [findAgentName("mission-analyst"), findAgentName("evidence-audit")],
      reason: "The incident reasoning should become reusable organizational memory, not a one-off chat transcript.",
      approval: "No for documentation, yes for operational policy changes.",
      evidence: "lessons-learned.md",
    },
  ];

  const mission = {
    missionId,
    generatedAt: now.toISOString(),
    scenario,
    scenarioProfile: profile.label,
    selectedTrack: "Reasoning Agents",
    demoProfile: "Local sandbox profile. No tenant secrets, no production tools, no customer data.",
    enterprisePath: "Microsoft 365 Copilot / Copilot Studio front door with Foundry Agent Service runtime path.",
    architecture: [
      "Copilot or Teams front door",
      "Godspeed mission orchestrator",
      "Foundry Agent Service / Agent Framework workflow",
      "Specialist defense agents",
      "Evidence package, audit trail and approval gates",
    ],
    microsoftFit,
    judgingFit,
    facts: knownFacts,
    assumptions,
    unknowns,
    specialists: selectedSpecialists,
    premortem,
    approvals: profile.approvals || approvals,
    actions,
    phaseDetails: [
      `Intake: classify the scenario as ${profile.label} and set safe boundaries.`,
      `Specialists: select ${selectedSpecialists.length} agents that match the scenario.`,
      "Premortem: reason backward from likely failure modes before action.",
      "Simulation: prepare lab-first checks before production changes.",
      `Approvals: block ${(profile.approvals || approvals).length} risky actions until a human approves.`,
      "Evidence: write the mission package and audit trail artifacts.",
    ],
    executiveSummary:
      `Godspeed classified the intake as ${profile.label} and converted it into a controlled defense mission. It selected specialist agents, separated facts from assumptions, identified unknowns, created a premortem, proposed lab-first validation and blocked risky actions behind approval gates.`,
  };

  return mission;
}

export function renderMarkdown(mission) {
  const lines = [];
  lines.push(`# Godspeed Defense Mission: ${mission.scenario.title}`);
  lines.push("");
  lines.push(`Mission ID: ${mission.missionId}`);
  lines.push(`Generated: ${mission.generatedAt}`);
  lines.push("");
  lines.push("## Executive Summary");
  lines.push("");
  lines.push(mission.executiveSummary);
  lines.push("");
  lines.push("## Scenario");
  lines.push("");
  lines.push(mission.scenario.description);
  lines.push("");
  lines.push(`Urgency: ${mission.scenario.urgency}`);
  lines.push(`Scenario profile: ${mission.scenarioProfile}`);
  lines.push("");
  lines.push("## Microsoft Fit");
  mission.microsoftFit.forEach((item) => lines.push(`- ${item.layer}: ${item.role}`));
  lines.push("");
  lines.push("## Known Facts");
  mission.facts.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Assumptions");
  mission.assumptions.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Unknowns");
  mission.unknowns.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Specialist Agents");
  mission.specialists.forEach((agent) => {
    lines.push(`- Wave ${agent.wave}: ${agent.name} (${agent.status}) - Action: ${agent.action} Finding: ${agent.finding}`);
  });
  lines.push("");
  lines.push("## Premortem");
  mission.premortem.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("## Approval Gates");
  mission.approvals.forEach((gate) => {
    lines.push(`- ${gate.action}: ${gate.defaultState}. ${gate.reason}`);
  });
  lines.push("");
  lines.push("## Action Plan");
  mission.actions.forEach((item) => {
    lines.push(
      `- ${item.horizon}: ${item.action} Owner: ${item.ownerAgent}. Support: ${item.supportAgents.join(", ")}. Reason: ${item.reason} Approval: ${item.approval}. Evidence: ${item.evidence}.`,
    );
  });
  lines.push("");
  lines.push("## Judging Fit");
  mission.judgingFit.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  return lines.join("\n");
}

export async function writeMissionArtifacts(mission, rootDir) {
  const runDir = path.join(rootDir, "artifacts", "last-run");
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, "mission.json"), JSON.stringify(mission, null, 2));
  await writeFile(path.join(runDir, "mission-plan.md"), renderMarkdown(mission));
  await writeFile(
    path.join(runDir, "approval-gates.md"),
    mission.approvals.map((gate) => `- [ ] ${gate.action}: ${gate.reason}`).join("\n") + "\n",
  );
  await writeFile(
    path.join(runDir, "executive-summary.md"),
    `# Executive Summary\n\n${mission.executiveSummary}\n`,
  );
  await writeFile(
    path.join(runDir, "microsoft-fit.md"),
    mission.microsoftFit.map((item) => `- ${item.layer}: ${item.role}`).join("\n") + "\n",
  );
  return runDir;
}
