# FE-170 — Signed admit smoke ops docs (post FE-142)

**Lane:** Meta  
**Audience:** Projects Manager  
**Author session:** `bc-ed51acef-7874-502d-acdd-4185e53a28e9`  
**Prerequisite:** FE-142 **CLOSED** — signed claim **202** + handler-token **400 `action_required`** (auth PASS); Port org secrets PATCHed. Do **not** re-ask secrets.

## Verdict

Shipped docs/script refresh for **signed HMAC admit smoke** (env vars only; never print values). Fresh branch → PR. Port schema upserts **refused**. Zero spend.

| Check | Result |
|-------|--------|
| Kit dry-run `npm run dry-run:gateway-signed` | **PASS** exit 0 |
| Live unsigned gates | **PASS** 200 / 401 / 404 / 401 |
| Live signed (this cloud VM) | **SKIP** probes 5/6 — `PORT_CLIENT_SECRET` / `FACTORY_GATEWAY_HANDLER_TOKEN` **ABSENT** (presence only) |
| `--require-signed` without secret | **PASS** exit 1 ABSENT |
| Port schema upsert | **Not done** (refused) |
| Secrets printed | **None** |

## Repo deliverables

| Path | Role |
|------|------|
| `docs/ops/signed-admit-smoke.md` | PM ops kit |
| `scripts/gateway-signed-admit-dry-run.mjs` | Offline kit + `--live` / `--require-signed` |
| `scripts/gateway-tailnet-health.mjs` | Probe 6 handler-token + `--require-signed` |
| `docs/gateway-hmac-smoke.md` | Signed section refresh |
| Cross-links | `docs/beads-admit-gateway-path.md` · `docs/ops/beads-gateway-unsigned-admit.md` |
| `package.json` | `dry-run:gateway-signed` |

## PR

| Field | Value |
|-------|-------|
| Branch | `cursor/signed-admit-smoke-ops-28e9` |
| Base | `main` |
| Tip | `083318f` |
| PR | https://github.com/mplsjohnnycage/factory/pull/71 |

## Operator live signed (env already loaded — never echo)

```bash
export FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net
export GATEWAY_HMAC_SMOKE=1
# PORT_CLIENT_SECRET + FACTORY_GATEWAY_HANDLER_TOKEN from vault/env file (not shown)
npm run dry-run:gateway-signed -- --live
# expect: probe 5 → 202; probe 6 → 400 action_required
```

## Explicit non-goals (held)

- No Port blueprint / workflow / EI mutate  
- No FE-142 secret re-ask / Johnny HMAC ping  
- No spend  
- No secret values in chat/docs/PR  

## 3-line PM summary

1. FE-142 stays **CLOSED** — no secret re-ask; shipped signed admit smoke ops kit → [#71](https://github.com/mplsjohnnycage/factory/pull/71).  
2. Cloud verified kit + unsigned Funnel gates; signed probes need env-present host (`GATEWAY_HMAC_SMOKE=1 npm run dry-run:gateway-signed -- --live`) → expect **202** + **400 `action_required`** (status codes only).  
3. Independent review + merge when CI green; no Port schema upserts.  
