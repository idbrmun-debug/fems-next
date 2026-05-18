const API_BASE = "http://127.0.0.1:5000";

const $ = (id) => document.getElementById(id);

function showAlert(message, type = "success") {
  const alert = $("alert");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  setTimeout(() => {
    alert.className = "alert d-none";
  }, 3500);
}

function formatNumber(value, digits = 2) {
  const number = Number(value || 0);
  return number.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

async function loadSettings() {
  const settings = await requestJson("/api/settings");
  $("target").value = settings.target_unit_kwh_per_unit;
  $("bucket").value = settings.influxdb_bucket;
  $("intensity-target").textContent = `${formatNumber(settings.target_unit_kwh_per_unit)} kWh/unit`;
}

async function loadIntensity() {
  const data = await requestJson("/api/electric-intensity");
  const gap = Number(data.unit_kwh_per_unit) - Number(data.target_unit_kwh_per_unit);

  $("metric-energy").textContent = `${formatNumber(data.energy_kwh)} kWh`;
  $("metric-production").textContent = `${formatNumber(data.production_quantity, 0)} units`;
  $("metric-intensity").textContent = `${formatNumber(data.unit_kwh_per_unit)} kWh/unit`;
  $("intensity-value").textContent = `${formatNumber(data.unit_kwh_per_unit)} kWh/unit`;
  $("intensity-target").textContent = `${formatNumber(data.target_unit_kwh_per_unit)} kWh/unit`;
  $("intensity-gap").textContent = `${formatNumber(gap)} kWh/unit`;
}

async function loadMaintenance() {
  const data = await requestJson("/api/maintenance-log");
  const tbody = $("maintenance-rows");
  tbody.innerHTML = "";

  if (!data.items.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-secondary">No records yet.</td></tr>';
    return;
  }

  for (const item of data.items) {
    const row = document.createElement("tr");
    const equipment = [item.meter, item.feeder, item.furnace].filter(Boolean).join(" / ");
    row.innerHTML = `
      <td>${item.time ? new Date(item.time).toLocaleString() : ""}</td>
      <td>${equipment}</td>
      <td>${item.work || ""}</td>
      <td>${item.owner || ""}</td>
      <td>${item.status || ""}</td>
    `;
    tbody.appendChild(row);
  }
}

async function saveProduction(event) {
  event.preventDefault();
  const file = $("production-file").files[0];

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const result = await requestJson("/api/production-upload", {
      method: "POST",
      body: formData,
    });
    showAlert(`Excel upload complete. Written rows: ${result.written}`);
    $("production-file").value = "";
  } else {
    const payload = {
      factory: $("factory").value,
      process: $("process").value,
      product: $("product").value,
      shift: $("shift").value,
      quantity: Number($("quantity").value),
    };
    await requestJson("/api/production-input", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showAlert("Production input saved.");
    $("quantity").value = "";
  }

  await loadIntensity();
}

async function saveSettings(event) {
  event.preventDefault();
  await requestJson("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_unit_kwh_per_unit: Number($("target").value),
    }),
  });
  showAlert("Settings saved.");
  await loadSettings();
  await loadIntensity();
}

async function saveMaintenance(event) {
  event.preventDefault();
  await requestJson("/api/maintenance-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      factory: $("factory").value || "youngsin_quartz",
      process: $("process").value || "electric_furnace",
      meter: $("maintenance-meter").value,
      feeder: $("maintenance-feeder").value,
      furnace: $("maintenance-furnace").value,
      work: $("maintenance-work").value,
      owner: $("maintenance-owner").value,
      status: "done",
    }),
  });
  showAlert("Maintenance record saved.");
  $("maintenance-work").value = "";
  $("maintenance-owner").value = "";
  await loadMaintenance();
}

async function init() {
  $("production-form").addEventListener("submit", (event) => saveProduction(event).catch((error) => showAlert(error.message, "danger")));
  $("settings-form").addEventListener("submit", (event) => saveSettings(event).catch((error) => showAlert(error.message, "danger")));
  $("maintenance-form").addEventListener("submit", (event) => saveMaintenance(event).catch((error) => showAlert(error.message, "danger")));

  await loadSettings();
  await loadIntensity();
  await loadMaintenance();
}

init().catch((error) => showAlert(error.message, "danger"));
