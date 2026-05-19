# Setup Guide

This guide describes how to start and verify the `D:\fems-next` development stack.

## Prerequisites

- Windows 11
- Docker Desktop
- PowerShell

Do not run these commands from `D:\FEMS`.

## Start

```powershell
cd D:\fems-next
docker compose up -d --build
docker compose ps
```

## Access

| Service | URL |
| --- | --- |
| Frontend | `http://127.0.0.1:5000/` |
| Backend health | `http://127.0.0.1:5000/api/health` |
| Grafana | `http://127.0.0.1:3000` |
| InfluxDB | `http://127.0.0.1:8086` |

Grafana development login:

```text
admin / admin
```

If Grafana asks to change the password, use `Skip` in the local development environment.

## Verification

Run the verification scripts after the containers are up:

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

## Stop

```powershell
docker compose down
```

## Reset Local Data

This removes local Docker volumes for InfluxDB and Grafana.

```powershell
docker compose down
docker volume rm fems-next_influxdb-data fems-next_influxdb-config fems-next_grafana-data
docker compose up -d --build
```
