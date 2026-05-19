const API_BASE = "";

const state = {
  summary: null,
  list: null,
  rows: [],
  filteredRows: [],
  selectedEquipmentId: null,
  queryFilters: {},
  charts: [],
};

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${path} request failed`);
  }
  return data;
}

async function fetchEquipmentSummary() {
  state.summary = await fetchJson("/api/equipment-page/summary");
  return state.summary;
}

async function fetchEquipmentList() {
  state.list = await fetchJson("/api/equipment-page/list");
  state.rows = [...state.list.items];
  state.filteredRows = [...state.rows];
  return state.list;
}

async function fetchEquipmentDetail(equipmentId) {
  return fetchJson(`/api/equipment-page/detail/${encodeURIComponent(equipmentId)}`);
}

async function fetchEquipmentPowerTrend(equipmentId) {
  return fetchJson(`/api/equipment-page/power-trend/${encodeURIComponent(equipmentId)}`);
}

function statusClass(status) {
  if (status === "가동") return "running";
  if (status === "경고") return "warning";
  if (status === "정지") return "stopped";
  return "comm-error";
}

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function renderSummaryCards() {
  document.getElementById("equipmentSummaryCards").innerHTML = state.summary.cards
    .map(
      (card) => `
        <article class="equipment-summary-card ${card.tone}">
          <i class="bi ${card.icon}"></i>
          <div>
            <span>${card.label}</span>
            <strong>${card.value}<small> ${card.unit}</small></strong>
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
  const filters = state.list.filters;
  fillSelect("factoryFilter", filters.factories);
  fillSelect("processFilter", filters.processes);
  fillSelect("statusFilter", filters.statuses);
  fillSelect("typeFilter", filters.types);
}

function readQueryFilters() {
  const params = new URLSearchParams(window.location.search);
  state.queryFilters = {
    factory: params.get("factory") || "",
    process: params.get("process") || "",
    furnace: params.get("furnace") || "",
    meter: params.get("meter") || "",
  };
  return state.queryFilters;
}

function setSelectValueIfExists(id, value) {
  if (!value) return;
  const select = document.getElementById(id);
  const option = [...select.options].find((item) => item.value === value);
  if (option) select.value = value;
}

function applyInitialQueryFilters() {
  const filters = readQueryFilters();
  setSelectValueIfExists("factoryFilter", filters.factory);
  setSelectValueIfExists("processFilter", filters.process);
  if (filters.meter) {
    document.getElementById("keywordFilter").value = filters.meter;
    state.selectedEquipmentId = filters.meter;
  } else if (filters.furnace) {
    document.getElementById("keywordFilter").value = filters.furnace;
  }
  applyFilters({ silent: true });
}

function renderEquipmentCards() {
  document.getElementById("equipmentCardCount").textContent = `${state.filteredRows.length}대`;
  document.getElementById("equipmentCards").innerHTML = state.filteredRows
    .map(
      (item) => `
        <article class="equipment-card ${item.id === state.selectedEquipmentId ? "active" : ""}" data-equipment-id="${item.id}">
          <div class="equipment-card-title">
            <div>
              <h3>${item.name}</h3>
              <small>${item.factory} / ${item.process} / ${item.line}</small>
            </div>
            <span class="status-badge ${statusClass(item.status)}">${item.status}</span>
          </div>
          <div class="equipment-meta">
            <div><span>계측기 ID</span><strong>${item.id}</strong></div>
            <div><span>피더/라인</span><strong>${item.feeder}</strong></div>
            <div><span>현재 전력</span><strong>${formatNumber(item.power_kw, 1)} kW</strong></div>
            <div><span>금일 전력량</span><strong>${formatNumber(item.today_kwh)} kWh</strong></div>
            <div><span>전압 / 전류</span><strong>${formatNumber(item.avg_v, 1)} V / ${formatNumber(item.avg_a, 1)} A</strong></div>
            <div><span>역률</span><strong>${formatNumber(item.avg_pf, 2)}</strong></div>
          </div>
          <div class="equipment-card-footer">
            <span>통신 ${item.communication}</span>
            <button class="btn btn-outline-primary btn-sm" type="button" data-detail="${item.id}">상세보기</button>
          </div>
          <small>최근 수집 ${item.collected_at}</small>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".equipment-card").forEach((card) => {
    card.addEventListener("click", () => updateEquipmentDetail(card.dataset.equipmentId));
  });
  document.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      updateEquipmentDetail(button.dataset.detail);
    });
  });
}

function renderEquipmentTable() {
  document.getElementById("equipmentRowCount").textContent = `${state.filteredRows.length}대`;
  document.getElementById("equipmentRows").innerHTML = state.filteredRows
    .map(
      (item) => `
        <tr>
          <td><span class="status-badge ${statusClass(item.status)}">${item.status}</span></td>
          <td class="factory-name">${item.factory}</td>
          <td>${item.process}</td>
          <td>${item.name}</td>
          <td>${item.id}</td>
          <td>${item.feeder}</td>
          <td>${formatNumber(item.power_kw, 1)}</td>
          <td>${formatNumber(item.today_kwh)}</td>
          <td>${formatNumber(item.avg_v, 1)}</td>
          <td>${formatNumber(item.avg_a, 1)}</td>
          <td>${formatNumber(item.avg_pf, 2)}</td>
          <td><span class="comm-badge ${item.communication === "정상" ? "ok" : "error"}">${item.communication}</span></td>
          <td>${item.collected_at}</td>
          <td><div class="row-actions"><button class="btn btn-outline-primary btn-sm" type="button" data-row-detail="${item.id}">상세</button></div></td>
        </tr>
      `
    )
    .join("");

  document.querySelectorAll("[data-row-detail]").forEach((button) => {
    button.addEventListener("click", () => updateEquipmentDetail(button.dataset.rowDetail));
  });
}

function listItems(items) {
  if (!items || items.length === 0) {
    return "<li>최근 이력이 없습니다.</li>";
  }
  return items.map((item) => `<li>${item}</li>`).join("");
}

async function updateEquipmentDetail(equipmentId) {
  const [detail, trend] = await Promise.all([fetchEquipmentDetail(equipmentId), fetchEquipmentPowerTrend(equipmentId)]);
  const item = detail.item;
  state.selectedEquipmentId = item.id;
  document.getElementById("selectedEquipmentId").textContent = item.id;
  document.getElementById("equipmentDetail").innerHTML = `
    <div class="detail-heading">
      <div>
        <h3>${item.name}</h3>
        <span>${item.factory} / ${item.process} / ${item.line}</span>
      </div>
      <span class="status-badge ${statusClass(item.status)}">${item.status}</span>
    </div>
    <div class="detail-grid">
      <div class="detail-box"><span>계측기 ID</span><strong>${item.id}</strong></div>
      <div class="detail-box"><span>계측기 타입</span><strong>${item.type}</strong></div>
      <div class="detail-box"><span>피더</span><strong>${item.feeder}</strong></div>
      <div class="detail-box"><span>IP 주소</span><strong>${item.ip}</strong></div>
      <div class="detail-box"><span>설치 위치</span><strong>${item.location}</strong></div>
      <div class="detail-box"><span>최근 수집 시간</span><strong>${item.collected_at}</strong></div>
      <div class="detail-box"><span>현재 전력</span><strong>${formatNumber(item.power_kw, 1)} kW</strong></div>
      <div class="detail-box"><span>금일 / 금월 전력량</span><strong>${formatNumber(item.today_kwh)} / ${formatNumber(item.month_kwh)} kWh</strong></div>
      <div class="detail-box"><span>전압 / 전류</span><strong>${formatNumber(item.avg_v, 1)} V / ${formatNumber(item.avg_a, 1)} A</strong></div>
      <div class="detail-box"><span>역률 / 통신</span><strong>${formatNumber(item.avg_pf, 2)} / ${item.communication}</strong></div>
    </div>
    <div class="detail-grid">
      <div class="detail-box">
        <span>최근 알람</span>
        <ul class="detail-list">${listItems(item.alarms)}</ul>
      </div>
      <div class="detail-box">
        <span>최근 유지보수 이력</span>
        <ul class="detail-list">${listItems(item.maintenance)}</ul>
      </div>
    </div>
    <div class="grafana-placeholder">
      <div>
        <i class="bi bi-bar-chart-line-fill"></i> ${detail.grafana.title}
        <small>${detail.grafana.description}</small>
        <small>예상 변수: meter=${item.id}, factory=${item.factory}, feeder=${item.feeder}</small>
      </div>
    </div>
    <div class="detail-box">
      <span>전력 추이 샘플</span>
      <strong>${trend.labels.at(-1)} 기준 ${formatNumber(trend.power_kw.at(-1), 1)} kW / 누적 ${formatNumber(trend.energy_kwh.at(-1))} kWh</strong>
    </div>
  `;
  renderEquipmentCards();
}

function applyFilters(options = {}) {
  const factory = document.getElementById("factoryFilter").value;
  const process = document.getElementById("processFilter").value;
  const status = document.getElementById("statusFilter").value;
  const type = document.getElementById("typeFilter").value;
  const keyword = document.getElementById("keywordFilter").value.trim().toLowerCase();
  const factoryAll = document.getElementById("factoryFilter").options[0]?.value;
  const processAll = document.getElementById("processFilter").options[0]?.value;
  const statusAll = document.getElementById("statusFilter").options[0]?.value;
  const typeAll = document.getElementById("typeFilter").options[0]?.value;

  state.filteredRows = state.rows.filter((item) => {
    const keywordSource = `${item.name} ${item.id} ${item.feeder} ${item.line}`.toLowerCase();
    return (
      (factory === factoryAll || item.factory === factory) &&
      (process === processAll || item.process === process) &&
      (status === statusAll || item.status === status) &&
      (type === typeAll || item.type === type) &&
      (!keyword || keywordSource.includes(keyword))
    );
  });

  document.getElementById("filterStatus").textContent = `${state.filteredRows.length}대 조회`;
  renderEquipmentCards();
  renderEquipmentTable();
  if (!options.silent) showToast("조회 조건이 적용되었습니다.");
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function renderEquipmentCharts() {
  destroyCharts();
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".equipment-chart").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  state.charts.push(
    new Chart(document.getElementById("processOperationChart"), {
      type: "bar",
      data: {
        labels: state.list.charts.process_operation.labels,
        datasets: [{ label: "가동률", data: state.list.charts.process_operation.data, backgroundColor: "#1f7aff", borderRadius: 5 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, grid: { color: "#e7edf5" } } },
      },
    })
  );

  state.charts.push(
    new Chart(document.getElementById("powerTopChart"), {
      type: "bar",
      data: {
        labels: state.list.charts.power_top10.labels,
        datasets: [{ label: "현재 전력", data: state.list.charts.power_top10.data, backgroundColor: "#43a83f", borderRadius: 5 }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grid: { color: "#e7edf5" } }, y: { grid: { display: false } } },
      },
    })
  );

  state.charts.push(
    new Chart(document.getElementById("statusRatioChart"), {
      type: "doughnut",
      data: {
        labels: state.list.charts.status_ratio.labels,
        datasets: [{ data: state.list.charts.status_ratio.data, backgroundColor: state.list.charts.status_ratio.colors, borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom" } } },
    })
  );
}

function showToast(message) {
  const toast = document.getElementById("equipmentToast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  document.getElementById("equipmentFilterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("equipmentFilterForm").reset();
    state.filteredRows = [...state.rows];
    document.getElementById("filterStatus").textContent = "전체 설비 조회";
    renderEquipmentCards();
    renderEquipmentTable();
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
  await Promise.all([fetchEquipmentSummary(), fetchEquipmentList()]);
  renderSummaryCards();
  renderFilters();
  applyInitialQueryFilters();
  renderEquipmentCharts();
  bindEvents();
  const selectedFromQuery = state.rows.find((item) => item.id === state.selectedEquipmentId);
  const selectedFromFilter = state.filteredRows[0];
  await updateEquipmentDetail((selectedFromQuery || selectedFromFilter || state.rows[0]).id);
}

init().catch((error) => {
  const content = document.querySelector(".equipment-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `설비 현황 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
