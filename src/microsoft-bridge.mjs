import { readFileSync } from "node:fs";

const approvalLadder = JSON.parse(
  readFileSync(new URL("../microsoft/integration-approval-ladder.json", import.meta.url), "utf8"),
);
const microsoftIqLayer = JSON.parse(
  readFileSync(new URL("../microsoft/foundry-iq-knowledge-layer.json", import.meta.url), "utf8"),
);

const integrationProfile = {
  mode: "dev-test-foundry-connected",
  microsoftTarget: "Copilot Studio front door with Foundry Agent Service and Agent Framework runtime path",
  authentication: "server-side only; no browser-exposed credentials",
  productionExecution: "disabled",
};

const sourceEndpoints = {
  foundryAgent: "POST /api/foundry/agent",
  foundryAsk: "POST /api/foundry/ask",
  copilotTool: "POST /api/microsoft/copilot/mission",
  agentFrameworkEvent: "POST /api/microsoft/agent-framework/event",
  localDemo: "POST /api/mission",
};

const safetyBoundary = {
  dataProfile: "sample/demo data only",
  secrets: "do not request, store or return tenant secrets",
  productionAccess: "not connected",
  riskyActions: "blocked until explicit human approval and a scoped execution tool exists",
};

const manualTenantProofSteps = [
  "Keep the public website-to-Foundry bridge server-side so credentials never reach browser JavaScript.",
  "Use the approved dev/test Foundry agent and knowledge layer for hackathon proof.",
  "Use the Godspeed OpenAPI tool for mission package creation.",
  "Capture screenshots of the tool config, successful mission response, approval gates and evidence package.",
  "Replace the dev/test authentication path with managed identity or a tenant-approved service principal before production use.",
];

export function toCopilotToolResponse(mission, artifactDir) {
  const approvalGates = mission.approvals.map((gate) => ({
    action: gate.action,
    reason: gate.reason,
    state: gate.defaultState || "blocked",
  }));

  const actionPlan = mission.actions.map((item) => ({
    horizon: item.horizon,
    task: item.action,
    ownerAgent: item.ownerAgent,
    supportAgents: item.supportAgents,
    reason: item.reason,
    approval: item.approval,
    evidence: item.evidence,
  }));

  const defensePackage = {
    summary: mission.executiveSummary,
    facts: mission.facts,
    assumptions: mission.assumptions,
    unknowns: mission.unknowns,
    premortem: mission.premortem,
    nextDecisions: actionPlan
      .filter((item) => item.approval.toLowerCase().includes("yes"))
      .map((item) => item.task),
  };

  return {
    missionId: mission.missionId,
    generatedAt: mission.generatedAt,
    integrationProfile,
    safetyBoundary,
    sourceEndpoints,
    scenarioProfile: mission.scenarioProfile,
    selectedTrack: mission.selectedTrack,
    demoProfile: mission.demoProfile,
    enterprisePath: mission.enterprisePath,
    selectedAgents: mission.specialists,
    approvalGates,
    actionPlan,
    defensePackage,
    localApprovalLadder: approvalLadder,
    microsoftIqLayer,
    suggestedCopilotReply: {
      opening: mission.executiveSummary,
      requiredSections: [
        "mission summary",
        "selected specialist agents",
        "approval-gated actions",
        "recommended next decisions",
        "evidence package",
      ],
      disclaimer:
        "This is a planning and evidence package. It does not prove remediation or execute production actions.",
    },
    manualTenantProofSteps,
    artifactDir,
  };
}

export function toAgentFrameworkEvent(mission) {
  return {
    type: "GodspeedMissionCreated",
    missionId: mission.missionId,
    profile: mission.scenarioProfile,
    workflow: {
      intake: {
        title: mission.scenario.title,
        description: mission.scenario.description,
        urgency: mission.scenario.urgency,
        boundary: mission.scenario.boundary,
      },
      specialists: mission.specialists.map((agent) => ({
        nodeId: agent.id,
        displayName: agent.name,
        wave: agent.wave,
        roleInstruction: agent.action,
      })),
      approvalGates: mission.approvals,
      guardrails: {
        mode: integrationProfile.mode,
        productionExecution: integrationProfile.productionExecution,
        riskyActions: safetyBoundary.riskyActions,
        approvalLadder: {
          profile: approvalLadder.profile,
          defaultState: approvalLadder.defaultState,
          hardBlockGate: "block-production-customer-security-tool-connections",
        },
        microsoftIqLayer: {
          type: microsoftIqLayer.type,
          integrationStatus: microsoftIqLayer.integrationStatus,
          tenantProofStatus: microsoftIqLayer.tenantProofStatus,
          approvalGate: "approve-foundry-iq-knowledge-layer",
        },
      },
      outputArtifacts: [
        "mission.json",
        "mission-plan.md",
        "approval-gates.md",
        "executive-summary.md",
        "microsoft-fit.md",
      ],
    },
  };
}
