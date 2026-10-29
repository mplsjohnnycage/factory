#Requires -Version 5.1
<#
.SYNOPSIS
  Register / unregister / status / dry-run the FactoryGatewayLogon scheduled task.

.DESCRIPTION
  Preferred persistence for DESKTOP-3APDBKG: Task Scheduler AtLogOn for the
  current interactive user. Survives reboot + logon better than a Startup
  shortcut alone.

  Never prints secret values. Never mutates Port.

.PARAMETER Action
  DryRun | Register | Unregister | Status  (default DryRun)

.PARAMETER RepoRoot
  Absolute path to factory clone. Default: two levels above this script.

.PARAMETER EnvFile
  Passed through to the start script. Default: %USERPROFILE%\.factory\gateway.env

.PARAMETER SkipFunnel
  Pass -SkipFunnel to the start script.

.PARAMETER TaskName
  Scheduled task name (default FactoryGatewayLogon).
#>
[CmdletBinding()]
param(
  [ValidateSet("DryRun", "Register", "Unregister", "Status")]
  [string]$Action = "DryRun",
  [string]$RepoRoot = "",
  [string]$EnvFile = "",
  [switch]$SkipFunnel,
  [string]$TaskName = "FactoryGatewayLogon"
)

$ErrorActionPreference = "Stop"

if (-not $RepoRoot) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}
if (-not $EnvFile) {
  $EnvFile = Join-Path $env:USERPROFILE ".factory\gateway.env"
}

$startScript = Join-Path $PSScriptRoot "factory-gateway-logon-start.ps1"
if (-not (Test-Path -LiteralPath $startScript)) {
  throw "Missing start script: $startScript"
}

$argList = @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", "`"$startScript`"",
  "-RepoRoot", "`"$RepoRoot`"",
  "-EnvFile", "`"$EnvFile`""
)
if ($SkipFunnel) { $argList += "-SkipFunnel" }

$powershellExe = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$arguments = ($argList -join " ")

function Show-Plan {
  Write-Host "=== Factory gateway Windows logon autostart (plan) ==="
  Write-Host "Action:        $Action"
  Write-Host "ComputerName:  $env:COMPUTERNAME"
  Write-Host "User:          $env:USERNAME"
  Write-Host "TaskName:      $TaskName"
  Write-Host "Trigger:       At logon (current user)"
  Write-Host "RepoRoot:      $RepoRoot"
  Write-Host "StartScript:   $startScript"
  Write-Host "EnvFile:       $EnvFile (values never printed)"
  Write-Host "SkipFunnel:    $SkipFunnel"
  Write-Host "Executable:    $powershellExe"
  Write-Host "Arguments:     $arguments"
  Write-Host "Log dir:       $(Join-Path $env:USERPROFILE '.factory\logs')"
  Write-Host "Pilot host:    DESKTOP-3APDBKG (Funnel https://desktop-3apdbkg.taildf3a4b.ts.net)"
  Write-Host "Port mutate:   REFUSED (no schema/secret/WEBHOOK changes from this kit)"
  Write-Host ""
  Write-Host "Manual one-shot start (after env file exists):"
  Write-Host "  powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$startScript`" -RepoRoot `"$RepoRoot`" -EnvFile `"$EnvFile`""
}

function Get-ExistingTask {
  try {
    return Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
  } catch {
    return $null
  }
}

Show-Plan

switch ($Action) {
  "DryRun" {
    Write-Host "DryRun: no Scheduled Task created or removed."
    $existing = Get-ExistingTask
    if ($existing) {
      Write-Host "Existing task state: $($existing.State)"
    } else {
      Write-Host "Existing task: none"
    }
    exit 0
  }
  "Status" {
    $existing = Get-ExistingTask
    if (-not $existing) {
      Write-Host "Task '$TaskName' is not registered."
      exit 1
    }
    $info = Get-ScheduledTaskInfo -TaskName $TaskName
    Write-Host "State: $($existing.State)"
    Write-Host "LastRunTime: $($info.LastRunTime)"
    Write-Host "LastTaskResult: $($info.LastTaskResult)"
    Write-Host "NextRunTime: $($info.NextRunTime)"
    exit 0
  }
  "Unregister" {
    $existing = Get-ExistingTask
    if (-not $existing) {
      Write-Host "Nothing to unregister."
      exit 0
    }
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Unregistered task '$TaskName'."
    exit 0
  }
  "Register" {
    if (-not (Test-Path -LiteralPath $EnvFile)) {
      throw "Refuse Register: env file missing at $EnvFile — create it first (never commit secrets)."
    }
    $existing = Get-ExistingTask
    if ($existing) {
      Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
      Write-Host "Removed previous task '$TaskName'."
    }

    $action = New-ScheduledTaskAction -Execute $powershellExe -Argument $arguments
    $trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
    $settings = New-ScheduledTaskSettingsSet `
      -AllowStartIfOnBatteries `
      -DontStopIfGoingOnBatteries `
      -StartWhenAvailable `
      -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
      -RestartCount 3 `
      -RestartInterval (New-TimeSpan -Minutes 1)
    # Unlimited execution for a watcher that exits after spawn+health:
    # ExecutionTimeLimit 0 = no limit on Windows PowerShell scheduled task settings.
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

    Register-ScheduledTask `
      -TaskName $TaskName `
      -Action $action `
      -Trigger $trigger `
      -Settings $settings `
      -Principal $principal `
      -Description "Start factory-gateway (+ optional Tailscale Funnel) at Windows logon. Meta lane only." `
      -Force | Out-Null

    Write-Host "Registered task '$TaskName' for user $env:USERNAME at logon."
    Write-Host "Verify:  powershell -File `"$PSCommandPath`" -Action Status"
    Write-Host "Smoke:   curl.exe -fsS http://127.0.0.1:8787/health"
    Write-Host "Public:  curl.exe -fsS https://desktop-3apdbkg.taildf3a4b.ts.net/health   # off-tailnet preferred"
    exit 0
  }
  default {
    throw "Unhandled Action: $Action"
  }
}
