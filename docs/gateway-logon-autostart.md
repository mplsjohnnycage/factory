# FE-153 — Gateway Windows logon auto-start

**Lane:** Meta  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**)  
**Pilot:** `DESKTOP-3APDBKG`  
**Branch:** `cursor/gateway-windows-logon-autostart-308e`  
**Author ≠ reviewer:** this agent authored; independent review required before merge.

## Delivered (repo)

| Path | Role |
|------|------|
| `scripts/windows/factory-gateway-logon-start.ps1` | Logon: load `%USERPROFILE%\.factory\gateway.env` → `npm start` → local `/health` → optional `tailscale funnel --bg 8787` |
| `scripts/windows/factory-gateway-register-logon-task.ps1` | Task Scheduler `FactoryGatewayLogon` — `DryRun` / `Register` / `Unregister` / `Status` |
| `scripts/windows/gateway.env.example` | Local env template (empty values only) |
| `scripts/gateway-windows-logon-dry-run.mjs` | Cross-OS kit presence dry-run |
| `docs/ops/gateway-windows-logon-autostart.md` | Operator runbook |
| `apps/factory-gateway/README.md` | Pointer to Windows kit |

## Verification this pass

| Check | Result |
|-------|--------|
| `node scripts/gateway-windows-logon-dry-run.mjs` | **PASS** (exit 0) |
| Secrets in git | **None** (example keys empty; scripts log counts only) |
| Port schema / secret upsert | **Not done** (refused) |
| Live reboot+logon on DESKTOP-3APDBKG | **STAGED** — needs Johnny desktop |

## Johnny (3 lines)

1. Pull this PR on **DESKTOP-3APDBKG**, copy `scripts/windows/gateway.env.example` → `%USERPROFILE%\.factory\gateway.env`, fill `PORT_CLIENT_SECRET` / `FACTORY_GATEWAY_HANDLER_TOKEN` locally (never commit).  
2. `powershell -File scripts\windows\factory-gateway-register-logon-task.ps1 -Action DryRun` then `-Action Register -RepoRoot <clone>`.  
3. Reboot+logon → `curl http://127.0.0.1:8787/health` and Funnel `https://desktop-3apdbkg.taildf3a4b.ts.net/health` — cloud cannot complete that verify.
