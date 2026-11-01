# port-catalog-intermediary — option (a) translator for the §4.2.1 catalog round-trip

**Status (2026-10-31): built + unit/integration-tested locally with mocks.
Not deployed, not merged. Gateway code is untouched.**

## Why this exists

PR #116 gave the gateway a `WorkflowCatalogStore` that POSTs one JSON
envelope per catalog operation to `PORT_CATALOG_WORKFLOW_URL` and expects a
synchronous JSON answer. Live Port inspection (2026-10-31, owner-step queue
item 14) proved that URL **cannot be a Port workflow**: Port workflows have
no inbound HTTP trigger and no synchronous return node; the only external
start is the authenticated Port API runs endpoint (async, 201).

Option (a) — approved by Johnny 2026-10-31 — puts a small intermediary at
that URL instead:

```
factory-gateway (NO Port credential)
  │  POST { kind:"catalog_read", blueprint, entityIdentifier }
  │       → { entity | null }
  │  POST { kind:"catalog_upsert", entity }
  │       → { ok:true }
  ▼
port-catalog-intermediary  ← holds the ONLY Port API credential
  │  client-credentials auth → start workflow run → poll run → extract
  ▼
Port (system of record)
```

The §4.2.1 fence (single-writer + `catalogVersion` reject-stale) stays in
the gateway, unchanged. The intermediary is a dumb, stateless translator:
no entity bytes are stored, every failure throws → HTTP 502 → the gateway
fails closed and the caller re-reads/retries per the §4.2.1 retry rule.

## Live modes — read this before deploying

- **`PORT_CATALOG_MODE=entity` (recommended for the first live smoke):**
  the intermediary performs the read/upsert directly against the Port
  entity API (`GET/POST /v1/blueprints/{bp}/entities…`). Needs no new
  Port-side workflows and is the only mode whose full path is verifiable
  today.
- **`PORT_CATALOG_MODE=workflow`:** each operation starts the configured
  Port workflow run (`factory_catalog_read` / `factory_catalog_upsert`)
  and polls it. Upserts map cleanly (run completion = the workflow's
  UPSERT_ENTITY node landed). **Reads carry one unverified assumption:**
  that the read workflow's entity surfaces in the run output
  (`output.entity`); if it doesn't, the translator falls back to fetching
  the entity by identifier through the entity API. These two workflows do
  not exist in Port yet — defining them is a live step, not part of this
  package.

## Timing constraint

The gateway transport times out at **10s**
(`DEFAULT_WORKFLOW_ROUND_TRIP_TIMEOUT_MS`). The intermediary's default run
deadline is **9s** (`INTERMEDIARY_RUN_DEADLINE_MS`) to fit inside it. If
live Port runs prove slower, raise both together (gateway follow-up PR:
make the transport timeout env-configurable).

## Run it

```bash
# env: see .env.example (values from the vault / 0600 keys.local only)
npm --prefix apps/port-catalog-intermediary run start   # tsx, no build needed
# or: npm run build && node dist/index.js
curl http://127.0.0.1:8788/health
```

Gateway cutover env (on the gateway host, same machine):

```
FACTORY_CATALOG_STORE=workflow
PORT_CATALOG_WORKFLOW_URL=http://127.0.0.1:8788/catalog
```

## Tests

```bash
npm --prefix apps/port-catalog-intermediary test
# 16 tests: translator (workflow + entity modes), Port client auth/caching,
# config fail-closed, and an end-to-end test that drives the REAL gateway
# WorkflowCatalogStore + CatalogWriter over HTTP into this intermediary
# against a fake Port (create → catalogVersion 1, stale write rejected
# before Port, second write → 2).
```

## Remaining live steps (deploy + smoke)

1. **Port API credential:** create a Port API client (service account) in
   the Port org; store the pair in the vault / `keys.local` (0600) under
   the names `PORT_CLIENT_ID` / `PORT_CLIENT_SECRET`. As of 2026-10-31 the
   vault holds **no** Port REST credential (220 names checked) and the
   `custom.port` connector credential is a stale OAuth token for the MCP
   server (401) — neither is usable here. If the Port console requires an
   interactive admin consent, that tap is Johnny's.
2. **Host:** run the intermediary on the same host as the live gateway
   (desktop, per the gateway's Funnel deployment) bound to loopback.
3. **Cutover:** set the two gateway env vars above, restart the gateway,
   confirm `GET /health` on both processes.
4. **Smoke:** one `factory_*`-driven catalog write (or a direct
   `POST /catalog/write` through the gateway) → confirm the entity exists
   in Port with `catalogVersion` bumped by exactly 1, and a stale-version
   retry is rejected gateway-side.
5. **Rollback:** unset `FACTORY_CATALOG_STORE` (defaults to memory) +
   restart the gateway. The intermediary can be stopped independently.
