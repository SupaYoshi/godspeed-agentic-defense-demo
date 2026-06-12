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
    status: "selected",
    finding:
      "Scope the mission around exposure, detection, safe validation and approval gates. Production changes are out of scope until explicit approval exists.",
  },
  {
    id: "threat-intel",
    name: "Threat Intelligence Agent",
    wave: 1,
    status: "selected",
    finding:
      "Likely risk pattern: internet-facing access path, credential abuse after exploit, and rapid opportunistic scanning. Treat external indicators as untrusted until validated.",
  },
  {
    id: "asset-exposure",
    name: "Asset & Exposure Agent",
    wave: 1,
    status: "selected",
    finding:
      "Prioritise externally reachable services, privileged management paths, remote access brokers and systems with weak segmentation.",
  },
  {
    id: "vulnerability",
    name: "Vulnerability Prioritisation Agent",
    wave: 1,
    status: "selected",
    finding:
      "Rank systems by exploitability, exposure, business criticality, compensating controls and rollback complexity.",
  },
  {
    id: "log-coverage",
    name: "Log Coverage Agent",
    wave: 1,
    status: "selected",
    finding:
      "Required signals: authentication events, remote access logs, process execution, network egress, admin changes and endpoint telemetry.",
  },
  {
    id: "evidence-audit",
    name: "Evidence & Audit Agent",
    wave: 1,
    status: "selected",
    finding:
      "Record assumptions, source data, tests, approval gates and unresolved unknowns in the evidence package.",
  },
  {
    id: "simulation",
    name: "Cyber Range / Simulation Agent",
    wave: 2,
    status: "standby",
    finding:
      "Build a lab-first validation path using sample assets and copied configuration patterns, not production access.",
  },
  {
    id: "patch-change",
    name: "Patch & Change Agent",
    wave: 2,
    status: "standby",
    finding:
      "Prepare patch order, maintenance windows, smoke tests and rollback checks. Do not execute change automatically.",
  },
  {
    id: "containment",
    name: "Containment Agent",
    wave: 2,
    status: "standby",
    finding:
      "Prepare isolation and credential rotation options as approval-gated actions only.",
  },
  {
    id: "communications",
    name: "Communications Draft Agent",
    wave: 3,
    status: "standby",
    finding:
      "Draft internal status updates and executive briefings. External sends stay blocked until approved.",
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

export function runGodspeedMission(input = {}) {
  const scenario = {
    ...DEFAULT_SCENARIO,
    ...input,
  };

  const now = new Date();
  const missionId = `godspeed-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;

  const knownFacts = [
    "A critical security scenario has been reported.",
    "Exposure and detection coverage are not yet proven.",
    "The mission must avoid production changes until approval exists.",
    "Sample data is safe to use for demo validation.",
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
      action: "Create asset exposure shortlist from inventory and edge services.",
      approval: "No, read-only sample/demo analysis.",
      evidence: "asset-exposure.csv and exposure-notes.md",
    },
    {
      horizon: "Immediate",
      action: "Map required log sources and identify detection gaps.",
      approval: "No, read-only sample/demo analysis.",
      evidence: "log-coverage.md",
    },
    {
      horizon: "Short-term",
      action: "Build lab-first validation plan for mitigation and rollback.",
      approval: "No for plan, yes before production execution.",
      evidence: "simulation-plan.md",
    },
    {
      horizon: "Short-term",
      action: "Draft approval request for patch or containment actions.",
      approval: "Yes, explicit human approval required.",
      evidence: "approval-gates.md",
    },
    {
      horizon: "30 days",
      action: "Convert lessons learned into a repeatable defense playbook.",
      approval: "No for documentation, yes for operational policy changes.",
      evidence: "lessons-learned.md",
    },
  ];

  const mission = {
    missionId,
    generatedAt: now.toISOString(),
    scenario,
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
    specialists,
    premortem,
    approvals,
    actions,
    executiveSummary:
      "Godspeed converted a high-pressure security scenario into a controlled defense mission. It selected a first wave of specialist agents, separated facts from assumptions, identified unknowns, created a premortem, proposed lab-first validation and blocked risky actions behind approval gates.",
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
    lines.push(`- Wave ${agent.wave}: ${agent.name} (${agent.status}) - ${agent.finding}`);
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
    lines.push(`- ${item.horizon}: ${item.action} Approval: ${item.approval}. Evidence: ${item.evidence}.`);
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
