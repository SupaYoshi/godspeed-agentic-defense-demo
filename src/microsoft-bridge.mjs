import { readFileSync } from "node:fs";

const approvalLadder = JSON.parse(
  readFileSync(new URL("../microsoft/integration-approval-ladder.json", import.meta.url), "utf8"),
);

const integrationProfile = {
  mode: "local-sandbox",
  microsoftTarget: "Copilot Studio front door with Foundry Agent Service and Agent Framework runtime path",
  authentication: "not configured in public demo",
  productionExecution: "disabled",
};

const sourceEndpoints = {
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
  "Expose the local API through an approved HTTPS endpoint or deploy a reviewed sandbox API.",
  "Update the Copilot Studio OpenAPI v2 host or Foundry OpenAPI server URL for that endpoint.",
  "Import the REST API tool in Copilot Studio or configure the OpenAPI tool in Foundry.",
  "Attach the Godspeed agent instructions and run one sandbox mission from the Microsoft surface.",
  "Capture screenshots of the tool import, successful mission response, approval gates and evidence package.",
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
