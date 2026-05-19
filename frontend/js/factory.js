const API_BASE = "";

const state = {
  selectedFactory: "전체",
  selectedProcess: "전체",
  summary: null,
  comparison: [],
  processRows: [],
  feederRows: [],
  powerTrend: null,
  specificTrend: null,
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

function pathFactory(factory) {
  return factory === "전체" ? "" : `/${encodeURIComponent(factory)}`;
}

async function fetchFactorySummary(factory) {
  state.summary = await fetchJson(`/api/factory-page/summary${pathFactory(factory)}`);
  return state.summary;
}

async function fetchFactoryComparison() {
  const data = await fetchJson("/api/factory-page/comparison");
  state.comparison = data.items || [];
  return state.comparison;
}

async function fetchProcessStatus(factory) {
  const data = await fetchJson(`/api/factory-page/process-status${pathFactory(factory)}`);
  state.processRows = data.items || [];
  return state.processRows;
}

async function fetchFeederStatus(factory, process = "전체") {
  const base = `/api/factory-page/feeder-status${pathFactory(factory)}`;
  const path = process === "전체" ? base : `${base}/${encodeURIComponent(process)}`;
  const data = await fetchJson(path);
  state.feederRows = data.items || [];
  return state.feederRows;
}

async function fetchFactoryPowerTrend(factory) {
  state.powerTrend = await fetchJson(`/api/factory-page/power-trend${pathFactory(factory)}`);
  return state.powerTrend;
}

async function fetchFactorySpecificEnergyTrend(factory) {
  state.specificTrend = await fetchJson(`/api/factory-page/specific-energy-trend${pathFactory(factory)}`);
  return state.specificTrend;
}

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function statusClass(status) {
  if (status === "정상" || status === "가동") return "ok";
  if (status === "경고") return "warning";
  if (status === "통신이상") return "comm";
  return "need";
}

function renderSummaryCards() {
  document.getElementById("factorySummaryCards").innerHTML = state.summary.cards
    .map(
      (card) => `
        <article class="factory-summary-card ${card.tone}">
          <i class="bi ${card.icon}"></i>
          <div>
            <span>${card.label}</span>
            <strong>${formatNumber(card.value, Number.isInteger(card.value) ? 0 : 1)} <small>${card.unit}</small></strong>
          </div>
        </article>
      `
    )
    .join("");
}

function renderFactoryCards() {
  document.getElementById("factoryCards").innerHTML = state.comparison
    .map(
      (item) => `
        <article class="factory-compare-card ${item.factory === state.selectedFactory ? "active" : ""}" data-factory-card="${item.factory}">
          <div class="factory-compare-title">
            <h3>${item.factory}</h3>
            <span class="status-badge ${statusClass(item.status)}">${item.status}</span>
          </div>
          <div class="factory-metric-grid">
            <div><span>전력량</span><strong>${formatNumber(item.today_kwh)} kWh</strong></div>
            <div><span>생산량</span><strong>${formatNumber(item.production_ton, 1)} ton</strong></div>
            <div><span>원단위</span><strong>${formatNumber(item.specific, 2)}</strong></div>
            <div><span>목표 원단위</span><strong>${formatNumber(item.target_specific, 2)}</strong></div>
            <div><span>달성률</span><strong>${formatNumber(item.achievement, 1)}%</strong></div>
            <div><span>가동률</span><strong>${formatNumber(item.operation_rate, 1)}%</strong></div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-factory-card]").forEach((card) => {
    card.addEventListener("click", () => updateFactoryView(card.dataset.factoryCard));
  });
}

function renderTargets() {
  const targets = state.summary.targets;
  document.getElementById("targetFactoryLabel").textContent = state.selectedFactory;
  document.getElementById("targetList").innerHTML = Object.values(targets)
    .map(
      (item) => `
        <div class="target-item">
          <div class="target-caption">
            <span>${item.label}</span>
            <strong>${formatNumber(item.rate, 1)}%</strong>
          </div>
          <div class="target-row">
            <div class="progress" role="progressbar" aria-valuenow="${item.rate}" aria-valuemin="0" aria-valuemax="120">
              <div class="progress-bar" style="width:${Math.min(item.rate, 100)}%"></div>
            </div>
            <span>현재 ${formatNumber(item.actual, 1)} / 목표 ${formatNumber(item.target, 1)}</span>
          </div>
        </div>
      `
    )
    .join("");
}

function renderProcessTable() {
  document.getElementById("processRowCount").textContent = `${state.processRows.length}건`;
  document.getElementById("processRows").innerHTML = state.processRows
    .map(
      (row) => `
        <tr data-process="${row.process}">
          <td class="factory-name">${row.factory}</td>
          <td>${row.process}</td>
          <td>${row.equipment_count}</td>
          <td>${row.running_count}</td>
          <td>${formatNumber(row.power_kw, 1)}</td>
          <td>${formatNumber(row.today_kwh)}</td>
          <td>${formatNumber(row.production_ton, 1)}</td>
          <td>${formatNumber(row.specific, 2)}</td>
          <td>${formatNumber(row.target_specific, 2)}</td>
          <td>${row.alarm_count}</td>
          <td><span class="status-badge ${statusClass(row.status)}">${row.status}</span></td>
        </tr>
      `
    )
    .join("");

  document.querySelectorAll("#processRows tr").forEach((row) => {
    row.addEventListener("click", async () => {
      state.selectedProcess = row.dataset.process;
      await fetchFeederStatus(state.selectedFactory, state.selectedProcess);
      renderFeederTable();
      showToast(`${state.selectedProcess} 상세가 적용되었습니다.`);
    });
  });
}

function equipmentUrl(row) {
  const params = new URLSearchParams({
    factory: row.factory,
    process: row.process,
    furnace: row.equipment,
    meter: row.meter,
  });
  return `./equipment.html?${params.toString()}`;
}

function renderFeederTable() {
  document.getElementById("feederRowCount").textContent = `${state.feederRows.length}건`;
  document.getElementById("feederRows").innerHTML = state.feederRows
    .map(
      (row) => `
        <tr>
          <td class="factory-name">${row.factory}</td>
          <td>${row.process}</td>
          <td>${row.feeder}</td>
          <td>${row.equipment}</td>
          <td>${row.meter}</td>
          <td>${formatNumber(row.power_kw, 1)}</td>
          <td>${formatNumber(row.avg_v, 1)}</td>
          <td>${formatNumber(row.avg_a, 1)}</td>
          <td>${formatNumber(row.avg_pf, 2)}</td>
          <td>${formatNumber(row.today_kwh)}</td>
          <td><span class="status-badge ${statusClass(row.status)}">${row.status}</span></td>
          <td><div class="row-actions"><a class="btn btn-outline-primary btn-sm" href="${equipmentUrl(row)}">상세</a></div></td>
        </tr>
      `
    )
    .join("");
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function renderFactoryCharts() {
  destroyCharts();
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".factory-chart").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  const labels = state.comparison.map((item) => item.factory);
  const colors = ["#1f7aff", "#43a83f", "#8e48d6"];
  document.getElementById("trendFactoryLabel").textContent = state.selectedFactory;

  state.charts.push(
    new Chart(document.getElementById("factoryPowerChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "전력량", data: state.comparison.map((item) => item.today_kwh), backgroundColor: colors, borderRadius: 5 }],
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("factorySpecificChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "현재 원단위", data: state.comparison.map((item) => item.specific), backgroundColor: "#1f7aff", borderRadius: 5 },
          { label: "목표 원단위", data: state.comparison.map((item) => item.target_specific), backgroundColor: "#d7e7fb", borderRadius: 5 },
        ],
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("factoryTrendChart"), {
      type: "line",
      data: {
        labels: state.powerTrend.labels,
        datasets: [{ label: "전력 추이", data: state.powerTrend.data, borderColor: "#1f7aff", backgroundColor: "#1f7aff", tension: 0.32, pointRadius: 2 }],
      },
      options: chartOptions(),
    })
  );

  const processTotals = state.processRows.reduce((acc, row) => {
    acc[row.process] = (acc[row.process] || 0) + row.power_kw;
    return acc;
  }, {});
  state.charts.push(
    new Chart(document.getElementById("processRatioChart"), {
      type: "doughnut",
      data: {
        labels: Object.keys(processTotals),
        datasets: [{ data: Object.values(processTotals), backgroundColor: ["#1f7aff", "#43a83f", "#8e48d6", "#f3a400"], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom" } } },
    })
  );
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { boxWidth: 10, font: { weight: "bold" } } } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#e7edf5" } } },
  };
}

function updateTabs() {
  document.querySelectorAll(".factory-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.factory === state.selectedFactory);
  });
}

async function updateFactoryView(factory) {
  state.selectedFactory = factory;
  state.selectedProcess = "전체";
  updateTabs();
  await Promise.all([
    fetchFactorySummary(factory),
    fetchFactoryComparison(),
    fetchProcessStatus(factory),
    fetchFeederStatus(factory),
    fetchFactoryPowerTrend(factory),
    fetchFactorySpecificEnergyTrend(factory),
  ]);
  renderSummaryCards();
  renderFactoryCards();
  renderTargets();
  renderProcessTable();
  renderFeederTable();
  renderFactoryCharts();
  showToast(`${factory} 기준이 적용되었습니다.`);
}

function bindEvents() {
  document.querySelectorAll(".factory-tab").forEach((button) => {
    button.addEventListener("click", () => updateFactoryView(button.dataset.factory));
  });
}

function showToast(message) {
  const toast = document.getElementById("factoryToast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
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
  bindEvents();
  await updateFactoryView("전체");
}

init().catch((error) => {
  const content = document.querySelector(".factory-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `공장별 현황 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
