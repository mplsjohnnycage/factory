# Meta Beads Dolt health / docs dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Morning readiness check for Meta Beads **Dolt** remote tip (`refs/dolt/data`), hybrid `.beads/` layout docs, and the safe bootstrap helper — without BdMetaBeads adapter unit tests, Funnel admit, Port schema upserts, spend, or secrets.  
**Script:** `scripts/beads-dolt-health-dry-run.mjs` → `npm run dry-run:beads-dolt-health`  
**Operator guide:** [`docs/meta-beads.md`](../meta-beads.md) · safe helper `scripts/bd-bootstrap-safe.sh`  
**Bootstrap note:** [`docs/meta-beads-bootstrap-dry-run.md`](../meta-beads-bootstrap-dry-run.md)

## Non-overlap (do not duplicate #80 / #82)

| Kit | Owns |
|-----|------|
| **This kit** | Dolt remote tip docs + `refs/dolt/data` verify + hybrid layout + `bd-bootstrap-safe` contract; optional read-only `git ls-remote` |
| [BdMetaBeads offline readiness (#80)](./bdmetabeads-readiness.md) | `BdMetaBeads` adapter + injectable `BdRunner` unit tests — **out of scope here** |
| Gateway Dockerfile health (#82) | `apps/factory-gateway` Dockerfile + `/health` image contract — **out of scope here** |
| [Supervisor admit dry-run](./supervisor-admit-dry-run.md) | Offline `POST /admit` / `admitFromPayload` |
| Signed / unsigned Funnel admit kits | Gateway HMAC claim path (FE-142 **CLOSED**) |

Kit default: never bd dolt push. Live remote Dolt rewrite, Funnel→gateway→Docker SA fire, and Port blueprint upserts remain **out of scope**.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + meta-beads + bootstrap helper + hybrid `.beads`) | Present; no secret assignments |
| Remote Dolt tip docs | `git ls-remote origin 'refs/dolt/*'` → expect `refs/dolt/data` |
| Safe bootstrap helper | Default dry-run; never `bd init --force`; never `bd dolt push`; never Product Beads |
| Hybrid layout | Tracked config/metadata; gitignored `embeddeddolt/`; sync remote = git origin |
| Port schema / WEBHOOK / OAuth | **Untouched** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (no network mutate, no npm install)

```bash
npm run dry-run:beads-dolt-health
# or: node scripts/beads-dolt-health-dry-run.mjs
```

Exit **0** = docs/scripts/hybrid markers present; Port mutate refused; no secrets printed.

## Optional remote tip probe (read-only)

Confirms origin publishes `refs/dolt/data` via `git ls-remote` (no bootstrap execute, no `bd dolt push`, zero spend):

```bash
npm run dry-run:beads-dolt-health -- --ls-remote
# or: node scripts/beads-dolt-health-dry-run.mjs --ls-remote
```

Expect a line ending in `refs/dolt/data`. Empty tip → hydrate path is broken until an authorized `bd dolt push` from an authoritative local DB (operator; **not** this kit).

## Operator hydrate (out of kit default)

Prefer the safe helper; never print secrets; never Product Beads; never rewrite remote from this kit:

```bash
export PATH="$HOME/.local/bin:$PATH"
git ls-remote origin 'refs/dolt/*'   # expect refs/dolt/data
./scripts/bd-bootstrap-safe.sh --dry-run
# ./scripts/bd-bootstrap-safe.sh --execute   # only if gate PASS (local embeddeddolt)
```

Do **not** `bd dolt push` from this kit. Do **not** remount Port WEBHOOKs or upsert blueprints for Dolt health.

## Chain (Dolt tip hop)

```text
origin refs/dolt/data
  → bd bootstrap / bd-bootstrap-safe (local embeddeddolt hydrate)
  → .beads/ hybrid (config tracked; DB gitignored)
  → BdMetaBeads / bd ready+claim (separate #80 kit)
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
- No duplicate of BdMetaBeads (#80) or gateway Dockerfile health (#82)  
- No live `bd dolt push` / remote Dolt rewrite  
