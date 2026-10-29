# Windows logon gateway — PM checklist (post-#59)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** After [#59](https://github.com/mplsjohnnycage/factory/pull/59) (Task Scheduler AtLogOn kit on `main`), confirm the **repo kit is intact** from any OS, then track the **one-time desktop register + reboot+logon** proof on the pilot host.  
**Full runbook:** [`gateway-windows-logon-autostart.md`](./gateway-windows-logon-autostart.md)  
**Pilot host:** `DESKTOP-3APDBKG` · Funnel (when up): `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Hard bans:** no secret values in chat/docs/PRs · no Port schema / blueprint upsert · no OAuth EI create/delete/revoke · no WEBHOOK remount from this checklist · zero spend

## FE-142 note (CLOSED — do not re-ask)

Signed Funnel claim + handler-token path are **CLOSED**. Port org secrets were PATCHed. Do **not** ask Johnny for `PORT_CLIENT_SECRET` / `FACTORY_GATEWAY_HANDLER_TOKEN` again. Local fill of `%USERPROFILE%\.factory\gateway.env` stays on the desktop only (never paste values here).

## What cloud can prove vs what desktop must prove

| Gate | Owner | Expect |
|------|-------|--------|
| Kit files + markers | Cloud / CI | `npm run dry-run:windows-logon` → **PASS** |
| Env template empty | Cloud | `gateway.env.example` keys present, **no** assigned secret values in git |
| Task Scheduler DryRun / Register | Desktop (Johnny) | PowerShell on `DESKTOP-3APDBKG` after pull |
| Reboot+logon `/health` (local + Funnel) | Desktop (Johnny) | `200` both; task `Status` OK |
| Port schema / secrets upsert | **Nobody from this kit** | **REFUSED** |

Cloud agents **stage and dry-run only**. Do not claim reboot+logon PASS without desktop evidence.

## Tick checklist

```text
[ ] 1. Cloud kit dry-run PASS (any OS)
[ ] 2. Confirm FE-142 closed — no secret re-ask in this ticket/PR
[ ] 3. Desktop: pull main, copy gateway.env.example → local gateway.env (fill locally)
[ ] 4. Desktop: register-task -Action DryRun then Register
[ ] 5. Desktop: reboot+logon → local + Funnel /health + task Status
[ ] 6. Reply PASS/FAIL lines only (no secrets, no env paste)
```

### 1) Cloud kit dry-run (any OS)

```bash
npm run dry-run:windows-logon
# or: node scripts/gateway-windows-logon-dry-run.mjs
```

| Expect | Detail |
|--------|--------|
| Exit | **0** |
| Scripts | `factory-gateway-logon-start.ps1` · `factory-gateway-register-logon-task.ps1` |
| Template | `scripts/windows/gateway.env.example` (empty values) |
| Docs | Full runbook + this PM checklist |
| Port mutate | Script prints **REFUSED** |

Record **PASS/FAIL** for exit 0 only. Do not print env contents.

### 2) FE-142 gate (PM)

| Check | Result expected |
|-------|-----------------|
| Secret re-ask in ticket/PR body | **Absent** |
| Secret assignment in git | **Absent** |
| Live signed Funnel smoke | Out of scope here — see signed-admit ops when that kit lands on `main` |

### 3–5) Desktop (Johnny on DESKTOP-3APDBKG) — STAGED

Condensed from the full runbook (do not paste secret values):

1. Pull `main` to a stable path (example `C:\src\factory`).
2. Copy `scripts\windows\gateway.env.example` → `%USERPROFILE%\.factory\gateway.env`; fill **locally**.
3. `npm ci` once under `apps\factory-gateway`.
4. `powershell -File scripts\windows\factory-gateway-register-logon-task.ps1 -Action DryRun -RepoRoot <clone>`
5. Same script `-Action Register`, then reboot+logon.
6. `curl.exe -fsS http://127.0.0.1:8787/health` and Funnel `/health`; `-Action Status` + tail log if needed.

Cloud replies **STAGED** for steps 3–5 until desktop evidence lands.

### 6) Reply shape (PM / cloud)

```text
windows-logon kit dry-run: PASS|FAIL
FE-142 secret re-ask: ABSENT
desktop DryRun/Register: STAGED|PASS|FAIL
reboot+logon health: STAGED|PASS|FAIL
Port schema upsert: REFUSED
```

## Related

- Full operator runbook: [`gateway-windows-logon-autostart.md`](./gateway-windows-logon-autostart.md)
- Gateway README pointer: `apps/factory-gateway/README.md`
- Remount dry-run (separate): `docs/gateway-remount-dry-run.md`
- OmniRoute desktop kit (separate host tooling): [`omniroute-desktop-install.md`](./omniroute-desktop-install.md)
- Unsigned Funnel admit kit: [`beads-gateway-unsigned-admit.md`](./beads-gateway-unsigned-admit.md)

## Explicit non-goals

- Live Port secret upsert, WEBHOOK remount, or EI OAuth mutations  
- Treating Vercel Dev OS as the gateway host  
- Overlapping signed HMAC admit smoke kit work (separate PR)  
- Claiming desktop reboot PASS from a cloud agent alone  
