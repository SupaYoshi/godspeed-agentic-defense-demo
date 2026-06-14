import http from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runGodspeedMission, writeMissionArtifacts } from "./godspeed.mjs";
import { toAgentFrameworkEvent, toCopilotToolResponse } from "./microsoft-bridge.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const port = Number(process.env.PORT || 8088);

const publicSpecRoutes = new Map([
  [
    "/openapi.yaml",
    {
      file: path.join(rootDir, "microsoft", "godspeed-mission.openapi.yaml"),
      type: "application/yaml; charset=utf-8",
    },
  ],
  [
    "/microsoft/godspeed-mission.openapi.yaml",
    {
      file: path.join(rootDir, "microsoft", "godspeed-mission.openapi.yaml"),
      type: "application/yaml; charset=utf-8",
    },
  ],
  [
    "/openapi-foundry.yaml",
    {
      file: path.join(rootDir, "microsoft", "foundry-openapi-tool.yaml"),
      type: "application/yaml; charset=utf-8",
    },
  ],
  [
    "/microsoft/foundry-openapi-tool.yaml",
    {
      file: path.join(rootDir, "microsoft", "foundry-openapi-tool.yaml"),
      type: "application/yaml; charset=utf-8",
    },
  ],
  [
    "/openapi-foundry.json",
    {
      file: path.join(rootDir, "microsoft", "foundry-openapi-tool.json"),
      type: "application/json; charset=utf-8",
    },
  ],
  [
    "/microsoft/foundry-openapi-tool.json",
    {
      file: path.join(rootDir, "microsoft", "foundry-openapi-tool.json"),
      type: "application/json; charset=utf-8",
    },
  ],
  [
    "/microsoft/copilot-studio-openapi-v2.json",
    {
      file: path.join(rootDir, "microsoft", "copilot-studio-openapi-v2.json"),
      type: "application/json; charset=utf-8",
    },
  ],
]);

function send(res, status, body, contentType = "application/json") {
  res.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getFoundryConfig() {
  return {
    endpoint: process.env.FOUNDRY_PROJECT_ENDPOINT || process.env.AZURE_AI_PROJECT_ENDPOINT || "",
    agentName: process.env.FOUNDRY_AGENT_NAME || "Godspeed-Agentic-Defense",
    agentVersion: process.env.FOUNDRY_AGENT_VERSION || "4",
  };
}

function buildFoundryPrompt(input) {
  return [
    "Use the Godspeed OpenAPI tool to create a governed defense mission for this scenario.",
    "Return the mission summary, selected agents, approval gates, action plan, evidence package, safety boundary, Microsoft IQ status, and whether the OpenAPI tool was used.",
    "",
    `Scenario: ${input.description}`,
    input.title ? `Title: ${input.title}` : "",
    input.urgency ? `Urgency: ${input.urgency}` : "",
    input.boundary ? `Boundary: ${input.boundary}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFoundryQuestionPrompt(question) {
  return [
    "Answer this direct question about Godspeed, this live demo, or the connected Microsoft Foundry agent.",
    "Do not create a defense mission package unless the user explicitly asks to create, run, or plan a mission.",
    "If the question asks whether this is real or connected, answer directly and mention the current route: website -> Godspeed backend -> Azure AI Foundry agent -> Godspeed OpenAPI tool and knowledge layer.",
    "Keep the answer concise.",
    "",
    `Question: ${question}`,
  ].join("\n");
}

function runFoundryAgent(payload) {
  const script = path.join(rootDir, "scripts", "foundry-agent-response.py");
  const python = process.env.PYTHON || "python3";

  return new Promise((resolve, reject) => {
    const child = spawn(python, [script], {
      cwd: rootDir,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Foundry agent bridge timed out after 55 seconds"));
    }, 55000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      let result = null;
      try {
        result = JSON.parse(stdout);
      } catch {
        reject(new Error(stderr || stdout || "Foundry bridge returned non-JSON output"));
        return;
      }

      if (code !== 0 || !result.ok) {
        const error = new Error(result.error || stderr || "Foundry bridge failed");
        error.details = result;
        reject(error);
        return;
      }
      resolve(result);
    });

    child.stdin.end(JSON.stringify(payload));
  });
}

function toPublicFoundryError(error) {
  const message = String(error.message || "");
  if (message.includes("DefaultAzureCredential failed")) {
    return "Azure authentication is not configured for the server-side Foundry bridge yet.";
  }
  if (message.includes("Missing Python dependencies")) {
    return "Azure Foundry Python dependencies are not installed on this server yet.";
  }
  if (message.includes("timed out")) {
    return "The Foundry agent bridge timed out.";
  }
  return "The Foundry agent bridge failed. Check the server-side bridge configuration.";
}

function toPublicFoundryDetails(error) {
  if (!error.details?.errorType) return null;
  return { errorType: error.details.errorType };
}

async function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safe);
  const ext = path.extname(filePath);
  const type =
    ext === ".html" ? "text/html; charset=utf-8" :
    ext === ".css" ? "text/css; charset=utf-8" :
    ext === ".js" ? "text/javascript; charset=utf-8" :
    ext === ".svg" ? "image/svg+xml" :
    "application/octet-stream";
  try {
    send(res, 200, await readFile(filePath), type);
  } catch {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      send(res, 200, JSON.stringify({ ok: true, service: "godspeed-demo", port }));
      return;
    }

    if ((req.method === "GET" || req.method === "HEAD") && publicSpecRoutes.has(req.url)) {
      const spec = publicSpecRoutes.get(req.url);
      if (req.method === "HEAD") {
        res.writeHead(200, {
          "content-type": spec.type,
          "cache-control": "no-store",
        });
        res.end();
        return;
      }
      send(res, 200, await readFile(spec.file), spec.type);
      return;
    }

    if (req.method === "POST" && req.url === "/api/mission") {
      const input = await readJson(req);
      const mission = runGodspeedMission(input);
      const runDir = await writeMissionArtifacts(mission, rootDir);
      send(
        res,
        200,
        JSON.stringify(
          {
            ...mission,
            artifactDir: runDir,
            copilotToolResponse: toCopilotToolResponse(mission, runDir),
            agentFrameworkEvent: toAgentFrameworkEvent(mission),
          },
          null,
          2,
        ),
      );
      return;
    }

    if (req.method === "POST" && req.url === "/api/microsoft/copilot/mission") {
      const input = await readJson(req);
      const mission = runGodspeedMission(input);
      const runDir = await writeMissionArtifacts(mission, rootDir);
      send(res, 200, JSON.stringify(toCopilotToolResponse(mission, runDir), null, 2));
      return;
    }

    if (req.method === "POST" && req.url === "/api/microsoft/agent-framework/event") {
      const input = await readJson(req);
      const mission = runGodspeedMission(input);
      send(res, 200, JSON.stringify(toAgentFrameworkEvent(mission), null, 2));
      return;
    }

    if (req.method === "POST" && req.url === "/api/foundry/agent") {
      const input = await readJson(req);
      const description = String(input.description || input.prompt || "").trim();
      if (!description) {
        send(res, 400, JSON.stringify({ ok: false, error: "description is required" }, null, 2));
        return;
      }
      if (description.length > 5000) {
        send(res, 400, JSON.stringify({ ok: false, error: "description is too long" }, null, 2));
        return;
      }

      const mission = runGodspeedMission({
        title: input.title || "Website Foundry prompt",
        description,
        urgency: input.urgency || "High",
        boundary: input.boundary,
      });
      const config = getFoundryConfig();
      const runDir = await writeMissionArtifacts(mission, rootDir);
      const localMission = {
        ...mission,
        artifactDir: runDir,
      };

      if (!config.endpoint) {
        send(
          res,
          501,
          JSON.stringify(
            {
              ok: false,
              configured: false,
              error: "Foundry agent bridge is not configured on this server yet.",
              requiredEnv: ["FOUNDRY_PROJECT_ENDPOINT", "FOUNDRY_AGENT_NAME", "FOUNDRY_AGENT_VERSION"],
              localMission,
            },
            null,
            2,
          ),
        );
        return;
      }

      try {
        const foundry = await runFoundryAgent({
          endpoint: config.endpoint,
          agentName: config.agentName,
          agentVersion: config.agentVersion,
          input: buildFoundryPrompt({
            ...input,
            description,
          }),
        });
        send(
          res,
          200,
          JSON.stringify(
            {
              ok: true,
              source: "azure-foundry-agent",
              foundry,
              localMission,
            },
            null,
            2,
          ),
        );
      } catch (error) {
        send(
          res,
          502,
          JSON.stringify(
            {
              ok: false,
              configured: true,
              error: toPublicFoundryError(error),
              details: toPublicFoundryDetails(error),
              localMission,
            },
            null,
            2,
          ),
        );
      }
      return;
    }

    if (req.method === "POST" && req.url === "/api/foundry/ask") {
      const input = await readJson(req);
      const question = String(input.question || input.prompt || "").trim();
      if (!question) {
        send(res, 400, JSON.stringify({ ok: false, error: "question is required" }, null, 2));
        return;
      }
      if (question.length > 3000) {
        send(res, 400, JSON.stringify({ ok: false, error: "question is too long" }, null, 2));
        return;
      }

      const config = getFoundryConfig();
      if (!config.endpoint) {
        send(
          res,
          501,
          JSON.stringify(
            {
              ok: false,
              configured: false,
              error: "Foundry agent bridge is not configured on this server yet.",
              requiredEnv: ["FOUNDRY_PROJECT_ENDPOINT", "FOUNDRY_AGENT_NAME", "FOUNDRY_AGENT_VERSION"],
            },
            null,
            2,
          ),
        );
        return;
      }

      try {
        const foundry = await runFoundryAgent({
          endpoint: config.endpoint,
          agentName: config.agentName,
          agentVersion: config.agentVersion,
          input: buildFoundryQuestionPrompt(question),
        });
        send(
          res,
          200,
          JSON.stringify(
            {
              ok: true,
              source: "azure-foundry-agent",
              foundry,
            },
            null,
            2,
          ),
        );
      } catch (error) {
        send(
          res,
          502,
          JSON.stringify(
            {
              ok: false,
              configured: true,
              error: toPublicFoundryError(error),
              details: toPublicFoundryDetails(error),
            },
            null,
            2,
          ),
        );
      }
      return;
    }

    if (req.method === "GET" && req.url === "/api/mission/default") {
      const mission = runGodspeedMission();
      send(res, 200, JSON.stringify(mission, null, 2));
      return;
    }

    await handleStatic(req, res);
  } catch (error) {
    send(res, 500, JSON.stringify({ ok: false, error: error.message }, null, 2));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Godspeed demo listening on http://127.0.0.1:${port}`);
});
