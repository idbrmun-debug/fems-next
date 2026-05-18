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

function Convert-ToUnixNanoseconds {
    param(
        [Parameter(Mandatory = $true)]
        [datetime] $DateTime
    )

    $offset = [datetimeoffset] $DateTime.ToUniversalTime()
    return ($offset.ToUnixTimeMilliseconds() * 1000000).ToString()
}

function Escape-LineProtocolTag {
    param([Parameter(Mandatory = $true)][string] $Value)

    return $Value.Replace("\", "\\").Replace(" ", "\ ").Replace(",", "\,").Replace("=", "\=")
}

function Escape-LineProtocolStringField {
    param([Parameter(Mandatory = $true)][string] $Value)

    return '"' + $Value.Replace("\", "\\").Replace('"', '\"') + '"'
}

$now = Get-Date
$lines = New-Object System.Collections.Generic.List[string]

$meters = @(
    @{ meter = "gems_01"; feeder = "feeder_01"; furnace = "furnace_01"; baseKw = 54.2; baseKwh = 13240.0 },
    @{ meter = "gems_01"; feeder = "feeder_02"; furnace = "furnace_02"; baseKw = 47.8; baseKwh = 11880.0 },
    @{ meter = "gems_01"; feeder = "feeder_03"; furnace = "furnace_03"; baseKw = 51.5; baseKwh = 12510.0 },
    @{ meter = "gems_02"; feeder = "feeder_01"; furnace = "furnace_04"; baseKw = 63.1; baseKwh = 15120.0 }
)

for ($i = 23; $i -ge 0; $i--) {
    $pointTime = $now.AddHours(-$i)
    $timestamp = Convert-ToUnixNanoseconds $pointTime
    $step = 23 - $i

    foreach ($m in $meters) {
        $wave = [math]::Sin($step / 3.0)
        $powerW = [math]::Round(($m.baseKw + ($wave * 3.5)) * 1000, 2)
        $sumKwh = [math]::Round($m.baseKwh + ($step * ($m.baseKw * 0.92)), 2)
        $avgV = [math]::Round(380.0 + ($wave * 2.3), 2)
        $avgA = [math]::Round(($powerW / 380.0) / 1.732, 2)
        $avgPf = [math]::Round(0.90 + ([math]::Cos($step / 4.0) * 0.03), 3)

        $tags = "factory=youngsin_quartz,process=electric_furnace,meter=$(Escape-LineProtocolTag $m.meter),feeder=$(Escape-LineProtocolTag $m.feeder),furnace=$(Escape-LineProtocolTag $m.furnace)"
        $fields = "avg_v=$avgV,avg_a=$avgA,power_w=$powerW,avg_pf=$avgPf,sum_kwh=$sumKwh"
        $lines.Add("gems_power,$tags $fields $timestamp")
    }
}

$productionRows = @(
    @{ process = "electric_furnace"; product = "quartz_part_a"; quantity = 420; shift = "day"; hoursAgo = 20 },
    @{ process = "electric_furnace"; product = "quartz_part_b"; quantity = 385; shift = "night"; hoursAgo = 12 },
    @{ process = "electric_furnace"; product = "quartz_part_a"; quantity = 448; shift = "day"; hoursAgo = 4 }
)

foreach ($row in $productionRows) {
    $timestamp = Convert-ToUnixNanoseconds $now.AddHours(-$row.hoursAgo)
    $tags = "factory=youngsin_quartz,process=$(Escape-LineProtocolTag $row.process),product=$(Escape-LineProtocolTag $row.product),shift=$(Escape-LineProtocolTag $row.shift)"
    $fields = "quantity=$($row.quantity)"
    $lines.Add("production_input,$tags $fields $timestamp")
}

$maintenanceRows = @(
    @{ meter = "gems_01"; feeder = "feeder_01"; furnace = "furnace_01"; owner = "maintenance"; work = "terminal_check"; status = "done"; hoursAgo = 18 },
    @{ meter = "gems_02"; feeder = "feeder_01"; furnace = "furnace_04"; owner = "electric"; work = "sensor_inspection"; status = "planned"; hoursAgo = 2 }
)

foreach ($row in $maintenanceRows) {
    $timestamp = Convert-ToUnixNanoseconds $now.AddHours(-$row.hoursAgo)
    $tags = "factory=youngsin_quartz,process=electric_furnace,meter=$(Escape-LineProtocolTag $row.meter),feeder=$(Escape-LineProtocolTag $row.feeder),furnace=$(Escape-LineProtocolTag $row.furnace),status=$(Escape-LineProtocolTag $row.status)"
    $fields = "work=$(Escape-LineProtocolStringField $row.work),owner=$(Escape-LineProtocolStringField $row.owner)"
    $lines.Add("maintenance_log,$tags $fields $timestamp")
}

$body = $lines -join "`n"
$writeUrl = "$influxUrl/api/v2/write?org=$([uri]::EscapeDataString($org))&bucket=$([uri]::EscapeDataString($bucket))&precision=ns"

Write-Host "Writing sample data to $bucket..."
Invoke-WebRequest `
    -Uri $writeUrl `
    -Method Post `
    -Headers @{ Authorization = "Token $token" } `
    -ContentType "text/plain; charset=utf-8" `
    -Body $body `
    -UseBasicParsing | Out-Null

Write-Host "Sample data write complete."
Write-Host "gems_power points: 96"
Write-Host "production_input points: 3"
Write-Host "maintenance_log points: 2"
