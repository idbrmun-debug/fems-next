# Alarm Screen Specification

## Purpose

The alarm screen provides alarm status monitoring, filtering, detail inspection, and acknowledgement workflow.

Current implementation uses dummy Flask JSON responses and frontend-only state changes. It does not write to InfluxDB or any production database.

## Page

```text
http://127.0.0.1:5000/alarm.html
```

Frontend files:

```text
frontend/alarm.html
frontend/css/alarm.css
frontend/js/alarm.js
```

## Screen Structure

### Summary Cards

- 전체 알람
- 경고 알람
- 정지 알람
- 통신 이상
- 미확인 알람

### Alarm Status Summary

Donut chart by level:

- 경고
- 정지
- 통신이상
- 복구완료

### Filters

- 시작일 / 종료일
- 공장
- 공정
- 설비
- 알람 레벨
- 알람 상태
- 확인 여부

Filtering currently runs in `frontend/js/alarm.js`.

### Alarm History Table

Columns:

- 발생시간
- 공장
- 공정
- 설비
- 알람 항목
- 현재값
- 기준값
- 알람 레벨
- 상태
- 확인자
- 확인시간
- 관리

### Recent Alarm Panel

Shows the latest alarms. Clicking an item opens the detail modal.

### Alarm Detail Modal

Shows:

- 발생시간
- 복구시간
- 공장
- 공정
- 설비
- 알람 항목
- 현재값
- 기준값
- 알람 레벨
- 알람 메시지
- 조치 가이드
- 확인자
- 확인 메모

### Acknowledgement Flow

1. Select an unacknowledged alarm.
2. Enter confirmer and note.
3. Click `확인`.
4. Frontend updates acknowledgement state and shows toast.

## Dummy API

```http
GET  /api/alarm-page/summary
GET  /api/alarm-page/list
GET  /api/alarm-page/recent
POST /api/alarm-page/acknowledge
```

Prepared frontend functions:

```text
fetchAlarmSummary()
fetchAlarmList()
fetchRecentAlarms()
acknowledgeAlarm()
renderAlarmCharts()
```

## Future API/InfluxDB Integration Points

Recommended backend endpoints:

```http
GET /api/alarms/summary
GET /api/alarms?start=&end=&factory=&process=&equipment=&level=&status=&ack=
GET /api/alarms/recent
GET /api/alarms/{id}
POST /api/alarms/{id}/acknowledge
```

Possible InfluxDB measurement:

```text
bucket: gems_test
measurement: alarm_log
```

Recommended tags:

```text
factory
process
equipment
meter
feeder
furnace
alarm_item
level
status
acknowledged
```

Recommended fields:

```text
current_value
threshold
message
guide
ack_owner
ack_note
recovered_at
```

For audit-grade alarm acknowledgement, use a relational or append-only event store. InfluxDB is suitable for time-series alarm statistics and trend dashboards.
