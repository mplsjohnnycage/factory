# Offline desktop ops tick

**When:** 2026-10-29 (America/Chicago)  
**Lane:** Meta · store-only ops/docs · no Observatory · no Port OAuth create/delete  
**Desktops:** Johhny-NET + DESKTOP-3APDBKG **offline**

## What moved without Johnny online

| Item | Result |
|------|--------|
| `main` tip | `b489d2c` — OAuth pin [#42](https://github.com/mplsjohnnycage/factory/pull/42) |
| Merged this morning | [#39](https://github.com/mplsjohnnycage/factory/pull/39) OpenAccess · [#40](https://github.com/mplsjohnnycage/factory/pull/40) remount dry-run · [#41](https://github.com/mplsjohnnycage/factory/pull/41) Dockerfile · [#42](https://github.com/mplsjohnnycage/factory/pull/42) OAuth pin |
| FE-128 curl recheck | **PASS** — stable alias `redirect_uri=https://factory-developer-os.vercel.app/api/auth/callback` |
| Remount dry-run kit | Ran `scripts/gateway-remount-dry-run.mjs` vs local mock `:18787` → exit 0; Port untouched |
| Funnel / WEBHOOK remount | **Not done** — no public `/health`; checklist armed |
| Prune `n5tdoht4l` | **Not done** — hard ban this run |
| PBI-015 | **Not started** — hard ban this run |

## Docs updated this tick

- [`funnel-remount-status.md`](./funnel-remount-status.md) — offline banner; remount armed; additive-notify note  
- [`morning-parallel-sprint.md`](./morning-parallel-sprint.md) — #39–42 merged; FE-128/Johnny blockers  
- [`fe-128-oauth-prod-verify.md`](./fe-128-oauth-prod-verify.md) — #42 merged; curl PASS; FE-128 open  
- [`claude-code-handoff.md`](./claude-code-handoff.md) — open-work + snapshot for offline desktops  

## Hard bans honored

No Funnel remount · no WEBHOOK remount · no prune of 5th callback URI · no PBI-015 · no Observatory · no Port OAuth create/delete.

---

**Blocked only on Johnny:** public gateway `/health` URL (desktop Funnel) + human Sign in with Port (then prune `n5tdoht4l`).
