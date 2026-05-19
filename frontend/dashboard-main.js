const factoryData = [
  {
    name: "3 공장",
    color: "#1f7aff",
    rate: 87,
    todayKwh: 8521,
    monthKwh: 245123,
    equipment: 24,
    running: 21,
    status: "정상",
  },
  {
    name: "4 공장",
    color: "#43a83f",
    rate: 91,
    todayKwh: 9342,
    monthKwh: 268654,
    equipment: 24,
    running: 22,
    status: "정상",
  },
  {
    name: "5 공장",
    color: "#8e48d6",
    rate: 82,
    todayKwh: 7895,
    monthKwh: 215897,
    equipment: 24,
    running: 20,
    status: "정상",
  },
];

const productionData = [
  { factory: "3 공장", today: 125.3, total: 3652.1, status: "입력 완료", recent: "05-24 08:00" },
  { factory: "4 공장", today: 132.8, total: 3857.7, status: "입력 완료", recent: "05-24 08:00" },
  { factory: "5 공장", today: 110.6, total: 3102.4, status: "입력 필요", recent: "-" },
];

const alarmData = [
  { time: "14:28:58", factory: "4 공장", message: "전기로 11 온도 상승 경고 (88.5℃)", type: "경고" },
  { time: "14:27:41", factory: "5 공장", message: "전기로 17 전류 불균형 경고", type: "경고" },
  { time: "14:25:13", factory: "3 공장", message: "전기로 03 통신 이상", type: "통신이상" },
  { time: "14:20:33", factory: "5 공장", message: "전기로 05 설비 정지", type: "정지" },
  { time: "14:18:07", factory: "4 공장", message: "전기로 08 온도 상승 경고 (79.1℃)", type: "경고" },
];

const chartLabels = ["05/18", "05/19", "05/20", "05/21", "05/22", "05/23", "05/24"];
const chartColors = {
  factory3: "#1f7aff",
  factory4: "#43a83f",
  factory5: "#8e48d6",
  target: "#ef3340",
};

const formatNumber = (value, digits = 0) =>
  Number(value).toLocaleString("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

function renderFactoryCards() {
  const container = document.getElementById("factoryCards");
  container.innerHTML = factoryData
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
                <span class="status-pill">${factory.status}</span>
              </div>
            </div>
            <div class="factory-metric">
              <span>금일 전력량</span>
              <strong>${formatNumber(factory.todayKwh)}</strong> <small>kWh</small>
            </div>
            <div class="factory-metric">
              <span>금월 누적 전력량</span>
              <strong>${formatNumber(factory.monthKwh)}</strong> <small>kWh</small>
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
            <div><span>설비 수</span><strong>${factory.equipment}<small> 대</small></strong></div>
            <div><span>가동 설비</span><strong>${factory.running}<small> 대</small></strong></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSummaryCards() {
  const totalKwh = factoryData.reduce((sum, item) => sum + item.todayKwh, 0);
  const totalMonthKwh = factoryData.reduce((sum, item) => sum + item.monthKwh, 0);
  const totalProduction = productionData.reduce((sum, item) => sum + item.today, 0);
  const avgIntensity = totalKwh / totalProduction;

  const cards = [
    { icon: "bi-lightning-charge-fill", label: "전체 전력량 (금일)", value: `${formatNumber(totalKwh)} kWh`, delta: "▼ 3.6%", good: true },
    { icon: "bi-arrow-left-right", label: "전체 누적 전력량 (금월)", value: `${formatNumber(totalMonthKwh)} kWh`, delta: "▼ 3.4%", good: true },
    { icon: "bi-speedometer2", label: "평균 원단위 (금일)", value: `${formatNumber(avgIntensity, 2)} kWh/ton`, delta: "▼ 2.8%", good: true },
    { icon: "bi-buildings-fill", label: "총 생산량 (금일)", value: `${formatNumber(totalProduction, 1)} ton`, delta: "▲ 1.5%", good: false },
  ];

  document.getElementById("summaryCards").innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <div class="summary-icon"><i class="bi ${card.icon}"></i></div>
          <div>
            <span>${card.label}</span>
            <strong>${card.value}</strong>
            <small>전일 대비 <em class="delta ${card.good ? "good" : "bad"}">${card.delta}</em></small>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProductionRows() {
  document.getElementById("productionRows").innerHTML = productionData
    .map((item) => {
      const isDone = item.status === "입력 완료";
      return `
        <tr>
          <td class="factory-name">${item.factory}</td>
          <td>${formatNumber(item.today, 1)}</td>
          <td>${formatNumber(item.total, 1)}</td>
          <td><span class="input-badge ${isDone ? "done" : "need"}">${item.status}</span></td>
          <td>${item.recent}</td>
        </tr>
      `;
    })
    .join("");
}

function renderIndicatorRows() {
  document.getElementById("indicatorRows").innerHTML = factoryData
    .map((factory, index) => {
      const production = productionData[index].today;
      const intensity = factory.todayKwh / production;
      const target = [20.5, 20.0, 22.0][index];
      const attainment = Math.min(99.9, (target / intensity) * 100);

      return `
        <tr>
          <td class="factory-name">${factory.name}</td>
          <td>${formatNumber(factory.todayKwh)} kWh</td>
          <td>${formatNumber(production, 1)} ton</td>
          <td>${formatNumber(intensity, 2)}</td>
          <td>${formatNumber(target, 2)}</td>
          <td><span class="attainment">${formatNumber(attainment, 1)}%</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderAlarmList() {
  const typeClass = {
    경고: "warning",
    정지: "stop",
    통신이상: "comm",
  };

  document.getElementById("alarmList").innerHTML = alarmData
    .map(
      (alarm) => `
        <div class="alarm-item">
          <span>${alarm.time}</span>
          <strong>${alarm.factory}</strong>
          <span>${alarm.message}</span>
          <span class="alarm-type ${typeClass[alarm.type]}">${alarm.type}</span>
        </div>
      `
    )
    .join("");
}

function createLineChart(canvasId, datasets, suggestedMax) {
  const context = document.getElementById(canvasId);

  return new Chart(context, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            font: { size: 11, weight: "bold" },
          },
        },
        tooltip: {
          backgroundColor: "#1b2430",
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { color: "#eef2f7" },
          ticks: { font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          suggestedMax,
          grid: { color: "#e7edf5" },
          ticks: { font: { size: 11 } },
        },
      },
    },
  });
}

function renderCharts() {
  // Keep the prototype readable even when CDN access is unavailable.
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".chart-canvas").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  createLineChart(
    "powerTrendChart",
    [
      chartDataset("3 공장", chartColors.factory3, [6700, 7900, 9300, 10500, 12100, 13200, 14200]),
      chartDataset("4 공장", chartColors.factory4, [8200, 9500, 10800, 11200, 12600, 13400, 11200]),
      chartDataset("5 공장", chartColors.factory5, [6100, 6900, 7600, 8300, 8900, 9800, 9100]),
    ],
    16000
  );

  createLineChart(
    "intensityTrendChart",
    [
      chartDataset("3 공장", chartColors.factory3, [25.5, 27.3, 28.1, 26.9, 30.2, 29.7, 31.4]),
      chartDataset("4 공장", chartColors.factory4, [24.2, 25.7, 26.4, 23.1, 24.6, 25.5, 25.1]),
      chartDataset("5 공장", chartColors.factory5, [31.2, 33.4, 29.5, 27.2, 28.6, 29.1, 28.4]),
      {
        label: "목표 원단위",
        data: [20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 20.8],
        borderColor: chartColors.target,
        backgroundColor: chartColors.target,
        borderDash: [6, 5],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
      },
    ],
    42
  );

  new Chart(document.getElementById("peakPowerChart"), {
    type: "bar",
    data: {
      labels: ["00시", "04시", "08시", "12시", "16시", "20시"],
      datasets: [
        barDataset("3 공장", chartColors.factory3, [7600, 8300, 9800, 8700, 10300, 7400]),
        barDataset("4 공장", chartColors.factory4, [9800, 9300, 11200, 10800, 11400, 7200]),
        barDataset("5 공장", chartColors.factory5, [6900, 7600, 9000, 9800, 8800, 7300]),
      ],
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

  new Chart(document.getElementById("alarmDonutChart"), {
    type: "doughnut",
    data: {
      labels: ["경고", "정지", "통신이상"],
      datasets: [
        {
          data: [6, 3, 1],
          backgroundColor: ["#f3a400", "#ef3340", "#1f7aff"],
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
  const formatted = now
    .toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(" ", " ");

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
    });
  });
}

function initDashboard() {
  renderFactoryCards();
  renderSummaryCards();
  renderProductionRows();
  renderIndicatorRows();
  renderAlarmList();
  renderCharts();
  bindSidebarActiveState();
  bindPeriodButtons();
  updateClock();
  setInterval(updateClock, 1000);
}

initDashboard();
