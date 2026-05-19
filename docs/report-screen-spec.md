# 리포트 화면 명세

## 화면 구성

- 파일: `frontend/report.html`
- CSS: `frontend/css/report.css`
- JS: `frontend/js/report.js`
- 공통 UI: 기존 메인 대시보드의 sidebar, topbar, card, table, blue accent 스타일을 재사용한다.
- 좌측 메뉴의 `리포트` 항목은 `report.html`로 이동하며, 리포트 화면에서는 active 처리한다.

## 리포트 유형

- 일간 리포트
- 주간 리포트
- 월간 리포트
- 사용자 지정 기간

조건 영역은 리포트 유형, 기간, 공장, 공정, 설비를 선택하고 조회한다. PDF/Excel 버튼은 현재 toast만 표시하며, 실제 파일 생성은 추후 서버 export 기능에서 구현한다.

## 데이터 구조

현재 화면은 더미 JSON API 응답을 사용한다.

- `/api/report-page/summary`: 핵심 요약 카드, 미리보기 제목/생성일시
- `/api/report-page/power`: 공장별 전력량, 일자별 전력 추이, 시간대별 최대 전력
- `/api/report-page/specific-energy`: 공장별 원단위 실적/목표, 달성률
- `/api/report-page/production`: 공장별 생산량, 일자별 생산량 추이, 입력 누락 현황
- `/api/report-page/alarms`: 알람 유형별 건수, 설비별 Top 5, 미확인 알람 수
- `/api/report-page/detail`: 상세 데이터 테이블

## 추후 API 연동 포인트

- `gems_power` measurement에서 `sum_kwh`, `power_w`를 기간별로 집계한다.
- `production_input` measurement에서 생산량 합계와 입력 누락 현황을 계산한다.
- 전력량 / 생산량으로 원단위 `kWh/ton`을 계산하고 목표 원단위와 비교한다.
- 알람 데이터가 measurement 또는 별도 DB로 확정되면 유형별/설비별 집계 API를 연결한다.
- 조회 조건은 query string으로 전달할 수 있다.
  - 예: `/api/report-page/summary?type=daily&start=2025-05-24&end=2025-05-24&factory=3공장`

## PDF/Excel 내보내기 구현 방향

- PDF: 서버에서 HTML 템플릿을 렌더링한 뒤 Playwright 또는 WeasyPrint 계열 도구로 생성한다.
- Excel: Python `openpyxl`로 상세 데이터, 요약, 차트용 데이터 시트를 구성한다.
- 내보내기 API 예시:
  - `POST /api/report-page/export/pdf`
  - `POST /api/report-page/export/excel`
- 프론트엔드의 `exportReportToPdf()`, `exportReportToExcel()` 함수는 위 API로 교체할 수 있도록 분리되어 있다.
