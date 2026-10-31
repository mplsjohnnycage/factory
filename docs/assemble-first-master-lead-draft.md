---
cursor:
  subagentId: "bc-ecc1ec43-1223-50bb-9876-4c2bab03e32a"
---

# FE-108 — Assemble-first master lead draft (store-only)

**Date:** 2026-10-29  
**Tasks:** FE-108 (this draft) → unblocks FE-24 (apply lead into master)  
**Status source:** [`assemble-first-status.md`](./assemble-first-status.md)  
**Scope:** **Store-only draft.** Do **not** edit `factory-master-spec.md`. Do **not** open a PR. Coordinator / Johnny review before any exclusive master edit window.

## Purpose

FE-24 needs the master to **lead with** the named **assemble-first** model. The substance already lives at [§4.2.2](./factory-master-spec.md#422-machine-validated-stack-assembly) (FE-37 Done); derived docs already say “assemble-first.” The master itself never uses the term and does not open with the principle.

This file is the proposed paste text for that lead — reviewable without multi-writer risk on the SoT.

## Locked alias

| Term | Meaning |
|------|---------|
| **assemble-first** | Prefer Port catalog composables and **§4.2.2 machine-validated stack assembly** before greenfield build or provision. Invalid combos reject before Coding admit. Catalog misses → **needs implementation** → Beads/PBI deltas — never silent scaffold of invalid stacks. |

Equivalent locked phrases already in master: “Machine-validated stack assembly” (§4.2.2 title), Cockpit **Assemble software** (§18.3), Spec Canvas catalog-hit vs **needs implementation** (§20).

## Proposed master edits (review only — not applied)

### A. Status banner (after the existing **Status:** line, or as a new bold lead line under the H1)

```markdown
**Assemble-first:** Factory leads with Port machine-validated stack assembly ([§4.2.2](#422-machine-validated-stack-assembly) / [§0.0](#00-assemble-first-lead-principle)) — choose stack → Port validate → provision only on success. Catalog misses → **needs implementation** (Beads/PBI), not silent greenfield.
```

### B. New early §0 principle (insert **before** current `### 0.1 Unit of work`)

```markdown
### 0.0 Assemble-first (lead principle)

> **Assemble-first:** Before Feature Assembly or provision, prefer Port catalog composables and **machine-validated stack assembly** ([§4.2.2](#422-machine-validated-stack-assembly)). Port rejects incompatible stacks **before** build. Catalog misses are flagged **needs implementation** and become Beads/PBI deltas — do **not** silently scaffold invalid combos or treat unflagged gaps as provisionable modules ([§20](#20-spec-canvas--loop--task-decomposition)).

**Flow (summary):** choose stack (template + modules) → Port validates compatibility rules as catalog data → on success only, provision / connect / Coding admit → on conflict, reject with machine-readable reasons and compatible alternatives.

**Does not:** weaken §4.2.1 write fencing; relocate catalog SoT out of Port; replace Spec+Contract Standardize; or imply M1 ships the full Assemble-software wizard (§18.3 remains post-M1 implement where already locked).
```

### C. One-line touch on §0.4 (optional, keeps loop ↔ lead aligned)

Current:

> **task → standardize → PR → build → loop.** …

Proposed replacement first sentence:

```markdown
**task → standardize → PR → build → loop.** Standardize includes Spec+Contract alignment and **assemble-first** ([§0.0](#00-assemble-first-lead-principle) / [§4.2.2](#422-machine-validated-stack-assembly)). Tool-agnostic. Cursor is not the only coding agent. Detail: derived [`factory-coding-loop.md`](./factory-coding-loop.md). This order does **not** add an independent-review / “Merge!” step — review attaches to the PR/build gates already named in §7 / ADR-008.
```

### D. §4.2.2 title alias (optional, one phrase — keeps SoT ↔ derived docs term match)

Current H4:

> `#### 4.2.2 Machine-validated stack assembly`

Proposed:

```markdown
#### 4.2.2 Machine-validated stack assembly (assemble-first)
```

Opening principle sentence can add the alias once:

```markdown
**Principle (assemble-first):** Port enforces **stack compatibility as machine-validated rules during assembly** — not as prose guidelines or post-build CI luck. …
```

No body rewrite of the four-step assembly flow — FE-37 text stays.

## What this draft deliberately does **not** change

- No rewrite of §4.2.2 assembly flow, §4.2.1 fencing, §18.3 / §20 canvas behavior.
- No repo `AGENTS.md` / living Specs / Linear / Beads mutations from this task.
- No PR, no branch, no master file write.
- Does not close FE-24 — apply + `notes.md` pointer still required after review.

## Apply checklist (for FE-24 exclusive window later)

1. Coordinator/Johnny approve this draft (or a marked revision).
2. Exclusive edit of `factory-master-spec.md`: A + B required; C and D recommended.
3. Grep master for literal `assemble-first` ≥ 1 in lead (§0.0 or banner) and ≥ 1 pointing at §4.2.2.
4. Spot-check derived docs already pointing at §4.2.2 (`factory-coding-loop.md`, `factory-workflow.md`) — no forced rewrite if alias lands.
5. Close FE-24 / FE-108 in `notes.md` with report pointer here; optionally move FE-24 off Queued in `factory-verify.html` (non-blocking).

## Evidence this draft satisfies the status gap

| FE-24 “Done” item (from status) | This draft |
|---------------------------------|------------|
| Master **leads** with named assemble-first | Proposed banner + §0.0 before §0.1 |
| Master uses term **assemble-first** | Locked alias + proposed paste uses the term |
| Catalog-miss → **needs implementation** in lead | Explicit in banner, §0.0, and alias table |
| FE-24 closed with report pointer | **Not yet** — apply step is FE-24; this file is FE-108 draft only |
