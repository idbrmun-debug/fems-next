# Grafana Provisioning

## Purpose

Grafana provisioning is used to create the FEMS InfluxDB datasource and reserve a dashboard folder structure when the container starts.

## Version

Grafana image:

- `grafana/grafana-oss:13.0.1`

## Provisioned Datasource

File:

- `grafana/provisioning/datasources/influxdb.yml`

Datasource:

- Name: `FEMS InfluxDB`
- UID: `fems-influxdb`
- Type: `influxdb`
- Query language: Flux
- URL inside Docker network: `http://influxdb:8086`
- Organization: `fems`
- Default bucket: `gems_test`
- Token: `dev-token-change-me`

## Dashboard Provider

File:

- `grafana/provisioning/dashboards/dashboards.yml`

Provider:

- Name: `FEMS Dashboards`
- Folder: `FEMS`
- JSON path inside container: `/etc/grafana/provisioning/dashboards/json`

Dashboard JSON files should be added under:

- `grafana/provisioning/dashboards/json`

Default dashboard:

- `grafana/provisioning/dashboards/json/fems-overview.json`
- UID: `fems-overview`

## Reserved Provisioning Folders

The following folders are present to keep Grafana startup logs clean and reserve future provisioning areas:

- `grafana/provisioning/alerting`
- `grafana/provisioning/plugins`

## Verify

Run from `D:\fems-next`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-grafana-provisioning.ps1
```

Manual checks:

```powershell
curl.exe -sS -u admin:admin http://127.0.0.1:3000/api/health
curl.exe -sS -u admin:admin http://127.0.0.1:3000/api/datasources
```
