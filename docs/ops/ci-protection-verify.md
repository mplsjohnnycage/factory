# CI + main branch-protection verify dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Offline morning checklist that Meta **CI presence + `main` protection docs + LICENSE + accept-on-SHA path** still match ADR-008 / PBI-011 — without mutating GitHub protection settings, Port schema upserts, spend, or secrets.  
**Script:** `scripts/ci-protection-verify-dry-run.mjs` → `npm run dry-run:ci-protection-verify`  
**Click-list SoT:** [`docs/ci/branch-protection.md`](../ci/branch-protection.md)  
**Accept path:** [`docs/ci/port-accept-on-sha.md`](../ci/port-accept-on-sha.md) · ADR-008 · [`specs/visibility-accept/spec.md`](../../specs/visibility-accept/spec.md)

## Non-overlap (do not duplicate #62–#92)

| Kit | Owns |
|-----|------|
| **This kit** | Offline CI / branch-protection / LICENSE / `meta-ci-presence` markers; optional read-only `--live` `protected: true` probe; **never** PUT protection / rulesets |
| [Assemble-first apply (#92)](./assemble-first-apply.md) | §4.2.2 / §4.2.1 Spec + CatalogWriter markers |
| [Funnel remount checklist (#90)](./funnel-remount-checklist.md) | Remount docs + seven `factory_*` IDs |
| [Local gate](../ci/local-gate.md) · `npm run test:local-gate` | ASDLC refuse tests — **not** this kit |
| [Gateway remount dry-run](../gateway-remount-dry-run.md) | Live Funnel `GET /health` |
| Admit / Rivet / sandbox / Beads / OpenAccess / Atlas / OmniRoute | Separate kits on `main` |

Live Port `upsert_*`, WEBHOOK remount, HMAC secret fill, Johnny Sign-in, and GitHub protection **writes** remain **out of scope**.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + branch-protection + meta-ci workflow + LICENSE + ADR-008 + visibility-accept + accept-on-sha) | Present; no secret assignments |
| Always-on check | Workflow job `name: meta-ci-presence` in `.github/workflows/meta-ci.yml` |
| Protection policy (docs) | Require PR + ≥1 approving review + `meta-ci-presence`; Do **not** require Vercel as Meta accept gate |
| LICENSE | Proprietary all-rights-reserved file at repo root |
| Port schema / WEBHOOK / OAuth EI | **REFUSED** (dry-run / read only) |
| GitHub protection mutate (`PUT` / rulesets create) | **REFUSED** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (default — offline, no network)

```bash
npm run dry-run:ci-protection-verify
# or: node scripts/ci-protection-verify-dry-run.mjs
```

Exit **0** = docs/workflows/LICENSE markers present; Port mutate refused; GitHub protection writes refused; no secrets printed.

## Optional read-only live probe

When `gh` is authenticated (integration tokens often **403** on protection *detail*), probe branch tip only — still **no** settings mutate:

```bash
npm run dry-run:ci-protection-verify -- --live
# or: node scripts/ci-protection-verify-dry-run.mjs --live
```

| Result | Meaning |
|--------|---------|
| `protected: true` on `main` | Soft PASS for live hop |
| Detail GET **403** | Expected for agent/integration tokens — do **not** treat as kit FAIL; admin dump stays human-only |
| `gh` missing / network fail with `--live` | Exit **1** (operator fix auth or skip `--live`) |

**Never** run `gh api -X PUT .../protection` or create rulesets from this kit.

## Port schema

**Dry-run / REFUSED upserts only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `upsert_entity` / `trigger_run` / EI create-delete-revoke. This kit prints `Port mutate: REFUSED` and never calls Port MCP write tools.

## Chain (CI accept hop)

```text
ci-protection-verify (this kit — docs + meta-ci-presence markers)
  → green meta-ci-presence on exact SHA S
  → optional meta-accept-matrix / accept-on-sha.ts evaluate
  → Cockpit/human Port accept (never agent self-accept)
```

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount / EI mutate  
- No GitHub branch-protection PUT / ruleset create / dipping `required_approving_review_count`  
- No local-gate test refresh (use `npm run test:local-gate`)  
- No Funnel remount (#90) / assemble-first (#92) / queue mirror (#88) overlap  
- No Johnny ping for HMAC / handler-token / Sign-in (FE-142 + FE-172 closed)  
- No Adapter auth / spend  
- No Product Beads / Observatory reuse  
- No agent self-APPROVE of this PR  
