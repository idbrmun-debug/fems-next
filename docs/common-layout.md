# 공통 레이아웃 구조

## 목적

화면별 HTML에 반복되던 sidebar/topbar 메뉴명, 링크, active 처리를 `frontend/js/common-layout.js`에서 중앙 관리한다.

## 적용 화면

- `frontend/dashboard-main.html`
- `frontend/equipment.html`
- `frontend/factory.html`
- `frontend/alarm.html`
- `frontend/report.html`
- `frontend/production-input.html`
- `frontend/maintenance.html`
- `frontend/settings.html`

각 화면은 페이지 전용 JS보다 먼저 아래 스크립트를 로드한다.

```html
<script src="./js/common-layout.js"></script>
```

## 관리 대상

`frontend/js/common-layout.js`의 `FEMS_NAV_ITEMS`에서 아래 항목을 관리한다.

- 메뉴 표시명
- 이동 URL
- Bootstrap icon class
- 현재 페이지별 active 매칭

topbar의 시스템명, 현재 시간 영역, 자동 갱신 표시, 새로고침 주기 select, 전체 화면 버튼도 같은 파일에서 렌더링한다.

## 변경 방법

새 메뉴를 추가하거나 링크를 변경할 때는 우선 `FEMS_NAV_ITEMS`를 수정한다.  
화면별 HTML의 기존 sidebar/topbar markup은 초기 렌더 fallback 역할만 하며, 실제 표시 내용은 공통 JS가 덮어쓴다.
