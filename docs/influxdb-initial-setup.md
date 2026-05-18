# InfluxDB Initial Setup

## Purpose

InfluxDB 2.x is initialized by Docker Compose for the `fems-next` development environment.

This setup is isolated from the existing `D:\FEMS` project.

## Default Access

- URL: `http://127.0.0.1:8086`
- Username: `admin`
- Password: `adminpassword`
- Organization: `fems`
- Bucket: `gems_test`
- Admin token: `dev-token-change-me`

For local overrides, copy `.env.example` to `.env` and change the values before the first container initialization.

## Bucket

Primary bucket:

- `gems_test`

Current retention:

- infinite

## Measurements

Primary power measurement:

- `gems_power`

Tags:

- `factory`
- `process`
- `meter`
- `feeder`
- `furnace`

Fields:

- `avg_v`
- `avg_a`
- `power_w`
- `avg_pf`
- `sum_kwh`

Additional measurements:

- `production_input`
- `maintenance_log`

InfluxDB creates measurements when points are first written. The scaffold does not seed fake equipment data.

## Verify

Run from `D:\fems-next`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-influxdb.ps1
```

Manual checks:

```powershell
curl.exe -sS http://127.0.0.1:8086/health
docker compose exec -T influxdb influx org list --token dev-token-change-me
docker compose exec -T influxdb influx bucket list --org fems --token dev-token-change-me
```

## Sample Data

Write development sample data:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\write-sample-data.ps1
```

Verify sample measurements:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-sample-data.ps1
```

The sample script writes:

- `gems_power`: 24 hours x 4 meter/feeders
- `production_input`: 3 production rows
- `maintenance_log`: 2 maintenance rows

The script uses development values only and does not contact any real equipment.

## Reset Development Data

Named Docker volumes hold InfluxDB data:

- `fems-next_influxdb-data`
- `fems-next_influxdb-config`

Resetting these volumes deletes all local development data. Do this only when a clean InfluxDB initialization is required.
