$ErrorActionPreference = "Stop"

$path = "telegraf\gems3500-collection.conf"
if (-not (Test-Path $path)) {
    throw "$path was not found."
}

$content = Get-Content -Raw -Path $path

$requiredText = @(
    'controller = "tcp://192.168.7.74:502"',
    'measurement = "gems_power"',
    'factory = "youngsin_quartz"',
    'process = "electric_furnace"',
    'meter = "gems_01"',
    'meter = "gems_02"',
    'feeder = "feeder_01"',
    'feeder = "feeder_02"',
    'feeder = "feeder_03"',
    'furnace = "furnace_01"',
    'furnace = "furnace_02"',
    'furnace = "furnace_03"',
    'furnace = "furnace_04"',
    'name = "avg_v"',
    'name = "avg_a"',
    'name = "power_w"',
    'name = "avg_pf"',
    'name = "sum_kwh"'
)

foreach ($text in $requiredText) {
    if (-not $content.Contains($text)) {
        throw "Missing required text: $text"
    }
}

$blockedText = @(
    'organization = "docker"',
    'XvNMKZX',
    'xARLzY'
)

foreach ($text in $blockedText) {
    if ($content.Contains($text)) {
        throw "Blocked legacy value found: $text"
    }
}

$metricCount = ([regex]::Matches($content, '\[\[inputs\.modbus\.metric\]\]')).Count
if ($metricCount -ne 4) {
    throw "Expected 4 GEMS3500 metric blocks, found $metricCount."
}

Write-Host "GEMS3500 draft config static verification complete."
Write-Host "Metric blocks: $metricCount"
Write-Host "No real device connection was attempted."
