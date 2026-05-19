const API_BASE = "";

const state = {
  summary: null,
  power: null,
  specific: null,
  production: null,
  alarms: null,
  detail: [],
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

async function fetchReportSummary() {
  state.summary = await fetchJson("/api/report-page/summary");
  return state.summary;
}

async function fetchPowerReport() {
  state.power = await fetchJson("/api/report-page/power");
  return state.power;
}

async function fetchSpecificEnergyReport() {
  state.specific = await fetchJson("/api/report-page/specific-energy");
  return state.specific;
}

async function fetchProductionReport() {
  state.production = await fetchJson("/api/report-page/production");
  return state.production;
}

async function fetchAlarmReport() {
  state.alarms = await fetchJson("/api/report-page/alarms");
  return state.alarms;
}

async function fetchReportDetail() {
  const data = await fetchJson("/api/report-page/detail");
  state.detail = data.items || [];
  return state.detail;
}

function exportReportToPdf() {
  showToast("PDF 내보내기 기능은 추후 서버 export 모듈과 연결됩니다.");
}

function exportReportToExcel() {
  showToast("Excel 내보내기 기능은 추후 서버 export 모듈과 연결됩니다.");
}

function renderSummaryCards() {
  document.getElementById("reportSummaryCards").innerHTML = state.summary.cards
    .map(
      (card) => `
        <article class="report-summary-card">
          <i class="bi ${card.icon}"></i>
          <div>
            <span>${card.label}</span>
            <strong>${card.value} <small>${card.unit}</small></strong>
            <span class="delta ${card.trend}"><i class="bi ${card.trend === "good" ? "bi-caret-down-fill" : "bi-caret-up-fill"}"></i>${card.delta}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPreview() {
  const typeText = document.getElementById("reportType").selectedOptions[0].textContent;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const factory = document.getElementById("factoryFilter").value;
  const process = document.getElementById("processFilter").value;
  const equipment = document.getElementById("equipmentFilter").value;

  document.getElementById("previewGeneratedAt").textContent = `생성일시 ${state.summary.generated_at}`;
  document.getElementById("previewTitle").textContent = `${typeText} - ${factory}`;
  document.getElementById("previewPeriod").textContent = `${startDate} ~ ${endDate}`;
  document.getElementById("previewSummary").textContent =
    `${process} / ${equipment} 조건으로 전력량, 생산량, 원단위, 알람 발생 현황을 집계합니다.`;
  document.getElementById("conditionStatus").textContent = `${typeText} 조회 조건 적용`;

  document.getElementById("previewMetrics").innerHTML = state.summary.cards
    .slice(0, 4)
    .map(
      (card) => `
        <div class="preview-metric">
          <span>${card.label}</span>
          <strong>${card.value} ${card.unit}</strong>
        </div>
      `
    )
    .join("");
}

function renderSpecificEnergyList() {
  document.getElementById("specificEnergyList").innerHTML = state.specific.achievement
    .map(
      (item) => `
        <div class="achievement-item">
          <span>${item.factory}</span>
          <small>실적 ${item.actual} / 목표 ${item.target}</small>
          <strong>${item.rate}%</strong>
        </div>
      `
    )
    .join("");
}

function renderProductionMissing() {
  document.getElementById("missingProductionList").innerHTML = state.production.missing
    .map(
      (item) => `
        <div class="missing-item">
          <span>${item.date}</span>
          <small>${item.factory}</small>
          <strong>${item.status}</strong>
        </div>
      `
    )
    .join("");
}

function renderAlarmSummary() {
  document.getElementById("unackAlarmCount").textContent = `${state.alarms.unacknowledged}건`;
}

function renderDetailRows() {
  document.getElementById("detailRowCount").textContent = `${state.detail.length}건`;
  document.getElementById("reportDetailRows").innerHTML = state.detail
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td class="factory-name">${row.factory}</td>
          <td>${row.process}</td>
          <td>${row.equipment}</td>
          <td>${row.power_kwh.toLocaleString()}</td>
          <td>${row.production_ton.toLocaleString()}</td>
          <td>${row.specific}</td>
          <td>${row.target}</td>
          <td><span class="attainment">${row.achievement}</span></td>
          <td>${row.alarms}</td>
          <td class="note-cell">${row.note}</td>
        </tr>
      `
    )
    .join("");
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { boxWidth: 10, font: { weight: "bold" } } } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#e7edf5" } },
    },
  };
}

function renderReportCharts() {
  destroyCharts();
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".report-chart").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  state.charts.push(
    new Chart(document.getElementById("factoryPowerChart"), {
      type: "bar",
      data: {
        labels: state.power.factory_compare.labels,
        datasets: [{ label: "전력량(kWh)", data: state.power.factory_compare.data, backgroundColor: ["#1f7aff", "#43a83f", "#8e48d6"], borderRadius: 5 }],
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("dailyPowerChart"), {
      type: "line",
      data: {
        labels: state.power.daily_trend.labels,
        datasets: state.power.daily_trend.datasets.map((item) => ({
          label: item.label,
          data: item.data,
          borderColor: item.color,
          backgroundColor: item.color,
          tension: 0.32,
          pointRadius: 2,
        })),
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("peakPowerChart"), {
      type: "bar",
      data: {
        labels: state.power.peak_by_hour.labels,
        datasets: state.power.peak_by_hour.datasets.map((item) => ({
          label: item.label,
          data: item.data,
          backgroundColor: item.color,
          borderRadius: 5,
        })),
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("specificEnergyChart"), {
      type: "bar",
      data: {
        labels: state.specific.factory_specific.labels,
        datasets: [
          { label: "실적", data: state.specific.factory_specific.actual, backgroundColor: "#1f7aff", borderRadius: 5 },
          { label: "목표", data: state.specific.factory_specific.target, backgroundColor: "#d7e7fb", borderRadius: 5 },
        ],
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("productionCompareChart"), {
      type: "bar",
      data: {
        labels: state.production.factory_compare.labels,
        datasets: [{ label: "누적 생산량(ton)", data: state.production.factory_compare.data, backgroundColor: ["#1f7aff", "#43a83f", "#8e48d6"], borderRadius: 5 }],
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("productionTrendChart"), {
      type: "line",
      data: {
        labels: state.production.daily_trend.labels,
        datasets: state.production.daily_trend.datasets.map((item) => ({
          label: item.label,
          data: item.data,
          borderColor: item.color,
          backgroundColor: item.color,
          tension: 0.32,
          pointRadius: 2,
        })),
      },
      options: chartOptions(),
    })
  );

  state.charts.push(
    new Chart(document.getElementById("alarmTypeChart"), {
      type: "doughnut",
      data: {
        labels: state.alarms.type_counts.labels,
        datasets: [{ data: state.alarms.type_counts.data, backgroundColor: state.alarms.type_counts.colors, borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom" } } },
    })
  );

  state.charts.push(
    new Chart(document.getElementById("alarmTopChart"), {
      type: "bar",
      data: {
        labels: state.alarms.equipment_top5.labels,
        datasets: [{ label: "알람 건수", data: state.alarms.equipment_top5.data, backgroundColor: "#f3a400", borderRadius: 5 }],
      },
      options: { ...chartOptions(), indexAxis: "y" },
    })
  );
}

async function refreshReport() {
  await Promise.all([
    fetchReportSummary(),
    fetchPowerReport(),
    fetchSpecificEnergyReport(),
    fetchProductionReport(),
    fetchAlarmReport(),
    fetchReportDetail(),
  ]);
  renderSummaryCards();
  renderPreview();
  renderSpecificEnergyList();
  renderProductionMissing();
  renderAlarmSummary();
  renderDetailRows();
  renderReportCharts();
}

function showToast(message) {
  const toast = document.getElementById("reportToast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  document.getElementById("reportConditionForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await refreshReport();
    showToast("조회 조건이 적용되었습니다.");
  });
  document.getElementById("exportPdf").addEventListener("click", exportReportToPdf);
  document.getElementById("exportExcel").addEventListener("click", exportReportToExcel);
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
  await refreshReport();
}

init().catch((error) => {
  const content = document.querySelector(".report-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `리포트 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
