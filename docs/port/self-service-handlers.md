# Port self-service handlers (Meta)

Wires Factory Meta **NEEDS HANDLER** Port self-service actions that belong on the Meta lane. Product Prospect / Painter stubs stay stubs.

## Inventory (live Port, 2026-10-29)

| Identifier | Prior state | Meta decision |
|------------|-------------|---------------|
| `ss_convex_create_preview` | CONDITION needs_handler | **Wired** → gateway `/handlers/self-service` |
| `ss_convex_set_env` | CONDITION needs_handler | **Wired** → gateway `/handlers/self-service` |
| `ss_painter_create_tenant_site` | needs_handler | **Product lane** — leave stub |
| `ss_prospect_qualify` | needs_handler | **Product lane** — leave stub |
| `ss_prospect_generate_site` | needs_handler | **Product lane** — leave stub |
| `ss_prospect_request_outreach` | needs_handler | **Product lane** — leave stub |
| `ss_prospect_run_discovery` | needs_handler | **Product lane** — leave stub |

Provider SS already LIVE (not in scope): `ss_linear_*`, `ss_github_*`, `ss_vercel_*`, `ss_sprite_provision`, `factory_*`.

## Control path

```
Port self-service → approval INPUT → WEBHOOK
  → factory-gateway POST /handlers/self-service
  → Convex Management API (team token)
  → optional §4.2.1 catalog project (convexDeployment)
```

As-code: `port/workflows/`. Implementation: `apps/factory-gateway/src/self-service-handlers.ts`.

## Ops to go LIVE end-to-end

1. Deploy `factory-gateway` with `CONVEX_TEAM_TOKEN` + `FACTORY_GATEWAY_HANDLER_TOKEN` (+ existing `PORT_CLIENT_SECRET`).
2. Add Port secrets `FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN`.
3. Upsert workflows from `port/workflows/*.json` (done in this change for Convex Meta).
4. Seed a Meta `product` + know its Convex `projectId` before running create/preview.

`factory_*` WEBHOOK → gateway admit path remains FE-106 / separate from these provider SS handlers.
