# Port workflows (Meta as-code)

Source of truth for Meta-owned Port self-service workflows that previously ended in **NEEDS HANDLER** stubs.

| File | Live identifier | Lane |
|------|-----------------|------|
| `ss_convex_create_preview.json` | `ss_convex_create_preview` | Meta |
| `ss_convex_set_env.json` | `ss_convex_set_env` | Meta |

Apply with Port MCP `upsert_workflow` (pass the JSON object as `workflow`) or Port UI import. Gateway implements `POST /handlers/self-service`.

**Product stubs (do not upsert Meta handlers):** `ss_painter_create_tenant_site`, `ss_prospect_*` — keep Port CONDITION `needs_handler` until Product owns backends.

**Port secrets required for Meta Convex LIVE path:**

- `FACTORY_GATEWAY_BASE_URL` — e.g. `https://gateway.example` (no trailing slash)
- `FACTORY_GATEWAY_HANDLER_TOKEN` — shared bearer with gateway env
- Gateway env `CONVEX_TEAM_TOKEN` — Convex Management team access token
