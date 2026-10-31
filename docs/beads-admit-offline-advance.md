# Beads / admit path — offline advance (no Funnel / no Port login)

**When:** 2026-10-29  
**Lane:** Meta · public `mplsjohnnycage/factory`  
**Worker:** bc-ba204153-c141-5055-b86f-f9382eac1a3e  
**Constraint honored:** no WEBHOOK remount · no OAuth URI prune · no PBI-015 · no Observatory · no desktop/Funnel

---

## Verdict

**Shipped code that closes the `BdMetaBeads` library gap (`factory-cvl`).**  
Live Port→gateway→Rivet→Sandbox admit is still blocked on Funnel/desktop (ops), but supervisor can now admit against real `bd` (or a mock runner) **without** a public gateway.

| Gap (from morning docs) | After this PR |
|-------------------------|---------------|
| G7 — `BdMetaBeads` class missing | **Closed in library** — `apps/project-supervisor/src/bd-meta-beads.ts` |
| Admit dry-run without Port bypass | **Yes** — `createBdSupervisor` + mock/`bd` runner unit tests |
| G1 Funnel / public gateway | **Still blocked** (ops / Johnny desktop) |
| G5/G6 Rivet host + `RIVET_SUPERVISOR_URL` | **Still blocked** (ops + deploy glue) |
| G8 coding PBI beads (ready set is ops-only) | **Unchanged** — `factory-r9f` still open |
| G9/G10 Sandbox spawn | **Unchanged** |

---

## What shipped

**Branch:** `cursor/bd-meta-beads-adapter-1a3e` → PR (see below)  
**Verify:** `cd apps/project-supervisor && npm ci && npm run typecheck && npm test` → **15/15 pass**

| Artifact | Role |
|----------|------|
| `src/bd-meta-beads.ts` | `BdMetaBeads` implements `MetaBeadsGate` via `bd show` / `bd ready` / `bd update --claim` / `bd unclaim`; injectable `BdRunner`; **refuses non-`factory-` ids** |
| `createBdSupervisor({ cwd })` | Memory catalog + live/`mock` beads — no Funnel, no Port human login |
| `test/bd-meta-beads.test.ts` | Prefix guard, ready/blocked/in_progress, claim/reclaim, full admit dry-run without `portBypassId` |
| `specs/factory-kernel/spec.md` · `docs/meta-beads.md` · README | Contract note: Memory = CI; `BdMetaBeads` = live/local adapter |

### Admit semantics (adapter)

- `isReady`: `in_progress` → true; `open` → true only if id ∈ `bd ready --json`; else false  
- `claim`: prefix check → ready check → holder check → `bd update --claim --json` (`--actor` = claimedBy)  
- `reclaim`: `bd unclaim`  
- Product Beads: hard throw on non-`factory-` id

---

## Still needs Johnny / desktop (one-liner blockers)

- **Public gateway Funnel + WEBHOOK remount** — not this PR; do not remount onto a dead URL.  
- **Rivet Compose/Serve + supervisor Actor host** — adapter alone does not start Sandbox.  
- **Coding-work beads** — ready queue is still ops scaffolding (`factory-r9f` / `factory-w3n` / `factory-cvl`); map PBI coding beads before demo admit of real work.  
- **Independent review** — author ≠ reviewer (repo protection: PR+1 APPROVE).

---

## Explicit non-actions

- No Port WEBHOOK upsert / remount  
- No OAuth create/delete/revoke / redirect prune  
- No PBI-015 / CE compound  
- No Observatory  
- No `bd dolt push` / live claim of `factory-cvl` on origin Dolt (tests use mocks only)

---

## Related store docs

- [`beads-morning-ready.md`](./beads-morning-ready.md)  
- [`supervisor-morning-ready.md`](./supervisor-morning-ready.md)  
- [`m1-morning-gap-map.md`](./m1-morning-gap-map.md) (G7)  
- [`port-factory-workflows-live.md`](./port-factory-workflows-live.md)

**Blocked only on Johnny/desktop for live Port→gateway fire:** Funnel/`FACTORY_GATEWAY_BASE_URL` + Rivet Serve host — not for this adapter PR.
