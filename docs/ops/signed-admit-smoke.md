# Signed HMAC admit smoke (ops)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Re-run / document the **signed** Funnel HMAC claim + handler-token auth smoke using **env vars only** (never print values). FE-142 already closed — this kit is the repeatable ops recipe, not a secret re-ask.  
**Scripts:** `scripts/gateway-signed-admit-dry-run.mjs` · `scripts/gateway-tailnet-health.mjs`  
**Map:** [`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md) · [`docs/beads-admit-gateway-path.md`](../beads-admit-gateway-path.md) · [`docs/ops/beads-gateway-unsigned-admit.md`](./beads-gateway-unsigned-admit.md)

## FE-142 status (closed — do not re-ask secrets)

| Check | Result |
|-------|--------|
| Signed Funnel claim | **202** `{ ok, admitId, actionIdentifier }` |
| Handler-token good bearer | **400 `action_required`** (auth accepted; empty/fixture action refused) |
| Port org secrets | **PATCHed** |
| Further secret fill / Windows desktop for HMAC | **Do not ask** |

Cloud agents without vault access: run **kit dry-run only**. Live signed probes need a host where env already holds the secrets (desktop / operator vault) — presence is checked; **values are never printed**.

## Live Funnel base

```text
FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
```

(No trailing slash.)

## Env vars (names only — never echo values)

| Env | Role |
|-----|------|
| `FACTORY_GATEWAY_BASE_URL` | Funnel origin (above) |
| `PORT_CLIENT_SECRET` | Port Client Secret — HMAC for `POST /webhooks/port/<factory_*>` |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | Shared bearer for `POST /handlers/self-service` |
| `GATEWAY_HMAC_SMOKE=1` | Opt-in to run signed / handler probes |

Load from operator vault or `%USERPROFILE%\.factory\gateway.env` on DESKTOP-3APDBKG. Confirm **present** / **ABSENT** only. Never echo secret values; never paste into chat/PRs/logs.

## Kit dry-run (no network, no secrets)

```bash
npm run dry-run:gateway-signed
# or: node scripts/gateway-signed-admit-dry-run.mjs
```

Exit **0** = docs/scripts markers present; Port mutate refused; no secret assignments in kit files.

## Live signed smoke (env-only; operator host)

```bash
# Secrets must already be in the environment — do not pass on the CLI argv.
export FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
# PORT_CLIENT_SECRET and FACTORY_GATEWAY_HANDLER_TOKEN: load from vault/env file (not shown)
export GATEWAY_HMAC_SMOKE=1

npm run dry-run:gateway-signed -- --live
# or:
node scripts/gateway-tailnet-health.mjs \
  --base-url "$FACTORY_GATEWAY_BASE_URL"
```

| # | Probe | Expect |
|---|-------|--------|
| 1 | `GET {BASE}/health` | **200** `factory-gateway` |
| 2 | Unsigned claim | **401** `invalid_port_signature` |
| 3 | Unknown path | **404** `not_found` |
| 4 | SS `Bearer bad` | **401** |
| 5 | Signed claim (`PORT_CLIENT_SECRET` from env) | **202** `{ ok, admitId, … }` |
| 6 | SS good bearer (`FACTORY_GATEWAY_HANDLER_TOKEN` from env) | **400** `action_required` |

If `PORT_CLIENT_SECRET` is **ABSENT**, probe 5 **SKIP**s (presence logged only). If `FACTORY_GATEWAY_HANDLER_TOKEN` is **ABSENT**, probe 6 **SKIP**s. `--require-signed` fails the run when required secrets are ABSENT (operator regression).

Status codes + `ok` / `error` / `admitId` keys only — **never** print digests, bearers, or secret values.

## Chain (signed hop)

```text
Operator env (PORT_CLIENT_SECRET present)
  → HMAC-SHA-256 over `${timestamp}.${rawBody}`
  → POST Funnel /webhooks/port/factory_claim_next_job
  → factory-gateway verify → 202 enqueue
  → optional ProjectSupervisor forward (RIVET_SUPERVISOR_URL)
```

Unsigned gates must still fail closed after secrets match (see unsigned ops kit).

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke for this smoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No FE-142 secret re-ask / Johnny ping for HMAC  
- No Port schema upserts  
- No OAuth External Interface mutate / URI prune  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
