const API_BASE = "";

const pageState = {
  summary: null,
  manual: null,
  excel: null,
  history: null,
  chart: null,
};

const formatNumber = (value, digits = 1) =>
  Number(value || 0).toLocaleString("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `${path} request failed`);
  }

  return data;
}

async function loadProductionPageData() {
  const [summary, manual, excel, history] = await Promise.all([
    fetchJson("/api/production-page/summary"),
    fetchJson("/api/production-page/manual"),
    fetchJson("/api/production-page/excel"),
    fetchJson("/api/production-page/history"),
  ]);

  pageState.summary = summary;
  pageState.manual = manual;
  pageState.excel = excel;
  pageState.history = history;
}

function renderSummary() {
  document.getElementById("summaryDate").textContent = `(${pageState.summary.date})`;

  const cards = pageState.summary.cards
    .map(
      (item) => `
        <article class="production-summary-card">
          <i class="bi ${item.icon}" style="background:${item.color}"></i>
          <div>
            <h3>${item.factory}</h3>
            <strong>${formatNumber(item.today, 1)} <small>ton</small></strong>
            <small>누적 ${formatNumber(item.total, 1)} ton</small>
          </div>
        </article>
      `
    )
    .join("");

  const statusCard = `
    <article class="status-summary-card">
      <h3>입력 현황</h3>
      ${pageState.summary.status_counts
        .map(
          (item) => `
            <div class="status-line ${item.status}">
              <span>${item.label}</span>
              <strong>${item.count} ${item.unit}</strong>
            </div>
          `
        )
        .join("")}
    </article>
  `;

  document.getElementById("summaryCards").innerHTML = cards + statusCard;
}

function renderManualRows() {
  document.getElementById("inputDate").value = pageState.manual.date;
  document.getElementById("manualRows").innerHTML = pageState.manual.items
    .map((item) => {
      const done = item.input_status === "입력 완료";
      const warning = item.attainment < 95;

      return `
        <tr data-factory="${item.factory}">
          <td>
            <span class="factory-with-icon" style="color:${item.color}">
              <i class="bi bi-buildings-fill"></i>${item.factory}
            </span>
          </td>
          <td><input class="form-control form-control-sm production-value" type="number" step="0.1" value="${item.today}"></td>
          <td>${formatNumber(item.total, 1)}</td>
          <td>${formatNumber(item.target, 1)}</td>
          <td class="attainment-cell">
            <strong>${formatNumber(item.attainment, 1)}%</strong>
            <div class="attainment-bar ${warning ? "warning" : ""}">
              <span style="width:${Math.min(item.attainment, 100)}%"></span>
            </div>
          </td>
          <td><span class="input-badge ${done ? "done" : "need"}">${item.input_status}</span></td>
          <td><i class="bi bi-clock"></i> ${item.last_input}</td>
        </tr>
      `;
    })
    .join("");
}

function renderExcelInfo() {
  document.getElementById("excelSteps").innerHTML = pageState.excel.steps
    .map(
      (step, index) => `
        <div class="excel-step ${index === 0 ? "active" : ""}">
          <span>${index + 1}</span>${step}
        </div>
      `
    )
    .join("");

  document.getElementById("downloadTemplate").href = pageState.excel.template_url;
  document.getElementById("excelRules").innerHTML = pageState.excel.rules.map((rule) => `<li>${rule}</li>`).join("");
  document.getElementById("excelSampleRows").innerHTML = pageState.excel.sample_rows
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${row.factory}</td>
          <td>${formatNumber(row.quantity, 1)}</td>
        </tr>
      `
    )
    .join("");
}

function renderHistory() {
  document.getElementById("historyRows").innerHTML = pageState.history.items
    .map(
      (item) => `
        <tr>
          <td>${item.date}</td>
          <td class="factory-name">${item.factory}</td>
          <td>${formatNumber(item.quantity, 1)} ton</td>
          <td>${formatNumber(item.total, 1)} ton</td>
          <td>${item.owner}</td>
          <td>${item.method}</td>
          <td>${item.input_time}</td>
        </tr>
      `
    )
    .join("");
}

function renderAttainmentChart() {
  if (typeof Chart === "undefined") {
    document.querySelector(".attainment-chart-wrap").innerHTML =
      '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    return;
  }

  if (pageState.chart) {
    pageState.chart.destroy();
  }

  pageState.chart = new Chart(document.getElementById("attainmentChart"), {
    type: "bar",
    data: {
      labels: pageState.manual.items.map((item) => item.factory),
      datasets: [
        {
          label: "목표 달성률",
          data: pageState.manual.items.map((item) => item.attainment),
          backgroundColor: pageState.manual.items.map((item) => item.color),
          borderRadius: 6,
          maxBarThickness: 42,
        },
        {
          label: "기준선",
          data: pageState.manual.items.map(() => 100),
          type: "line",
          borderColor: "#ef3340",
          borderDash: [6, 5],
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11, weight: "bold" } } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, suggestedMax: 120, ticks: { callback: (value) => `${value}%` } },
      },
    },
  });
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
}

function bindTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`${button.dataset.tab}Panel`).classList.add("active");
    });
  });
}

function bindManualForm() {
  document.getElementById("todayButton").addEventListener("click", () => {
    document.getElementById("inputDate").value = pageState.manual.date;
  });

  document.getElementById("resetManual").addEventListener("click", () => {
    renderManualRows();
    document.getElementById("manualMessage").textContent = "";
  });

  document.getElementById("manualForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const rows = Array.from(document.querySelectorAll("#manualRows tr")).map((row) => ({
      factory: row.dataset.factory,
      quantity: Number(row.querySelector(".production-value").value),
    }));

    await fetchJson("/api/production-page/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: document.getElementById("inputDate").value, rows }),
    });

    document.getElementById("manualMessage").textContent = "저장되었습니다.";
  });
}

function bindExcelUpload() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("excelFile");
  const selectedFileName = document.getElementById("selectedFileName");

  document.getElementById("selectExcel").addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    selectedFileName.textContent = fileInput.files[0]?.name || "지원 형식: .xlsx, .xls";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("drag-over");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    if (!file) {
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    selectedFileName.textContent = file.name;
  });

  document.getElementById("uploadExcel").addEventListener("click", async () => {
    const formData = new FormData();
    const file = fileInput.files[0];
    if (file) {
      formData.append("file", file);
    }

    const result = await fetchJson("/api/production-page/excel-upload", {
      method: "POST",
      body: formData,
    });

    document.getElementById("excelMessage").textContent = `${result.message} (${result.written}건)`;
  });
}

function bindSidebarActiveState() {
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function renderPage() {
  renderSummary();
  renderManualRows();
  renderExcelInfo();
  renderHistory();
  renderAttainmentChart();
}

async function init() {
  updateClock();
  setInterval(updateClock, 1000);
  bindTabs();
  bindManualForm();
  bindExcelUpload();
  bindSidebarActiveState();
  await loadProductionPageData();
  renderPage();
}

init().catch((error) => {
  const content = document.querySelector(".production-content");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `생산량 입력 화면 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
