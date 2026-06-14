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
    scenarioProfile: mission.scenarioProfile,
    selectedTrack: mission.selectedTrack,
    demoProfile: mission.demoProfile,
    enterprisePath: mission.enterprisePath,
    selectedAgents: mission.specialists,
    approvalGates,
    actionPlan,
    defensePackage,
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
