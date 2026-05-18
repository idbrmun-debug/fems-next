# Backend API

## Health

```http
GET /api/health
```

## Production Direct Input

```http
POST /api/production-input
Content-Type: application/json
```

Required fields:

- `factory`
- `process`
- `quantity`

Optional fields:

- `time`: ISO-8601 datetime. Defaults to server time.
- `product`
- `shift`
- `note`

Example:

```json
{
  "factory": "youngsin_quartz",
  "process": "electric_furnace",
  "product": "quartz_part_a",
  "shift": "day",
  "quantity": 512,
  "time": "2026-05-18T08:00:00Z",
  "note": "manual input"
}
```

Writes to InfluxDB measurement:

- `production_input`

## Production Excel Upload

```http
POST /api/production-upload
Content-Type: multipart/form-data
```

Form field:

- `file`: `.xlsx` file

Required columns:

- `factory`
- `process`
- `quantity`

Optional columns:

- `time`
- `product`
- `shift`
- `note`

Supported aliases:

- `qty`, `production` -> `quantity`
- `site`, `plant` -> `factory`
- `line` -> `process`
- `item` -> `product`
- `date`, `datetime`, `timestamp` -> `time`

Rows with validation errors are returned in `errors`. Valid rows are still written.

## Settings

```http
GET /api/settings
POST /api/settings
```

Writable field:

- `target_unit_kwh_per_unit`

## Electric Intensity

```http
GET /api/electric-intensity
```

Returns the latest 24 hour energy, production quantity, calculated unit energy, and target unit energy.

## Maintenance Log

```http
GET /api/maintenance-log
POST /api/maintenance-log
```

Required POST fields:

- `factory`
- `process`
- `meter`
- `feeder`
- `furnace`
- `work`
- `owner`

Optional fields:

- `time`
- `status`
- `note`

## Verify

Run from `D:\fems-next`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-production-api.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-ui-api.ps1
```
