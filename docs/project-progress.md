# FEMS Next 프로젝트 진행 현황

## 1. 프로젝트 개요

`fems-next`는 Windows 11과 Docker Compose 기반으로 구축 중인 차세대 FEMS 프로토타입이다.

- 작업 경로: `D:\fems-next`
- 기존 운영 프로젝트: `D:\FEMS`
- 원칙: 기존 `D:\FEMS`는 수정하지 않고, 신규 개발은 `D:\fems-next`에서만 수행한다.
- Frontend: HTML, Bootstrap 5, Bootstrap Icons, Chart.js
- Backend: Flask
- Time-series DB: InfluxDB 2.x
- Visualization: Grafana
- Collector: Telegraf

현재 구현은 UI/UX 프로토타입과 더미 API 중심이다. 일부 API는 InfluxDB 쓰기/조회 구조를 갖추고 있으나, 주요 화면 데이터는 아직 실제 장비/InfluxDB 실시간 조회로 전환하지 않았다.

## 2. 현재 구현 완료 화면

현재 구현 완료된 웹 화면은 다음과 같다.

- 메인 대시보드: `frontend/dashboard-main.html`
- 설비 현황: `frontend/equipment.html`
- 공장별 현황: `frontend/factory.html`
- 알람 현황: `frontend/alarm.html`
- 리포트: `frontend/report.html`
- 생산량 입력: `frontend/production-input.html`
- 유지보수 이력: `frontend/maintenance.html`
- 설정: `frontend/settings.html`

각 화면은 기존 SCADA/FEMS 톤앤매너에 맞춰 밝은 테마, 좌측 고정 사이드바, 상단 상태바, 카드형 레이아웃, Chart.js 차트를 사용한다.

## 3. Docker 구성

`docker-compose.yml` 기준 서비스 구성은 다음과 같다.

| 서비스 | 이미지/빌드 | 포트 | 역할 |
|---|---|---:|---|
| `influxdb` | `influxdb:2.7` | `8086` | InfluxDB 2.x 저장소 |
| `grafana` | `grafana/grafana-oss:13.0.1` | `3000` | Grafana 대시보드 |
| `telegraf` | `telegraf:1.38.4` | 내부 | 수집 설정 템플릿 기반 collector |
| `backend` | `./backend` build | `5000` | Flask API 및 frontend static serving |

주요 기본 환경값:

- InfluxDB org: `fems`
- InfluxDB bucket: `gems_test`
- InfluxDB token: `dev-token-change-me`
- Grafana admin user/password: `admin` / `admin`

볼륨:

- `influxdb-data`
- `influxdb-config`
- `grafana-data`

## 4. InfluxDB Schema

주 전력 measurement:

- bucket: `gems_test`
- measurement: `gems_power`

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

추가 measurement:

- `production_input`
- `maintenance_log`

원단위 계산 기준:

```text
원단위(kWh/ton) = 전력량(kWh) / 생산량(ton)
```

관련 Flux 문서:

- `docs/flux/electric-intensity.flux`
- `docs/electric-intensity.md`
- `docs/schema.md`

## 5. 화면 구조

화면은 공통적으로 아래 구조를 사용한다.

```text
dashboard-shell
├─ sidebar
│  └─ sidebar-nav
└─ main-area
   ├─ topbar
   └─ main.content
```

공통 레이아웃은 `frontend/js/common-layout.js`에서 관리한다.

- 메뉴명
- 메뉴 링크
- Bootstrap icon
- active 처리
- 상단 시스템명
- 현재 시간 영역
- 자동 갱신 상태
- 새로고침 주기 select

각 화면은 자체 CSS/JS를 가진다.

```text
frontend/css/{screen}.css
frontend/js/{screen}.js
```

메인 대시보드는 기존 파일명 유지:

```text
frontend/dashboard-main.css
frontend/dashboard-main.js
```

## 6. 메뉴 구조

좌측 메뉴 구조는 `frontend/js/common-layout.js`의 `FEMS_NAV_ITEMS`에서 중앙 관리한다.

| 메뉴 | 파일 |
|---|---|
| 메인 | `dashboard-main.html` |
| 설비 현황 | `equipment.html` |
| 공장별 | `factory.html` |
| 알람 현황 | `alarm.html` |
| 리포트 | `report.html` |
| 생산량 입력 | `production-input.html` |
| 유지보수 이력 | `maintenance.html` |
| 설정 | `settings.html` |

공장별 화면의 피더/라인 상세에서 설비 현황으로 이동하는 drilldown 구조도 준비되어 있다.

예시:

```text
equipment.html?factory=4공장&process=열처리 공정&furnace=전기로 11&meter=RTU-401
```

`equipment.html`은 query string을 읽어 공장/공정 필터와 RTU 상세 패널을 자동 선택한다.

## 7. Flask/API 구조

Flask 진입점:

- `backend/app/main.py`

주요 route module:

- `backend/app/dashboard.py`
- `backend/app/equipment_screen.py`
- `backend/app/factory_screen.py`
- `backend/app/production_dashboard.py`
- `backend/app/settings_screen.py`
- `backend/app/maintenance_screen.py`
- `backend/app/alarm_screen.py`
- `backend/app/report_screen.py`
- `backend/app/production.py`
- `backend/app/maintenance.py`
- `backend/app/influx.py`

주요 API:

메인 대시보드:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/factories`
- `GET /api/dashboard/power-trend`
- `GET /api/dashboard/specific-energy-trend`
- `GET /api/dashboard/production-status`
- `GET /api/dashboard/alarms`

설비 현황:

- `GET /api/equipment-page/summary`
- `GET /api/equipment-page/list`
- `GET /api/equipment-page/detail/<equipment_id>`
- `GET /api/equipment-page/power-trend/<equipment_id>`

공장별:

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

생산량 입력:

- `GET /api/production-page/summary`
- `GET /api/production-page/manual`
- `POST /api/production-page/manual`
- `GET /api/production-page/excel`
- `POST /api/production-page/excel-upload`
- `GET /api/production-page/history`
- `POST /api/production-input`
- `POST /api/production-upload`

설정:

- `GET /api/settings`
- `POST /api/settings`
- `GET /api/settings-screen/tree`
- `GET /api/settings-screen/equipment-detail`
- `POST /api/settings-screen/save`

유지보수:

- `GET /api/maintenance-page/data`
- `POST /api/maintenance-page/save`
- `GET/POST /api/maintenance-log`

알람:

- `GET /api/alarm-page/summary`
- `GET /api/alarm-page/list`
- `GET /api/alarm-page/recent`
- `POST /api/alarm-page/acknowledge`

리포트:

- `GET /api/report-page/summary`
- `GET /api/report-page/power`
- `GET /api/report-page/specific-energy`
- `GET /api/report-page/production`
- `GET /api/report-page/alarms`
- `GET /api/report-page/detail`

기타:

- `GET /api/health`
- `GET /api/electric-intensity`

## 8. 향후 구현 예정 기능

우선순위가 높은 후속 작업은 다음과 같다.

1. 더미 API를 실제 InfluxDB Flux 조회로 전환
   - 메인 대시보드
   - 설비 현황
   - 공장별 현황
   - 리포트

2. 생산량 입력 실제 저장/조회 연동 강화
   - 직접 입력 저장
   - Excel 업로드 파싱
   - `production_input` measurement 집계

3. Grafana iframe 연동
   - 공장별 상세
   - 설비별 상세
   - 메인 대시보드 일부 패널
   - dashboard variable: `factory`, `process`, `meter`, `feeder`, `furnace`

4. 알람 데이터 저장 구조 확정
   - 현재는 더미 상태 변경 중심
   - 추후 알람 measurement 또는 별도 저장소 필요

5. 유지보수 이력 실제 저장/조회 연동
   - `maintenance_log` measurement 기반 조회
   - 설비/공장 화면과 cross-link

6. 공통 레이아웃 추가 정리
   - 현재 `common-layout.js`가 sidebar/topbar를 중앙 렌더링
   - 추후 HTML fallback markup을 placeholder로 축소 가능

7. 화면 회귀 테스트 확대
   - 주요 화면별 DOM/API 검증
   - drilldown 검증 자동화 확대

## 9. 현재 프로젝트 폴더 구조

주요 구조:

```text
D:\fems-next
├─ AGENTS.md
├─ README.md
├─ docker-compose.yml
├─ backend
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ app
│  │  ├─ main.py
│  │  ├─ dashboard.py
│  │  ├─ equipment_screen.py
│  │  ├─ factory_screen.py
│  │  ├─ production_dashboard.py
│  │  ├─ settings_screen.py
│  │  ├─ maintenance_screen.py
│  │  ├─ alarm_screen.py
│  │  ├─ report_screen.py
│  │  ├─ influx.py
│  │  ├─ production.py
│  │  ├─ maintenance.py
│  │  ├─ settings.py
│  │  └─ config_store.py
│  ├─ data
│  │  └─ settings.json
│  └─ tools
│     └─ create_sample_production_excel.py
├─ frontend
│  ├─ dashboard-main.html
│  ├─ equipment.html
│  ├─ factory.html
│  ├─ alarm.html
│  ├─ report.html
│  ├─ production-input.html
│  ├─ maintenance.html
│  ├─ settings.html
│  ├─ css
│  ├─ js
│  │  └─ common-layout.js
│  └─ assets
│     └─ templates
├─ grafana
│  └─ provisioning
│     ├─ dashboards
│     └─ datasources
├─ telegraf
│  ├─ telegraf.conf
│  ├─ gems3500-collection.conf
│  └─ templates
├─ scripts
└─ docs
```

주의:

- `backend/app/__pycache__`는 실행 중 생성되는 Python bytecode 산출물이다.
- 소스 변경 대상이 아니며 Git 관리 대상에서 제외하는 것이 바람직하다.

## 10. 실행 방법

Docker Desktop을 실행한 뒤 `D:\fems-next`에서 실행한다.

```powershell
cd D:\fems-next
docker compose up -d --build
```

서비스 확인:

```powershell
docker compose ps
```

접속 URL:

- FEMS Web/Backend: `http://127.0.0.1:5000`
- 메인 대시보드: `http://127.0.0.1:5000/dashboard-main.html`
- 설비 현황: `http://127.0.0.1:5000/equipment.html`
- 공장별: `http://127.0.0.1:5000/factory.html`
- Grafana: `http://127.0.0.1:3000`
- InfluxDB: `http://127.0.0.1:8086`

주요 검증 스크립트:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-factory-equipment-drilldown.ps1
.\scripts\verify-influxdb.ps1
.\scripts\verify-grafana-provisioning.ps1
.\scripts\verify-grafana-dashboard.ps1
.\scripts\verify-telegraf-config.ps1
```

## 11. Codex 작업 흐름

Codex 작업 시 기본 흐름:

1. `D:\fems-next`에서만 작업한다.
2. 기존 운영 프로젝트 `D:\FEMS`는 수정하지 않는다.
3. 작업 전 관련 파일과 현재 구조를 `rg`, `Get-Content`로 확인한다.
4. 코드 변경은 가능한 한 작은 단위로 수행한다.
5. 화면 추가 시 다음 파일을 함께 만든다.
   - `frontend/{screen}.html`
   - `frontend/css/{screen}.css`
   - `frontend/js/{screen}.js`
   - 필요 시 `backend/app/{screen}_screen.py`
   - 필요 시 `docs/{screen}-screen-spec.md`
6. Docker backend route 변경 시 backend 컨테이너를 재빌드/재시작한다.
7. 검증은 최소한 다음을 수행한다.
   - JS 문법 검사
   - Python compile 검사
   - 정적 파일/API 200 응답 확인
   - 브라우저 DOM 핵심 요소 확인
8. 작업 결과는 변경 파일, 실행 방법, 테스트 방법, 다음 추천 작업으로 정리한다.

공통 레이아웃 관련:

- 메뉴/상단바 변경은 우선 `frontend/js/common-layout.js`를 수정한다.
- 화면별 HTML의 sidebar/topbar markup은 fallback 역할이다.

## 12. Git/GitHub 사용 방식

현재 작업은 로컬 `D:\fems-next` 기준으로 진행한다.

권장 Git 운영 방식:

1. 작업 전 상태 확인

```powershell
git status --short
```

2. 기능 단위 브랜치 생성

```powershell
git switch -c codex/<task-name>
```

3. 변경 범위 확인

```powershell
git diff --stat
git diff
```

4. 검증 후 stage

```powershell
git add <changed-files>
```

5. commit message는 기능 단위로 작성

```powershell
git commit -m "Add factory equipment drilldown verification"
```

6. GitHub 사용 시

- `codex/` prefix 브랜치를 기본으로 사용한다.
- PR은 기능 단위로 작게 생성한다.
- PR 본문에는 구현 내용, 테스트 결과, 남은 작업을 포함한다.

주의:

- 사용자 또는 기존 작업자가 만든 변경을 임의로 되돌리지 않는다.
- `git reset --hard`, `git checkout --` 같은 파괴적 명령은 명시적 요청 없이는 사용하지 않는다.
- `backend/app/__pycache__` 같은 생성 산출물은 커밋 대상에서 제외한다.
