# Electric Intensity

## Flux Query

Template:

- `docs/flux/electric-intensity.flux`

The query calculates:

- Energy usage from `gems_power.sum_kwh`
- Production quantity from `production_input.quantity`
- Unit energy as `energy_kwh / production_quantity`

The backend endpoint uses the same calculation approach over the latest 24 hours.

## API

```http
GET /api/electric-intensity
```

Response fields:

- `energy_kwh`
- `production_quantity`
- `unit_kwh_per_unit`
- `target_unit_kwh_per_unit`

## Verify

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-ui-api.ps1
```
