# factory-gateway Windows logon auto-start

**Lane:** Meta  
**Pilot host:** `DESKTOP-3APDBKG`  
**Public Funnel (when up):** `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Scripts:** `scripts/windows/`  
**Kit dry-run (any OS):** `scripts/gateway-windows-logon-dry-run.mjs`

## Verdict

Prefer **Task Scheduler AtLogOn** over a Startup-folder shortcut. The task runs `factory-gateway-logon-start.ps1`, which loads a **local** env file, starts `npm start` in `apps/factory-gateway`, waits for `GET http://127.0.0.1:8787/health`, then optionally `tailscale funnel --bg 8787`.

Cloud agents **cannot** complete live reboot+logon verify on Johnny’s desktop. They stage scripts, dry-run the kit, and open a PR. Johnny runs `-Action Register` once on `DESKTOP-3APDBKG`, then confirms after reboot.

**Hard bans:** no Port schema upsert, no Port secret paste into git/chat, no OAuth EI create/delete/revoke, no WEBHOOK remount from this kit.

---

## Files

| Path | Role |
|------|------|
| `scripts/windows/factory-gateway-logon-start.ps1` | Logon start: env load → `npm start` → health → Funnel |
| `scripts/windows/factory-gateway-register-logon-task.ps1` | `DryRun` / `Register` / `Unregister` / `Status` |
| `scripts/windows/gateway.env.example` | Local env template (copy to `%USERPROFILE%\.factory\gateway.env`) |
| `scripts/gateway-windows-logon-dry-run.mjs` | Repo kit presence check (Linux/macOS/Windows Node) |

---

## One-time setup (Johnny on DESKTOP-3APDBKG)

1. Clone/pull `factory` to a stable path (example: `C:\src\factory`).
2. Install **Node ≥ 20** and ensure `node` / `npm` are on the user PATH used at logon.
3. Create the env directory and file (**never commit**):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.factory\logs" | Out-Null
Copy-Item C:\src\factory\scripts\windows\gateway.env.example `
  "$env:USERPROFILE\.factory\gateway.env"
# Edit gateway.env — set PORT_CLIENT_SECRET and FACTORY_GATEWAY_HANDLER_TOKEN to match Port.
notepad "$env:USERPROFILE\.factory\gateway.env"
```

4. Install gateway deps once:

```powershell
cd C:\src\factory\apps\factory-gateway
npm ci
```

5. Dry-run the scheduled task (no registration):

```powershell
cd C:\src\factory
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-register-logon-task.ps1 `
  -Action DryRun `
  -RepoRoot C:\src\factory
```

6. Register AtLogOn task:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-register-logon-task.ps1 `
  -Action Register `
  -RepoRoot C:\src\factory
```

7. Optional immediate smoke (without reboot):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\factory-gateway-logon-start.ps1 `
  -RepoRoot C:\src\factory
curl.exe -fsS http://127.0.0.1:8787/health
# Prefer off-tailnet for Funnel:
curl.exe -fsS https://desktop-3apdbkg.taildf3a4b.ts.net/health
```

8. **Survive reboot+logon proof:** sign out or reboot, sign in, then re-check local + Funnel `/health`. Task status:

```powershell
powershell -File .\scripts\windows\factory-gateway-register-logon-task.ps1 -Action Status
Get-Content $env:USERPROFILE\.factory\logs\gateway-logon.log -Tail 40
```

---

## Env file contract

Path: `%USERPROFILE%\.factory\gateway.env`  
Template: `scripts/windows/gateway.env.example`

| Key | Required | Notes |
|-----|----------|--------|
| `PORT_CLIENT_SECRET` | Yes for admits | Port classic HMAC — match Port Client Secret |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | For Meta SS | Same value as Port secret of that name |
| `GATEWAY_HOST` / `GATEWAY_PORT` | No | Default `0.0.0.0` / `8787` |
| `RIVET_SUPERVISOR_URL` | No | Optional Serve URL |
| `CONVEX_TEAM_TOKEN` | No | Meta `ss_convex_*` only |

Scripts log **key counts**, never values.

---

## Why Task Scheduler (not Startup folder alone)

| Mechanism | Reboot+logon | Restart on fail | WorkingDirectory / args | Notes |
|-----------|--------------|-----------------|-------------------------|-------|
| **Task Scheduler AtLogOn** (preferred) | Yes | Yes (`RestartCount`) | Explicit | Survives Explorer Startup quirks |
| Startup folder `.lnk` | Yes (interactive) | No | Fragile | Optional backup only |
| Windows Service | Yes (pre-logon) | Yes | Needs service wrapper | Out of scope for M1 desktop Funnel |

Optional Startup backup (after task works):

```powershell
$start = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
# Prefer the scheduled task. Do not dual-start unless you know you need a backup.
```

---

## Unregister

```powershell
powershell -File .\scripts\windows\factory-gateway-register-logon-task.ps1 -Action Unregister
```

---

## Cloud / CI dry-run (no Windows)

```bash
node scripts/gateway-windows-logon-dry-run.mjs
# exit 0 = kit files present + markers OK
```

---

## Related

- Remount dry-run: `docs/gateway-remount-dry-run.md`
- Funnel / Port remount armed path: store `docs/remount-armed-runbook.md` / `docs/funnel-remount-status.md`
- Gateway README Docker / Funnel: `apps/factory-gateway/README.md`

## Explicit non-goals

- Live Port secret upsert or WEBHOOK remount  
- Port OAuth / External Interface mutations  
- Treating Vercel Dev OS as the gateway host  
- Claiming reboot+logon PASS without Johnny desktop evidence  
