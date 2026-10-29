# factory-gateway Dockerfile + `/health` ops checklist

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Morning ops checklist for the production `apps/factory-gateway` image contract (Dockerfile multi-stage, non-root, `HEALTHCHECK`, `GET /health` body) — without Funnel admit HMAC, Port remount mutate, Windows logon, Rivet Compose, or Sandbox Agent.  
**Script:** `scripts/gateway-dockerfile-health-dry-run.mjs` → `npm run dry-run:gateway-dockerfile-health`  
**Code:** `apps/factory-gateway/Dockerfile` · `apps/factory-gateway/src/server.ts` (`GET /health`)  
**Related:** [`docs/gateway-remount-dry-run.md`](../gateway-remount-dry-run.md) (live BASE_URL preflight) · gateway README Docker section

## Non-overlap (do not duplicate)

| Kit | Owns |
|-----|------|
| **This kit** | Dockerfile + image HEALTHCHECK + `/health` JSON contract + compose `gateway` profile build pointer (offline markers) |
| [Remount dry-run](../gateway-remount-dry-run.md) | Live `FACTORY_GATEWAY_BASE_URL` → `GET /health` before WEBHOOK remount |
| [Unsigned Funnel admit](./beads-gateway-unsigned-admit.md) | Unsigned/bad-auth Funnel gates |
| [Signed HMAC admit](./signed-admit-smoke.md) | Env-only signed claim (FE-142 **CLOSED**) |
| [Windows logon PM checklist](./gateway-windows-logon-pm-checklist.md) | Task Scheduler AtLogOn path |
| [Rivet Compose + Serve (#76)](./rivet-compose-serve-smoke.md) | Rivet engine `:6420` — **not** factory-gateway |
| [BdMetaBeads (#80)](./bdmetabeads-readiness.md) | Meta Beads adapter / hydrate |

Live `docker build` / Funnel / Port WEBHOOK remount remain **operator** steps — out of this kit’s default (no spend, no network mutate).

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + Dockerfile + `/health` source + README) | Present; no secret assignments |
| Dockerfile contract | Multi-stage `node:20-alpine`; non-root `factory`; `EXPOSE 8787`; `HEALTHCHECK` curls `/health` |
| `/health` body | `200` JSON `{ ok: true, service: "factory-gateway" }` (source contract) |
| Compose opt-in | `compose/` profile `gateway` builds this Dockerfile (pointer only) |
| Port schema / WEBHOOK / OAuth EI | **Untouched** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (no Docker, no network)

```bash
npm run dry-run:gateway-dockerfile-health
# or: node scripts/gateway-dockerfile-health-dry-run.mjs
```

Exit **0** = docs/scripts/source markers present; Port mutate refused; no secrets printed.

## Dockerfile structure probe (optional)

Re-checks Dockerfile stages / HEALTHCHECK / USER without `docker build` (zero spend):

```bash
npm run dry-run:gateway-dockerfile-health -- --lint
# or: node scripts/gateway-dockerfile-health-dry-run.mjs --lint
```

## Live image smoke (operator — out of kit default)

```bash
cd apps/factory-gateway
docker build -t factory-gateway:local .
docker run --rm -p 8787:8787 factory-gateway:local
# other terminal:
curl -fsS http://127.0.0.1:8787/health
# expect: {"ok":true,"service":"factory-gateway"}
```

Or Compose profile:

```bash
cd compose
docker compose --profile gateway up -d --build
curl -fsS http://127.0.0.1:8787/health
```

After green local health, use [`docs/gateway-remount-dry-run.md`](../gateway-remount-dry-run.md) before any Port WEBHOOK remount. Do **not** remount onto a dead base URL.

## PM checklist (human)

1. Confirm `npm run dry-run:gateway-dockerfile-health` PASS (and `--lint` when convenient).  
2. Schedule live `docker build` / Funnel only when intentional — **do not** block on FE-172 Sign-in.  
3. Do **not** upsert Port blueprints / workflows / EI OAuth for this advance.  
4. Do **not** ping Johnny for HMAC / handler-token (FE-142 closed).  
5. Independent write APPROVE before merge of kit PRs (author ≠ reviewer).  
6. Grokbot often offline — note and continue; no Reason fan-out required for this kit.

## Chain (image hop)

```text
apps/factory-gateway/Dockerfile (multi-stage → HEALTHCHECK)
  → GET /health { ok:true, service:"factory-gateway" }
  → compose --profile gateway (optional)
  → Funnel/PaaS public HTTPS (operator)
  → gateway-remount-dry-run (live BASE_URL) → Port WEBHOOK remount (human)
```

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount from this kit  
- No Funnel unsigned/signed admit probes  
- No Windows logon / Rivet engine / Sandbox Agent / BdMetaBeads hydrate  
