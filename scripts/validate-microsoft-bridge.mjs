import { readFile } from "node:fs/promises";
import { runGodspeedMission } from "../src/godspeed.mjs";
import { toAgentFrameworkEvent, toCopilotToolResponse } from "../src/microsoft-bridge.mjs";

const openApi = JSON.parse(await readFile(new URL("../microsoft/copilot-studio-openapi-v2.json", import.meta.url), "utf8"));
const approvalLadder = JSON.parse(
  await readFile(new URL("../microsoft/integration-approval-ladder.json", import.meta.url), "utf8"),
);
const foundryIqLayer = JSON.parse(
  await readFile(new URL("../microsoft/foundry-iq-knowledge-layer.json", import.meta.url), "utf8"),
);
const foundryIqEvidenceChecklist = await readFile(
  new URL("../microsoft/foundry-iq-tenant-evidence-checklist.md", import.meta.url),
  "utf8",
);
const foundryLiveProof = await readFile(new URL("../microsoft/foundry-live-proof.md", import.meta.url), "utf8");
const foundryUiQuickstart = await readFile(new URL("../microsoft/foundry-ui-quickstart.md", import.meta.url), "utf8");
const foundryAgentInstructions = await readFile(
  new URL("../microsoft/foundry-agent-instructions.md", import.meta.url),
  "utf8",
);
const knowledgeReadme = await readFile(new URL("../microsoft/knowledge/README.md", import.meta.url), "utf8");
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
  "microsoftIqLayer",
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

if (copilotResponse.microsoftIqLayer.type !== "Foundry IQ") {
  throw new Error("Copilot response must include a Foundry IQ Microsoft IQ layer");
}

if (copilotResponse.microsoftIqLayer.integrationStatus !== "approval-gated") {
  throw new Error("Foundry IQ layer must remain approval-gated until live tenant proof exists");
}

if (copilotResponse.microsoftIqLayer.tenantProofStatus !== "tenant-proof pending") {
  throw new Error("Foundry IQ layer must clearly mark tenant proof as pending");
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

if (event.workflow.guardrails?.microsoftIqLayer?.approvalGate !== "approve-foundry-iq-knowledge-layer") {
  throw new Error("Agent Framework guardrails must reference the Foundry IQ approval gate");
}

const requiredOpenApiDefinitions = [
  "IntegrationProfile",
  "SafetyBoundary",
  "SourceEndpoints",
  "SuggestedCopilotReply",
  "LocalApprovalLadder",
  "ApprovalLadderGate",
  "MicrosoftIqLayer",
  "MicrosoftDocReference",
  "IqKnowledgeSource",
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
  "approve-foundry-iq-knowledge-layer",
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

if (foundryIqLayer.type !== "Foundry IQ") {
  throw new Error("Foundry IQ manifest must identify type as Foundry IQ");
}

if (foundryIqLayer.integrationStatus !== "approval-gated") {
  throw new Error("Foundry IQ manifest must be approval-gated");
}

if (foundryIqLayer.tenantProofStatus !== "tenant-proof pending") {
  throw new Error("Foundry IQ manifest must mark tenant proof pending");
}

if (!foundryIqLayer.approvalGateReferences.includes("approve-foundry-iq-knowledge-layer")) {
  throw new Error("Foundry IQ manifest must reference the Foundry IQ approval gate");
}

if (!foundryIqLayer.microsoftDocs.every((doc) => doc.url.startsWith("https://learn.microsoft.com/"))) {
  throw new Error("Foundry IQ manifest must cite official Microsoft Learn references");
}

if (!Array.isArray(foundryIqLayer.knowledgeSources) || foundryIqLayer.knowledgeSources.length < 2) {
  throw new Error("Foundry IQ manifest must include at least two safe knowledge sources");
}

for (const source of foundryIqLayer.knowledgeSources) {
  if (source.sensitivity !== "public-demo-safe") {
    throw new Error(`Knowledge source ${source.sourceId} must be public-demo-safe`);
  }
  await readFile(new URL(`../${source.path}`, import.meta.url), "utf8");
}

if (copilotResponse.microsoftIqLayer.knowledgeSources.length !== foundryIqLayer.knowledgeSources.length) {
  throw new Error("Copilot response IQ layer must match the Foundry IQ manifest sources");
}

const requiredEvidenceChecklistPhrases = [
  "Foundry project overview",
  "Agent model/configuration",
  "Foundry IQ or Knowledge detail",
  "Knowledge source list",
  "Agent configuration",
  "Test prompt result",
  "Grounded or cited answer evidence",
  "Safety boundary or approval gates",
  "OpenAPI tool configuration",
  "Submission Wording Before Tenant Proof",
  "Submission Wording After Tenant Proof",
];

for (const phrase of requiredEvidenceChecklistPhrases) {
  if (!foundryIqEvidenceChecklist.includes(phrase)) {
    throw new Error(`Foundry IQ evidence checklist is missing ${phrase}`);
  }
}

for (const phrase of [
  "Foundry project: `Godspeed-Agentic-Defense`",
  "Region: `Sweden Central`",
  "Model: `GPT-4.1`",
  "Knowledge base: `godspeed-defense-mission-knowledge`",
  "Status: `pending-screenshots`",
]) {
  if (!foundryLiveProof.includes(phrase)) {
    throw new Error(`Foundry live proof template is missing ${phrase}`);
  }
}

const requiredFoundryQuickstartPhrases = [
  "GPT-4.1",
  "Sweden Central",
  "Godspeed-Agentic-Defense",
  "godspeed-defense-mission-knowledge",
  "microsoft/foundry-agent-instructions.md",
  "createGodspeedCopilotMission",
];

for (const phrase of requiredFoundryQuickstartPhrases) {
  if (!foundryUiQuickstart.includes(phrase)) {
    throw new Error(`Foundry UI quickstart is missing ${phrase}`);
  }
}

for (const phrase of ["Mission summary", "Approval gates", "Microsoft IQ status", "tenant-proof pending"]) {
  if (!foundryAgentInstructions.includes(phrase)) {
    throw new Error(`Foundry agent instructions are missing ${phrase}`);
  }
}

for (const source of foundryIqLayer.knowledgeSources) {
  if (!knowledgeReadme.includes(source.path.split("/").at(-1))) {
    throw new Error(`Knowledge README is missing ${source.path}`);
  }
}

const requiredUploadBundleFiles = [
  "README.md",
  "foundry-agent-instructions.md",
  "foundry-iq-knowledge-layer.json",
  "foundry-iq-tenant-evidence-checklist.md",
  "foundry-ui-quickstart.md",
  "godspeed-approval-boundaries.json",
  "godspeed-foundry-iq-knowledge-pack.zip",
  "godspeed-iq-grounding-overview.md",
];

for (const fileName of requiredUploadBundleFiles) {
  await readFile(new URL(`../artifacts/foundry-iq-upload/${fileName}`, import.meta.url));
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
