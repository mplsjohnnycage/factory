# factory-gateway

Thin Meta gateway for **PBI-005 / STL-166** + **PBI-011 / STL-172** + **PBI-012 / STL-173**:

1. Verify Port classic webhook **HMAC-SHA-256** (`x-port-signature` / `x-port-timestamp`)
2. Enqueue **ProjectSupervisor** (push-only — Rivet never polls Port)
3. Host **§4.2.1 catalog writer** (single-writer per `{blueprint}:{entityIdentifier}` + `catalogVersion` reject-stale)
4. **Ocean/MCP sync ingress** — Meta-fenced blueprints cannot bypass the writer (`POST /catalog/sync-write`)
5. Accept-on-exact-SHA evaluate/record (ADR-008) — Cockpit/human only
6. **OpenFleet ceilings** + **gateway rate limit** (PBI-012) — over-ceiling → ledger `ceiling.refuse`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness (not rate-limited) |
| `POST` | `/webhooks/port` | HMAC-gated Port webhook → supervisor enqueue |
| `POST` | `/webhooks/port/<factory_*>` | Same HMAC path; allowlisted workflow ID from path (Port WEBHOOK URL templates) |
| `POST` | `/fleet/spawn` | OpenFleet ceiling gate; refuse → `ceiling.refuse` |
| `GET` | `/fleet/ledger` | List ledger events / ceiling refuses for a fleet |
| `POST` | `/accept/evaluate` | ADR-008 accept eligibility for exact SHA (no Port mutation) |
| `POST` | `/accept/record` | Cockpit/human accept evidence only (`X-Factory-Accept-Actor`) |
| `GET` | `/accept/status` | Whether recorded accept still matches tip SHA |
| `POST` | `/catalog/write` | §4.2.1 fenced catalog apply |
| `POST` | `/catalog/sync-write` | Ocean/MCP/workflow sync ingress; rejects Meta fence bypass |
| `POST` | `/catalog/claim-next` | `factory_claim_next_job` lease patch via same writer |
| `POST` | `/handlers/self-service` | Meta Port SS handlers (Convex preview/env); HMAC or Bearer |

Mutating routes (except `/health`) are rate-limited (`GATEWAY_RATE_LIMIT_RPM`, default 60/min). Over limit → HTTP 429 + `Retry-After`.

## Ocean / MCP Meta fences

Factory-governed blueprints (`product`, `service`, `executionContract`, …) are **Meta-fenced**: Ocean and MCP must call `/catalog/sync-write` (never raw Port dual-write, never `bypassFence: true`). Context Lake mirrors (`github*` / `linear*` / `vercel*` / `convex*`) stay on Port Ocean native sync.

Design + ops: [`docs/ocean-mcp-write-fencing.md`](../../docs/ocean-mcp-write-fencing.md).

## Self-service handlers (Meta)

Replaces Port **NEEDS HANDLER** stubs that belong on the Meta lane:

| Action | Lane | Behavior |
|--------|------|----------|
| `ss_convex_create_preview` | Meta | Convex Management `create_deployment` + catalog project `convexDeployment` |
| `ss_convex_set_env` | Meta | Convex Management `update_default_environment_variables` |
| `ss_prospect_*` / `ss_painter_*` | **Product** | HTTP 501 `product_lane_stub` — do not implement here |

Auth: Port classic HMAC (`PORT_CLIENT_SECRET`) **or** `Authorization: Bearer` matching `FACTORY_GATEWAY_HANDLER_TOKEN`.

As-code Port workflows: `port/workflows/`. Live Port WEBHOOK URL:

`{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/handlers/self-service`

## OpenFleet ceilings (PBI-012)

Ceiling keys: `approvals`, `budget`, `depth`, `fan_out`, `hosts`, `until`.

`POST /fleet/spawn` body (JSON):

```json
{
  "fleet": "johnny@meta",
  "swarm": "task-slug",
  "member": "member-id",
  "by": "parent-or-sysop",
  "host": "dev",
  "approvals": "native",
  "proposedDepth": 1,
  "currentSwarmMembers": 0,
  "fleetCeiling": { "fan_out": 2, "depth": 1, "hosts": ["dev"] },
  "swarmCeiling": { "fan_out": 1 }
}
```

On refuse: `403` with `error: "ceiling_refuse"` and the appended ledger event (`event: "ceiling.refuse"`).

Optional `OPENFLEET_HOME` writes JSONL under `$OPENFLEET_HOME/fleets/<fleet>/ledger.jsonl`. CI uses in-memory ledger.

## Secrets

Copy `.env.example`. Set `PORT_CLIENT_SECRET` from Port (never git). Optional `RIVET_SUPERVISOR_URL` forwards admits over HTTP when Rivet is reachable. For Meta SS handlers also set `FACTORY_GATEWAY_HANDLER_TOKEN` + `CONVEX_TEAM_TOKEN`, and matching Port secrets `FACTORY_GATEWAY_BASE_URL` / `FACTORY_GATEWAY_HANDLER_TOKEN` / `CONVEX_TEAM_TOKEN`.

## Docker (public HTTPS / Port remount)

Multi-stage production image (`Dockerfile`): Node 20 Alpine → `npm ci` + `tsc` → non-root `factory` user → `EXPOSE 8787` → `HEALTHCHECK` `GET /health` → `node dist/index.js`.

```bash
cd apps/factory-gateway
docker build -t factory-gateway:local .
docker run --rm -p 8787:8787 \
  -e PORT_CLIENT_SECRET \
  -e FACTORY_GATEWAY_HANDLER_TOKEN \
  factory-gateway:local
curl -fsS http://127.0.0.1:8787/health
```

Compose (opt-in; Rivet default path unchanged):

```bash
cd compose
docker compose --profile gateway up -d --build
```

**Port remount path (FE-114):** keep the repo **public**. Put Tailscale **Funnel** (M1) or a PaaS (Fly/Railway/Render/Cloud Run) in front of `:8787`, confirm `GET /health` from a non-tailnet client, then set Port secret `FACTORY_GATEWAY_BASE_URL` and remount WEBHOOKs. Do not remount onto a dead base URL.

## Windows logon auto-start (DESKTOP-3APDBKG)

Prefer Task Scheduler AtLogOn (survives reboot+logon). Operator kit:

- `scripts/windows/factory-gateway-register-logon-task.ps1` (`DryRun` / `Register` / `Status`)
- `scripts/windows/factory-gateway-logon-start.ps1`
- Docs: [`docs/ops/gateway-windows-logon-autostart.md`](../../docs/ops/gateway-windows-logon-autostart.md)
- Kit check (any OS): `node scripts/gateway-windows-logon-dry-run.mjs`

Secrets live only in `%USERPROFILE%\.factory\gateway.env` (from `scripts/windows/gateway.env.example`). Never commit real values. Live reboot verify is on Johnny’s desktop — cloud agents stage only.

## Verify

```bash
cd apps/factory-gateway
npm install
npm run typecheck
npm test
```

HTTP proof for all seven `factory_*` WEBHOOK admits (HMAC reject + 202 enqueue + path allowlist): `test/webhooks-port.test.ts`. Live Port wiring inventory: `docs/port-workflow-webhooks.md`. Funnel/tailnet health + unsigned HMAC smoke: `scripts/gateway-tailnet-health.mjs` · `docs/gateway-hmac-smoke.md`. Beads admit path: `docs/beads-admit-gateway-path.md`.

## Lane hard rules

- Meta only — no Product Beads
- No Port OAuth create/delete
- No dual-write Port bypass around this writer
- Author ≠ reviewer

