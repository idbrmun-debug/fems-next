# Codex Worklog

## 2026-05-21 최근 업데이트

### 작업 일시

- 2026-05-20 ~ 2026-05-21

### 요청 내용 요약

- 메인 화면의 `전력량 추이`와 `원단위 추이`에서 `1시간 / 일간 / 월간` 샘플 화면 표시
- 설정 화면의 `+ 설비 추가` 및 `연결 계측기 추가` 샘플 화면 작성
- 유지보수 화면 하단 관리 메뉴의 편집 버튼 클릭 시 편집 화면 샘플 작성
- 메인 화면 `원단위 추이` 그래프의 x축 라벨을 선택 기간과 일치하도록 수정
- 메인 화면에서 `공장별 종합 현황`과 `전체 요약`의 위치 변경
- 위 작업 내용을 `docs/codex-worklog.md`에 업데이트

### 변경 파일

- `frontend/dashboard-main.html`
- `frontend/dashboard-main.css`
- `frontend/dashboard-main.js`
- `frontend/settings.html`
- `frontend/css/settings.css`
- `frontend/js/settings.js`
- `frontend/js/maintenance.js`
- `docs/screenshots/dashboard-trend-hour.png`
- `docs/screenshots/dashboard-trend-day.png`
- `docs/screenshots/dashboard-trend-month.png`
- `docs/screenshots/settings-equipment-add.png`
- `docs/screenshots/settings-connected-meter-add.png`
- `docs/screenshots/maintenance-edit-modal.png`
- `docs/codex-worklog.md`

### 구현 기능

- 메인 화면 차트 기간 버튼에 `data-chart` 구분값 추가
- `전력량 추이`와 `원단위 추이` 차트의 `1시간 / 일간 / 월간` 샘플 데이터 전환 기능 추가
- `원단위 추이` 그래프의 x축 라벨을 `selectedSpecificTrend.labels` 기준으로 변경
- `1시간` 선택 시 시간대 라벨, `일간` 선택 시 일자 라벨, `월간` 선택 시 월 라벨이 표시되도록 수정
- 설정 화면에 `설비 추가` modal 추가
- 설정 화면에 `연결 계측기 추가` modal 추가
- 설정 modal 저장 시 더미 데이터 기준으로 화면에 샘플 행/노드가 추가되도록 처리
- 유지보수 이력 테이블의 편집 버튼 클릭 시 기존 행 데이터가 입력된 편집 modal 표시
- 유지보수 편집 저장 시 해당 행 데이터가 프론트엔드 상태에서 갱신되도록 처리
- 메인 상단 레이아웃을 `전체 요약` 왼쪽, `공장별 종합 현황` 오른쪽으로 변경
- 상단 그리드 비율을 `전체 요약 1fr / 공장별 종합 현황 2fr`로 조정

### 검증 결과

- `frontend/dashboard-main.js`, `frontend/js/settings.js`, `frontend/js/maintenance.js` 문법 검사 통과
- 브라우저에서 메인 차트 기간 버튼 동작 확인
- 브라우저에서 설정 `설비 추가` modal 표시 확인
- 브라우저에서 설정 `연결 계측기 추가` modal 표시 확인
- 브라우저에서 유지보수 이력 편집 modal 표시 및 기존 데이터 채움 확인
- 요청 화면별 샘플 스크린샷 생성 확인
- `docker compose ps` 기준 backend, grafana, influxdb, telegraf 실행 상태 확인

## 기준 정보

| 항목 | 내용 |
|---|---|
| 프로젝트 | FEMS Next |
| 작업 경로 | `D:\fems-next` |
| 기존 운영 프로젝트 | `D:\FEMS` |
| 원칙 | 기존 `D:\FEMS`는 수정하지 않음 |
| 현재 기준일 | 2026-05-20 |
| 실행 환경 | Windows 11, Docker Desktop, Docker Compose |
| 주요 stack | Flask, HTML, Bootstrap 5, Chart.js, InfluxDB 2.x, Grafana, Telegraf |

## 작업 순서

| 순서 | 작업 | 요약 |
|---:|---|---|
| 1 | 프로젝트 scaffold | `D:\fems-next` 구조 생성, Docker Compose, README, architecture 문서, backend/frontend scaffold 구성 |
| 2 | Docker Compose 실행 테스트 | InfluxDB, Grafana, Telegraf, Flask backend 기동 및 포트 확인 |
| 3 | InfluxDB 초기 설정 | org/bucket/token 기준 정리, `gems_test` bucket 기준 설정 |
| 4 | Grafana provisioning | InfluxDB datasource, dashboard provider, 기본 dashboard JSON 구성 |
| 5 | Telegraf 설정 | 기본 `telegraf.conf`, GEMS3500/RTU 수집 템플릿 및 예시 설정 작성 |
| 6 | 샘플 데이터/Flux | 샘플 데이터 입력 스크립트, 원단위 계산 Flux 문서 작성 |
| 7 | 메인 대시보드 | 이미지 참고 기반 FEMS 메인 대시보드 UI prototype 구현 |
| 8 | 메인 더미 데이터 API 분리 | dashboard JS 내부 데이터를 Flask `/api/dashboard/*` 응답으로 분리 |
| 9 | 생산량 입력 화면 | 직접 입력, Excel 업로드, 입력 이력, 샘플 양식 구현 |
| 10 | 설정 화면 | 설비 Tree, 설비 정보, 알람 설정, 목표 원단위, 연결 계측기 테이블 구현 |
| 11 | 유지보수 이력 화면 | 유지보수 요약, 필터, 이력 테이블, 등록 modal, 차트 구현 |
| 12 | 알람 현황 화면 | 알람 요약, 이력, 최근 알람, 상세 modal, 확인 처리 구현 |
| 13 | 리포트 화면 | 조건 조회, 요약 카드, 전력/원단위/생산량/알람 리포트 구현 |
| 14 | 설비 현황 화면 | RTU 기준 설비 카드/테이블/상세 패널/차트 구현 |
| 15 | 공장별 현황 화면 | 공장 탭, 공장 비교, 공정/피더 drilldown, 목표 대비 실적 구현 |
| 16 | Drilldown 연동 | `factory.html` 피더 상세에서 `equipment.html` query string 자동 필터/상세 선택 구현 |
| 17 | 공통 레이아웃 분리 | `common-layout.js`로 sidebar/topbar 중앙 관리 시작 |
| 18 | 프로젝트 문서 정리 | `project-progress.md`, `notion-project-summary.md`, worklog 정리 |

## 요청 내용 요약

초기 요청은 TIG stack 기반 FEMS 신규 개발 프로젝트 scaffold 생성이었다. 이후 단계적으로 Docker 실행, InfluxDB/Grafana/Telegraf 설정, Flask backend, 생산량 입력, Excel 업로드, 원단위 계산, 설정, 유지보수, 알람, 리포트, 설비 현황, 공장별 현황 화면 구현으로 확장되었다.

주요 요구 조건:

- 기존 `D:\FEMS`는 수정하지 않는다.
- 신규 개발은 `D:\fems-next`에서만 진행한다.
- Docker Compose 기반으로 실행한다.
- 기본 포트는 Grafana `3000`, InfluxDB `8086`, Backend API `5000`을 사용한다.
- 실제 장비 통신은 아직 구현하지 않는다.
- UI prototype과 더미 API를 먼저 완성한다.
- 계측기 표기는 GEMS3500이 아니라 RTU 기준으로 통일한다.
- 작업 완료 시마다 `docs/codex-worklog.md`에 append한다.

## 구현 화면 목록

| 화면 | 파일 | 구현 상태 |
|---|---|---|
| 메인 대시보드 | `frontend/dashboard-main.html` | 완료 |
| 설비 현황 | `frontend/equipment.html` | 완료 |
| 공장별 현황 | `frontend/factory.html` | 완료 |
| 알람 현황 | `frontend/alarm.html` | 완료 |
| 리포트 | `frontend/report.html` | 완료 |
| 생산량 입력 | `frontend/production-input.html` | 완료 |
| 유지보수 이력 | `frontend/maintenance.html` | 완료 |
| 설정 | `frontend/settings.html` | 완료 |

## 생성 파일 목록

### Backend

- `backend/Dockerfile`
- `backend/requirements.txt`
- `backend/app/main.py`
- `backend/app/dashboard.py`
- `backend/app/equipment_screen.py`
- `backend/app/factory_screen.py`
- `backend/app/production_dashboard.py`
- `backend/app/settings_screen.py`
- `backend/app/maintenance_screen.py`
- `backend/app/alarm_screen.py`
- `backend/app/report_screen.py`
- `backend/app/influx.py`
- `backend/app/production.py`
- `backend/app/maintenance.py`
- `backend/app/settings.py`
- `backend/app/config_store.py`
- `backend/data/settings.json`
- `backend/tools/create_sample_production_excel.py`

### Frontend

- `frontend/dashboard-main.html`
- `frontend/dashboard-main.css`
- `frontend/dashboard-main.js`
- `frontend/equipment.html`
- `frontend/factory.html`
- `frontend/alarm.html`
- `frontend/report.html`
- `frontend/production-input.html`
- `frontend/maintenance.html`
- `frontend/settings.html`
- `frontend/css/equipment.css`
- `frontend/css/factory.css`
- `frontend/css/alarm.css`
- `frontend/css/report.css`
- `frontend/css/production-input.css`
- `frontend/css/maintenance.css`
- `frontend/css/settings.css`
- `frontend/js/common-layout.js`
- `frontend/js/equipment.js`
- `frontend/js/factory.js`
- `frontend/js/alarm.js`
- `frontend/js/report.js`
- `frontend/js/production-input.js`
- `frontend/js/maintenance.js`
- `frontend/js/settings.js`
- `frontend/assets/templates/production-input-template.xlsx`

### Docker/Grafana/Telegraf

- `docker-compose.yml`
- `grafana/provisioning/datasources/influxdb.yml`
- `grafana/provisioning/dashboards/dashboards.yml`
- `grafana/provisioning/dashboards/json/fems-overview.json`
- `telegraf/telegraf.conf`
- `telegraf/gems3500-collection.conf`
- `telegraf/templates/gems3500-modbus.example.conf`

### Scripts

- `scripts/write-sample-data.ps1`
- `scripts/verify-influxdb.ps1`
- `scripts/verify-grafana-provisioning.ps1`
- `scripts/verify-grafana-dashboard.ps1`
- `scripts/verify-gems3500-config.ps1`
- `scripts/verify-telegraf-config.ps1`
- `scripts/verify-sample-data.ps1`
- `scripts/verify-production-api.ps1`
- `scripts/verify-ui-api.ps1`
- `scripts/verify-factory-equipment-drilldown.ps1`

### Docs

- `docs/architecture.md`
- `docs/setup-guide.md`
- `docs/schema.md`
- `docs/dashboard-plan.md`
- `docs/backend-api.md`
- `docs/influxdb-initial-setup.md`
- `docs/grafana-provisioning.md`
- `docs/grafana-dashboard.md`
- `docs/telegraf-template.md`
- `docs/electric-intensity.md`
- `docs/flux/electric-intensity.flux`
- `docs/production-input-spec.md`
- `docs/settings-screen-spec.md`
- `docs/maintenance-screen-spec.md`
- `docs/alarm-screen-spec.md`
- `docs/report-screen-spec.md`
- `docs/equipment-screen-spec.md`
- `docs/factory-screen-spec.md`
- `docs/common-layout.md`
- `docs/project-progress.md`
- `docs/notion-project-summary.md`
- `docs/codex-worklog.md`

## 수정 파일 목록

현재까지 반복적으로 수정된 핵심 파일:

- `README.md`
- `docker-compose.yml`
- `backend/app/main.py`
- `frontend/dashboard-main.html`
- `frontend/dashboard-main.js`
- `frontend/equipment.html`
- `frontend/js/equipment.js`
- `frontend/factory.html`
- `frontend/js/factory.js`
- `frontend/alarm.html`
- `frontend/report.html`
- `frontend/production-input.html`
- `frontend/maintenance.html`
- `frontend/settings.html`
- `docs/equipment-screen-spec.md`
- `docs/codex-worklog.md`

비고:

- `backend/app/__pycache__`는 Python 실행 중 생성되는 bytecode 산출물이며 소스 변경 대상이 아니다.
- Git 관리에서는 `__pycache__` 제외가 필요하다.

## 현재 메뉴 구조

메뉴는 `frontend/js/common-layout.js`에서 중앙 관리한다.

| 메뉴 | 화면 |
|---|---|
| 메인 | `dashboard-main.html` |
| 설비 현황 | `equipment.html` |
| 공장별 | `factory.html` |
| 알람 현황 | `alarm.html` |
| 리포트 | `report.html` |
| 생산량 입력 | `production-input.html` |
| 유지보수 이력 | `maintenance.html` |
| 설정 | `settings.html` |

## 현재 구현 상태

### 완료

- Docker Compose 기반 실행 구조
- InfluxDB 2.7, Grafana 13.0.1, Telegraf 1.38.4 버전 고정
- Flask backend와 frontend static serving
- 주요 8개 화면 prototype 구현
- 화면별 더미 Flask API 구현
- 생산량 직접 입력 UI
- Excel 업로드 UI 및 샘플 양식
- 유지보수 이력 등록 modal
- 알람 상세/확인 처리 UI
- 리포트 화면과 export placeholder
- 설비 현황 query string 자동 필터
- 공장별 → 설비 현황 drilldown 구조
- Grafana provisioning 기본 구조
- Telegraf/GEMS3500/RTU 수집 설정 템플릿
- 주요 문서 정리
- Notion용 프로젝트 요약 문서

### 부분 구현

- `production_input`, `maintenance_log` 일부 write API 구조
- `/api/electric-intensity` Flux 기반 계산 API
- Grafana dashboard provisioning
- 검증 스크립트 일부

### 미구현

- 실제 GEMS3500/RTU 장비 통신
- Telegraf 실제 현장 수집 검증
- 주요 화면의 실시간 InfluxDB 조회 전환
- Grafana iframe 실연동
- 알람 데이터 실제 저장 구조
- 사용자 인증/권한
- PDF/Excel 실제 export 생성
- 배포용 운영 설정

## 현재 Docker 구성

| 서비스 | 이미지/빌드 | 포트 |
|---|---|---:|
| InfluxDB | `influxdb:2.7` | 8086 |
| Grafana | `grafana/grafana-oss:13.0.1` | 3000 |
| Telegraf | `telegraf:1.38.4` | 내부 |
| Backend | `./backend` build | 5000 |

## 현재 InfluxDB Schema

bucket:

- `gems_test`

measurement:

- `gems_power`

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

## 현재 Drilldown 구조

공장별 화면에서 설비 상세로 이동:

```text
factory.html
  → equipment.html?factory=4공장&process=열처리 공정&furnace=전기로 11&meter=RTU-401
```

`equipment.html`은 query string을 읽어 다음을 자동 수행한다.

- 공장 필터 선택
- 공정 필터 선택
- RTU ID 검색어 입력
- 해당 RTU 상세 패널 표시

검증 스크립트:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-factory-equipment-drilldown.ps1
```

## 다음 추천 작업

1. `.gitignore` 정리
   - `backend/app/__pycache__`
   - `.pyc`
   - 임시 파일

2. 더미 API를 실제 InfluxDB Flux 조회로 전환
   - 1순위: 설비 현황
   - 2순위: 공장별 현황
   - 3순위: 메인 대시보드

3. 생산량 데이터 실제 연동 강화
   - 직접 입력 저장 확인
   - Excel 파싱 저장
   - 원단위 계산에 `production_input` 반영

4. Grafana iframe 연동
   - 설비 상세 dashboard
   - 공장별 dashboard
   - dashboard variable 설계

5. 공통 레이아웃 2차 정리
   - HTML에 남아 있는 sidebar/topbar fallback markup을 placeholder로 축소
   - 공통 API client 분리

6. 테스트 자동화 확대
   - 주요 화면 static/API/DOM 검증 통합 스크립트
   - drilldown 회귀 테스트 확대

## Append 운영 규칙

앞으로 작업 완료 시마다 이 파일 하단에 아래 형식으로 append한다.

```markdown
## YYYY-MM-DD 작업 로그

### 작업 일시

- YYYY-MM-DD HH:mm

### 요청 내용 요약

- ...

### 변경 파일

- ...

### 구현 기능

- ...

### 검증 결과

- ...
```

## 2026-05-20 작업 로그

### 작업 일시

- 2026-05-20

### 요청 내용 요약

- 현재까지의 작업 내용을 기반으로 `docs/codex-worklog.md`를 생성 및 정리
- 포함 항목: 작업 순서, 요청 내용 요약, 구현 화면 목록, 생성 파일 목록, 수정 파일 목록, 현재 메뉴 구조, 현재 구현 상태, 다음 추천 작업
- 앞으로 작업 완료 시마다 append 방식 자동 업데이트 요청

### 변경 파일

- `docs/codex-worklog.md`

### 구현 기능

- 누적 작업 순서 정리
- 요청 흐름 요약
- 구현 완료 화면 목록 정리
- 생성/수정 파일 목록 정리
- 현재 메뉴 구조 정리
- 현재 구현 상태와 미구현 항목 정리
- 다음 추천 작업 정리
- 향후 append 운영 규칙 명시

### 검증 결과

- 문서 파일 생성/정리 완료
- 요청된 포함 항목 반영 완료

## 2026-05-20 작업 로그

### 작업 일시

- 2026-05-20

### 요청 내용 요약

- Docker 기동 시 `fems-next` 프로젝트 컨테이너들이 자동으로 시작되도록 수정 요청

### 변경 파일

- `docker-compose.yml`
- `docs/codex-worklog.md`

### 구현 기능

- `influxdb`, `grafana`, `telegraf`, `backend` 서비스에 `restart: unless-stopped` 추가
- Docker Desktop 또는 Docker daemon 재시작 시, 사용자가 명시적으로 중지하지 않은 컨테이너가 자동 재시작되도록 설정

### 검증 결과

- `docker compose config` 통과
- `docker compose up -d`로 현재 컨테이너에 restart policy 반영
- `docker compose ps`로 4개 서비스 정상 기동 확인
- backend health API `200` 응답 확인
- `docker inspect`로 4개 컨테이너 모두 `RestartPolicy.Name=unless-stopped` 확인
## 2026-05-20 작업 로그

### 작업 일시

- 2026-05-20

### 요청 내용 요약

- 좌측 탭에서 `설비 현황`과 `공장별` 메뉴 순서 변경
- 메인 화면 우측 `상세 보기` 클릭 시 `공장별` 화면으로 이동
- 주간 리포트 PDF 샘플 파일 생성

### 변경 파일

- `frontend/js/common-layout.js`
- `frontend/dashboard-main.html`
- `docs/samples/weekly-report-sample.pdf`
- `docs/codex-worklog.md`

### 구현 기능

- 공통 사이드바 메뉴 순서를 `메인 > 공장별 > 설비 현황 > 알람 현황 > 리포트 > 생산량 입력 > 유지보수 이력 > 설정`으로 변경
- 메인 대시보드 우측 전체 요약 카드의 `상세 보기` 링크를 `factory.html`로 연결
- `docs/samples/weekly-report-sample.pdf` 주간 리포트 샘플 생성

### 검증 결과

- `node --check frontend/js/common-layout.js` 통과
- 브라우저에서 메인 화면 사이드바 순서와 active 상태 확인
- 브라우저에서 메인 화면 `상세 보기` 클릭 시 `http://127.0.0.1:5000/factory.html` 이동 확인
- PDF 샘플 파일 생성 및 파일 크기 확인

## 2026-05-20 작업 로그

### 작업 일시

- 2026-05-20

### 요청 내용 요약

- 주간 리포트 PDF 샘플의 한글이 `??`로 표시되는 문제 수정
- PDF 내용을 한글로 다시 작성

### 변경 파일

- `scripts/generate-weekly-report-sample.py`
- `docs/samples/weekly-report-sample.pdf`
- `docs/samples/weekly-report-sample-preview.png`
- `docs/codex-worklog.md`

### 구현 기능

- 한글 폰트가 안정적으로 적용되도록 주간 리포트 PDF 생성 스크립트 추가
- 기존 PDF 샘플을 한글 정상 표시 버전으로 재생성
- PDF 검증용 PNG 미리보기 파일 생성

### 검증 결과

- `scripts/generate-weekly-report-sample.py` 실행 성공
- `docs/samples/weekly-report-sample-preview.png`에서 한글 정상 표시 확인
- `docs/samples/weekly-report-sample.pdf` 파일 재생성 및 파일 크기 확인

## 2026-05-20 작업 로그

### 작업 일시

- 2026-05-20

### 요청 내용 요약

- 주간 리포트 샘플을 Excel 파일로도 생성

### 변경 파일

- `scripts/generate-weekly-report-sample-xlsx.mjs`
- `docs/samples/weekly-report-sample.xlsx`
- `docs/samples/weekly-report-sample-xlsx-preview.png`
- `docs/codex-worklog.md`

### 구현 기능

- `요약`, `공장별 실적`, `알람 요약`, `차트 데이터` 시트로 구성된 Excel 주간 리포트 샘플 생성
- 핵심 요약, 공장별 주간 실적, 운영 메모, 전력량 추이 차트, 알람 유형별 발생 건수 차트 포함
- PDF 샘플과 동일한 기준 수치 적용

### 검증 결과

- Excel 파일 열기 검증: 시트 4개 확인
- `요약` 시트 제목 `FEMS 주간 리포트 샘플` 확인
- `요약` 시트 차트 2개 포함 확인
- Excel 미리보기 PNG에서 한글 및 차트 표시 확인
