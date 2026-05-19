# Dashboard Plan

This document defines the baseline Grafana dashboard scope for `FEMS Overview`.

## Dashboard

```text
folder: FEMS
uid: fems-overview
title: FEMS Overview
datasource uid: fems-influxdb
bucket: gems_test
```

## Variables

| Variable | Source | Purpose |
| --- | --- | --- |
| `meter` | `gems_power` tag values | Filter dashboard panels by meter |

## Panels

| Panel | Measurement | Field | Purpose |
| --- | --- | --- | --- |
| Power Trend | `gems_power` | `power_w` | Time-series active power trend |
| Latest Energy | `gems_power` | `sum_kwh` | Latest accumulated energy by equipment |
| Power Factor | `gems_power` | `avg_pf` | Current or recent power factor |
| Production Quantity | `production_input` | `quantity` | Production quantity trend |
| Unit Energy Placeholder | derived | derived | Placeholder for unit energy visualization |
| Maintenance Log | `maintenance_log` | `owner`, `work`, `note` | Recent maintenance activity |

## Next Improvements

- Replace the unit energy placeholder with the production-aware Flux query from `docs/flux/electric-intensity.flux`.
- Add target unit-energy line or threshold display.
- Add factory/process/furnace variables.
- Split operational view and maintenance view if the panel count grows.
- Add dashboard annotations for maintenance events.

## Provisioning Files

```text
grafana/provisioning/datasources/influxdb.yml
grafana/provisioning/dashboards/dashboards.yml
grafana/provisioning/dashboards/json/fems-overview.json
```
