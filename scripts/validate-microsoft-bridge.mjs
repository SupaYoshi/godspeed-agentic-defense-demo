import { readFile } from "node:fs/promises";
import { runGodspeedMission } from "../src/godspeed.mjs";
import { toAgentFrameworkEvent, toCopilotToolResponse } from "../src/microsoft-bridge.mjs";

const openApi = JSON.parse(await readFile(new URL("../microsoft/copilot-studio-openapi-v2.json", import.meta.url), "utf8"));

const requiredPaths = [
  "/api/microsoft/copilot/mission",
  "/api/microsoft/agent-framework/event",
];

for (const requiredPath of requiredPaths) {
  if (!openApi.paths?.[requiredPath]?.post) {
    throw new Error(`OpenAPI v2 spec is missing POST ${requiredPath}`);
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
  "scenarioProfile",
  "selectedAgents",
  "approvalGates",
  "actionPlan",
  "defensePackage",
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

if (event.type !== "GodspeedMissionCreated") {
  throw new Error("Agent Framework event type is incorrect");
}

console.log("Microsoft bridge validation passed");
