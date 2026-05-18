$ErrorActionPreference = "Stop"

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

Write-Host "Checking InfluxDB health..."
curl.exe -sS http://127.0.0.1:8086/health

Write-Host ""
Write-Host "Checking organization..."
docker compose exec -T influxdb influx org list --token $token

Write-Host ""
Write-Host "Checking bucket..."
docker compose exec -T influxdb influx bucket list --org $org --token $token | Select-String $bucket

Write-Host ""
Write-Host "InfluxDB initial setup verification complete."
