# Funnel remount checklist dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Offline morning checklist that the Port → Funnel `factory-gateway` remount **docs + script contract** still match (canonical `factory_*` IDs, fencing stays on `api.port.io`, health-before-remount) — without live Funnel, Port WEBHOOK upserts, spend, or secrets.  
**Script:** `scripts/funnel-remount-checklist-dry-run.mjs` → `npm run dry-run:funnel-remount-checklist`  
**Live health preflight (separate):** [`docs/gateway-remount-dry-run.md`](../gateway-remount-dry-run.md) · `scripts/gateway-remount-dry-run.mjs`  
**WEBHOOK inventory:** [`docs/port-workflow-webhooks.md`](../port-workflow-webhooks.md)

## Non-overlap (do not duplicate #76–#88)

| Kit | Owns |
|-----|------|
| **This kit** | Offline remount checklist markers + seven `factory_*` IDs + fencing host + npm wiring; optional `--live` delegates to remount health script |
| [Gateway remount dry-run](../gateway-remount-dry-run.md) | Live `FACTORY_GATEWAY_BASE_URL` → `GET /health` (requires reachable base) |
| [Gateway Dockerfile health (#82)](./gateway-dockerfile-health.md) | Image Dockerfile + `/health` source contract |
| [Unsigned / signed Funnel admit](./beads-gateway-unsigned-admit.md) / [signed](./signed-admit-smoke.md) | Admit auth gates (FE-142 **CLOSED**) |
| [Queue mirror (#88)](./factory-queue-mirror.md) | `bd ready` → notes Queued convention — **not this kit** |
| Rivet / sandbox / BdMetaBeads / Dolt / OpenAccess | Separate kits on `main` |

Live Port `upsert_workflow` remount, HMAC secret fill, and Johnny Sign-in remain **out of scope**.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + remount doc + WEBHOOK inventory + remount script) | Present; no secret assignments |
| Canonical IDs | All seven `factory_*` workflows listed; no invented parallel names (`factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release`) |
| Fencing | WEBHOOK fencing hosts stay `api.port.io` (never retargeted to Funnel) |
| Remount rule | Do not remount onto a dead Funnel / dead `FACTORY_GATEWAY_BASE_URL` |
| Port schema / WEBHOOK upsert / OAuth EI | **Untouched** (dry-run / read only) |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (default — offline, no network)

```bash
npm run dry-run:funnel-remount-checklist
# or: node scripts/funnel-remount-checklist-dry-run.mjs
```

Exit **0** = docs/scripts markers present; Port mutate refused; no secrets printed.

## Optional live health hop (operator)

When Funnel (or local `:8787`) is reachable, delegate to the existing remount health script — still **no** Port upsert:

```bash
FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net \
  npm run dry-run:funnel-remount-checklist -- --live
```

Exit non-zero from the health script → **do not remount**.

## Operator remount (human — not this kit)

1. Green `/health` from Port’s network path (prefer non-tailnet client for Funnel).
2. Confirm fencing WEBHOOK nodes still hit `api.port.io` (never replace).
3. Additive `gateway_admit` only → `{BASE}/webhooks/port/<factory_*>` after secrets match (Johnny UI — MCP has no secrets tool; FE-142 closed so do not re-ask from this kit).
4. Smoke unsigned claim → **401**; signed claim only after env match (separate admit kits).

## Chain (remount hop)

```text
funnel-remount-checklist (offline markers)
  → gateway-remount-dry-run (live BASE_URL /health)
  → Port WEBHOOK remount (human; additive gateway_admit only)
  → unsigned/signed admit kits (auth) → ProjectSupervisor
```

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `upsert_entity` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / live WEBHOOK remount from this kit  
- No OAuth External Interface mutate  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
- No Johnny ping for HMAC / handler-token / Sign-in (FE-142 + FE-172 closed)  
- No Adapter auth / spend  
- No duplicate of Dockerfile (#82), queue mirror (#88), or admit HMAC kits  
