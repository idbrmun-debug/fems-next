const FEMS_NAV_ITEMS = [
  { section: "main", label: "메인", href: "./dashboard-main.html", icon: "bi-house-door-fill", match: ["dashboard-main.html", "index.html", ""] },
  { section: "factory", label: "공장별", href: "./factory.html", icon: "bi-grid-3x3-gap-fill", match: ["factory.html"] },
  { section: "equipment", label: "설비 현황", href: "./equipment.html", icon: "bi-building-gear", match: ["equipment.html"] },
  { section: "alarm", label: "알람 현황", href: "./alarm.html", icon: "bi-exclamation-triangle-fill", match: ["alarm.html"] },
  { section: "report", label: "리포트", href: "./report.html", icon: "bi-bar-chart-line-fill", match: ["report.html"] },
  { section: "production", label: "생산량 입력", href: "./production-input.html", icon: "bi-pencil-square", match: ["production-input.html"] },
  { section: "maintenance", label: "유지보수 이력", href: "./maintenance.html", icon: "bi-clipboard2-pulse-fill", match: ["maintenance.html"] },
  { section: "settings", label: "설정", href: "./settings.html", icon: "bi-gear-fill", match: ["settings.html"] },
];

function currentPageName() {
  return window.location.pathname.split("/").pop() || "";
}

function activeSection() {
  const page = currentPageName();
  const item = FEMS_NAV_ITEMS.find((nav) => nav.match.includes(page));
  return item?.section || "main";
}

function renderCommonSidebar() {
  const nav = document.querySelector(".sidebar-nav");
  if (!nav) return;
  const current = activeSection();
  nav.innerHTML = FEMS_NAV_ITEMS.map(
    (item) => `
      <a class="sidebar-link ${item.section === current ? "active" : ""}" href="${item.href}" data-section="${item.section}">
        <i class="bi ${item.icon}"></i>
        <span>${item.label}</span>
      </a>
    `
  ).join("");
}

function renderCommonTopbar() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  topbar.innerHTML = `
    <div>
      <h1><i class="bi bi-lightning-charge-fill"></i> FEMS 전력 모니터링 시스템</h1>
      <span class="system-subtitle">Factory Energy Management System</span>
    </div>
    <div class="topbar-tools">
      <span class="date-time"><i class="bi bi-calendar3"></i><span id="currentTime">-</span></span>
      <span class="refresh-state"><i class="bi bi-arrow-repeat"></i> 자동 갱신</span>
      <select id="refreshInterval" class="form-select form-select-sm" aria-label="새로고침 주기">
        <option value="5">5s</option>
        <option value="10">10s</option>
        <option value="30">30s</option>
        <option value="60">60s</option>
      </select>
      <button class="icon-button" type="button" aria-label="전체 화면">
        <i class="bi bi-fullscreen"></i>
      </button>
    </div>
  `;
}

function initCommonLayout() {
  renderCommonSidebar();
  renderCommonTopbar();
}

initCommonLayout();
