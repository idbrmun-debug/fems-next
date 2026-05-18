$ErrorActionPreference = "Stop"

$backendUrl = "http://127.0.0.1:5000"

Write-Host "Checking settings..."
Invoke-RestMethod -Uri "$backendUrl/api/settings" | ConvertTo-Json

Write-Host ""
Write-Host "Saving target setting..."
Invoke-RestMethod `
    -Uri "$backendUrl/api/settings" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"target_unit_kwh_per_unit": 100}' | ConvertTo-Json

Write-Host ""
Write-Host "Checking electric intensity..."
Invoke-RestMethod -Uri "$backendUrl/api/electric-intensity" | ConvertTo-Json

Write-Host ""
Write-Host "Writing maintenance record..."
Invoke-RestMethod `
    -Uri "$backendUrl/api/maintenance-log" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"factory":"youngsin_quartz","process":"electric_furnace","meter":"gems_01","feeder":"feeder_01","furnace":"furnace_01","work":"api maintenance check","owner":"maintenance","status":"done"}' | ConvertTo-Json

Write-Host ""
Write-Host "Checking maintenance records..."
Invoke-RestMethod -Uri "$backendUrl/api/maintenance-log" | ConvertTo-Json -Depth 5

Write-Host ""
Write-Host "UI API verification complete."
