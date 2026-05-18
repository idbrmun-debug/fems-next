# Telegraf Template

## Scope

The current Telegraf configuration keeps the container running but does not connect to real equipment.

Real GEMS3500 or power meter collection must not be enabled until the following are confirmed:

- Device IP address or serial port
- Modbus TCP or Modbus RTU
- Slave ID
- Register map
- Data type per register
- Byte order
- Scaling rules
- Tag values for factory, process, meter, feeder, and furnace

## Active Runtime Configuration

File:

- `telegraf/telegraf.conf`

Enabled input:

- `inputs.internal`

Purpose:

- Keep Telegraf running during scaffold validation.
- Avoid real device communication.
- Verify InfluxDB output wiring.

Output:

- `outputs.influxdb_v2`
- URL: `http://influxdb:8086`
- Organization: `fems`
- Bucket: `gems_test`

## Device Template

Template file:

- `telegraf/templates/gems3500-modbus.example.conf`
- `telegraf/gems3500-collection.conf`

The concrete `gems3500-collection.conf` file was derived from the existing read-only reference project:

- `D:\FEMS\telegraf\telegraf_d.conf`

Values adapted for `fems-next`:

- Legacy `site = "youngsin_quartz"` is mapped to `factory = "youngsin_quartz"`.
- `process = "electric_furnace"` is added.
- Legacy `channel` is mapped to the required `feeder` tag.
- Existing register addresses, data types, byte order, and scales are preserved.
- Legacy InfluxDB token and organization are not copied.
- `fems-next` environment variables are used for InfluxDB output.

Expected measurement:

- `gems_power`

Required tags:

- `factory`
- `process`
- `meter`
- `feeder`
- `furnace`

Required fields:

- `avg_v`
- `avg_a`
- `power_w`
- `avg_pf`
- `sum_kwh`

## Enable Later

When the actual register map is approved:

1. Review `telegraf/gems3500-collection.conf`.
2. Confirm `controller = "tcp://192.168.7.74:502"` is correct for the new environment.
3. Confirm slave IDs and feeder/furnace mapping.
4. Replace `telegraf/telegraf.conf` with the approved GEMS3500 config or update the Compose mount.
5. Restart Telegraf.
6. Verify that points are written to `gems_power`.

## Verify Current Scaffold

Run from `D:\fems-next`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-telegraf-config.ps1
```

## Verify GEMS3500 Draft

This static check does not contact the real device:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-gems3500-config.ps1
```
