import { runGodspeedMission, renderMarkdown, writeMissionArtifacts } from "./godspeed.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mission = runGodspeedMission();
await writeMissionArtifacts(mission, rootDir);
console.log(renderMarkdown(mission));
