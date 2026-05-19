# FEMS Next

Windows 11 and Docker Compose based development workspace for the new FEMS environment.

This project lives in `D:\fems-next`.
The existing production/reference project at `D:\FEMS` must not be modified unless the operator explicitly approves it.

## Stack

- Telegraf 1.38.4
- InfluxDB 2.x
- Grafana 13.0.1
- Flask backend API
- Bootstrap frontend scaffold

## Default Ports

Use `127.0.0.1` on Windows when `localhost` behaves inconsistently.

| Service | URL |
| --- | --- |
| Grafana | `http://127.0.0.1:3000` |
| InfluxDB | `http://127.0.0.1:8086` |
| Backend API | `http://127.0.0.1:5000/api/health` |
| Frontend | `http://127.0.0.1:5000/` |
| Main dashboard prototype | `http://127.0.0.1:5000/dashboard-main.html` |
| Production input prototype | `http://127.0.0.1:5000/production-input.html` |

Grafana login:

```text
admin / admin
```

## Quick Start

Run these from PowerShell:

```powershell
cd D:\fems-next
docker compose up -d --build
docker compose ps
```

Check core services:

```powershell
curl.exe -sS http://127.0.0.1:8086/health
curl.exe -sS http://127.0.0.1:5000/api/health
curl.exe -sS -u admin:admin http://127.0.0.1:3000/api/health
```

Open Grafana:

```text
http://127.0.0.1:3000/d/fems-overview/fems-overview
```

Open the FEMS main dashboard prototype:

```text
http://127.0.0.1:5000/dashboard-main.html
```

Open the production input prototype:

```text
http://127.0.0.1:5000/production-input.html
```

## Environment

Default values are in [.env.example](.env.example).

To override defaults:

```powershell
Copy-Item .env.example .env
```

Important defaults:

```text
INFLUXDB_ORG=fems
INFLUXDB_BUCKET=gems_test
INFLUXDB_TOKEN=dev-token-change-me
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
TARGET_UNIT_KWH_PER_UNIT=0
```

InfluxDB initialization values apply only when the InfluxDB data/config volumes are first created.

## Data Model

Bucket:

```text
gems_test
```

Power measurement:

```text
gems_power
```

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

## Project Layout

```text
backend/                 Flask API
frontend/                Bootstrap UI
grafana/provisioning/    Datasource and dashboard provisioning
telegraf/                Runtime config and GEMS3500 draft config
docs/                    Architecture and operation documents
scripts/                 Verification and sample-data scripts
docker-compose.yml       TIG and backend service composition
```

## Verification Flow

Recommended full validation after `docker compose up -d --build`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-influxdb.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\write-sample-data.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-sample-data.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-grafana-provisioning.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-grafana-dashboard.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-telegraf-config.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-gems3500-config.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-production-api.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\verify-ui-api.ps1
```

What these cover:

| Script | Purpose |
| --- | --- |
| `verify-influxdb.ps1` | InfluxDB health, org, bucket |
| `write-sample-data.ps1` | Development data for power, production, maintenance |
| `verify-sample-data.ps1` | Measurement count/query verification |
| `verify-grafana-provisioning.ps1` | Datasource and dashboard folder |
| `verify-grafana-dashboard.ps1` | `FEMS Overview` dashboard |
| `verify-telegraf-config.ps1` | Active Telegraf scaffold config |
| `verify-gems3500-config.ps1` | Static check of GEMS3500 draft config |
| `verify-production-api.ps1` | Direct input and Excel upload |
| `verify-ui-api.ps1` | Settings, electric intensity, maintenance APIs |

## Backend APIs

The Flask backend also serves the Bootstrap frontend from the same port.
Open this URL after `docker compose up -d`:

```powershell
http://127.0.0.1:5000/
```

Production direct input:

```http
POST /api/production-input
```

Excel upload:

```http
POST /api/production-upload
```

Settings:

```http
GET /api/settings
POST /api/settings
```

Electric intensity:

```http
GET /api/electric-intensity
```

Maintenance history:

```http
GET /api/maintenance-log
POST /api/maintenance-log
```

Dashboard prototype data:

```http
GET /api/dashboard/summary
GET /api/dashboard/factories
GET /api/dashboard/power-trend
GET /api/dashboard/specific-energy-trend
GET /api/dashboard/production-status
GET /api/dashboard/alarms
```

Quick dashboard API check:

```powershell
curl.exe -sS http://127.0.0.1:5000/api/dashboard/summary
curl.exe -sS http://127.0.0.1:5000/api/dashboard/factories
curl.exe -sS http://127.0.0.1:5000/api/dashboard/power-trend
curl.exe -sS http://127.0.0.1:5000/api/dashboard/specific-energy-trend
curl.exe -sS http://127.0.0.1:5000/api/dashboard/production-status
curl.exe -sS http://127.0.0.1:5000/api/dashboard/alarms
```

Production input prototype data:

```http
GET /api/production-page/summary
GET /api/production-page/manual
POST /api/production-page/manual
GET /api/production-page/excel
POST /api/production-page/excel-upload
GET /api/production-page/history
```

Quick production input API check:

```powershell
curl.exe -sS http://127.0.0.1:5000/api/production-page/summary
curl.exe -sS http://127.0.0.1:5000/api/production-page/manual
curl.exe -sS http://127.0.0.1:5000/api/production-page/excel
curl.exe -sS http://127.0.0.1:5000/api/production-page/history
```

API details:

- [docs/backend-api.md](docs/backend-api.md)
- [docs/electric-intensity.md](docs/electric-intensity.md)
- [docs/production-input-spec.md](docs/production-input-spec.md)

## Grafana

Grafana image is pinned:

```text
grafana/grafana-oss:13.0.1
```

Provisioned datasource:

```text
Name: FEMS InfluxDB
UID: fems-influxdb
Bucket: gems_test
```

Provisioned dashboard:

```text
Folder: FEMS
Title: FEMS Overview
UID: fems-overview
URL: http://127.0.0.1:3000/d/fems-overview/fems-overview
```

Docs:

- [docs/grafana-provisioning.md](docs/grafana-provisioning.md)
- [docs/grafana-dashboard.md](docs/grafana-dashboard.md)

## Telegraf

Telegraf image is pinned:

```text
telegraf:1.38.4
```

The active runtime config is:

```text
telegraf/telegraf.conf
```

It currently uses `inputs.internal` only so that the container stays running without contacting real equipment.

GEMS3500 draft config:

```text
telegraf/gems3500-collection.conf
```

This draft was derived from `D:\FEMS\telegraf\telegraf_d.conf`, but legacy tokens/org values were not copied. It is not mounted by Compose yet.

Docs:

- [docs/telegraf-template.md](docs/telegraf-template.md)

## Common Commands

Start or update:

```powershell
docker compose up -d --build
```

Restart one service:

```powershell
docker compose restart backend
docker compose restart grafana
docker compose restart telegraf
```

View status:

```powershell
docker compose ps
```

View logs:

```powershell
docker compose logs --tail 100 backend
docker compose logs --tail 100 grafana
docker compose logs --tail 100 influxdb
docker compose logs --tail 100 telegraf
```

Stop services:

```powershell
docker compose down
```

## Reset Local Development Data

InfluxDB and Grafana data are stored in Docker volumes:

```text
fems-next_influxdb-data
fems-next_influxdb-config
fems-next_grafana-data
```

To reset local development data:

```powershell
docker compose down
docker volume rm fems-next_influxdb-data fems-next_influxdb-config fems-next_grafana-data
docker compose up -d --build
```

This deletes local development data only. Use carefully.

## Current Scope

Implemented:

- TIG stack scaffold
- InfluxDB initialization
- Grafana provisioning and default dashboard
- Telegraf runtime scaffold
- GEMS3500 collection draft config
- Sample data script
- Production direct input API
- Excel upload API
- Electric intensity calculation API and Flux template
- Settings screen/API
- Maintenance history screen/API

Not enabled yet:

- Real equipment communication
- Real GEMS3500 collection
- Production WSGI server
