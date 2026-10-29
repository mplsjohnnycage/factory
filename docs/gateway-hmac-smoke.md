# factory-gateway HMAC smoke (Funnel / tailnet)

**Lane:** Meta  
**Purpose:** Prove Port classic HMAC + allowlist + SS bearer gates on a **public** Funnel base without applying Port schema or remounting workflows.  
**Script:** `scripts/gateway-tailnet-health.mjs`  
**Related:** [`beads-admit-gateway-path.md`](./beads-admit-gateway-path.md) · [`gateway-remount-dry-run.md`](./gateway-remount-dry-run.md) · [`port-workflow-webhooks.md`](./port-workflow-webhooks.md)

## Verdict

Unsigned probes are safe from any cloud/non-tailnet client once Funnel `/health` is green. They **must** return **401** / **404** / **401** as below until Johnny mirrors `PORT_CLIENT_SECRET` + `FACTORY_GATEWAY_HANDLER_TOKEN` onto the desktop gateway process **and** Port org secrets. Signed **202** smoke is optional and reads the secret from env only — **never print or commit it**.

## Live Funnel base (operator paste)

```text
FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
```

(No trailing slash. Rotate hostname → update Port secret + this doc.)

## Unsigned smoke (no secrets)

```bash
node scripts/gateway-tailnet-health.mjs \
  --base-url "$FACTORY_GATEWAY_BASE_URL"
```

| # | Probe | Expect |
|---|-------|--------|
| 1 | `GET {BASE}/health` | **200** `{"ok":true,"service":"factory-gateway"}` |
| 2 | `POST …/webhooks/port/factory_claim_next_job` unsigned JSON | **401** `invalid_port_signature` |
| 3 | `POST …/webhooks/port/not_a_factory_tool` | **404** `not_found` |
| 4 | `POST …/handlers/self-service` `Authorization: Bearer bad` | **401** |

Exit **0** = path alive + gates closed. Exit **1** = Funnel down or wrong body. Exit **2** = bad args.

Equivalent one-liners (same expectations):

```bash
curl -fsS --max-time 15 "$FACTORY_GATEWAY_BASE_URL/health"
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  "$FACTORY_GATEWAY_BASE_URL/webhooks/port/factory_claim_next_job" \
  -H 'content-type: application/json' -d '{"action":"factory_claim_next_job"}'
# → 401
```

## Signed smoke (after secrets match — optional)

1. Desktop gateway env has `PORT_CLIENT_SECRET` = Port Client Secret (classic webhook HMAC).  
2. Port org secret `FACTORY_GATEWAY_BASE_URL` = Funnel origin.  
3. Mirror `FACTORY_GATEWAY_HANDLER_TOKEN` both sides for Meta SS.  
4. Restart gateway; re-run unsigned probes (still 401/404/401 for bad/missing auth).  
5. Signed claim:

```bash
# Secret from env only — do not echo / paste into chat / git
GATEWAY_HMAC_SMOKE=1 \
PORT_CLIENT_SECRET='…' \
FACTORY_GATEWAY_BASE_URL="$FACTORY_GATEWAY_BASE_URL" \
  node scripts/gateway-tailnet-health.mjs
```

Expect **202** `{ ok, admitId, actionIdentifier: "factory_claim_next_job" }` and an in-process supervisor enqueue (or HTTP forward if `RIVET_SUPERVISOR_URL` is set). Mismatch → still **401**.

Contract reminder: Port signs `` `${timestamp}.${rawBody}` `` HMAC-SHA-256 → `x-port-signature: v1,<base64>` + `x-port-timestamp` (`apps/factory-gateway/src/hmac.ts`).

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` for this smoke. Remount of `gateway_admit` nodes is already live (additive); this kit does not change workflows or blueprints.

## Explicit non-goals

- No Port secret upsert from agents (MCP has no secrets tool)  
- No `trigger_run` of `factory_*` until Johnny approves a fixture  
- No OAuth create/delete/revoke / URI prune  
- No PBI-015 / Observatory / Product Beads  
- No printing `PORT_CLIENT_SECRET` or bearer tokens  
