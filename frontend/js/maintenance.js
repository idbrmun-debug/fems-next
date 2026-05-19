const API_BASE = "";

const state = {
  data: null,
  rows: [],
  filteredRows: [],
  charts: [],
};

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${path} request failed`);
  }
  return data;
}

async function loadMaintenanceData() {
  state.data = await fetchJson("/api/maintenance-page/data");
  state.rows = [...state.data.history];
  state.filteredRows = [...state.rows];
}

function renderSummary() {
  document.getElementById("summaryCards").innerHTML = state.data.summary
    .map(
      (item) => `
        <article class="maintenance-summary-card ${item.tone}">
          <i class="bi ${item.icon}"></i>
          <div>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
            <span>${item.delta}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function fillSelect(id, values) {
  document.getElementById(id).innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join("");
}

function renderFilters() {
  const filters = state.data.filters;
  fillSelect("factoryFilter", filters.factories);
  fillSelect("processFilter", filters.processes);
  fillSelect("equipmentFilter", filters.equipments);
  fillSelect("workTypeFilter", filters.work_types);
  fillSelect("statusFilter", filters.statuses);

  fillSelect("modalFactory", filters.factories.filter((item) => item !== "전체"));
  fillSelect("modalProcess", filters.processes.filter((item) => item !== "전체"));
  fillSelect("modalEquipment", filters.equipments.filter((item) => item !== "전체"));
  fillSelect("modalWorkType", filters.work_types.filter((item) => item !== "전체"));
}

function statusClass(status) {
  if (status === "완료") return "done";
  if (status === "진행중") return "progress";
  return "plan";
}

function renderRows() {
  document.getElementById("rowCount").textContent = `${state.filteredRows.length}건`;
  document.getElementById("maintenanceRows").innerHTML = state.filteredRows
    .map(
      (row, index) => `
        <tr>
          <td>${row.date}</td>
          <td class="factory-name">${row.factory}</td>
          <td>${row.process}</td>
          <td>${row.equipment}</td>
          <td>${row.work_type}</td>
          <td class="work-text">${row.work}</td>
          <td>${row.owner}</td>
          <td class="downtime-cell">${Number(row.downtime).toFixed(1)}h</td>
          <td class="cost-cell">${currencyFormatter.format(row.cost)}</td>
          <td><span class="status-badge ${statusClass(row.status)}">${row.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn btn-outline-primary btn-sm" type="button" aria-label="수정" data-index="${index}"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-outline-danger btn-sm" type="button" aria-label="삭제" data-index="${index}"><i class="bi bi-trash3"></i></button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function applyFilters() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const factory = document.getElementById("factoryFilter").value;
  const process = document.getElementById("processFilter").value;
  const equipment = document.getElementById("equipmentFilter").value;
  const workType = document.getElementById("workTypeFilter").value;
  const status = document.getElementById("statusFilter").value;

  state.filteredRows = state.rows.filter((row) => {
    const inDateRange = (!startDate || row.date >= startDate) && (!endDate || row.date <= endDate);
    return (
      inDateRange &&
      (factory === "전체" || row.factory === factory) &&
      (process === "전체" || row.process === process) &&
      (equipment === "전체" || row.equipment === equipment) &&
      (workType === "전체" || row.work_type === workType) &&
      (status === "전체" || row.status === status)
    );
  });

  renderRows();
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function renderCharts() {
  destroyCharts();
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".maintenance-chart").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  const downtimeChart = new Chart(document.getElementById("downtimeChart"), {
    type: "bar",
    data: {
      labels: state.data.monthly_downtime.labels,
      datasets: state.data.monthly_downtime.series.map((item) => ({
        label: item.label,
        data: item.data,
        backgroundColor: `${item.color}c7`,
        borderRadius: 5,
        maxBarThickness: 26,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11, weight: "bold" } } } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: "#e7edf5" } },
      },
    },
  });

  const ratioChart = new Chart(document.getElementById("workTypeChart"), {
    type: "doughnut",
    data: {
      labels: state.data.work_type_ratio.labels,
      datasets: [
        {
          data: state.data.work_type_ratio.data,
          backgroundColor: state.data.work_type_ratio.colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11, weight: "bold" } } } },
    },
  });

  state.charts.push(downtimeChart, ratioChart);
}

function openModal() {
  document.getElementById("maintenanceModal").classList.add("show");
  document.getElementById("maintenanceModal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.getElementById("maintenanceModal").classList.remove("show");
  document.getElementById("maintenanceModal").setAttribute("aria-hidden", "true");
}

function showToast() {
  const toast = document.getElementById("saveToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  document.getElementById("filterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("filterForm").reset();
    state.filteredRows = [...state.rows];
    renderRows();
  });

  document.getElementById("openModal").addEventListener("click", openModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelModal").addEventListener("click", closeModal);

  document.getElementById("maintenanceModal").addEventListener("click", (event) => {
    if (event.target.id === "maintenanceModal") {
      closeModal();
    }
  });

  document.getElementById("maintenanceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const row = {
      date: document.getElementById("workDate").value,
      factory: document.getElementById("modalFactory").value,
      process: document.getElementById("modalProcess").value,
      equipment: document.getElementById("modalEquipment").value,
      work_type: document.getElementById("modalWorkType").value,
      work: document.getElementById("modalWork").value,
      action: document.getElementById("modalAction").value,
      owner: document.getElementById("modalOwner").value,
      downtime: Number(document.getElementById("modalDowntime").value || 0),
      cost: Number(document.getElementById("modalCost").value || 0),
      note: document.getElementById("modalNote").value,
      status: "완료",
    };

    await fetchJson("/api/maintenance-page/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    state.rows.unshift(row);
    state.filteredRows = [...state.rows];
    renderRows();
    closeModal();
    event.target.reset();
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

function setDefaultFormValues() {
  document.getElementById("workDate").value = "2025-05-24";
  document.getElementById("modalOwner").value = "admin";
}

async function init() {
  updateClock();
  setInterval(updateClock, 1000);
  await loadMaintenanceData();
  renderSummary();
  renderFilters();
  renderRows();
  renderCharts();
  setDefaultFormValues();
  bindEvents();
}

init().catch((error) => {
  const content = document.querySelector(".maintenance-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `유지보수 이력 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
