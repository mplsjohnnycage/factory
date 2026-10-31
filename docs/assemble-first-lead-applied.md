---
cursor:
  subagentId: "bc-ed70a4cb-5786-5fd9-984c-3ed87d5f5a6b"
---

# FE-24 — Assemble-first master lead applied

**Date:** 2026-10-29  
**Tasks:** FE-24 (close) · FE-125 apply window · draft FE-108  
**Draft source:** [`assemble-first-master-lead-draft.md`](./assemble-first-master-lead-draft.md)  
**SoT edited:** [`factory-master-spec.md`](./factory-master-spec.md) (Project store — canonical)

## Verdict

**Store-only apply complete.** Master now **leads with** named **assemble-first**. No repo PR — `docs/factory-master-spec.md` does not exist in the meta-repo (only pointers to Project store §N).

## Applied (A–D)

| Section | Change |
|---------|--------|
| **A (required)** | Status-banner **Assemble-first** line under H1 Status — links §4.2.2 + §0.0; catalog-miss → **needs implementation** |
| **B (required)** | New **§0.0 Assemble-first (lead principle)** before §0.1 — flow summary + explicit **Does not** weaken §4.2.1 |
| **C (recommended)** | §0.4 first sentence ties Standardize to **assemble-first** (§0.0 / §4.2.2) |
| **D (recommended)** | §4.2.2 title alias `(assemble-first)`; principle renamed **Principle (assemble-first):** — FE-37 body / four-step flow unchanged |

## Grep evidence (`assemble-first` in master)

| Location | Role |
|----------|------|
| Banner (after Status) | Lead + pointers to §4.2.2 / §0.0 |
| §0.0 | Lead principle (Assemble-first) |
| §0.4 | Loop ↔ lead alignment |
| §4.2.2 H4 + Principle | SoT ↔ derived-docs term match |

Literal `assemble-first` present in lead (banner / §0.0 anchors + prose) and in §4.2.2 (≥1 each).

## Guardrails checked

- **§4.2.1** body untouched (single-writer / `catalogVersion` / reject-stale / ownership split preserved).
- §4.2.2 assembly flow steps 1–4 unchanged.
- No Port mutations.
- No repo branch / PR (`cursor/assemble-first-lead-81e8` not needed).

## Repo check

- `/workspace/docs/factory-master-spec.md` — **absent**
- Repo references Project store master only (`README.md`, PBI seed docs)
- Workspace `rg assemble-first` — no meta-repo hits

## Coordinator follow-ups (out of this worker)

- Mark **FE-24** / **FE-125** Done in `notes.md` with pointer here.
- Optional: move FE-24 off Queued in `factory-verify.html` (non-blocking per draft).
