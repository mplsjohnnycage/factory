# ProjectSupervisor admit dry-run kit (ops)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Verify the **offline** ProjectSupervisor admit entry (G6) without Funnel, Rivet Actor host, Port schema upserts, spend, or secrets.  
**Scripts:** `scripts/supervisor-admit-dry-run.mjs`  
**Code:** `apps/project-supervisor` (`admitFromPayload` · `POST /admit` · Memory Meta Beads) · library from [#48](https://github.com/mplsjohnnycage/factory/pull/48)  
**Upstream unsigned Funnel kit:** [`beads-gateway-unsigned-admit.md`](./beads-gateway-unsigned-admit.md)

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (docs + admit sources) | Present; no secret assignments |
| Opaque Port `{action,runId}` without bead/bypass | **Refuse** `claim_or_bypass_required` |
| Memory bead ready → `admitFromPayload` | **Admit OK** |
| Duplicate `workKey` | **Fenced** (no second attempt) |
| `GET /health` on local admit HTTP | **200** `project-supervisor-admit` |
| Port schema / WEBHOOK / OAuth | **Untouched** |

Live Port→gateway→Rivet→Docker Sandbox fire remains **ops/desktop** (Funnel host + Rivet Serve + Docker) — **out of scope** for this kit.

## FE-142 note (do not re-ask)

Signed Funnel claim + handler-token path are **CLOSED**. Do not ask Johnny for HMAC / handler-token again. Unsigned Funnel regression stays on [`beads-gateway-unsigned-admit.md`](./beads-gateway-unsigned-admit.md).

## Kit dry-run (no network, no npm install)

```bash
npm run dry-run:supervisor-admit
# or: node scripts/supervisor-admit-dry-run.mjs
```

Exit **0** = docs/scripts/source markers present; Port mutate refused; no secrets printed.

## Memory admit probe (optional — local Node deps)

Runs `apps/project-supervisor` admit-entry tests (Memory Meta Beads + HTTP `/health` + spawn stub). Installs package deps only under that app (no Port, no spend, no Funnel).

```bash
npm run dry-run:supervisor-admit -- --memory
# or: node scripts/supervisor-admit-dry-run.mjs --memory
```

Exit **0** = kit markers + admit-entry tests green.

## PM checklist (human — after green kit)

1. Confirm this kit PASS offline (and `--memory` when deps available).  
2. Confirm unsigned Funnel kit still PASS (`npm run dry-run:gateway-unsigned -- --live` when Funnel up).  
3. Do **not** upsert Port blueprints / workflows / EI OAuth for admit advance.  
4. Live end-to-end admit (gateway → `RIVET_SUPERVISOR_URL` → Docker SA) only when desktop Rivet/Funnel hosts are intentional — separate ops ticket; Grokbot often offline (note and continue).  
5. Independent write APPROVE before merge of kit PRs (author ≠ reviewer).

## Chain (offline hop)

```text
Dry-run JSON / SupervisorAdmit blob
  → admitFromPayload / POST /admit
  → MemoryMetaBeads or BdMetaBeads (factory-* only)
  → ProjectSupervisorActor.admit (fence + projections to Memory catalog)
  → optional SessionSpawner stub (no Docker)
```

Point a **local** gateway `RIVET_SUPERVISOR_URL` at `http://127.0.0.1:<port>/admit` only for forward tests. Compose Rivet engine `:6420` is **not** an admit consumer.

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount  
- No OAuth External Interface mutate  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
- No Johnny ping for HMAC / handler-token (FE-142 closed)  
- No Adapter auth / spend  
