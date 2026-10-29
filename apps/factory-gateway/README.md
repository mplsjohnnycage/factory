# factory-gateway

Thin Meta gateway for **PBI-005 / STL-166** + **PBI-011 / STL-172** + **PBI-012 / STL-173**:

1. Verify Port classic webhook **HMAC-SHA-256** (`x-port-signature` / `x-port-timestamp`)
2. Enqueue **ProjectSupervisor** (push-only — Rivet never polls Port)
3. Host **§4.2.1 catalog writer** (single-writer per `{blueprint}:{entityIdentifier}` + `catalogVersion` reject-stale)
4. Accept-on-exact-SHA evaluate/record (ADR-008) — Cockpit/human only
5. **OpenFleet ceilings** + **gateway rate limit** (PBI-012) — over-ceiling → ledger `ceiling.refuse`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness (not rate-limited) |
| `POST` | `/webhooks/port` | HMAC-gated Port webhook → supervisor enqueue |
| `POST` | `/fleet/spawn` | OpenFleet ceiling gate; refuse → `ceiling.refuse` |
| `GET` | `/fleet/ledger` | List ledger events / ceiling refuses for a fleet |
| `POST` | `/accept/evaluate` | ADR-008 accept eligibility for exact SHA (no Port mutation) |
| `POST` | `/accept/record` | Cockpit/human accept evidence only (`X-Factory-Accept-Actor`) |
| `GET` | `/accept/status` | Whether recorded accept still matches tip SHA |
| `POST` | `/catalog/write` | §4.2.1 fenced catalog apply |
| `POST` | `/catalog/claim-next` | `factory_claim_next_job` lease patch via same writer |

Mutating routes (except `/health`) are rate-limited (`GATEWAY_RATE_LIMIT_RPM`, default 60/min). Over limit → HTTP 429 + `Retry-After`.

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

Copy `.env.example`. Set `PORT_CLIENT_SECRET` from Port (never git). Optional `RIVET_SUPERVISOR_URL` forwards admits over HTTP when Rivet is reachable.

## Verify

```bash
cd apps/factory-gateway
npm install
npm run typecheck
npm test
```

## Lane hard rules

- Meta only — no Product Beads
- No Port OAuth create/delete
- No dual-write Port bypass around this writer
- Author ≠ reviewer
