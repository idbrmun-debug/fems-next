$ErrorActionPreference = "Stop"

$influxUrl = $env:INFLUXDB_URL
if ([string]::IsNullOrWhiteSpace($influxUrl)) {
    $influxUrl = "http://127.0.0.1:8086"
}

$token = $env:INFLUXDB_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
    $token = "dev-token-change-me"
}

$org = $env:INFLUXDB_ORG
if ([string]::IsNullOrWhiteSpace($org)) {
    $org = "fems"
}

$bucket = $env:INFLUXDB_BUCKET
if ([string]::IsNullOrWhiteSpace($bucket)) {
    $bucket = "gems_test"
}

$measurements = @("gems_power", "production_input", "maintenance_log")

foreach ($measurement in $measurements) {
    Write-Host "Checking measurement: $measurement"
    $query = "from(bucket: `"$bucket`") |> range(start: -48h) |> filter(fn: (r) => r._measurement == `"$measurement`") |> count()"

    $payload = @{
        query = $query
        type = "flux"
    } | ConvertTo-Json

    $response = Invoke-WebRequest `
        -Uri "$influxUrl/api/v2/query?org=$([uri]::EscapeDataString($org))" `
        -Method Post `
        -Headers @{
            Authorization = "Token $token"
            Accept = "application/csv"
        } `
        -ContentType "application/json" `
        -Body $payload `
        -UseBasicParsing

    $csv = $response.Content
    Write-Host $csv

    if ($csv -notmatch $measurement) {
        throw "No query result returned for $measurement."
    }
    Write-Host ""
}

Write-Host "Sample data verification complete."
