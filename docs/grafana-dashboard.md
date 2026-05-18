# Grafana Dashboard

## Default Dashboard

Provisioned dashboard file:

- `grafana/provisioning/dashboards/json/fems-overview.json`

Dashboard:

- Title: `FEMS Overview`
- UID: `fems-overview`
- Folder: `FEMS`
- Datasource UID: `fems-influxdb`

## Panels

- Power trend from `gems_power.power_w`
- Latest energy from `gems_power.sum_kwh`
- Power factor from `gems_power.avg_pf`
- Production quantity from `production_input.quantity`
- Unit energy placeholder
- Maintenance log table from `maintenance_log`

## Verify

Run from `D:\fems-next`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-grafana-dashboard.ps1
```
