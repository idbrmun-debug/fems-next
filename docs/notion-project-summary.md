# FEMS Next 프로젝트 요약

## 프로젝트 기본 정보

| 항목 | 내용 |
|---|---|
| 프로젝트명 | FEMS Next |
| 작업 경로 | `D:\fems-next` |
| 기존 운영 프로젝트 | `D:\FEMS` |
| 원칙 | 기존 `D:\FEMS`는 수정하지 않음 |
| OS | Windows 11 |
| 실행 환경 | Docker Desktop, Docker Compose |
| Frontend | HTML, Bootstrap 5, Bootstrap Icons, Chart.js |
| Backend | Flask |
| DB | InfluxDB 2.x |
| Visualization | Grafana |
| Collector | Telegraf |

## 현재 상태 한 줄 요약

FEMS Next는 TIG stack과 Flask backend 기반의 웹 UI prototype이 구축된 상태이며, 주요 화면은 더미 API와 Chart.js 기반으로 동작한다. 실제 장비 통신과 실시간 InfluxDB 조회 전환은 다음 단계 작업이다.

## 구현 완료 화면

| 화면 | 파일 | 상태 | 주요 기능 |
|---|---|---|---|
| 메인 대시보드 | `frontend/dashboard-main.html` | 완료 | 공장별 현황, 전체 요약, 전력/원단위 차트, 생산량/알람 요약 |
| 설비 현황 | `frontend/equipment.html` | 완료 | 설비 카드, 설비 목록, 상세 패널, RTU 필터, Grafana placeholder |
| 공장별 현황 | `frontend/factory.html` | 완료 | 공장 탭, 공장 비교, 공정/피더 drilldown, 목표 대비 실적 |
| 알람 현황 | `frontend/alarm.html` | 완료 | 알람 요약, 이력 테이블, 최근 알람, 상세 modal, 확인 처리 |
| 리포트 | `frontend/report.html` | 완료 | 조건 조회, 리포트 차트, 상세 테이블, PDF/Excel placeholder |
| 생산량 입력 | `frontend/production-input.html` | 완료 | 직접 입력, Excel 업로드 UI, 입력 이력, 샘플 양식 |
| 유지보수 이력 | `frontend/maintenance.html` | 완료 | 이력 테이블, 필터, 등록 modal, 월별/유형별 차트 |
| 설정 | `frontend/settings.html` | 완료 | 설비 Tree, 설비 정보, 알람 설정, 목표 원단위, 연결 계측기 |

## 메뉴 구조

좌측 메뉴는 `frontend/js/common-layout.js`에서 중앙 관리한다.

| 메뉴 | 연결 화면 |
|---|---|
| 메인 | `dashboard-main.html` |
| 설비 현황 | `equipment.html` |
| 공장별 | `factory.html` |
| 알람 현황 | `alarm.html` |
| 리포트 | `report.html` |
| 생산량 입력 | `production-input.html` |
| 유지보수 이력 | `maintenance.html` |
| 설정 | `settings.html` |

## 공통 레이아웃

| 항목 | 구현 방식 |
|---|---|
| Sidebar | `frontend/js/common-layout.js`에서 렌더링 |
| Topbar | `frontend/js/common-layout.js`에서 렌더링 |
| Active 메뉴 | 현재 HTML 파일명 기준 자동 처리 |
| 화면별 CSS | `frontend/css/{screen}.css` |
| 화면별 JS | `frontend/js/{screen}.js` |

현재 각 HTML의 sidebar/topbar markup은 fallback 역할이며, 실제 표시 내용은 공통 JS가 덮어쓴다.

## Docker 구성

| 서비스 | 이미지/빌드 | 포트 | 역할 |
|---|---|---:|---|
| InfluxDB | `influxdb:2.7` | 8086 | 시계열 데이터 저장 |
| Grafana | `grafana/grafana-oss:13.0.1` | 3000 | 대시보드 시각화 |
| Telegraf | `telegraf:1.38.4` | 내부 | 데이터 수집 |
| Backend | `./backend` build | 5000 | Flask API, frontend static serving |

## 접속 URL

| 대상 | URL |
|---|---|
| FEMS Web | `http://127.0.0.1:5000` |
| 메인 대시보드 | `http://127.0.0.1:5000/dashboard-main.html` |
| 설비 현황 | `http://127.0.0.1:5000/equipment.html` |
| 공장별 현황 | `http://127.0.0.1:5000/factory.html` |
| Grafana | `http://127.0.0.1:3000` |
| InfluxDB | `http://127.0.0.1:8086` |

## InfluxDB Schema

### 전력 데이터

| 항목 | 값 |
|---|---|
| bucket | `gems_test` |
| measurement | `gems_power` |

tags:

- `factory`
- `process`
- `meter`
- `feeder`
- `furnace`

fields:

- `avg_v`
- `avg_a`
- `power_w`
- `avg_pf`
- `sum_kwh`

### 추가 measurement

| measurement | 용도 |
|---|---|
| `production_input` | 생산량 직접 입력 및 Excel 업로드 데이터 |
| `maintenance_log` | 유지보수 이력 |

원단위 계산:

```text
원단위(kWh/ton) = 전력량(kWh) / 생산량(ton)
```

## Grafana 구성

| 항목 | 경로/값 |
|---|---|
| datasource provisioning | `grafana/provisioning/datasources/influxdb.yml` |
| dashboard provider | `grafana/provisioning/dashboards/dashboards.yml` |
| 기본 dashboard JSON | `grafana/provisioning/dashboards/json/fems-overview.json` |
| datasource uid | `fems-influxdb` |
| dashboard uid | `fems-overview` |

추후 iframe 연동 후보:

- 메인 대시보드 일부 패널
- 설비 상세 화면
- 공장별 상세 화면
- 리포트 상세 분석 화면

## Flask/API 구조

Flask 진입점:

- `backend/app/main.py`

주요 module:

| 파일 | 역할 |
|---|---|
| `dashboard.py` | 메인 대시보드 API |
| `equipment_screen.py` | 설비 현황 API |
| `factory_screen.py` | 공장별 현황 API |
| `production_dashboard.py` | 생산량 입력 화면 API |
| `settings_screen.py` | 설정 화면 API |
| `maintenance_screen.py` | 유지보수 화면 API |
| `alarm_screen.py` | 알람 화면 API |
| `report_screen.py` | 리포트 화면 API |
| `influx.py` | InfluxDB query/write helper |

## 주요 API

### 메인 대시보드

- `GET /api/dashboard/summary`
- `GET /api/dashboard/factories`
- `GET /api/dashboard/power-trend`
- `GET /api/dashboard/specific-energy-trend`
- `GET /api/dashboard/production-status`
- `GET /api/dashboard/alarms`

### 설비 현황

- `GET /api/equipment-page/summary`
- `GET /api/equipment-page/list`
- `GET /api/equipment-page/detail/<equipment_id>`
- `GET /api/equipment-page/power-trend/<equipment_id>`

### 공장별 현황

- `GET /api/factory-page/summary`
- `GET /api/factory-page/summary/<factory>`
- `GET /api/factory-page/comparison`
- `GET /api/factory-page/process-status`
- `GET /api/factory-page/process-status/<factory>`
- `GET /api/factory-page/feeder-status`
- `GET /api/factory-page/feeder-status/<factory>`
- `GET /api/factory-page/feeder-status/<factory>/<process>`
- `GET /api/factory-page/power-trend`
- `GET /api/factory-page/power-trend/<factory>`
- `GET /api/factory-page/specific-energy-trend`
- `GET /api/factory-page/specific-energy-trend/<factory>`

### 생산량/알람/유지보수/리포트

- `POST /api/production-input`
- `POST /api/production-upload`
- `GET /api/production-page/summary`
- `POST /api/production-page/manual`
- `POST /api/production-page/excel-upload`
- `GET /api/alarm-page/summary`
- `GET /api/alarm-page/list`
- `POST /api/alarm-page/acknowledge`
- `GET /api/maintenance-page/data`
- `POST /api/maintenance-page/save`
- `GET/POST /api/maintenance-log`
- `GET /api/report-page/summary`
- `GET /api/report-page/detail`

## Drilldown 구조

공장별 화면의 피더/라인 상세에서 `상세`를 클릭하면 설비 현황으로 이동한다.

예시:

```text
equipment.html?factory=4공장&process=열처리 공정&furnace=전기로 11&meter=RTU-401
```

설비 현황 화면은 query string을 읽어 다음을 자동 적용한다.

- 공장 필터 선택
- 공정 필터 선택
- RTU ID 검색어 입력
- 해당 RTU 상세 패널 자동 표시

검증:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-factory-equipment-drilldown.ps1
```

## 주요 문서

| 문서 | 내용 |
|---|---|
| `docs/project-progress.md` | 전체 프로젝트 진행 현황 |
| `docs/architecture.md` | 아키텍처 |
| `docs/schema.md` | InfluxDB schema |
| `docs/setup-guide.md` | 실행/설정 가이드 |
| `docs/common-layout.md` | 공통 레이아웃 구조 |
| `docs/equipment-screen-spec.md` | 설비 현황 명세 |
| `docs/factory-screen-spec.md` | 공장별 현황 명세 |
| `docs/report-screen-spec.md` | 리포트 명세 |
| `docs/production-input-spec.md` | 생산량 입력 명세 |
| `docs/maintenance-screen-spec.md` | 유지보수 명세 |
| `docs/alarm-screen-spec.md` | 알람 명세 |
| `docs/settings-screen-spec.md` | 설정 명세 |
| `docs/codex-worklog.md` | Codex 작업 로그 |

## 실행 방법

```powershell
cd D:\fems-next
docker compose up -d --build
docker compose ps
```

Backend/API 확인:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/health
```

## 검증 스크립트

| 스크립트 | 목적 |
|---|---|
| `scripts/verify-influxdb.ps1` | InfluxDB 초기 설정 확인 |
| `scripts/verify-grafana-provisioning.ps1` | Grafana provisioning 확인 |
| `scripts/verify-grafana-dashboard.ps1` | Grafana dashboard 확인 |
| `scripts/verify-telegraf-config.ps1` | Telegraf 설정 확인 |
| `scripts/verify-gems3500-config.ps1` | GEMS3500/RTU 수집 설정 확인 |
| `scripts/verify-production-api.ps1` | 생산량 API 확인 |
| `scripts/verify-ui-api.ps1` | 기본 UI/API 확인 |
| `scripts/verify-factory-equipment-drilldown.ps1` | 공장별 → 설비 현황 drilldown 확인 |

## 향후 구현 예정 기능

### 우선순위 높음

- 더미 API를 실제 InfluxDB Flux 조회로 전환
- 생산량 입력/Excel 업로드 실제 저장 및 조회 강화
- 설비 현황과 공장별 현황 실제 전력 데이터 연동
- Grafana iframe 상세 패널 연동
- 알람 데이터 저장 구조 확정
- 유지보수 이력 실제 조회 연동

### 구조 개선

- HTML에 남아 있는 sidebar/topbar fallback markup 축소
- 화면별 공통 유틸 함수 분리
- 공통 API client 분리
- 화면 회귀 테스트 자동화 확대
- `__pycache__` 등 생성 파일 Git 제외 정리

## Codex 작업 운영 규칙

| 규칙 | 내용 |
|---|---|
| 작업 경로 | `D:\fems-next`에서만 작업 |
| 운영 프로젝트 | `D:\FEMS`는 수정 금지 |
| 변경 방식 | 기존 패턴 우선, 작은 단위 변경 |
| 문서화 | 화면/기능 추가 시 docs 문서 작성 |
| 검증 | JS 문법, Python compile, API 200, 브라우저 DOM 확인 |
| Worklog | 작업 완료 시 `docs/codex-worklog.md`에 append |
| Git | 사용자 변경을 임의로 되돌리지 않음 |

## Git/GitHub 운영 방식

권장 흐름:

```powershell
git status --short
git switch -c codex/<task-name>
git diff --stat
git add <changed-files>
git commit -m "<task summary>"
```

PR 작성 시 포함할 내용:

- 구현 내용
- 변경 파일
- 테스트 결과
- 남은 작업
- 스크린샷 또는 확인 URL

## 다음 액션 제안

1. 실제 InfluxDB Flux 조회 API 전환 범위 선정
2. 메인/설비/공장별 화면 중 우선 연동 화면 결정
3. RTU tag naming convention 확정
4. Grafana dashboard variable 설계
5. 생산량 입력 데이터와 원단위 계산 API 연결
