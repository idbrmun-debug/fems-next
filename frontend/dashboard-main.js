const API_BASE = "";

const state = {
  factories: [],
  summary: { cards: [], input_warning: "" },
  powerTrend: { labels: [], series: [], peak_power: { labels: [], series: [] } },
  specificEnergyTrend: { labels: [], series: [], target: null },
  productionStatus: { items: [], indicators: [] },
  alarms: { summary: { total: 0, items: [] }, recent: [] },
  charts: [],
  trendSamples: {
    power: {},
    specific: {},
  },
  activePeriods: {
    power: "day",
    specific: "day",
  },
};

const formatNumber = (value, digits = 0) =>
  Number(value || 0).toLocaleString("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${path} request failed: ${response.status}`);
  }

  return response.json();
}

async function loadDashboardData() {
  const [summary, factories, powerTrend, specificEnergyTrend, productionStatus, alarms] = await Promise.all([
    fetchJson("/api/dashboard/summary"),
    fetchJson("/api/dashboard/factories"),
    fetchJson("/api/dashboard/power-trend"),
    fetchJson("/api/dashboard/specific-energy-trend"),
    fetchJson("/api/dashboard/production-status"),
    fetchJson("/api/dashboard/alarms"),
  ]);

  state.summary = summary;
  state.factories = factories.items || [];
  state.powerTrend = powerTrend;
  state.specificEnergyTrend = specificEnergyTrend;
  state.productionStatus = productionStatus;
  state.alarms = alarms;
  buildTrendSamples();
}

function buildTrendSamples() {
  const factoryColors = {
    "3공장": "#1a73e8",
    "4공장": "#36a339",
    "5공장": "#8e44d7",
  };

  state.trendSamples.power = {
    hour: {
      labels: ["09:00", "09:10", "09:20", "09:30", "09:40", "09:50", "10:00"],
      series: [
        { label: "3공장", color: factoryColors["3공장"], data: [1180, 1240, 1310, 1270, 1390, 1450, 1420] },
        { label: "4공장", color: factoryColors["4공장"], data: [1320, 1360, 1420, 1510, 1490, 1560, 1610] },
        { label: "5공장", color: factoryColors["5공장"], data: [980, 1040, 1110, 1160, 1210, 1190, 1260] },
      ],
    },
    day: state.powerTrend,
    month: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      series: [
        { label: "3공장", color: factoryColors["3공장"], data: [220000, 231500, 238200, 242800, 245123, 249600] },
        { label: "4공장", color: factoryColors["4공장"], data: [242300, 251400, 259700, 264200, 268654, 271300] },
        { label: "5공장", color: factoryColors["5공장"], data: [198500, 204100, 209800, 212400, 215897, 219200] },
      ],
    },
  };

  state.trendSamples.specific = {
    hour: {
      labels: ["09:00", "09:10", "09:20", "09:30", "09:40", "09:50", "10:00"],
      series: [
        { label: "3공장", color: factoryColors["3공장"], data: [19.2, 19.4, 19.8, 19.5, 19.7, 19.6, 19.8] },
        { label: "4공장", color: factoryColors["4공장"], data: [18.4, 18.6, 18.7, 18.9, 18.8, 18.7, 18.9] },
        { label: "5공장", color: factoryColors["5공장"], data: [20.2, 20.5, 20.8, 20.6, 20.9, 21.0, 20.7] },
      ],
      target: { label: "목표 원단위", color: "#ef3340", data: [20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 20.8] },
    },
    day: state.specificEnergyTrend,
    month: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      series: [
        { label: "3공장", color: factoryColors["3공장"], data: [20.3, 20.0, 19.9, 19.7, 19.58, 19.45] },
        { label: "4공장", color: factoryColors["4공장"], data: [19.6, 19.2, 19.0, 18.9, 18.82, 18.75] },
        { label: "5공장", color: factoryColors["5공장"], data: [21.6, 21.3, 21.0, 20.9, 20.73, 20.65] },
      ],
      target: { label: "목표 원단위", color: "#ef3340", data: [20.8, 20.8, 20.8, 20.8, 20.8, 20.8] },
    },
  };
}

function renderFactoryCards() {
  const container = document.getElementById("factoryCards");
  container.innerHTML = state.factories
    .map((factory) => {
      const circumference = 2 * Math.PI * 48;
      const offset = circumference - (factory.rate / 100) * circumference;

      return `
        <article class="factory-card">
          <div>
            <div class="factory-title">
              <div class="factory-icon" style="background:${factory.color}">
                <i class="bi bi-buildings-fill"></i>
              </div>
              <div>
                <h3>${factory.name}</h3>
                <span class="status-pill">${factory.status_label}</span>
              </div>
            </div>
            <div class="factory-metric">
              <span>금일 전력량</span>
              <strong>${formatNumber(factory.today_kwh)}</strong> <small>kWh</small>
            </div>
            <div class="factory-metric">
              <span>금월 누적 전력량</span>
              <strong>${formatNumber(factory.month_kwh)}</strong> <small>kWh</small>
            </div>
          </div>
          <div class="equipment-stats">
            <div class="gauge" aria-label="${factory.name} 가동률 ${factory.rate}%">
              <svg viewBox="0 0 116 116" aria-hidden="true">
                <circle class="track" cx="58" cy="58" r="48"></circle>
                <circle
                  class="progress"
                  cx="58"
                  cy="58"
                  r="48"
                  style="stroke:${factory.color};stroke-dasharray:${circumference};stroke-dashoffset:${offset}"
                ></circle>
              </svg>
              <div class="gauge-label"><div><strong>${factory.rate}%</strong><span>가동률</span></div></div>
            </div>
            <div><span>설비 수</span><strong>${factory.equipment_count}<small> 대</small></strong></div>
            <div><span>가동 설비</span><strong>${factory.running_count}<small> 대</small></strong></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSummaryCards() {
  document.getElementById("summaryCards").innerHTML = (state.summary.cards || [])
    .map(
      (card) => `
        <article class="summary-card">
          <div class="summary-icon"><i class="bi ${card.icon}"></i></div>
          <div>
            <span>${card.label}</span>
            <strong>${card.value}</strong>
            <small>전일 대비 <em class="delta ${card.trend === "bad" ? "bad" : "good"}">${card.delta}</em></small>
          </div>
        </article>
      `
    )
    .join("");

  const warning = document.querySelector(".input-warning");
  if (warning && state.summary.input_warning) {
    warning.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i>${state.summary.input_warning}`;
  }
}

function renderProductionRows() {
  document.getElementById("productionRows").innerHTML = (state.productionStatus.items || [])
    .map((item) => {
      const isDone = item.input_status === "입력 완료";
      return `
        <tr>
          <td class="factory-name">${item.factory}</td>
          <td>${formatNumber(item.today, 1)}</td>
          <td>${formatNumber(item.total, 1)}</td>
          <td><span class="input-badge ${isDone ? "done" : "need"}">${item.input_status}</span></td>
          <td>${item.recent}</td>
        </tr>
      `;
    })
    .join("");
}

function renderIndicatorRows() {
  document.getElementById("indicatorRows").innerHTML = (state.productionStatus.indicators || [])
    .map(
      (item) => `
        <tr>
          <td class="factory-name">${item.factory}</td>
          <td>${formatNumber(item.power_kwh)} kWh</td>
          <td>${formatNumber(item.production_ton, 1)} ton</td>
          <td>${formatNumber(item.specific_energy, 2)}</td>
          <td>${formatNumber(item.target_specific_energy, 2)}</td>
          <td><span class="attainment">${formatNumber(item.attainment, 1)}%</span></td>
        </tr>
      `
    )
    .join("");
}

function renderAlarmList() {
  const typeClass = {
    경고: "warning",
    정지: "stop",
    통신이상: "comm",
  };

  document.getElementById("alarmList").innerHTML = (state.alarms.recent || [])
    .map(
      (alarm) => `
        <div class="alarm-item">
          <span>${alarm.time}</span>
          <strong>${alarm.factory}</strong>
          <span>${alarm.message}</span>
          <span class="alarm-type ${typeClass[alarm.type] || "warning"}">${alarm.type}</span>
        </div>
      `
    )
    .join("");
}

function renderAlarmSummary() {
  const legend = document.querySelector(".alarm-legend");
  const total = document.querySelector(".alarm-total strong");
  const items = state.alarms.summary?.items || [];

  if (total) {
    total.textContent = state.alarms.summary?.total || 0;
  }

  if (legend) {
    legend.innerHTML = items
      .map(
        (item) => `
          <li>
            <span class="dot" style="background:${item.color}"></span>${item.type}
            <strong>${item.count}건</strong>
          </li>
        `
      )
      .join("");
  }
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function createLineChart(canvasId, labels, datasets, suggestedMax) {
  const context = document.getElementById(canvasId);

  const chart = new Chart(context, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, usePointStyle: true, font: { size: 11, weight: "bold" } },
        },
        tooltip: { backgroundColor: "#1b2430", padding: 10 },
      },
      scales: {
        x: { grid: { color: "#eef2f7" }, ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, suggestedMax, grid: { color: "#e7edf5" }, ticks: { font: { size: 11 } } },
      },
    },
  });

  state.charts.push(chart);
  return chart;
}

function renderCharts() {
  destroyCharts();

  // Keep the prototype readable even when CDN access is unavailable.
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".chart-canvas").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  const selectedPowerTrend = state.trendSamples.power[state.activePeriods.power] || state.powerTrend;
  const selectedSpecificTrend = state.trendSamples.specific[state.activePeriods.specific] || state.specificEnergyTrend;

  createLineChart(
    "powerTrendChart",
    selectedPowerTrend.labels || [],
    (selectedPowerTrend.series || []).map((item) => chartDataset(item.label, item.color, item.data)),
    state.activePeriods.power === "month" ? 300000 : 16000
  );

  const specificEnergyDatasets = (selectedSpecificTrend.series || []).map((item) =>
    chartDataset(item.label, item.color, item.data)
  );

  if (selectedSpecificTrend.target) {
    specificEnergyDatasets.push({
      label: selectedSpecificTrend.target.label,
      data: selectedSpecificTrend.target.data,
      borderColor: selectedSpecificTrend.target.color,
      backgroundColor: selectedSpecificTrend.target.color,
      borderDash: [6, 5],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0,
    });
  }

  createLineChart("intensityTrendChart", selectedSpecificTrend.labels || [], specificEnergyDatasets, 42);

  const peakPower = state.powerTrend.peak_power || { labels: [], series: [] };
  const peakChart = new Chart(document.getElementById("peakPowerChart"), {
    type: "bar",
    data: {
      labels: peakPower.labels || [],
      datasets: (peakPower.series || []).map((item) => barDataset(item.label, item.color, item.data)),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11, weight: "bold" } } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, suggestedMax: 15000, grid: { color: "#e7edf5" }, ticks: { font: { size: 11 } } },
      },
    },
  });
  state.charts.push(peakChart);

  const alarmItems = state.alarms.summary?.items || [];
  const alarmChart = new Chart(document.getElementById("alarmDonutChart"), {
    type: "doughnut",
    data: {
      labels: alarmItems.map((item) => item.type),
      datasets: [
        {
          data: alarmItems.map((item) => item.count),
          backgroundColor: alarmItems.map((item) => item.color),
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    },
  });
  state.charts.push(alarmChart);

  renderAlarmSummary();
}

function chartDataset(label, color, data) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: `${color}22`,
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 4,
    fill: true,
    tension: 0.35,
  };
}

function barDataset(label, color, data) {
  return {
    label,
    data,
    backgroundColor: `${color}b8`,
    borderRadius: 4,
    maxBarThickness: 18,
  };
}

function updateClock() {
  const now = new Date();
  const formatted = now.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  document.getElementById("currentTime").textContent = formatted;
  document.getElementById("lastUpdate").textContent = formatted;
}

function bindSidebarActiveState() {
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function bindPeriodButtons() {
  document.querySelectorAll(".period-tabs").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }

      group.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("btn-primary", item === button);
        item.classList.toggle("btn-outline-primary", item !== button);
      });

      const chartType = group.dataset.chart;
      if (chartType && state.activePeriods[chartType]) {
        state.activePeriods[chartType] = button.dataset.period || "day";
        renderCharts();
      }
    });
  });
}

function showDashboardError(error) {
  const content = document.querySelector(".content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `대시보드 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
}

function renderDashboard() {
  renderFactoryCards();
  renderSummaryCards();
  renderProductionRows();
  renderIndicatorRows();
  renderAlarmSummary();
  renderAlarmList();
  renderCharts();
}

async function initDashboard() {
  bindSidebarActiveState();
  bindPeriodButtons();
  updateClock();
  setInterval(updateClock, 1000);

  try {
    await loadDashboardData();
    renderDashboard();
  } catch (error) {
    showDashboardError(error);
  }
}

initDashboard();
