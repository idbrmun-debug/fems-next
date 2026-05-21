const transferHistory = [
  {
    time: "2026-05-21 09:00:00",
    type: "수동",
    target: "gems_power",
    count: 24,
    result: "준비중",
    message: "k-FEMS API 명세 확정 후 전송 가능",
  },
  {
    time: "2026-05-20 17:30:00",
    type: "점검",
    target: "production_input",
    count: 3,
    result: "검토",
    message: "생산량 코드 매핑 필요",
  },
];

function formatNow() {
  return new Date().toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function updateClock() {
  const currentTime = document.getElementById("currentTime");
  if (currentTime) {
    currentTime.textContent = formatNow();
  }
}

function renderTransferHistory() {
  const tbody = document.getElementById("kfemsHistoryBody");
  if (!tbody) return;

  tbody.innerHTML = transferHistory.map((item) => `
    <tr>
      <td>${item.time}</td>
      <td>${item.type}</td>
      <td>${item.target}</td>
      <td>${item.count}</td>
      <td><span class="status-badge pending">${item.result}</span></td>
      <td>${item.message}</td>
    </tr>
  `).join("");
}

function showToast(message) {
  const toastElement = document.getElementById("kfemsToast");
  if (!toastElement || !window.bootstrap) {
    alert(message);
    return;
  }

  toastElement.querySelector(".toast-body").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

function bindKfemsActions() {
  document.getElementById("saveKfemsConfig")?.addEventListener("click", () => {
    showToast("k-FEMS 연동 설정 샘플이 저장되었습니다.");
  });

  document.getElementById("sendSamplePayload")?.addEventListener("click", () => {
    transferHistory.unshift({
      time: formatNow(),
      type: "샘플",
      target: "gems_power",
      count: 1,
      result: "준비중",
      message: "실제 전송은 k-FEMS API 확정 후 연결됩니다.",
    });
    renderTransferHistory();
    showToast("k-FEMS 샘플 전송 이력이 추가되었습니다.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  renderTransferHistory();
  bindKfemsActions();
});
