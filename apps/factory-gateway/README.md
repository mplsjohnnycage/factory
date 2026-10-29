# factory-gateway

Thin Meta gateway for **PBI-005 / STL-166**:

1. Verify Port classic webhook **HMAC-SHA-256** (`x-port-signature` / `x-port-timestamp`)
2. Enqueue **ProjectSupervisor** (push-only — Rivet never polls Port)
3. Host **§4.2.1 catalog writer** (single-writer per `{blueprint}:{entityIdentifier}` + `catalogVersion` reject-stale)

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness |
| `POST` | `/webhooks/port` | HMAC-gated Port webhook → supervisor enqueue |
| `POST` | `/catalog/write` | §4.2.1 fenced catalog apply |
| `POST` | `/catalog/claim-next` | `factory_claim_next_job` lease patch via same writer |

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
