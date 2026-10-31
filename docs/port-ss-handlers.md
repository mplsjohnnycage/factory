# Port self-service handlers (FE-107)

**Checked:** 2026-10-29  
**Branch:** `cursor/port-ss-handlers-0ff6`  
**Lane:** Meta  
**Avoided:** OAuth External Interface, Vercel CI files, Beads DB

## Outcome

Wired Meta-lane Port **NEEDS HANDLER** self-service actions through `factory-gateway`. Left Prospect / Painter stubs as Product lane.

| Action | Result |
|--------|--------|
| `ss_convex_create_preview` | Live Port WEBHOOK → `/handlers/self-service`; gateway Convex Management client |
| `ss_convex_set_env` | Same path; default env upsert via Management API |
| `ss_painter_*` / `ss_prospect_*` | Titles/descriptions marked **[product lane]**; CONDITION stub kept |

## Repo

- `apps/factory-gateway` — `POST /handlers/self-service` (HMAC or bearer)
- `port/workflows/` — as-code Port workflows
- `docs/port/self-service-handlers.md` — Meta docs
- `specs/port-governance/spec.md` — Contract + scenario

## Ops still needed for E2E

1. Deploy gateway with `CONVEX_TEAM_TOKEN` + `FACTORY_GATEWAY_HANDLER_TOKEN`
2. Port secrets: `FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN`
3. Seed Meta `product` + Convex project id before running create/preview

`factory_*` WEBHOOK→gateway admit remains FE-106 (not this PR).
