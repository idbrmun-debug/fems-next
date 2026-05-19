const API_BASE = "";

const state = {
  summary: null,
  list: null,
  recent: [],
  rows: [],
  filteredRows: [],
  selectedAlarm: null,
  charts: [],
};

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${path} request failed`);
  }
  return data;
}

async function fetchAlarmSummary() {
  state.summary = await fetchJson("/api/alarm-page/summary");
  return state.summary;
}

async function fetchAlarmList() {
  state.list = await fetchJson("/api/alarm-page/list");
  state.rows = [...state.list.items];
  state.filteredRows = [...state.rows];
  return state.list;
}

async function fetchRecentAlarms() {
  const data = await fetchJson("/api/alarm-page/recent");
  state.recent = data.items || [];
  return state.recent;
}

async function acknowledgeAlarm(id, owner, note) {
  const result = await fetchJson("/api/alarm-page/acknowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, owner, note }),
  });

  const now = new Date().toLocaleString("sv-SE", { hour12: false });
  state.rows = state.rows.map((row) =>
    row.id === id ? { ...row, acknowledged: true, ack_owner: owner, ack_time: now, ack_note: note } : row
  );
  state.filteredRows = state.filteredRows.map((row) =>
    row.id === id ? { ...row, acknowledged: true, ack_owner: owner, ack_time: now, ack_note: note } : row
  );
  return result;
}

function levelClass(level) {
  if (level === "정지") return "stop";
  if (level === "통신이상") return "comm";
  if (level === "복구완료") return "recovered";
  return "warning";
}

function renderSummaryCards() {
  document.getElementById("alarmSummaryCards").innerHTML = state.summary.cards
    .map(
      (card) => `
        <article class="alarm-summary-card ${card.tone}">
          <i class="bi ${card.icon}"></i>
          <div>
            <span>${card.label}</span>
            <strong>${card.value}</strong>
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
  fillSelect("equipmentFilter", filters.equipments);
  fillSelect("levelFilter", filters.levels);
  fillSelect("statusFilter", filters.statuses);
  fillSelect("ackFilter", filters.acknowledgements);
}

function renderRatioList() {
  document.getElementById("alarmRatioList").innerHTML = state.summary.status_ratio
    .map(
      (item) => `
        <li>
          <span><i class="alarm-dot" style="background:${item.color}"></i>${item.label}</span>
          <strong>${item.count}건</strong>
        </li>
      `
    )
    .join("");
}

function renderRecentAlarms() {
  document.getElementById("recentAlarmList").innerHTML = state.recent
    .map(
      (alarm) => `
        <div class="recent-alarm-item" data-id="${alarm.id}">
          <span>${alarm.occurred_at.slice(11)}</span>
          <strong>${alarm.factory}</strong>
          <span>${alarm.equipment} ${alarm.item}</span>
          <span class="alarm-level ${levelClass(alarm.level)} ${alarm.acknowledged ? "" : "unack"}">${alarm.level}</span>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".recent-alarm-item").forEach((item) => {
    item.addEventListener("click", () => openAlarmDetail(item.dataset.id));
  });
}

function renderAlarmRows() {
  document.getElementById("rowCount").textContent = `${state.filteredRows.length}건`;
  document.getElementById("alarmRows").innerHTML = state.filteredRows
    .map(
      (alarm) => `
        <tr class="${alarm.acknowledged ? "" : "table-warning"}">
          <td>${alarm.occurred_at}</td>
          <td class="factory-name">${alarm.factory}</td>
          <td>${alarm.process}</td>
          <td>${alarm.equipment}</td>
          <td>${alarm.item}</td>
          <td>${alarm.current_value}</td>
          <td>${alarm.threshold}</td>
          <td><span class="alarm-level ${levelClass(alarm.level)} ${alarm.acknowledged ? "" : "unack"}">${alarm.level}</span></td>
          <td>${alarm.status}</td>
          <td>${alarm.ack_owner || "-"}</td>
          <td>${alarm.ack_time || "-"}</td>
          <td>
            <div class="row-actions">
              <button class="btn btn-outline-primary btn-sm" type="button" data-detail="${alarm.id}">상세</button>
              <button class="btn btn-primary btn-sm" type="button" data-ack="${alarm.id}" ${alarm.acknowledged ? "disabled" : ""}>확인</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  document.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => openAlarmDetail(button.dataset.detail));
  });
  document.querySelectorAll("[data-ack]").forEach((button) => {
    button.addEventListener("click", () => openAlarmDetail(button.dataset.ack));
  });
}

function applyFilters() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const factory = document.getElementById("factoryFilter").value;
  const process = document.getElementById("processFilter").value;
  const equipment = document.getElementById("equipmentFilter").value;
  const level = document.getElementById("levelFilter").value;
  const status = document.getElementById("statusFilter").value;
  const ack = document.getElementById("ackFilter").value;

  state.filteredRows = state.rows.filter((row) => {
    const date = row.occurred_at.slice(0, 10);
    const inDateRange = (!startDate || date >= startDate) && (!endDate || date <= endDate);
    const ackMatched =
      ack === "전체" || (ack === "미확인" && !row.acknowledged) || (ack === "확인완료" && row.acknowledged);
    return (
      inDateRange &&
      (factory === "전체" || row.factory === factory) &&
      (process === "전체" || row.process === process) &&
      (equipment === "전체" || row.equipment === equipment) &&
      (level === "전체" || row.level === level) &&
      (status === "전체" || row.status === status) &&
      ackMatched
    );
  });
  renderAlarmRows();
}

function destroyCharts() {
  state.charts.forEach((chart) => chart.destroy());
  state.charts = [];
}

function renderAlarmCharts() {
  destroyCharts();
  if (typeof Chart === "undefined") {
    document.querySelectorAll(".alarm-chart, .alarm-donut-large").forEach((container) => {
      container.innerHTML = '<div class="chart-fallback">Chart.js 로딩 후 차트가 표시됩니다.</div>';
    });
    return;
  }

  const statusChart = new Chart(document.getElementById("alarmStatusChart"), {
    type: "doughnut",
    data: {
      labels: state.summary.status_ratio.map((item) => item.label),
      datasets: [
        {
          data: state.summary.status_ratio.map((item) => item.count),
          backgroundColor: state.summary.status_ratio.map((item) => item.color),
          borderWidth: 0,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { display: false } } },
  });

  const hourlyChart = new Chart(document.getElementById("hourlyAlarmChart"), {
    type: "bar",
    data: {
      labels: state.list.hourly_counts.labels,
      datasets: [
        {
          label: "알람 발생",
          data: state.list.hourly_counts.data,
          backgroundColor: "#1f7affc7",
          borderRadius: 5,
          maxBarThickness: 28,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#e7edf5" } } },
    },
  });

  const equipmentChart = new Chart(document.getElementById("equipmentTopChart"), {
    type: "bar",
    data: {
      labels: state.list.equipment_top5.labels,
      datasets: [
        {
          label: "알람 건수",
          data: state.list.equipment_top5.data,
          backgroundColor: ["#ef3340", "#f3a400", "#7c2d92", "#1f7aff", "#43a83f"],
          borderRadius: 5,
          maxBarThickness: 28,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, grid: { color: "#e7edf5" } }, y: { grid: { display: false } } },
    },
  });

  state.charts.push(statusChart, hourlyChart, equipmentChart);
}

function detailItem(label, value, wide = false) {
  return `<div class="detail-item ${wide ? "wide" : ""}"><span>${label}</span><strong>${value || "-"}</strong></div>`;
}

function openAlarmDetail(id) {
  const alarm = state.rows.find((row) => row.id === id);
  if (!alarm) return;
  state.selectedAlarm = alarm;
  document.getElementById("alarmDetail").innerHTML = [
    detailItem("발생시간", alarm.occurred_at),
    detailItem("복구시간", alarm.recovered_at),
    detailItem("공장", alarm.factory),
    detailItem("공정", alarm.process),
    detailItem("설비", alarm.equipment),
    detailItem("알람 항목", alarm.item),
    detailItem("현재값", alarm.current_value),
    detailItem("기준값", alarm.threshold),
    detailItem("알람 레벨", alarm.level),
    detailItem("알람 메시지", alarm.message, true),
    detailItem("조치 가이드", alarm.guide, true),
    detailItem("확인자", alarm.ack_owner),
    detailItem("확인 메모", alarm.ack_note, true),
  ].join("");
  document.getElementById("ackOwner").value = alarm.ack_owner || "admin";
  document.getElementById("ackNote").value = alarm.ack_note || "";
  document.getElementById("ackButton").disabled = alarm.acknowledged;
  document.getElementById("alarmModal").classList.add("show");
  document.getElementById("alarmModal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.getElementById("alarmModal").classList.remove("show");
  document.getElementById("alarmModal").setAttribute("aria-hidden", "true");
}

function showToast() {
  const toast = document.getElementById("saveToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function bindEvents() {
  document.getElementById("alarmFilterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("alarmFilterForm").reset();
    state.filteredRows = [...state.rows];
    renderAlarmRows();
  });

  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelModal").addEventListener("click", closeModal);
  document.getElementById("alarmModal").addEventListener("click", (event) => {
    if (event.target.id === "alarmModal") closeModal();
  });

  document.getElementById("ackForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedAlarm || state.selectedAlarm.acknowledged) return;
    await acknowledgeAlarm(
      state.selectedAlarm.id,
      document.getElementById("ackOwner").value,
      document.getElementById("ackNote").value
    );
    renderAlarmRows();
    await fetchRecentAlarms();
    renderRecentAlarms();
    closeModal();
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
  await Promise.all([fetchAlarmSummary(), fetchAlarmList(), fetchRecentAlarms()]);
  renderSummaryCards();
  renderFilters();
  renderRatioList();
  renderRecentAlarms();
  renderAlarmRows();
  renderAlarmCharts();
  bindEvents();
}

init().catch((error) => {
  const content = document.querySelector(".alarm-content-page");
  const alert = document.createElement("div");
  alert.className = "alert alert-danger";
  alert.textContent = `알람 현황 데이터를 불러오지 못했습니다. ${error.message}`;
  content.prepend(alert);
});
