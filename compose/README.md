# Rivet Compose (desktop pilot)

**PBI:** PBI-004 / [STL-165](https://linear.app/johnny-cage/issue/STL-165)  
**Spec:** `specs/rivet-execution/spec.md`  
**Lane:** Meta only — no Product Beads, no Port OAuth create/delete, no `factory-edge`.

## What this is

Single-node Rivet **2.x** control plane on Docker Compose for the Factory operator desktop (master §13.4 / ADR-002). Persistent volume survives Compose restart. Tailscale Serve publishes HTTPS on the tailnet — see `docs/rivet-tailscale-serve.md`.

## Prerequisites

- Docker Desktop (or Engine) with Compose plugin
- Tailscale client on the same host (for Serve)
- ~10 GB free disk

## Quick start

```bash
cd compose
cp .env.example .env
# set RIVET_ADMIN_TOKEN=$(openssl rand -hex 32) in .env

docker compose config >/dev/null   # lint
docker compose up -d
../bin/rivet-healthcheck.sh        # waits for /health
../bin/rivet-healthcheck.sh --restart-proof   # restart + recover
```

Local health: `http://127.0.0.1:6420/health` (expect HTTP 200).  
Dashboard: `http://127.0.0.1:6420/ui` (admin token from `.env`).

## Runner pool (before Factory nodes)

Workers need a default runner config (Rivet docs). After engine is healthy:

```bash
set -a && source .env && set +a
curl -fsS -X PUT "http://127.0.0.1:6420/runner-configs/default?namespace=default" \
  -H "Authorization: Bearer ${RIVET_ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"datacenters":{"default":{"normal":{}}}}'
```

Factory Actor nodes / gateway attach in later PBIs (005–007). This unit stops at **Compose health + Serve docs**.

## Tear down

```bash
docker compose down
# keep volume for resume: omit -v
# wipe pilot state: docker compose down -v
```

## Secrets

Never commit `compose/.env` or admin tokens. Serve URL is operational evidence, not a credential.
