# Desktop / Funnel live checks tick

**When:** 2026-10-29 (cloud agent)  
**Funnel base:** `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Lane:** Meta · zero spend · FE-142 / FE-172 CLOSED · no secret values  
**Adapter mcp_auth:** skipped

## Funnel health

| Item | Result |
|------|--------|
| Command | `curl -fsS https://desktop-3apdbkg.taildf3a4b.ts.net/health` |
| HTTP | **200** |
| Body | `{"ok":true,"service":"factory-gateway"}` |
| Verdict | **PASS** |

## Gateway remount dry-run

| Item | Result |
|------|--------|
| Command | `node scripts/gateway-remount-dry-run.mjs --base-url 'https://desktop-3apdbkg.taildf3a4b.ts.net'` (from repo `main`) |
| Exit | **0** |
| Notes | Printed expected `factory_*` WEBHOOK paths; Port mutate refused; health re-checked green |
| Verdict | **PASS** |

## Remount-armed / Port (read-only)

Health + dry-run are green → **remount-armed runbook may proceed** for PM Port secret / WEBHOOK steps (`docs/remount-armed-runbook.md` in Project store; in-repo `docs/port-workflow-webhooks.md`).

| Action | Status |
|--------|--------|
| Port schema / blueprint upsert | **NOT DONE** (no clear need; health green alone does not authorize upsert this tick) |
| Port secret PATCH / WEBHOOK remount | **PM / operator** — not executed by cloud |
| Port MCP `get_workflow` `factory_claim_next_job` | **Read-only OK** — fencing GETs still `https://api.port.io/v1/...`; admit notify `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/factory_claim_next_job` |
| Secret values printed | **None** |

## Windows logon Register / reboot verify

| Gate | Status |
|------|--------|
| Cloud Register / reboot+logon | **BLOCKED** — cloud cannot run on `DESKTOP-3APDBKG` |
| Owner | Desktop agent: **Grokbot / Reason** or self-hosted worker on that host |
| Checklist | `docs/ops/gateway-windows-logon-pm-checklist.md` · full runbook `docs/ops/gateway-windows-logon-autostart.md` |
| FE-142 secret re-ask | **ABSENT** (CLOSED) |

### Exact commands for Grokbot (on DESKTOP-3APDBKG)

Assume clone at `C:\src\factory` (adjust `-RepoRoot` if different). Do **not** paste env secret values into chat.

```powershell
# 1. Pull main + env template (fill locally; never paste values)
cd C:\src\factory
git pull origin main
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.factory\logs" | Out-Null
Copy-Item C:\src\factory\scripts\windows\gateway.env.example `
  "$env:USERPROFILE\.factory\gateway.env"
# Edit gateway.env locally only (FE-142 closed — values already known on host / Port)

# 2. Gateway deps once
cd C:\src\factory\apps\factory-gateway
npm ci

# 3. Task DryRun then Register
cd C:\src\factory
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-register-logon-task.ps1 `
  -Action DryRun `
  -RepoRoot C:\src\factory

powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-register-logon-task.ps1 `
  -Action Register `
  -RepoRoot C:\src\factory

# 4. Optional immediate smoke (no reboot)
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-logon-start.ps1 `
  -RepoRoot C:\src\factory
curl.exe -fsS http://127.0.0.1:8787/health
curl.exe -fsS https://desktop-3apdbkg.taildf3a4b.ts.net/health

# 5. Survive reboot+logon proof
# Reboot or sign out/in, then:
curl.exe -fsS http://127.0.0.1:8787/health
curl.exe -fsS https://desktop-3apdbkg.taildf3a4b.ts.net/health
powershell -File .\scripts\windows\factory-gateway-register-logon-task.ps1 -Action Status
Get-Content $env:USERPROFILE\.factory\logs\gateway-logon.log -Tail 40
```

Reply shape (no secrets):

```text
windows-logon kit dry-run: PASS|FAIL
FE-142 secret re-ask: ABSENT
desktop DryRun/Register: STAGED|PASS|FAIL
reboot+logon health: STAGED|PASS|FAIL
Port schema upsert: REFUSED
```

## Blockers

1. **Windows AtLogOn Register + reboot+logon proof** — needs Grokbot/Reason (or self-hosted worker) on `DESKTOP-3APDBKG`; cloud marked **BLOCKED**.
2. **Port secret / WEBHOOK operator steps** — remount-armed may proceed (health green); PM owns secret set + any remount; cloud did not mutate Port this tick.

## 3-line summary

1. Funnel `/health` → **200** + `ok`/`factory-gateway` (**PASS**).
2. `gateway-remount-dry-run.mjs` → exit **0** (**PASS**); remount-armed OK for PM; Port upsert skipped; read-only `get_workflow` fencing intact.
3. Windows Register/reboot → **BLOCKED** (desktop agent required); FE-142/FE-172 closed; zero spend; no secrets.
