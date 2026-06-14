const scenarioEl = document.querySelector("#scenario");
const runButton = document.querySelector("#runMission");
const localButton = document.querySelector("#askFoundry");
const agentsEl = document.querySelector("#agents");
const microsoftFitEl = document.querySelector("#microsoftFit");
const premortemEl = document.querySelector("#premortem");
const approvalsEl = document.querySelector("#approvals");
const actionsEl = document.querySelector("#actions");
const summaryEl = document.querySelector("#summary");
const foundryStatusEl = document.querySelector("#foundryStatus");
const foundryOutputEl = document.querySelector("#foundryOutput");
const agentCountEl = document.querySelector("#agentCount");
const gateCountEl = document.querySelector("#gateCount");
const actionCountEl = document.querySelector("#actionCount");
const phaseTitleEl = document.querySelector("#phaseTitle");
const phaseDetailEl = document.querySelector("#phaseDetail");
const phases = [...document.querySelectorAll(".phase-bar button")];
const toggles = [...document.querySelectorAll(".status-strip .toggle")];
const metricCards = [...document.querySelectorAll(".metric-card")];
const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let currentMission = null;

const phaseNames = ["Intake", "Specialists", "Premortem", "Simulation", "Approvals", "Evidence"];
const runTiming = {
  phase: 430,
  agent: 155,
  fitCard: 100,
  section: 280,
  actionIntro: 240,
  actionCard: 280,
  finalPackage: 260,
};
const demoScenarios = {
  zeroDay:
    "A critical zero-day affects an internet-facing remote access service. Build a safe defense mission.",
  phishing:
    "Several users clicked a phishing email and M365 accounts may be compromised.",
  ransomware:
    "Ransomware encrypted file shares and backups need validation before recovery.",
  cloud:
    "Azure tenant cloud storage may be publicly exposed.",
};

function approvalGatesEnabled() {
  return document.querySelector('[data-control="approvalGates"]')?.classList.contains("active") ?? true;
}

function getVisibleApprovals(mission) {
  return approvalGatesEnabled() ? mission.approvals : [];
}

function focusPanel(panelId) {
  const panel = document.querySelector(panelId);
  if (!panel) return;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
  const pulseTarget = panel.closest(".panel") || panel;
  pulseTarget.classList.remove("pulse");
  requestAnimationFrame(() => pulseTarget.classList.add("pulse"));
}

function setPhase(index) {
  phases.forEach((phase, phaseIndex) => {
    phase.classList.toggle("active", phaseIndex <= index);
  });
  phaseTitleEl.textContent = phaseNames[index] || "Mission";
  phaseDetailEl.textContent =
    currentMission?.phaseDetails?.[index] || "Run the mission to generate this workflow step.";
}

function inspectPhase(index) {
  phases.forEach((phase, phaseIndex) => {
    phase.classList.toggle("inspected", phaseIndex === index);
  });
  phaseTitleEl.textContent = phaseNames[index] || "Mission";
  phaseDetailEl.textContent =
    currentMission?.phaseDetails?.[index] || "Run the mission first, then use these steps to walk through the reasoning flow.";
  if (index === 1) focusPanel("#agentsPanel");
  if (index === 4) focusPanel("#approvalsPanel");
  if (index === 5) focusPanel("#actionsPanel");
}

function renderEmptyState() {
  currentMission = null;
  agentCountEl.textContent = "0";
  gateCountEl.textContent = "0";
  actionCountEl.textContent = "0";
  setPhase(0);
  agentsEl.innerHTML = '<p class="empty-state">Run the mission to select the specialist agents for this scenario.</p>';
  microsoftFitEl.innerHTML = '<p class="empty-state">Microsoft integration path appears after orchestration.</p>';
  premortemEl.innerHTML = '<li class="empty-state">Premortem checks appear after the mission run.</li>';
  approvalsEl.innerHTML = '<li class="empty-state">Approval gates appear when risky actions are identified.</li>';
  actionsEl.innerHTML = '<p class="empty-state">Actions appear after the mission run.</p>';
  summaryEl.textContent = "Awaiting mission run. Godspeed will create the defense package after Run Mission.";
}

function clearMissionOutput() {
  agentCountEl.textContent = "0";
  gateCountEl.textContent = "0";
  actionCountEl.textContent = "0";
  agentsEl.innerHTML = '<p class="empty-state">Selecting specialist agents...</p>';
  microsoftFitEl.innerHTML = '<p class="empty-state">Mapping Copilot, Foundry and Agent Framework path...</p>';
  premortemEl.innerHTML = "";
  approvalsEl.innerHTML = "";
  actionsEl.innerHTML = "";
  summaryEl.textContent = "Creating Godspeed defense mission...";
}

function setFoundryStatus(status, tone = "neutral") {
  foundryStatusEl.textContent = status;
  foundryStatusEl.dataset.tone = tone;
}

async function renderAgents(agents) {
  agentsEl.innerHTML = "";
  for (const agent of agents) {
    const node = document.createElement("article");
    node.className = "agent reveal";
    node.innerHTML = `
      <span class="badge">Wave ${agent.wave} - ${agent.status}</span>
      <strong>${agent.name}</strong>
      <p><span class="card-label">Action</span>${agent.action}</p>
      <p><span class="card-label">Finding</span>${agent.finding}</p>
    `;
    agentsEl.appendChild(node);
    await sleep(runTiming.agent);
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

async function renderMicrosoftFit(items) {
  microsoftFitEl.innerHTML = "";
  for (const item of items) {
    const node = document.createElement("article");
    node.className = "fit reveal";
    node.innerHTML = `
      <strong>${item.layer}</strong>
      <p>${item.role}</p>
    `;
    microsoftFitEl.appendChild(node);
    await sleep(runTiming.fitCard);
  }
}

function renderApprovalControls(mission) {
  const visibleApprovals = getVisibleApprovals(mission);
  gateCountEl.textContent = visibleApprovals.length;
  if (visibleApprovals.length) {
    renderList(approvalsEl, visibleApprovals, (gate) => `${gate.action}: blocked until approval`);
  } else {
    approvalsEl.innerHTML = '<li class="empty-state">Approval Gates toggle is off for this mock view.</li>';
  }
}

async function renderActions(actions) {
  actionsEl.innerHTML = '<p class="empty-state">Assigning action owners and support agents...</p>';
  await sleep(runTiming.actionIntro);
  actionsEl.innerHTML = "";
  for (const item of actions) {
    const node = document.createElement("article");
    node.className = "action-item action-reveal";
    node.innerHTML = `
      <span class="badge">${item.horizon}</span>
      <strong>${item.action}</strong>
      <p><span class="card-label">Owner agent</span>${item.ownerAgent}</p>
      <p><span class="card-label">Support agents</span>${item.supportAgents.join(", ")}</p>
      <p><span class="card-label">Reason</span>${item.reason}</p>
    `;
    actionsEl.appendChild(node);
    await sleep(runTiming.actionCard);
  }
}

async function renderMission(mission) {
  currentMission = mission;
  await sleep(runTiming.section);
  agentCountEl.textContent = mission.specialists.length;
  await renderAgents(mission.specialists);
  await sleep(runTiming.section);
  await renderMicrosoftFit(mission.microsoftFit || []);
  await sleep(runTiming.section);
  renderList(premortemEl, mission.premortem);
  await sleep(runTiming.section);
  renderApprovalControls(mission);
  await sleep(runTiming.section);
  actionCountEl.textContent = mission.actions.length;
  await renderActions(mission.actions);
  await sleep(runTiming.finalPackage);
  summaryEl.textContent = [
    `Mission ID: ${mission.missionId}`,
    "",
    mission.executiveSummary,
    "",
    `Scenario profile: ${mission.scenarioProfile}`,
    `Track: ${mission.selectedTrack}`,
    `Profile: ${mission.demoProfile}`,
    "",
    "Architecture:",
    ...mission.architecture.map((item) => `- ${item}`),
    "",
    "Next actions:",
    ...mission.actions.map((item) => `- ${item.horizon}: ${item.action} (${item.ownerAgent})`),
    "",
    `Artifacts: ${mission.artifactDir || "artifacts/last-run"}`,
  ].join("\n");
}

async function runLocalMission() {
  localButton.disabled = true;
  localButton.textContent = "Running";
  setFoundryStatus("Local fallback", "neutral");
  foundryOutputEl.textContent = "Running the local Godspeed orchestrator without the Foundry agent bridge.";
  setPhase(0);
  clearMissionOutput();

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
  currentMission = mission;
  for (let index = 1; index < phases.length; index += 1) {
    await sleep(runTiming.phase);
    setPhase(index);
  }
  await renderMission(mission);
  localButton.disabled = false;
  localButton.textContent = "Run Local";
}

async function runMission() {
  runButton.disabled = true;
  localButton.disabled = true;
  runButton.textContent = "Calling Foundry";
  setFoundryStatus("Calling Foundry", "working");
  foundryOutputEl.textContent = "Sending the scenario through the server-side Foundry bridge...";
  setPhase(0);
  clearMissionOutput();

  try {
    const response = await fetch("/api/foundry/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Website Foundry prompt",
        description: scenarioEl.value,
        urgency: "High",
      }),
    });
    const result = await response.json();

    if (result.localMission) {
      currentMission = result.localMission;
      for (let index = 1; index < phases.length; index += 1) {
        await sleep(runTiming.phase);
        setPhase(index);
      }
      await renderMission(result.localMission);
    }

    if (!response.ok || !result.ok) {
      setFoundryStatus(result.configured === false ? "Needs server config" : "Bridge error", "error");
      foundryOutputEl.textContent = [
        result.error || "Foundry bridge failed.",
        "",
        result.requiredEnv ? `Required env: ${result.requiredEnv.join(", ")}` : "",
        result.localMission
          ? `Local Godspeed fallback: ${result.localMission.scenarioProfile}, ${result.localMission.specialists.length} agents, ${result.localMission.approvals.length} approval gates.`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      return;
    }

    setFoundryStatus("Foundry response", "ok");
    foundryOutputEl.textContent = [
      `Agent: ${result.foundry.agent.name} v${result.foundry.agent.version}`,
      "",
      result.foundry.outputText || "Foundry returned an empty response.",
    ].join("\n");
  } catch (error) {
    setFoundryStatus("Bridge error", "error");
    foundryOutputEl.textContent = error.message;
  } finally {
    runButton.disabled = false;
    localButton.disabled = false;
    runButton.textContent = "Run Mission";
  }
}

runButton.addEventListener("click", runMission);
localButton.addEventListener("click", runLocalMission);
phases.forEach((phase) => {
  phase.addEventListener("click", () => inspectPhase(Number(phase.dataset.phase)));
});
toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isActive = toggle.classList.toggle("active");
    toggle.setAttribute("aria-pressed", String(isActive));
    if (currentMission) {
      renderApprovalControls(currentMission);
    }
    if (toggle.dataset.control === "approvalGates") {
      focusPanel("#approvalsPanel");
    }
  });
});
metricCards.forEach((card) => {
  card.addEventListener("click", () => {
    const focusTarget = card.dataset.focus;
    if (focusTarget === "agents") focusPanel("#agentsPanel");
    if (focusTarget === "approvals") focusPanel("#approvalsPanel");
    if (focusTarget === "actions") focusPanel("#actionsPanel");
  });
});
scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scenarioButtons.forEach((item) => item.classList.toggle("active", item === button));
    scenarioEl.value = demoScenarios[button.dataset.scenario] || scenarioEl.value;
    renderEmptyState();
    scenarioEl.focus();
  });
});

renderEmptyState();

if (new URLSearchParams(window.location.search).get("autorun") === "1") {
  window.setTimeout(runMission, 350);
}
