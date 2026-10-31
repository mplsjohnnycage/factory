# FE-24 — Assemble-first exclusive-window apply plan

**Date:** 2026-10-29  
**Kind:** Store-only plan (this file). Does **not** edit `factory-master-spec.md`. Does **not** open a PR.  
**Source draft:** Project store `docs/assemble-first-master-lead-draft.md` (FE-108)  
**Status context:** `docs/assemble-first-status.md` (Project store)  
**Sequencing:** FE-108 draft → coordinator/Johnny review → **FE-24 exclusive apply** → closeout in `notes.md`  
**Restore note:** FE-116 originally wrote this to a private agent `self` store; restored into Project `docs/` 2026-10-29 from transcript `bc-9708c7a4-9142-5ae0-9537-2efa01110569` (see `internal/fe-116-assemble-first-apply-plan-extract.md`). Apply outcome: `docs/assemble-first-apply-status.md`.

---

## Goal

Make the master SoT **lead with** the named **assemble-first** model without rewriting FE-37 §4.2.2 substance.

**Done when** (from status, via FE-108 draft):

1. Master **leads** with named assemble-first (banner + §0.0 before §0.1).
2. Master uses the literal term `assemble-first`.
3. Catalog-miss → **needs implementation** appears in the lead.
4. FE-24 / FE-108 closed in Project `notes.md` with a report pointer (optional: FE-24 off Queued in `factory-verify.html`).

---

## Preconditions (gate before exclusive window)

| # | Gate | Owner |
|---|------|--------|
| P1 | FE-108 draft approved (as-is or marked revision) | Coordinator / Johnny |
| P2 | No other FE-* / agent holds an open write on `factory-master-spec.md` | Coordinator |
| P3 | Paste blocks A–D frozen from approved draft (no ad-hoc rewrite mid-apply) | Apply agent |
| P4 | This plan accepted; apply agent briefed: **A+B required; C+D recommended** | Coordinator |

**Do not start apply** if P1–P2 fail. Store-only planning (this file) is already complete and parallel-safe.

---

## Exclusive-window protocol

Master is single SoT; prior multi-writer dirt makes parallel edits **not safe**.

1. **Claim:** Coordinator announces FE-24 exclusive window (who applies; file: `factory-master-spec.md` in Project store).
2. **Freeze:** Pause other FE-* units that may touch the master until apply agent reports closeout or abort.
3. **Apply:** One writer only — paste A+B (and C+D if approved). No scope creep (no §4.2.2 body rewrite, no fencing / §18.3 / §20 behavior change).
4. **Verify:** Grep + spot-check (steps below).
5. **Release:** Update `notes.md`; announce window closed.

**Abort:** If a concurrent edit is discovered mid-window, stop, do not merge competing text, re-queue FE-24 after re-approval of a reconciled draft.

---

## Apply steps

Target file: Project store `factory-master-spec.md` (same store as FE-108 draft). Paste text is in the approved FE-108 draft — do not invent new lead copy during apply.

### Step 1 — Snapshot

- Note current master revision / mtime / hash if available.
- Confirm `### 0.1 Unit of work` still exists (insert point for §0.0).
- Confirm `#### 4.2.2 Machine-validated stack assembly` still exists (alias target for D).

### Step 2 — Required edit A (status banner)

- Insert the draft **Assemble-first:** banner after the existing **Status:** line (or as a new bold lead line under the H1), per approved draft block A.
- Must include: §4.2.2 link, §0.0 link, choose→validate→provision flow, catalog-miss → **needs implementation**.

### Step 3 — Required edit B (§0.0 lead principle)

- Insert new `### 0.0 Assemble-first (lead principle)` **immediately before** current `### 0.1 Unit of work`.
- Paste draft block B verbatim (quote, flow summary, **Does not** bounds).
- Do **not** place this as a later §0.x (e.g. not §0.8).

### Step 4 — Recommended edit C (§0.4 loop alignment)

- If approved: replace the first sentence of §0.4 with draft block C so Standardize names **assemble-first** and links §0.0 / §4.2.2.
- Leave the rest of §0.4 (tool-agnostic / no extra “Merge!” step) intact unless the approved draft already includes those sentences in the replacement.

### Step 5 — Recommended edit D (§4.2.2 alias)

- If approved: retitle H4 to `#### 4.2.2 Machine-validated stack assembly (assemble-first)`.
- Optionally prefix the opening principle sentence with **Principle (assemble-first):** once.
- **Do not** rewrite the four-step assembly flow body (FE-37 text stays).

### Step 6 — Verification

| Check | Pass criteria |
|-------|----------------|
| Grep lead | Literal `assemble-first` ≥ 1 in banner and/or §0.0 |
| Grep SoT pointer | Literal `assemble-first` ≥ 1 in/near §4.2.2 **or** a lead link that points at §4.2.2 (banner/§0.0/§0.4) |
| Lead position | §0.0 appears before §0.1 |
| Catalog-miss | Lead text includes **needs implementation** |
| Non-goals | §4.2.1 fencing, §4.2.2 flow body, §18.3 / §20 behavior unchanged |
| Derived docs | Spot-check `factory-coding-loop.md`, `factory-workflow.md` still coherent with §4.2.2 — **no forced rewrite** if D alias lands |

### Step 7 — Closeout

1. Update Project `notes.md`: mark FE-24 (and FE-108) closed with pointer to this apply plan + FE-108 draft path + any apply report.
2. Optionally move FE-24 off Queued in `factory-verify.html` (non-blocking).
3. Coordinator releases exclusive window.

---

## Risk

| Risk | Severity | Mitigation |
|------|----------|------------|
| Multi-writer dirt on `factory-master-spec.md` | High | Exclusive window; freeze other FE-* writers; abort on conflict |
| Apply without draft approval | High | P1 gate; paste only approved blocks |
| Accidental §4.2.2 / fencing rewrite | Medium | Explicit non-goals; D is title/alias only |
| Lead buried after §0.1 | Medium | Step 3 insert-before rule |
| Term mismatch vs derived docs | Low | Recommended D alias; spot-check only — no forced derived rewrite |
| Scope creep into repo Specs / AGENTS / Linear / Beads | Medium | Apply touches **master SoT (+ notes/verify) only** |
| Premature git PR during planning or apply | Medium | See PR shape — default **none** for store SoT |

---

## PR shape

| Phase | GitHub / forge PR? | Shape |
|-------|--------------------|--------|
| **This plan (now)** | **No** | Store-only doc under Project `docs/` |
| **FE-108 draft** | **No** | Already store-only |
| **FE-24 apply** | **No (default)** | Project-store edit of `factory-master-spec.md` + `notes.md` closeout. Not a git branch/PR unless coordinator later promotes master into the factory repo under a separate authorized unit. |
| **If promoted later** | Separate decision | Single docs-only PR: master lead paste A+B (+C/D); title like `docs: FE-24 assemble-first lead in master`; body links FE-108 draft + this plan; no Spec/AGENTS/Beads side changes |

**This task does not open a PR.**

---

## Out of scope (explicit)

- Editing `factory-master-spec.md` from **this** plan authoring pass.
- Rewriting §4.2.2 assembly flow, §4.2.1 write fencing, §18.3 Assemble-software wizard, or §20 Spec Canvas behavior.
- Repo `AGENTS.md`, living Specs, Linear, Beads, Port mutations.
- Closing FE-24 before exclusive apply + notes pointer.

---

## Quick reference — edit matrix

| Edit | Required? | Location | Intent |
|------|-----------|----------|--------|
| A | Yes | Status / H1 lead banner | Name assemble-first at the top |
| B | Yes | New §0.0 before §0.1 | Lead principle + flow + bounds |
| C | Recommended | §0.4 first sentence | Loop ↔ lead term |
| D | Recommended | §4.2.2 title (+ optional principle prefix) | SoT ↔ derived term match |

**Locked alias:** Prefer Port catalog composables and §4.2.2 machine-validated stack assembly before greenfield; invalid combos reject before Coding admit; catalog misses → **needs implementation** → Beads/PBI — never silent scaffold.
