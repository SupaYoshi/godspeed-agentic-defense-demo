import http from "node:http";
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
