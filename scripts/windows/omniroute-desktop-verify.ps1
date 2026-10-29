#Requires -Version 5.1
<#
.SYNOPSIS
  OmniRoute / OmniRouter desktop verify helper (Factory Meta kit).

.DESCRIPTION
  DryRun  — confirm kit files exist next to this script (no install, no network).
  Health  — GET http://127.0.0.1:20128/healthz (requires OmniRoute already running).

  Does not print secrets. Does not call Port. Does not install OmniRoute.

.PARAMETER Action
  DryRun | Health

.PARAMETER RepoRoot
  Factory repo root. Default: parent of scripts/

.PARAMETER BaseUrl
  OmniRoute base (Health only). Default: http://127.0.0.1:20128
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [ValidateSet('DryRun', 'Health')]
  [string]$Action = 'DryRun',

  [Parameter(Mandatory = $false)]
  [string]$RepoRoot = '',

  [Parameter(Mandatory = $false)]
  [string]$BaseUrl = 'http://127.0.0.1:20128'
)

$ErrorActionPreference = 'Stop'

function Get-FactoryRepoRoot {
  param([string]$Explicit)
  if ($Explicit -and $Explicit.Trim().Length -gt 0) {
    return (Resolve-Path -LiteralPath $Explicit).Path
  }
  $here = Split-Path -Parent $PSCommandPath
  # scripts/windows -> repo root
  return (Resolve-Path -LiteralPath (Join-Path $here '..\..')).Path
}

function Test-KitFiles {
  param([string]$Root)
  $required = @(
    'docs\ops\omniroute-desktop-install.md',
    'scripts\omniroute-desktop-dry-run.mjs',
    'scripts\windows\omniroute.env.example',
    'scripts\windows\omniroute-desktop-verify.ps1'
  )
  $failed = $false
  foreach ($rel in $required) {
    $abs = Join-Path $Root $rel
    if (-not (Test-Path -LiteralPath $abs)) {
      Write-Host "FAIL missing: $rel"
      $failed = $true
    }
    else {
      Write-Host "OK  $rel"
    }
  }
  $envExample = Join-Path $Root 'scripts\windows\omniroute.env.example'
  if (Test-Path -LiteralPath $envExample) {
    $body = Get-Content -LiteralPath $envExample -Raw
    if ($body -notmatch 'OMNIROUTE_PORT=20128') {
      Write-Host 'FAIL omniroute.env.example missing OMNIROUTE_PORT=20128'
      $failed = $true
    }
    if ($body -match '(?im)^(OPENAI_API_KEY|ANTHROPIC_API_KEY|OMNIROUTE_API_KEY)=\S+') {
      Write-Host 'FAIL possible committed API key assignment in omniroute.env.example'
      $failed = $true
    }
  }
  return -not $failed
}

function Invoke-Health {
  param([string]$Url)
  $health = ($Url.TrimEnd('/') + '/healthz')
  Write-Host "GET $health"
  try {
    $resp = Invoke-WebRequest -Uri $health -UseBasicParsing -TimeoutSec 10
    Write-Host ("HTTP {0}" -f [int]$resp.StatusCode)
    Write-Host $resp.Content
    if ([int]$resp.StatusCode -ne 200) {
      return $false
    }
    return $true
  }
  catch {
    Write-Host ("FAIL health: {0}" -f $_.Exception.Message)
    return $false
  }
}

$root = Get-FactoryRepoRoot -Explicit $RepoRoot
Write-Host '=== OmniRoute desktop verify ==='
Write-Host ("Repo root: {0}" -f $root)
Write-Host ("Action: {0}" -f $Action)
Write-Host 'Port mutate: REFUSED'
Write-Host 'Provider spend: REFUSED'
Write-Host ''

switch ($Action) {
  'DryRun' {
    $ok = Test-KitFiles -Root $root
    if (-not $ok) {
      Write-Host 'DryRun FAILED'
      exit 1
    }
    Write-Host 'DryRun PASS (kit staged; live OmniRoute start pending desktop)'
    exit 0
  }
  'Health' {
    $ok = Invoke-Health -Url $BaseUrl
    if (-not $ok) {
      Write-Host 'Health FAILED (is omniroute listening on :20128?)'
      exit 1
    }
    Write-Host 'Health PASS'
    exit 0
  }
  default {
    throw "Unhandled Action: $Action"
  }
}
