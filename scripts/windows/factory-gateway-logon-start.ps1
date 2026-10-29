#Requires -Version 5.1
<#
.SYNOPSIS
  Start factory-gateway after Windows logon (DESKTOP-3APDBKG pilot path).

.DESCRIPTION
  Invoked by Task Scheduler task "FactoryGatewayLogon".
  Loads secrets from a local env file (never from git). Starts the gateway on
  :8787, optionally re-enables Tailscale Funnel, then probes GET /health.

  Does not touch Port schemas, secrets, or WEBHOOK remounts.

.PARAMETER RepoRoot
  Absolute path to the factory clone. Default: two levels above this script.

.PARAMETER EnvFile
  Dotenv-style file (KEY=VALUE). Default: %USERPROFILE%\.factory\gateway.env

.PARAMETER SkipFunnel
  Do not run `tailscale funnel --bg 8787`.

.PARAMETER HealthTimeoutSec
  Seconds to wait for local /health before failing (default 45).
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = "",
  [string]$EnvFile = "",
  [switch]$SkipFunnel,
  [int]$HealthTimeoutSec = 45
)

$ErrorActionPreference = "Stop"

function Write-Log {
  param([string]$Message, [string]$Level = "INFO")
  $ts = (Get-Date).ToString("o")
  $line = "[$ts] [$Level] $Message"
  Write-Host $line
  if ($script:LogPath) {
    Add-Content -LiteralPath $script:LogPath -Value $line -Encoding UTF8
  }
}

function Import-DotEnvFile {
  param([Parameter(Mandatory = $true)][string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Env file not found: $Path (create it with PORT_CLIENT_SECRET and optional FACTORY_GATEWAY_HANDLER_TOKEN; never commit)"
  }
  $loaded = 0
  foreach ($raw in Get-Content -LiteralPath $Path -Encoding UTF8) {
    $line = $raw.Trim()
    if (-not $line -or $line.StartsWith("#")) { continue }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { continue }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    if (
      ($val.StartsWith('"') -and $val.EndsWith('"')) -or
      ($val.StartsWith("'") -and $val.EndsWith("'"))
    ) {
      $val = $val.Substring(1, $val.Length - 2)
    }
    if ($key -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') { continue }
    # Set process env only; never log values.
    [Environment]::SetEnvironmentVariable($key, $val, "Process")
    $loaded++
  }
  Write-Log "Loaded $loaded env keys from env file (values not logged)."
}

function Test-LocalHealth {
  try {
    $resp = Invoke-WebRequest -Uri "http://127.0.0.1:8787/health" -UseBasicParsing -TimeoutSec 5
    if ($resp.StatusCode -ne 200) { return $false }
    return ($resp.Content -match '"ok"\s*:\s*true' -and $resp.Content -match 'factory-gateway')
  } catch {
    return $false
  }
}

# --- paths ---
if (-not $RepoRoot) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
}
if (-not $EnvFile) {
  $EnvFile = Join-Path $env:USERPROFILE ".factory\gateway.env"
}

$factoryDir = Join-Path $env:USERPROFILE ".factory"
$logDir = Join-Path $factoryDir "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$script:LogPath = Join-Path $logDir "gateway-logon.log"

$gatewayDir = Join-Path $RepoRoot "apps\factory-gateway"
if (-not (Test-Path -LiteralPath (Join-Path $gatewayDir "package.json"))) {
  throw "factory-gateway package not found under $RepoRoot"
}

Write-Log "RepoRoot=$RepoRoot"
Write-Log "GatewayDir=$gatewayDir"
Write-Log "EnvFile=$EnvFile (contents not logged)"
Write-Log "ComputerName=$env:COMPUTERNAME User=$env:USERNAME"

Import-DotEnvFile -Path $EnvFile

if (-not $env:PORT_CLIENT_SECRET) {
  Write-Log "PORT_CLIENT_SECRET is unset after env load — HMAC admits will 401 until set." "WARN"
}

# Prefer already-running healthy process (idempotent logon).
if (Test-LocalHealth) {
  Write-Log "factory-gateway already healthy on :8787 — skipping start."
} else {
  $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
  $npmCmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if (-not $npmCmd) { $npmCmd = Get-Command npm -ErrorAction SilentlyContinue }
  if (-not $nodeCmd -or -not $npmCmd) {
    throw "Node.js/npm not on PATH (need Node >= 20)."
  }

  if (-not $env:GATEWAY_HOST) { $env:GATEWAY_HOST = "0.0.0.0" }
  if (-not $env:GATEWAY_PORT) { $env:GATEWAY_PORT = "8787" }

  $outLog = Join-Path $logDir "gateway-stdout.log"
  $errLog = Join-Path $logDir "gateway-stderr.log"
  $cmdExe = Join-Path $env:SystemRoot "System32\cmd.exe"

  # cmd.exe so npm.cmd works under redirected Start-Process (PS 5.1).
  # Env vars set on this process are inherited; values are never logged.
  $cmdLine = "/c npm start >> `"$outLog`" 2>> `"$errLog`""
  Write-Log "Starting npm start in apps/factory-gateway (stdout/stderr → .factory/logs)."
  $proc = Start-Process -FilePath $cmdExe `
    -ArgumentList $cmdLine `
    -WorkingDirectory $gatewayDir `
    -WindowStyle Hidden `
    -PassThru
  Write-Log "Spawned gateway wrapper pid=$($proc.Id)"

  $deadline = (Get-Date).AddSeconds($HealthTimeoutSec)
  while ((Get-Date) -lt $deadline) {
    if (Test-LocalHealth) { break }
    Start-Sleep -Seconds 1
  }
  if (-not (Test-LocalHealth)) {
    throw "Timed out waiting for http://127.0.0.1:8787/health after ${HealthTimeoutSec}s"
  }
  Write-Log "Local /health OK."
}

if (-not $SkipFunnel) {
  $ts = Get-Command tailscale -ErrorAction SilentlyContinue
  if ($ts) {
    Write-Log "Ensuring Tailscale Funnel on 8787 (bg)."
    & tailscale funnel --bg 8787
    & tailscale funnel status 2>&1 | ForEach-Object { Write-Log "funnel: $_" }
  } else {
    Write-Log "tailscale not on PATH — skip Funnel; start gateway only." "WARN"
  }
}

Write-Log "Logon start complete."
exit 0
