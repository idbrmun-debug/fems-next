# 설비 현황 화면 명세

## 화면 구성

- 파일: `frontend/equipment.html`
- CSS: `frontend/css/equipment.css`
- JS: `frontend/js/equipment.js`
- 기존 FEMS 웹 화면의 sidebar, topbar, panel, table, blue accent 스타일을 재사용한다.
- 좌측 메뉴의 `설비 현황` 항목은 `equipment.html`로 이동하며, 해당 화면에서는 active 처리한다.

## 설비 상태 정의

- `가동`: 전력 데이터가 정상 수집되고 설비가 운전 중인 상태
- `정지`: 통신은 정상이나 전력/전류가 0 또는 정지 이벤트가 발생한 상태
- `경고`: 전압, 전류, 역률, 전력 등 임계값 경고가 발생한 상태
- `통신이상`: RTU 통신 응답 지연, Timeout, Modbus TCP 접속 실패 상태

계측기 표기는 `GEMS3500`이 아니라 `RTU` 기준으로 통일한다.

## 데이터 구조

현재는 Flask 더미 JSON API를 사용한다.

- `/api/equipment-page/summary`
  - 전체 설비 수, 가동 설비 수, 정지 설비 수, 통신 이상 설비 수, 평균 가동률
- `/api/equipment-page/list`
  - 설비 목록, 필터 옵션, 차트용 집계 데이터
- `/api/equipment-page/detail/<equipment_id>`
  - 설비 기본 정보, 실시간 전기 지표, 최근 알람, 최근 유지보수 이력
- `/api/equipment-page/power-trend/<equipment_id>`
  - 설비별 전력 추이 샘플 데이터

## InfluxDB 연동 기준

전력 데이터는 아래 구조를 기준으로 조회한다.

- bucket: `gems_test`
- measurement: `gems_power`
- tags: `factory`, `process`, `meter`, `feeder`, `furnace`
- fields: `avg_v`, `avg_a`, `power_w`, `avg_pf`, `sum_kwh`

설비 카드와 목록은 `meter` 또는 RTU ID를 기준으로 최근 값을 조회한다. 금일/금월 전력량은 `sum_kwh`의 기간 차분 또는 누적 집계로 계산한다.

## Grafana 상세화면 연동 포인트

현재 상세 패널의 Grafana 영역은 placeholder다. 추후 iframe으로 교체할 때는 dashboard variable을 URL에 전달한다.

예시:

```text
http://127.0.0.1:3000/d/equipment-detail/equipment-detail?var-meter=RTU-301&var-factory=3공장&var-feeder=메인 피더
```

## 화면 간 query string 연동

`factory.html`의 피더/라인 상세 테이블에서 `상세` 링크를 클릭하면 `equipment.html`로 이동하면서 조건을 query string으로 전달한다.

예시:

```text
equipment.html?factory=3공장&process=압출 공정&furnace=압출 메인계측기&meter=RTU-301
```

`equipment.html`은 초기 로딩 시 query string을 읽어 다음 동작을 수행한다.

- `factory` 값이 있으면 공장 필터를 자동 선택한다.
- `process` 값이 있으면 공정 필터를 자동 선택한다.
- `meter` 값이 있으면 검색어에 RTU ID를 넣고 해당 설비 상세를 자동 표시한다.
- `meter`가 없고 `furnace` 값이 있으면 설비명 기준 검색어로 사용한다.

Grafana 패널 후보:

- 설비별 전력 추이
- 전압/전류/역률 추이
- 금일/금월 누적 전력량
- RTU 통신 상태
- 최근 알람 및 유지보수 이벤트

## 추후 API 연동 포인트

프론트엔드 함수는 실제 API 교체를 고려해 분리되어 있다.

- `fetchEquipmentSummary()`
- `fetchEquipmentList()`
- `fetchEquipmentDetail(equipmentId)`
- `fetchEquipmentPowerTrend(equipmentId)`
- `renderEquipmentCards()`
- `renderEquipmentTable()`
- `renderEquipmentCharts()`
- `updateEquipmentDetail(equipmentId)`

실제 구현 시 조회 조건은 query string으로 전달한다.

```text
/api/equipment-page/list?factory=3공장&process=압출 공정&status=가동&type=RTU&keyword=RTU-301
```
