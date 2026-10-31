# Code Atlas follow-ups tick (STL-154)

**Lane:** Meta · Zero spend · No secrets · No Port schema mutate (already applied)  
**Branch:** `cursor/code-atlas-followups-ddc3`  
**PR:** https://github.com/mplsjohnnycage/factory/pull/58  
**Author:** `bc-e4c1f61b-7c24-57b5-a68f-37dd4536ddc3`

## Shipped

| Gap | Change |
|-----|--------|
| BFF hardening | JSON content-type + 64 KiB body cap + `Cache-Control: no-store`; subgraph depth clamp; Port underscore → dotted normalize |
| OpenMCP `atlas.*` naming | `factory.atlas_tools.map` in `.well-known/openmcp.json`; validator asserts dotted-only `tools[]` |
| Smoke automation | `scripts/atlas-bff-smoke.mjs` + `npm run smoke:atlas-bff` (dry-run / prod / local) |
| Docs | Spec scenario, README, prep status → APPLIED (no re-apply) |

## Verify

- `apps/developer-os` tests **23/23** + typecheck
- `node scripts/validate-well-known.mjs` OK
- `npm run smoke:atlas-bff -- --dry-run` OK
- Port: dry-run stage only (schema already live per `atlas-schema-apply-run.md`)

---

## Johnny 3-line report

- **Shipped:** [#58](https://github.com/mplsjohnnycage/factory/pull/58) — BFF accepts `atlas_*`↔`atlas.*`, OpenMCP naming map + well-known validator, `npm run smoke:atlas-bff`; prep doc marked applied (no Port re-upsert).
- **Next:** Independent write APPROVE + green `meta-ci-presence` → merge; then re-run live smoke after Vercel prod picks up the SHA (alias check lands with deploy).
- **Blockers:** None. Zero spend; no secrets; Port schema untouched this tick.
