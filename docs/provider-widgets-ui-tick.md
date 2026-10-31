---
cursor:
  subagentId: "bc-2be14b57-3509-53d0-9550-f008b1693b4d"
---

# FE-197 — Provider dashboard widgets UI (tick)

**When:** 2026-10-29  
**Worker:** `bc-2be14b57-3509-53d0-9550-f008b1693b4d`  
**Audience:** Projects Manager  
**Spend:** Zero · fixtures only · no Port upserts · FE-142/FE-172 stay CLOSED · author≠reviewer (no self-APPROVE)

## Outcome

Shipped first shippable slice of **Provider widgets** against locked comps (`provider-widget-grid-dark.png` · `Provider Dashboard.dc.html` · per-provider widget comps).

| Item | Detail |
|------|--------|
| Route | `/providers` (dark cockpit ambient via `CockpitShell mode="cockpit"`) |
| UI | `ProviderGrid` — glass tiles + light Provider Dashboard detail |
| Tile set | **Port · Vercel · GitHub · Convex · Docker · Turso** (+ Add Widget) |
| Detail | 4 KPIs · recent activity · surface-tool chips (read/status only) |
| Shell | New **Providers** tab; Cockpit `/`, Atlas `/atlas`, Intelligence `/intelligence` unchanged |
| Cockpit Apps | Port / GitHub / Vercel / Add → `/providers` (status strip) |

## PR

- **PR:** https://github.com/mplsjohnnycage/factory/pull/104
- Branch: `cursor/provider-widgets-ui-3b4d`
- Base: `main` (includes #99 Cockpit · #100 Atlas · #102 Intelligence)
- Head: `76beae5475a16b0d51d2171384347145f276eedb`
- Verify: `npm test` · `npm run typecheck` · `npm run build` in `apps/developer-os` — PASS (`/providers` in route table)

## Guardrails held

- No Port `upsert_*` / WEBHOOK remount from UI  
- No secrets in fixtures (asserted in tests; FE-142 / FE-172 CLOSED)  
- No Cockpit / Atlas / Intelligence visual regression (additive tab + Apps hrefs only)  
- Independent review required before merge (this author session excluded)

## Next (out of slice)

- Live provider status joins (beyond fixtures)  
- Per-provider drawer fidelity (Port Assemble / Vercel deploy list full comps)  
- Optional dark-grid Apps strip embed on Cockpit home
