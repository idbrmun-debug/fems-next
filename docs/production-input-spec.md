# Production Input Screen Specification

## Purpose

The production input screen provides operator-facing manual entry and Excel upload workflows for factory production quantities.

Current implementation uses dummy Flask JSON responses. Later, the same API contracts can be backed by InfluxDB `production_input`.

## Page

```text
http://127.0.0.1:5000/production-input.html
```

Frontend files:

```text
frontend/production-input.html
frontend/css/production-input.css
frontend/js/production-input.js
frontend/assets/templates/production-input-template.xlsx
```

## API

### Summary

```http
GET /api/production-page/summary
```

Returns:

- base date
- factory production summary cards
- input status counts

### Manual Input Data

```http
GET /api/production-page/manual
POST /api/production-page/manual
```

`GET` returns factory rows for manual input:

- factory
- today production
- monthly total production
- target production
- target attainment
- input status
- last input time

`POST` accepts:

```json
{
  "date": "2025-05-24",
  "rows": [
    { "factory": "3 공장", "quantity": 125.3 }
  ]
}
```

Current behavior: returns dummy save success.

### Excel Upload Info

```http
GET /api/production-page/excel
POST /api/production-page/excel-upload
```

`GET` returns:

- upload steps
- supported extensions
- template URL
- upload rules
- sample rows

`POST` accepts multipart file field:

```text
file
```

Current behavior: returns dummy upload success.

### History

```http
GET /api/production-page/history
```

Returns recent production input history:

- date
- factory
- quantity
- monthly total
- owner
- input method
- input timestamp

## Excel Template

Template path:

```text
frontend/assets/templates/production-input-template.xlsx
```

Columns:

| Column | Required | Description |
| --- | --- | --- |
| `date` | yes | Production date, `YYYY-MM-DD` |
| `factory` | yes | Factory name such as `3공장`, `4공장`, `5공장` |
| `quantity_ton` | yes | Production quantity in tons |
| `owner` | no | Input owner |
| `note` | no | Optional note |

## Future InfluxDB Mapping

Target measurement:

```text
measurement: production_input
bucket: gems_test
```

Recommended tags:

```text
factory
process
product
shift
input_method
owner
```

Recommended fields:

```text
quantity
note
```

Suggested timestamp:

- Use the selected production date for daily aggregation.
- Store actual entry timestamp separately if audit-level history is required.

## Integration Notes

- Manual save should call the existing production write helper or a new service layer that writes `production_input`.
- Excel upload should reuse the existing Excel parser after aligning column aliases.
- History can be queried from `production_input` using Flux and pivoted by date/factory.
- Target production values should eventually move to a settings measurement or configuration store.
