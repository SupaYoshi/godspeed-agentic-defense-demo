import { readFile } from "node:fs/promises";
import { runGodspeedMission } from "../src/godspeed.mjs";
import { toAgentFrameworkEvent, toCopilotToolResponse } from "../src/microsoft-bridge.mjs";

const openApi = JSON.parse(await readFile(new URL("../microsoft/copilot-studio-openapi-v2.json", import.meta.url), "utf8"));
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

if (event.type !== "GodspeedMissionCreated") {
  throw new Error("Agent Framework event type is incorrect");
}

if (event.workflow.guardrails?.productionExecution !== "disabled") {
  throw new Error("Agent Framework event must keep production execution disabled in the public demo");
}

const requiredOpenApiDefinitions = [
  "IntegrationProfile",
  "SafetyBoundary",
  "SourceEndpoints",
  "SuggestedCopilotReply",
];

for (const definition of requiredOpenApiDefinitions) {
  if (!openApi.definitions?.[definition]) {
    throw new Error(`OpenAPI v2 spec is missing ${definition}`);
  }
  if (!foundryOpenApi.includes(`${definition}:`)) {
    throw new Error(`OpenAPI 3 spec is missing ${definition}`);
  }
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
