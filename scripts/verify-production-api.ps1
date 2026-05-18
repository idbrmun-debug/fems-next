$ErrorActionPreference = "Stop"

$backendUrl = "http://127.0.0.1:5000"
$sampleDir = "backend\tmp"
$samplePath = "$sampleDir\production-upload-sample.xlsx"

New-Item -ItemType Directory -Force -Path $sampleDir | Out-Null

Write-Host "Checking backend health..."
Invoke-RestMethod -Uri "$backendUrl/api/health" | ConvertTo-Json

Write-Host ""
Write-Host "Writing direct production input..."
$payload = @{
    factory = "youngsin_quartz"
    process = "electric_furnace"
    product = "quartz_part_api"
    shift = "day"
    quantity = 512
    note = "api verification"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "$backendUrl/api/production-input" `
    -Method Post `
    -ContentType "application/json" `
    -Body $payload | ConvertTo-Json

Write-Host ""
Write-Host "Creating sample Excel file in backend container..."
docker compose exec -T backend python /app/tools/create_sample_production_excel.py /app/tmp/production-upload-sample.xlsx
if ($LASTEXITCODE -ne 0) {
    throw "Failed to create sample Excel file."
}

Write-Host ""
Write-Host "Uploading sample Excel file..."
curl.exe -sS `
    -X POST "$backendUrl/api/production-upload" `
    -F "file=@$samplePath"
if ($LASTEXITCODE -ne 0) {
    throw "Excel upload failed."
}

Write-Host ""
Write-Host ""
Write-Host "Production API verification complete."
