$ErrorActionPreference = "Stop"

$backendUrl = "http://127.0.0.1:5000"

function Assert-True {
    param(
        [bool] $Condition,
        [string] $Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function UrlEncode {
    param([string] $Value)
    return [System.Uri]::EscapeDataString($Value)
}

Write-Host "Checking backend health..."
$health = Invoke-RestMethod -Uri "$backendUrl/api/health"
Assert-True ($health.status -eq "ok") "Backend health check failed."

Write-Host ""
Write-Host "Checking static pages..."
$factoryPage = Invoke-WebRequest -UseBasicParsing -Uri "$backendUrl/factory.html"
$equipmentPage = Invoke-WebRequest -UseBasicParsing -Uri "$backendUrl/equipment.html"
Assert-True ($factoryPage.StatusCode -eq 200) "factory.html is not available."
Assert-True ($equipmentPage.StatusCode -eq 200) "equipment.html is not available."

Write-Host ""
Write-Host "Reading factory feeder drilldown data..."
$feederData = Invoke-RestMethod -Uri "$backendUrl/api/factory-page/feeder-status"
$target = $feederData.items | Where-Object { $_.meter -eq "RTU-401" } | Select-Object -First 1

Assert-True ($null -ne $target) "Expected RTU-401 feeder row was not found."
Assert-True (-not [string]::IsNullOrWhiteSpace($target.factory)) "Factory is empty in feeder data."
Assert-True (-not [string]::IsNullOrWhiteSpace($target.process)) "Process is empty in feeder data."

$query = "factory=$(UrlEncode $target.factory)&process=$(UrlEncode $target.process)&furnace=$(UrlEncode $target.equipment)&meter=$(UrlEncode $target.meter)"
$drilldownUrl = "$backendUrl/equipment.html?$query"

Write-Host ""
Write-Host "Checking generated equipment drilldown URL..."
Write-Host $drilldownUrl
$drilldownPage = Invoke-WebRequest -UseBasicParsing -Uri $drilldownUrl
Assert-True ($drilldownPage.StatusCode -eq 200) "Generated equipment drilldown URL is not available."

Write-Host ""
Write-Host "Checking equipment detail API..."
$detail = Invoke-RestMethod -Uri "$backendUrl/api/equipment-page/detail/$($target.meter)"
Assert-True ($detail.item.id -eq $target.meter) "Equipment detail meter mismatch."
Assert-True ($detail.item.factory -eq $target.factory) "Equipment detail factory mismatch."
Assert-True ($detail.item.process -eq $target.process) "Equipment detail process mismatch."

Write-Host ""
Write-Host "Checking frontend-equivalent filter result..."
$equipmentList = Invoke-RestMethod -Uri "$backendUrl/api/equipment-page/list"
$filtered = $equipmentList.items | Where-Object {
    $_.factory -eq $target.factory -and
    $_.process -eq $target.process -and
    ($_.id -eq $target.meter -or $_.name -like "*$($target.meter)*" -or $_.feeder -like "*$($target.meter)*")
}

Assert-True (($filtered | Measure-Object).Count -eq 1) "Equipment filter did not resolve exactly one row."
Assert-True (($filtered | Select-Object -First 1).id -eq $target.meter) "Filtered equipment row mismatch."

Write-Host ""
Write-Host "Factory to equipment drilldown verification complete."
Write-Host "Factory: $($target.factory)"
Write-Host "Process: $($target.process)"
Write-Host "Equipment: $($target.equipment)"
Write-Host "Meter: $($target.meter)"
