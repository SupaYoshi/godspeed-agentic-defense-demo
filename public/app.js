const scenarioEl = document.querySelector("#scenario");
const runButton = document.querySelector("#runMission");
const agentsEl = document.querySelector("#agents");
const microsoftFitEl = document.querySelector("#microsoftFit");
const premortemEl = document.querySelector("#premortem");
const approvalsEl = document.querySelector("#approvals");
const summaryEl = document.querySelector("#summary");
const agentCountEl = document.querySelector("#agentCount");
const gateCountEl = document.querySelector("#gateCount");
const actionCountEl = document.querySelector("#actionCount");
const phases = [...document.querySelectorAll(".phase-bar span")];

function setPhase(index) {
  phases.forEach((phase, phaseIndex) => {
    phase.classList.toggle("active", phaseIndex <= index);
  });
}

function renderAgents(agents) {
  agentsEl.innerHTML = "";
  for (const agent of agents) {
    const node = document.createElement("article");
    node.className = "agent";
    node.innerHTML = `
      <span class="badge">Wave ${agent.wave} - ${agent.status}</span>
      <strong>${agent.name}</strong>
      <p>${agent.finding}</p>
    `;
    agentsEl.appendChild(node);
  }
}

function renderList(el, items, formatter = (value) => value) {
  el.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = formatter(item);
    el.appendChild(li);
  }
}

function renderMicrosoftFit(items) {
  microsoftFitEl.innerHTML = "";
  for (const item of items) {
    const node = document.createElement("article");
    node.className = "fit";
    node.innerHTML = `
      <strong>${item.layer}</strong>
      <p>${item.role}</p>
    `;
    microsoftFitEl.appendChild(node);
  }
}

function renderMission(mission) {
  agentCountEl.textContent = mission.specialists.length;
  gateCountEl.textContent = mission.approvals.length;
  actionCountEl.textContent = mission.actions.length;
  renderAgents(mission.specialists);
  renderMicrosoftFit(mission.microsoftFit || []);
  renderList(premortemEl, mission.premortem);
  renderList(approvalsEl, mission.approvals, (gate) => `${gate.action}: blocked until approval`);
  summaryEl.textContent = [
    `Mission ID: ${mission.missionId}`,
    "",
    mission.executiveSummary,
    "",
    `Track: ${mission.selectedTrack}`,
    `Profile: ${mission.demoProfile}`,
    "",
    "Architecture:",
    ...mission.architecture.map((item) => `- ${item}`),
    "",
    "Next actions:",
    ...mission.actions.map((item) => `- ${item.horizon}: ${item.action}`),
    "",
    `Artifacts: ${mission.artifactDir || "artifacts/last-run"}`,
  ].join("\n");
}

async function runMission() {
  runButton.disabled = true;
  runButton.textContent = "Running";
  setPhase(0);
  summaryEl.textContent = "Creating Godspeed defense mission...";

  const response = await fetch("/api/mission", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: "Critical remote access vulnerability",
      description: scenarioEl.value,
      urgency: "High",
    }),
  });

  const mission = await response.json();
  for (let index = 1; index < phases.length; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 260));
    setPhase(index);
  }
  renderMission(mission);
  runButton.disabled = false;
  runButton.textContent = "Run Mission";
}

runButton.addEventListener("click", runMission);

fetch("/api/mission/default")
  .then((response) => response.json())
  .then(renderMission)
  .catch(() => {
    summaryEl.textContent = "Demo API is not reachable yet.";
  });
