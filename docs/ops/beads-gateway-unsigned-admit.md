# Beads → gateway unsigned admit path (ops)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Harden and verify the **unsigned** Funnel gates on the Beads admit → `factory-gateway` path without secrets, Port schema upserts, or spend.  
**Scripts:** `scripts/gateway-unsigned-admit-dry-run.mjs` · `scripts/gateway-tailnet-health.mjs`  
**Map:** [`docs/beads-admit-gateway-path.md`](../beads-admit-gateway-path.md) · [`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md) · [`docs/ops/signed-admit-smoke.md`](./signed-admit-smoke.md)

## FE-142 status (do not re-ask secrets)

| Check | Result |
|-------|--------|
| Signed Funnel claim | **202** — closed |
| Handler-token good bearer | **400 `action_required`** (auth accepted; empty/fixture action refused) — closed |
| Port org secrets | **PATCHed** — closed |
| Further secret fill / Windows desktop for HMAC | **Do not ask** |

Unsigned probes remain the cloud-safe regression: gates must stay closed for bad/missing auth even after secrets match.

## Live Funnel base

```text
FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
```

(No trailing slash.)

## Kit dry-run (no network)

```bash
npm run dry-run:gateway-unsigned
# or: node scripts/gateway-unsigned-admit-dry-run.mjs
```

Exit **0** = docs/scripts markers present; Port mutate refused; no secrets printed.

## Live unsigned probes (safe anytime Funnel is up)

```bash
npm run dry-run:gateway-unsigned -- --live
# or:
node scripts/gateway-tailnet-health.mjs \
  --base-url "$FACTORY_GATEWAY_BASE_URL" \
  --unsigned-only
```

| # | Probe | Expect |
|---|-------|--------|
| 1 | `GET {BASE}/health` | **200** `factory-gateway` |
| 2 | Unsigned `POST …/webhooks/port/factory_claim_next_job` | **401** `invalid_port_signature` |
| 3 | `POST …/webhooks/port/not_a_factory_tool` | **404** `not_found` |
| 4 | SS `Authorization: Bearer bad` | **401** `unauthorized_handler` |

Exit **0** = path alive + gates closed. Does **not** print or require secret values.

## Chain (unsigned hop only)

```text
Any client (cloud OK)
  → Funnel BASE unsigned / bad-auth POSTs
  → factory-gateway MUST 401/404 (no ProjectSupervisor enqueue)
  → Beads claim / Rivet / Sandbox never reached
```

After green unsigned: signed admit + handler-token ops recipe is [`signed-admit-smoke.md`](./signed-admit-smoke.md) (env-only; FE-142 closed). Supervisor forward remains library-ready ([#48](https://github.com/mplsjohnnycage/factory/pull/48)); do not remount WEBHOOKs or upsert blueprints for this kit.

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run`.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port EI / OAuth create-delete-revoke  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
- No Johnny ping for HMAC / handler-token (FE-142 closed)  
