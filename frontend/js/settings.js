const API_BASE = "";

const state = {
  tree: [],
  detail: null,
  selectedId: "RTU-301",
};

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${path} request failed`);
  }
  return data;
}

async function loadSettingsData() {
  const [tree, detail] = await Promise.all([
    fetchJson("/api/settings-screen/tree"),
    fetchJson("/api/settings-screen/equipment-detail"),
  ]);
  state.tree = tree.items || [];
  state.selectedId = tree.selected_id;
  state.detail = detail;
}

function renderTreeNode(item) {
  const children = item.children || [];
  const icon = item.icon || (children.length ? "bi-chevron-right" : "bi-dot");
  const color = item.color || "";

  return `
    <li>
      <div class="tree-node ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}">
        <i class="bi ${children.length ? "bi-chevron-down" : "bi-chevron-right"} chevron"></i>
        <i class="bi ${icon}" style="${color ? `color:${color}` : ""}"></i>
        <span>${item.label}</span>
      </div>
      ${children.length ? `<ul class="tree-list">${children.map(renderTreeNode).join("")}</ul>` : ""}
    </li>
  `;
}

function renderTree() {
  document.getElementById("equipmentTree").innerHTML = `<ul class="tree-list">${state.tree.map(renderTreeNode).join("")}</ul>`;

  document.querySelectorAll(".tree-node").forEach((node) => {
    node.addEventListener("click", () => {
      document.querySelectorAll(".tree-node").forEach((item) => item.classList.remove("active"));
      node.classList.add("active");
      state.selectedId = node.dataset.id;
      renderDetail();
    });
  });
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value ?? "";
  }
}

function renderDetail() {
  const equipment = state.detail.equipment;
  setValue("meterId", state.selectedId.startsWith("RTU") ? state.selectedId : equipment.meter_id);
  setValue("meterName", equipment.meter_name);
  setValue("factory", equipment.factory);
  setValue("process", equipment.process);
  setValue("line", equipment.line);
  setValue("equipmentName", equipment.equipment_name);
  setValue("meterType", equipment.meter_type);
  setValue("communication", equipment.communication);
  setValue("ip", equipment.ip);
  setValue("port", equipment.port);
  setValue("location", equipment.location);
  setValue("installedAt", equipment.installed_at);
  setValue("memo", equipment.memo);

  renderAlarmRules();
  renderTarget();
  renderConnectedMeters();
}

function renderAlarmRules() {
  document.getElementById("alarmRuleRows").innerHTML = state.detail.alarm_rules
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.low}</td>
          <td>${item.high}</td>
          <td>${item.unit}</td>
          <td>${item.duration}</td>
          <td><span class="alarm-level ${item.level === "중지" ? "stop" : "warning"}">${item.level}</span></td>
          <td>
            <label class="toggle-switch">
              <input type="checkbox" ${item.enabled ? "checked" : ""}>
              <span></span>
            </label>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderTarget() {
  const target = state.detail.target;
  setValue("targetProcess", target.process);
  setValue("targetSpecificEnergy", target.specific_energy);
  setValue("targetPeriod", target.period);

  document.getElementById("targetHistoryRows").innerHTML = target.history
    .map(
      (item) => `
        <tr>
          <td>${item.start}</td>
          <td>${item.end}</td>
          <td>${Number(item.target).toFixed(2)}</td>
          <td>${item.owner}</td>
          <td>${item.created_at}</td>
        </tr>
      `
    )
    .join("");
}

function renderConnectedMeters() {
  document.getElementById("connectedMeterRows").innerHTML = state.detail.connected_meters
    .map(
      (item) => `
        <tr>
          <td>${item.meter_id}</td>
          <td>${item.meter_name}</td>
          <td>${item.type}</td>
          <td>${item.connection}</td>
          <td>${item.ip}</td>
          <td>${item.port}</td>
          <td>${item.role}</td>
          <td><span class="status-badge">${item.status}</span></td>
          <td>
            <div class="meter-actions">
              <button class="btn btn-outline-primary btn-sm" type="button" aria-label="수정"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-outline-danger btn-sm" type="button" aria-label="삭제"><i class="bi bi-trash3"></i></button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function bindTabs() {
  document.querySelectorAll(".settings-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".settings-tab").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function bindSaveButtons() {
  document.querySelectorAll(".save-settings").forEach((button) => {
    button.addEventListener("click", async () => {
      await fetchJson("/api/settings-screen/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_id: state.selectedId, meter_id: document.getElementById("meterId").value }),
      });
      showToast();
    });
  });
}

function showToast() {
  const toast = document.getElementById("saveToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function openSettingsModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function bindSampleModals() {
  document.getElementById("openEquipmentAddModal")?.addEventListener("click", () => {
    openSettingsModal("equipmentAddModal");
  });

  document.getElementById("openConnectedMeterModal")?.addEventListener("click", () => {
    openSettingsModal("connectedMeterModal");
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeSettingsModal(button.dataset.closeModal));
  });

  document.querySelectorAll(".settings-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeSettingsModal(modal.id);
      }
    });
  });

  document.getElementById("equipmentAddForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = document.getElementById("newEquipmentName").value || "신규 설비";
    const tree = document.getElementById("equipmentTree");
    const sample = document.createElement("div");
    sample.className = "tree-node active";
    sample.innerHTML = `<i class="bi bi-chevron-right chevron"></i><i class="bi bi-cpu-fill" style="color:#1a73e8"></i><span>${label}</span>`;
    tree?.querySelectorAll(".tree-node").forEach((node) => node.classList.remove("active"));
    tree?.prepend(sample);
    closeSettingsModal("equipmentAddModal");
    showToast();
  });

  document.getElementById("connectedMeterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const meter = {
      meter_id: document.getElementById("newMeterId").value,
      meter_name: document.getElementById("newMeterName").value,
      type: document.getElementById("newMeterType").value,
      connection: document.getElementById("newMeterConnection").value,
      ip: document.getElementById("newMeterIp").value,
      port: document.getElementById("newMeterPort").value,
      role: document.getElementById("newMeterRole").value,
      status: document.getElementById("newMeterStatus").value,
    };
    state.detail.connected_meters.push(meter);
    renderConnectedMeters();
    closeSettingsModal("connectedMeterModal");
    showToast();
  });
}

function updateClock() {
  const now = new Date();
  document.getElementById("currentTime").textContent = now.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

async function init() {
  updateClock();
  setInterval(updateClock, 1000);
  bindTabs();
  bindSaveButtons();
  bindSampleModals();
  await loadSettingsData();
  renderTree();
  renderDetail();
}

init().catch((error) => {
  const content = document.querySelector(".settings-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `설정 화면 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
