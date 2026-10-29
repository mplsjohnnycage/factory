# Rivet Compose + Tailscale Serve smoke (ops)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Offline kit dry-run + desktop Compose/Serve smoke checklist for the Rivet 2.x pilot (`compose/` · PBI-004). Does **not** duplicate signed/unsigned Funnel admit, supervisor admit, Windows logon, or OmniRoute kits.  
**Scripts:** `scripts/rivet-compose-serve-dry-run.mjs` · `bin/rivet-healthcheck.sh`  
**Upstream:** [`docs/rivet-tailscale-serve.md`](../rivet-tailscale-serve.md) · [`compose/README.md`](../../compose/README.md)

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + compose + Serve docs + healthcheck) | Present; no secret assignments |
| `bin/rivet-healthcheck.sh --lint-only` | Compose structural lint OK (Docker optional) |
| Pin | `rivetdev/engine` **2.x** — refuse `:next` |
| Port schema / WEBHOOK / OAuth EI | **Untouched** |
| Live `docker compose up` + Tailscale Serve `/health` | **Desktop pilot only** (out of cloud scope) |

Cloud agents: run **kit dry-run** (and optional `--lint`). Live Compose + Serve evidence stays on the operator desktop.

## FE-142 note (do not re-ask)

Signed Funnel claim + handler-token path are **CLOSED**. Do not ask Johnny for HMAC / handler-token again. This kit never touches Funnel admit secrets.

## FE-172 note (CLOSED — do not ask Johnny)

Port human Sign-in verify is **CLOSED** (curl pin PASS, allowlist 3 keepers, `lastLoginAt` today). Do **not** ask Johnny for Sign-in. Do not block Rivet Compose/Serve smoke on Sign-in.

## Kit dry-run (no Docker required)

```bash
npm run dry-run:rivet-compose-serve
# or: node scripts/rivet-compose-serve-dry-run.mjs
```

Exit **0** = docs/scripts/compose markers present; Port mutate refused; no secrets printed.

## Compose lint probe (optional)

Runs `bin/rivet-healthcheck.sh --lint-only` (structural compose check; `docker compose config` when Docker is present).

```bash
npm run dry-run:rivet-compose-serve -- --lint
# or: node scripts/rivet-compose-serve-dry-run.mjs --lint
```

## Desktop smoke (operator — after green kit)

On the Rivet Compose host (Docker + Tailscale):

```bash
cd compose
cp .env.example .env
# set RIVET_ADMIN_TOKEN=$(openssl rand -hex 32) in .env — never commit / never paste

docker compose up -d
../bin/rivet-healthcheck.sh                 # local :6420 /health
../bin/rivet-healthcheck.sh --restart-proof # restart recovers

tailscale serve --bg 6420
tailscale serve status
# Record FACTORY_RIVET_SERVE_URL=https://<hostname>.<tailnet>.ts.net (evidence, not a secret)
curl -fsS "${FACTORY_RIVET_SERVE_URL}/health"   # expect 200 from a tailnet client
```

Paste checklist evidence into the PR/Linear when live (hostname OK; **no tokens**):

- [ ] `docker compose up -d` in `compose/`
- [ ] `bin/rivet-healthcheck.sh --restart-proof` exit 0
- [ ] `tailscale serve 6420` shows HTTPS URL
- [ ] `curl -fsS "$FACTORY_RIVET_SERVE_URL/health"` → 200 from a tailnet client

## PM checklist (human)

1. Confirm `npm run dry-run:rivet-compose-serve` PASS (and `--lint` when convenient).  
2. Schedule desktop Compose + Serve smoke when the pilot host is intentional — **do not** block on FE-172 Sign-in.  
3. Do **not** upsert Port blueprints / workflows / EI OAuth for this advance.  
4. Do **not** ping Johnny for HMAC / handler-token (FE-142 closed).  
5. Independent write APPROVE before merge of kit PRs (author ≠ reviewer).  
6. Grokbot often offline — note and continue; no Reason fan-out required for this kit.

## Chain (pilot hop)

```text
compose/docker-compose.yml (rivet-engine :6420)
  → bin/rivet-healthcheck.sh (local /health + restart-proof)
  → tailscale serve 6420 (FACTORY_RIVET_SERVE_URL)
  → gateway / Dev OS reach Actor HTTP/SSE on tailnet (later PBIs)
```

Compose Rivet engine is **not** an admit consumer. Supervisor admit stays on [`supervisor-admit-dry-run.md`](./supervisor-admit-dry-run.md).

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount  
- No OAuth External Interface mutate  
- No Funnel signed/unsigned admit smoke (separate kits)  
- No Sandbox Agent from browser  
- No Johnny ping for HMAC / handler-token (FE-142 closed)  
- No Adapter auth / spend  
- No Product Beads  
