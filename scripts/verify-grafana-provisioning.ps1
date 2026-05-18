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

Write-Host "Checking Grafana health..."
$health = Invoke-RestMethod -Uri "$grafanaUrl/api/health" -Headers $headers
$health | ConvertTo-Json

Write-Host ""
Write-Host "Checking provisioned datasource..."
$datasources = Invoke-RestMethod -Uri "$grafanaUrl/api/datasources" -Headers $headers
$datasource = $datasources | Where-Object { $_.name -eq "FEMS InfluxDB" } | Select-Object -First 1
if (-not $datasource) {
    throw "Provisioned datasource 'FEMS InfluxDB' was not found."
}
$datasource | ConvertTo-Json -Depth 6

Write-Host ""
Write-Host "Checking datasource health..."
$datasourceHealth = Invoke-RestMethod -Uri "$grafanaUrl/api/datasources/uid/$($datasource.uid)/health" -Headers $headers
$datasourceHealth | ConvertTo-Json

Write-Host ""
Write-Host "Checking provisioned dashboard folder..."
$folders = Invoke-RestMethod -Uri "$grafanaUrl/api/search?query=FEMS" -Headers $headers
$folder = $folders | Where-Object { $_.title -eq "FEMS" -and $_.type -eq "dash-folder" } | Select-Object -First 1
if (-not $folder) {
    throw "Provisioned dashboard folder 'FEMS' was not found."
}
$folder | ConvertTo-Json

Write-Host ""
Write-Host "Grafana provisioning verification complete."
