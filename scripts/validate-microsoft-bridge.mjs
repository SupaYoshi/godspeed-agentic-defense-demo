import { readFile } from "node:fs/promises";
import { runGodspeedMission } from "../src/godspeed.mjs";
import { toAgentFrameworkEvent, toCopilotToolResponse } from "../src/microsoft-bridge.mjs";

const openApi = JSON.parse(await readFile(new URL("../microsoft/copilot-studio-openapi-v2.json", import.meta.url), "utf8"));
const approvalLadder = JSON.parse(
  await readFile(new URL("../microsoft/integration-approval-ladder.json", import.meta.url), "utf8"),
);
const foundryOpenApi = await readFile(new URL("../microsoft/godspeed-mission.openapi.yaml", import.meta.url), "utf8");

const requiredPaths = [
  "/api/microsoft/copilot/mission",
  "/api/microsoft/agent-framework/event",
];

for (const requiredPath of requiredPaths) {
  if (!openApi.paths?.[requiredPath]?.post) {
    throw new Error(`OpenAPI v2 spec is missing POST ${requiredPath}`);
  }
  if (!foundryOpenApi.includes(requiredPath)) {
    throw new Error(`OpenAPI 3 spec is missing ${requiredPath}`);
  }
}

const mission = runGodspeedMission({
  title: "Critical remote access vulnerability",
  description: "A critical zero-day affects an internet-facing remote access service.",
  urgency: "Critical",
  boundary: "Read-only first. No production changes without approval.",
  approvalOwner: "Security incident commander",
});

const copilotResponse = toCopilotToolResponse(mission, "artifacts/last-run");
const event = toAgentFrameworkEvent(mission);

const requiredCopilotFields = [
  "missionId",
  "integrationProfile",
  "safetyBoundary",
  "sourceEndpoints",
  "scenarioProfile",
  "selectedAgents",
  "approvalGates",
  "actionPlan",
  "defensePackage",
  "localApprovalLadder",
  "suggestedCopilotReply",
  "manualTenantProofSteps",
];

for (const field of requiredCopilotFields) {
  if (!(field in copilotResponse)) {
    throw new Error(`Copilot response is missing ${field}`);
  }
}

if (!Array.isArray(copilotResponse.selectedAgents) || copilotResponse.selectedAgents.length === 0) {
  throw new Error("Copilot response must include selected agents");
}

if (!Array.isArray(copilotResponse.approvalGates) || copilotResponse.approvalGates.length === 0) {
  throw new Error("Copilot response must include approval gates");
}

if (copilotResponse.integrationProfile.mode !== "local-sandbox") {
  throw new Error("Copilot response must identify the local-sandbox integration profile");
}

if (!copilotResponse.safetyBoundary.riskyActions.toLowerCase().includes("blocked")) {
  throw new Error("Copilot response must preserve blocked risky-action safety boundary");
}

if (!copilotResponse.sourceEndpoints.copilotTool.includes("/api/microsoft/copilot/mission")) {
  throw new Error("Copilot response must include the Copilot tool endpoint");
}

if (!copilotResponse.suggestedCopilotReply.disclaimer.includes("does not prove remediation")) {
  throw new Error("Copilot response must include a remediation disclaimer");
}

if (!Array.isArray(copilotResponse.manualTenantProofSteps) || copilotResponse.manualTenantProofSteps.length < 4) {
  throw new Error("Copilot response must include manual tenant proof steps");
}

if (copilotResponse.localApprovalLadder.profile !== "local-demo-approval-model") {
  throw new Error("Copilot response must include the local/demo Microsoft integration approval ladder");
}

if (copilotResponse.localApprovalLadder.defaultState !== "not-approved") {
  throw new Error("Integration approval ladder must default to not-approved");
}

if (event.type !== "GodspeedMissionCreated") {
  throw new Error("Agent Framework event type is incorrect");
}

if (event.workflow.guardrails?.productionExecution !== "disabled") {
  throw new Error("Agent Framework event must keep production execution disabled in the public demo");
}

if (event.workflow.guardrails?.approvalLadder?.hardBlockGate !== "block-production-customer-security-tool-connections") {
  throw new Error("Agent Framework guardrails must reference the production/customer/security-tool hard block");
}

const requiredOpenApiDefinitions = [
  "IntegrationProfile",
  "SafetyBoundary",
  "SourceEndpoints",
  "SuggestedCopilotReply",
  "LocalApprovalLadder",
  "ApprovalLadderGate",
];

for (const definition of requiredOpenApiDefinitions) {
  if (!openApi.definitions?.[definition]) {
    throw new Error(`OpenAPI v2 spec is missing ${definition}`);
  }
  if (!foundryOpenApi.includes(`${definition}:`)) {
    throw new Error(`OpenAPI 3 spec is missing ${definition}`);
  }
}

const requiredApprovalGateIds = [
  "approve-public-https-endpoint-choice",
  "approve-sandbox-auth-mode",
  "approve-copilot-studio-openapi-import",
  "approve-foundry-openapi-tool-configuration",
  "approve-test-prompts-and-screenshots",
  "block-production-customer-security-tool-connections",
];

if (approvalLadder.profile !== "local-demo-approval-model") {
  throw new Error("Approval ladder must use the local-demo-approval-model profile");
}

if (approvalLadder.defaultState !== "not-approved") {
  throw new Error("Approval ladder must default to not-approved");
}

if (!approvalLadder.rationale.toLowerCase().includes("too early")) {
  throw new Error("Approval ladder must explain that live tenant approval automation is too early");
}

const ladderGateIds = new Set(approvalLadder.gates?.map((gate) => gate.id));

for (const gateId of requiredApprovalGateIds) {
  if (!ladderGateIds.has(gateId)) {
    throw new Error(`Approval ladder is missing gate ${gateId}`);
  }
}

const orderedSequences = approvalLadder.gates.map((gate) => gate.sequence);
const sortedSequences = [...orderedSequences].sort((a, b) => a - b);

if (orderedSequences.join(",") !== sortedSequences.join(",")) {
  throw new Error("Approval ladder gates must be ordered by sequence");
}

const hardBlockGate = approvalLadder.gates.find(
  (gate) => gate.id === "block-production-customer-security-tool-connections",
);

if (hardBlockGate.decisionType !== "hard-block" || hardBlockGate.defaultState !== "blocked") {
  throw new Error("Production/customer/security-tool gate must be a blocked hard block");
}

const blockedCapabilities = hardBlockGate.blockedCapabilities.join(" ").toLowerCase();

for (const blockedTerm of ["customer data", "production scans", "tenant-wide policy changes"]) {
  if (!blockedCapabilities.includes(blockedTerm)) {
    throw new Error(`Hard-block gate must mention ${blockedTerm}`);
  }
}

if (copilotResponse.localApprovalLadder.gates.length !== approvalLadder.gates.length) {
  throw new Error("Copilot response ladder must match the structured approval ladder artifact");
}

const scenarioSamples = [
  {
    description: "A phishing campaign led to suspected account token theft in Microsoft 365.",
    expectedProfile: "Phishing / identity compromise",
  },
  {
    description: "Ransomware encrypted several file shares and the team needs restore evidence.",
    expectedProfile: "Ransomware / containment",
  },
  {
    description: "An Azure storage endpoint may be publicly exposed after a cloud configuration change.",
    expectedProfile: "Cloud / SaaS exposure",
  },
];

for (const sample of scenarioSamples) {
  const sampleMission = runGodspeedMission(sample);
  const sampleResponse = toCopilotToolResponse(sampleMission, "artifacts/last-run");
  if (sampleResponse.scenarioProfile !== sample.expectedProfile) {
    throw new Error(`Expected ${sample.expectedProfile}, got ${sampleResponse.scenarioProfile}`);
  }
  if (!sampleResponse.approvalGates.every((gate) => gate.state === "blocked")) {
    throw new Error(`Approval gates must default to blocked for ${sample.expectedProfile}`);
  }
}

console.log("Microsoft bridge validation passed");
