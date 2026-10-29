# Assemble-first apply dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Offline morning checklist that Meta **repo Specs + AGENTS + gateway writer** still encode the assemble-first contract (§4.2.2 machine-validated stack assembly before Coding admit; catalog-miss → needs implementation; §4.2.1 single-writer fence intact) — without Port schema upserts, spend, secrets, or Project-store master edits.  
**Script:** `scripts/assemble-first-apply-dry-run.mjs` → `npm run dry-run:assemble-first-apply`  
**Spec SoT (repo):** [`specs/port-governance/spec.md`](../../specs/port-governance/spec.md)  
**Fencing ops:** [`docs/ocean-mcp-write-fencing.md`](../ocean-mcp-write-fencing.md)  
**Project store master** (exclusive SoT for lead paste A–D; **not** this kit): FE-24 / FE-125 apply status in Project `docs/` — this kit never mutates it.

## Non-overlap (do not duplicate #76–#90)

| Kit | Owns |
|-----|------|
| **This kit** | Assemble-first / §4.2.2 stack-assembly + §4.2.1 fencing markers in Specs, AGENTS, CatalogWriter, Ocean fencing doc; Port mutate **REFUSED** |
| [Funnel remount checklist (#90)](./funnel-remount-checklist.md) | Offline remount checklist + seven `factory_*` IDs — **out of scope here** |
| [Gateway remount dry-run](../gateway-remount-dry-run.md) | Live `FACTORY_GATEWAY_BASE_URL` → `GET /health` |
| [Queue mirror (#88)](./factory-queue-mirror.md) | `bd ready` → notes Queued convention |
| Atlas BFF / OpenAccess / Dolt / BdMetaBeads / Rivet / sandbox | Separate kits on `main` |

Live Port `upsert_blueprint` / `upsert_workflow` / `upsert_entity`, WEBHOOK remount, HMAC secret fill, and Johnny Sign-in remain **out of scope**.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + port-governance Spec + AGENTS + Ocean fencing + CatalogWriter) | Present; no secret assignments |
| §4.2.2 assemble-first contract | Spec names **stack assembly** / machine-validated reject-before-admit; catalog-miss → **needs implementation** called out in this ops kit |
| §4.2.1 fence intact | Spec + AGENTS **NEVER** dual-write outside gateway writer; `CatalogWriter` + `catalogVersion` still in `apps/factory-gateway` |
| Port schema / WEBHOOK upsert / OAuth EI | **REFUSED** (dry-run / read only) |
| Project store master edit | **REFUSED** (store exclusive; FE-24 already Done) |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## Assemble-first (locked alias)

**assemble-first** = prefer Port catalog composables and **§4.2.2 machine-validated stack assembly** before greenfield build or provision. Invalid combos reject before Coding admit. Catalog misses → **needs implementation** → Beads/PBI deltas — never silent scaffold of invalid stacks.

**Does not:** weaken §4.2.1 write fencing; relocate catalog SoT out of Port; replace Spec+Contract Standardize; or imply this kit applies Project-store master paste blocks.

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (default — offline, no network)

```bash
npm run dry-run:assemble-first-apply
# or: node scripts/assemble-first-apply-dry-run.mjs
```

Exit **0** = docs/scripts/Spec/gateway markers present; Port mutate refused; Project master untouched; no secrets printed.

## Port schema

**Dry-run / REFUSED upserts only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `upsert_entity` / `trigger_run` / EI create-delete-revoke. This kit prints `Port mutate: REFUSED` and never calls Port MCP write tools.

## Chain (assemble-first hop)

```text
assemble-first-apply (this kit — Spec + fence markers)
  → Port stack-compat rules as catalog data (live; human / Port UI)
  → Catalog miss → needs implementation → Beads/PBI (not silent scaffold)
  → §4.2.1 CatalogWriter apply only (gateway)
  → Coding admit / Funnel remount / admit kits (separate)
```

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount / EI mutate  
- No Project-store `factory-master-spec.md` rewrite (FE-24 Done; exclusive window closed)  
- No Funnel remount (#90) / queue mirror (#88) / Atlas BFF live invoke  
- No Johnny ping for HMAC / handler-token / Sign-in (FE-142 + FE-172 closed)  
- No Adapter auth / spend  
- No Product Beads / Observatory reuse  
- No Sandbox Agent from browser  
