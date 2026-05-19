# Maintenance Screen Specification

## Purpose

The maintenance screen provides operator-facing maintenance history lookup, filtering, registration, and summary visualization.

Current implementation uses dummy Flask JSON responses and frontend-only filtering. It does not write to InfluxDB or any production database.

## Page

```text
http://127.0.0.1:5000/maintenance.html
```

Frontend files:

```text
frontend/maintenance.html
frontend/css/maintenance.css
frontend/js/maintenance.js
```

## Screen Structure

### Summary Cards

- 금월 유지보수 건수
- 예방정비 건수
- 고장정비 건수
- 총 정지시간
- 총 비용

### Filters

- 시작일 / 종료일
- 공장
- 공정
- 설비
- 작업유형
- 상태
- 검색 / 초기화

Filtering currently runs in `frontend/js/maintenance.js`.

### History Table

Columns:

- 일자
- 공장
- 공정
- 설비
- 작업유형
- 작업내용
- 작업자
- 정지시간
- 비용
- 상태
- 관리

### Registration Modal

Fields:

- 작업일자
- 공장
- 공정
- 설비
- 작업유형
- 작업내용
- 조치내용
- 작업자
- 정지시간
- 비용
- 비고

Saving currently appends a row in the frontend and calls the dummy API.

### Charts

- 월별 정지시간: Chart.js bar chart
- 작업유형별 비율: Chart.js doughnut chart

## Dummy API

### Data

```http
GET /api/maintenance-page/data
```

Returns:

- summary cards
- filter options
- maintenance history rows
- monthly downtime chart data
- work type ratio chart data

### Save

```http
POST /api/maintenance-page/save
```

Current behavior:

- returns dummy save success
- frontend appends the submitted row to the table

## Future Flask/InfluxDB Integration Points

Recommended backend endpoints:

```http
GET /api/maintenance-page/data
GET /api/maintenance-log?start=&end=&factory=&process=&equipment=&work_type=&status=
POST /api/maintenance-log
PUT /api/maintenance-log/{id}
DELETE /api/maintenance-log/{id}
```

Target InfluxDB measurement:

```text
bucket: gems_test
measurement: maintenance_log
```

Recommended tags:

```text
factory
process
meter
feeder
furnace
equipment
work_type
status
owner
```

Recommended fields:

```text
work
action
note
downtime_hours
cost
```

For audit-grade maintenance history, consider a relational table or append-only log store for immutable records. InfluxDB can still be used for time-series aggregation such as downtime trends.
