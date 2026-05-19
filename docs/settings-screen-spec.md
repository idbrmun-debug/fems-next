# Settings Screen Specification

## Purpose

The settings screen manages factory/equipment structure, meter metadata, alarm thresholds, target specific energy, and connected meters.

Current implementation uses dummy Flask JSON responses. No production database or InfluxDB writes are performed.

## Page

```text
http://127.0.0.1:5000/settings.html
```

Frontend files:

```text
frontend/settings.html
frontend/css/settings.css
frontend/js/settings.js
```

## Navigation

The shared sidebar links are organized as:

| Menu | Current target |
| --- | --- |
| 메인 | `dashboard-main.html` |
| 생산량 입력 | `production-input.html` |
| 설정 | `settings.html` |

Other sidebar items are retained as placeholders for future screens.

## Layout

- Left fixed sidebar
- Top status bar
- Breadcrumb: `설정 > 공장/설비 관리`
- Top settings tabs:
  - 공장/설비 관리
  - 계측기 관리
  - 알람 설정
  - 목표 관리
  - 시스템 설정
- Left equipment tree
- Equipment detail form
- Alarm setting table
- Target specific energy panel
- Connected meter table

No separate `시스템 관리` sidebar item is created.

## Dummy API

### Equipment Tree

```http
GET /api/settings-screen/tree
```

Returns factory/process/line/RTU hierarchy and selected node id.

### Equipment Detail

```http
GET /api/settings-screen/equipment-detail
```

Returns:

- meter basic information
- alarm rule rows
- target specific energy
- target history
- connected meters

### Save

```http
POST /api/settings-screen/save
```

Current behavior: returns dummy save success.

## Future API/InfluxDB Integration Points

Recommended backend split:

- `GET /api/settings/equipment-tree`
- `GET /api/settings/equipment/{meter_id}`
- `PUT /api/settings/equipment/{meter_id}`
- `GET /api/settings/equipment/{meter_id}/alarm-rules`
- `PUT /api/settings/equipment/{meter_id}/alarm-rules`
- `GET /api/settings/targets`
- `POST /api/settings/targets`
- `GET /api/settings/connected-meters?parent_meter_id=RTU-301`

Recommended persistence:

- Store equipment/master configuration in a relational table or JSON config store.
- Store target specific energy history in a settings table or dedicated InfluxDB measurement.
- Store alarm rule configuration in a durable config store, not as telemetry.
- Use InfluxDB for measured data and derived KPI history, not primary equipment master data.

Relevant InfluxDB data:

```text
bucket: gems_test
measurement: gems_power
tags: factory, process, meter, feeder, furnace
fields: avg_v, avg_a, power_w, avg_pf, sum_kwh
```
