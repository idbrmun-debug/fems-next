$ErrorActionPreference = "Stop"

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string] $FilePath,

        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]] $ArgumentList
    )

    & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath exited with code $LASTEXITCODE"
    }
}

Write-Host "Checking Telegraf container status..."
Invoke-NativeCommand docker compose ps telegraf

Write-Host ""
Write-Host "Checking active Telegraf config syntax..."
Invoke-NativeCommand docker compose exec -T telegraf telegraf --config /etc/telegraf/telegraf.conf --test --once

Write-Host ""
Write-Host "Checking Telegraf logs..."
Invoke-NativeCommand docker compose logs --tail 40 telegraf

Write-Host ""
Write-Host "Telegraf scaffold verification complete."
