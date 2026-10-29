# factory-gateway HMAC smoke (Funnel / tailnet)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Prove Port classic HMAC + allowlist + SS bearer gates on a **public** Funnel base without applying Port schema or remounting workflows.  
**Script:** `scripts/gateway-tailnet-health.mjs`  
**Ops kits:** [`ops/signed-admit-smoke.md`](./ops/signed-admit-smoke.md) (signed / handler, env-only) · [`ops/beads-gateway-unsigned-admit.md`](./ops/beads-gateway-unsigned-admit.md) (unsigned regression)  
**Related:** [`beads-admit-gateway-path.md`](./beads-admit-gateway-path.md) · [`gateway-remount-dry-run.md`](./gateway-remount-dry-run.md) · [`port-workflow-webhooks.md`](./port-workflow-webhooks.md)

## FE-142 verdict (closed)

| Check | Result |
|-------|--------|
| Signed claim | **202** |
| Handler-token good bearer | **400 `action_required`** (auth accepted) |
| Port org secrets | **PATCHed** |
| Further secret fill / Windows desktop for HMAC | **Do not ask** |

Unsigned probes stay the cloud-safe regression after secrets match — bad/missing auth must still return **401** / **404** / **401**. Signed re-checks use **env vars only**. Never print or commit secret values (status codes + error keys only).

## Live Funnel base (operator paste)

```text
FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
```

(No trailing slash. Rotate hostname → update Port secret + this doc.)

## Unsigned smoke (no secrets)

```bash
npm run dry-run:gateway-unsigned -- --live
# or:
node scripts/gateway-tailnet-health.mjs \
  --base-url "$FACTORY_GATEWAY_BASE_URL" \
  --unsigned-only
```

| # | Probe | Expect |
|---|-------|--------|
| 1 | `GET {BASE}/health` | **200** `{"ok":true,"service":"factory-gateway"}` |
| 2 | `POST …/webhooks/port/factory_claim_next_job` unsigned JSON | **401** `invalid_port_signature` |
| 3 | `POST …/webhooks/port/not_a_factory_tool` | **404** |
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

## Signed / handler-token smoke (env vars only)

FE-142 closed the first PASS. Ops recipe for a host that already has secrets in the environment (never paste values into argv/chat):

```bash
# Kit markers offline (safe on any cloud agent)
npm run dry-run:gateway-signed

# Live — secrets must already be in env (PORT_CLIENT_SECRET, optional FACTORY_GATEWAY_HANDLER_TOKEN)
export FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
export GATEWAY_HMAC_SMOKE=1
npm run dry-run:gateway-signed -- --live
# Operator regression that must fail if secret ABSENT:
npm run dry-run:gateway-signed -- --live --require-signed
```

| # | Probe | Expect |
|---|-------|--------|
| 5 | Signed claim (`PORT_CLIENT_SECRET` from env) | **202** `{ ok, admitId, actionIdentifier }` |
| 6 | Good SS bearer (`FACTORY_GATEWAY_HANDLER_TOKEN` from env) | **400** `action_required` (not **401**) |
| — | Bad SS bearer | still **401** `unauthorized_handler` |

Presence of each secret is logged as `present` / `ABSENT` only. Digests and bearers are never printed. Full table + chain: [`ops/signed-admit-smoke.md`](./ops/signed-admit-smoke.md).

Contract reminder: Port signs `` `${timestamp}.${rawBody}` `` HMAC-SHA-256 → `x-port-signature: v1,<base64>` + `x-port-timestamp` (`apps/factory-gateway/src/hmac.ts`).

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` for this smoke. Remount of `gateway_admit` nodes is already live (additive); this kit does not change workflows or blueprints.

## Explicit non-goals

- No Port secret upsert from agents (MCP has no secrets tool)  
- No `trigger_run` of `factory_*` without an approved fixture  
- No OAuth create/delete/revoke / URI prune  
- No PBI-015 / Observatory / Product Beads  
- No printing `PORT_CLIENT_SECRET` or bearer tokens  
- No FE-142 secret re-ask  
