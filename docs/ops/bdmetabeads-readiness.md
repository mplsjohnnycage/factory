# BdMetaBeads offline / readiness dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Morning readiness check for the live Meta Beads adapter (`BdMetaBeads`) and hybrid `.beads/` hydrate path — without Funnel, Port schema upserts, spend, secrets, or duplicating gateway/supervisor kits.  
**Script:** `scripts/bdmetabeads-dry-run.mjs` → `npm run dry-run:bdmetabeads`  
**Code:** `apps/project-supervisor/src/bd-meta-beads.ts` (`bd ready` / `bd update --claim` / `bd unclaim`, prefix `factory-` only)  
**Operator guide:** [`docs/meta-beads.md`](../meta-beads.md) · safe helper `scripts/bd-bootstrap-safe.sh`

## Non-overlap (do not duplicate)

| Kit | Owns |
|-----|------|
| **This kit** | `BdMetaBeads` adapter + Meta Beads hybrid config + safe bootstrap dry-run markers; optional injectable-`BdRunner` unit tests |
| [Supervisor admit dry-run](./supervisor-admit-dry-run.md) | Offline `admitFromPayload` / `POST /admit` / Memory admit-entry (G6) |
| [Unsigned Funnel admit](./beads-gateway-unsigned-admit.md) | Gateway unsigned/bad-auth gates |
| [Signed HMAC admit](./signed-admit-smoke.md) | Env-only signed claim (FE-142 **CLOSED**) |
| [Sandbox harness readiness](./sandbox-harness-readiness.md) | Image pin + MemorySandboxLease |

Live `bd dolt push` / remote Dolt rewrite, Funnel→gateway→Docker SA fire, and Port blueprint upserts remain **out of scope**.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + adapter + `.beads` config + bootstrap helper) | Present; no secret assignments |
| Meta-only prefix | `factory-` / `issue-prefix: "factory"` — Product Beads **refused** |
| Adapter contract | `isReady` / `claim` (`--claim`) / `reclaim` (`unclaim`) / injectable `BdRunner` |
| Safe bootstrap helper | Default dry-run; never `bd init --force`; never `bd dolt push` |
| Port schema / WEBHOOK / OAuth | **Untouched** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (no network, no npm install)

```bash
npm run dry-run:bdmetabeads
# or: node scripts/bdmetabeads-dry-run.mjs
```

Exit **0** = docs/scripts/source markers present; Port mutate refused; no secrets printed.

## Injectable BdRunner probe (optional — local Node deps)

Runs `apps/project-supervisor` **BdMetaBeads** unit tests only (scripted `BdRunner` — no live `bd`, no Dolt, no Port). Installs package deps under that app when needed.

```bash
npm run dry-run:bdmetabeads -- --memory
# or: node scripts/bdmetabeads-dry-run.mjs --memory
```

Exit **0** = kit markers + `test/bd-meta-beads.test.ts` green.

## Live `bd` hydrate (operator — out of kit default)

Prefer the safe helper; never print secrets; never Product Beads:

```bash
export PATH="$HOME/.local/bin:$PATH"
./scripts/bd-bootstrap-safe.sh --dry-run
# ./scripts/bd-bootstrap-safe.sh --execute   # only if gate PASS (local embeddeddolt)
bd where
bd ready
```

Do **not** `bd dolt push` from this kit. Do **not** remount Port WEBHOOKs or upsert blueprints for BdMetaBeads readiness.

## Chain (adapter hop)

```text
ReadyTaskEvent.beadId (factory-* only)
  → BdMetaBeads.isReady / claim / reclaim
  → spawn bd (or injectable BdRunner in CI)
  → .beads/ hybrid Dolt (refs/dolt/data hydrate via bd-bootstrap-safe)
  → ProjectSupervisorActor.admit (separate supervisor-admit kit)
```

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount  
- No OAuth External Interface mutate  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
- No Johnny ping for HMAC / handler-token / Sign-in (FE-142 + FE-172 closed)  
- No Adapter auth / spend  
- No duplicate of unsigned/signed Funnel or supervisor-admit kits  
