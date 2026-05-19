# Schema

InfluxDB organization and bucket:

```text
org: fems
bucket: gems_test
```

## gems_power

Power telemetry measurement.

```text
measurement: gems_power
```

Tags:

| Tag | Purpose |
| --- | --- |
| `factory` | Factory or site identifier |
| `process` | Process identifier |
| `meter` | Meter identifier |
| `feeder` | Feeder identifier |
| `furnace` | Furnace identifier |

Fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `avg_v` | float | Average voltage |
| `avg_a` | float | Average current |
| `power_w` | float | Active power in watts |
| `avg_pf` | float | Average power factor |
| `sum_kwh` | float | Accumulated energy in kWh |

## production_input

Manual and Excel-uploaded production quantity measurement.

```text
measurement: production_input
```

Tags:

| Tag | Purpose |
| --- | --- |
| `factory` | Factory or site identifier |
| `process` | Process identifier |
| `product` | Optional product identifier |
| `shift` | Optional shift identifier |

Fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `quantity` | float | Production quantity |
| `note` | string | Optional note |

## maintenance_log

Maintenance history measurement.

```text
measurement: maintenance_log
```

Tags:

| Tag | Purpose |
| --- | --- |
| `factory` | Factory or site identifier |
| `process` | Process identifier |
| `meter` | Meter identifier |
| `feeder` | Feeder identifier |
| `furnace` | Furnace identifier |
| `status` | Maintenance status |

Fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `work` | string | Work description |
| `owner` | string | Person or team responsible |
| `note` | string | Optional note |

## Unit Energy

The current calculation uses the last 24 hours:

```text
unit_kwh_per_unit = sum(difference(gems_power.sum_kwh)) / sum(production_input.quantity)
```

If production quantity is zero, the backend returns `0.0` for unit energy.
