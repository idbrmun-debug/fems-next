# 공장별 현황 화면 명세

## 화면 구성

- 파일: `frontend/factory.html`
- CSS: `frontend/css/factory.css`
- JS: `frontend/js/factory.js`
- 기존 화면의 sidebar, topbar, panel, table, blue accent 스타일을 재사용한다.
- 좌측 메뉴의 `공장별` 항목은 `factory.html`로 이동하며, 해당 화면에서는 active 처리한다.

## 공장/공정/피더 drilldown 구조

1. 공장 선택 탭 또는 공장 비교 카드를 클릭한다.
2. `updateFactoryView(factory)`가 선택 공장 기준으로 요약, 공장 비교, 공정 테이블, 피더 테이블, 차트를 갱신한다.
3. 공정별 현황 테이블의 행을 클릭하면 `fetchFeederStatus(factory, process)`로 피더/라인 상세가 해당 공정 기준으로 필터링된다.
4. 피더/라인별 상세의 `상세` 링크는 설비 현황 화면으로 이동할 수 있는 query string 구조를 준비한다.

예시:

```text
equipment.html?factory=3공장&process=압출 공정&furnace=압출 메인계측기&meter=RTU-301
```

## 데이터 구조

현재는 Flask 더미 JSON API를 사용한다.

- `/api/factory-page/summary`
- `/api/factory-page/summary/<factory>`
- `/api/factory-page/comparison`
- `/api/factory-page/process-status`
- `/api/factory-page/process-status/<factory>`
- `/api/factory-page/feeder-status`
- `/api/factory-page/feeder-status/<factory>`
- `/api/factory-page/feeder-status/<factory>/<process>`
- `/api/factory-page/power-trend`
- `/api/factory-page/power-trend/<factory>`
- `/api/factory-page/specific-energy-trend`
- `/api/factory-page/specific-energy-trend/<factory>`

계측기 표기는 `RTU` 기준으로 통일한다.

## 원단위 계산 기준

원단위는 전력량을 생산량으로 나누어 계산한다.

```text
원단위(kWh/ton) = 금일 전력량(kWh) / 금일 생산량(ton)
```

목표 원단위 대비 달성률은 현재 원단위가 목표 이하일수록 양호한 방식으로 표시한다.

```text
달성률(%) = 목표 원단위 / 현재 원단위 * 100
```

## InfluxDB 연동 기준

전력 데이터 구조:

- bucket: `gems_test`
- measurement: `gems_power`
- tags: `factory`, `process`, `meter`, `feeder`, `furnace`
- fields: `avg_v`, `avg_a`, `power_w`, `avg_pf`, `sum_kwh`

생산량은 `production_input` measurement를 기준으로 공장/공정 단위 집계한다.

## 추후 API 연동 포인트

프론트엔드 함수는 실제 API 교체를 고려해 분리되어 있다.

- `fetchFactorySummary(factory)`
- `fetchFactoryComparison()`
- `fetchProcessStatus(factory)`
- `fetchFeederStatus(factory, process)`
- `fetchFactoryPowerTrend(factory)`
- `fetchFactorySpecificEnergyTrend(factory)`
- `renderFactoryCards()`
- `renderFactoryCharts()`
- `renderProcessTable()`
- `renderFeederTable()`
- `updateFactoryView(factory)`

실제 구현 시 Flux query에서 `factory`, `process`, `feeder`, `meter`, `furnace` tag 조건을 조합해 조회한다.
