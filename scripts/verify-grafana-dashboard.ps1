$ErrorActionPreference = "Stop"

$grafanaUrl = "http://127.0.0.1:3000"
$user = $env:GRAFANA_ADMIN_USER
if ([string]::IsNullOrWhiteSpace($user)) {
    $user = "admin"
}

$password = $env:GRAFANA_ADMIN_PASSWORD
if ([string]::IsNullOrWhiteSpace($password)) {
    $password = "admin"
}

$authValue = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${user}:${password}"))
$headers = @{ Authorization = "Basic $authValue" }

Write-Host "Checking provisioned datasource UID..."
$datasource = Invoke-RestMethod -Uri "$grafanaUrl/api/datasources/uid/fems-influxdb" -Headers $headers
$datasource | ConvertTo-Json -Depth 5

Write-Host ""
Write-Host "Checking default dashboard..."
$dashboard = Invoke-RestMethod -Uri "$grafanaUrl/api/dashboards/uid/fems-overview" -Headers $headers
$dashboard.dashboard.title
$dashboard.dashboard.panels | Select-Object id, title, type | Format-Table

if ($dashboard.dashboard.panels.Count -lt 6) {
    throw "Expected at least 6 dashboard panels."
}

Write-Host ""
Write-Host "Grafana default dashboard verification complete."
