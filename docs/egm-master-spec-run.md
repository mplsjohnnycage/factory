# EGM run — Factory master spec

**Date:** 2026-10-28  
**Skill invoked:** `egm-review` (feature-spec path: Stages 5–8 uninterrupted)  
**Target:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Outcome:** **Completed with FAIL verdict** (Goldfish review succeeded as a process; document does not pass Feature Spec / Zoom-Out bars). **Master spec not edited by this run.**

**Superseding loop (FE-40):** Iterate-to-buildable on master + [`factory-skill-leverage.md`](./factory-skill-leverage.md) is logged in [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md). Treat this FE-21 file as the historical FAIL baseline only.

---

## Dirty baseline (read this first)

Peer workers (Factory skill leverage) **mutated** `factory-master-spec.md` **mid-run before halt**. Known zones: §4.2 Port workflows, §4.5 pink-elephant-adjacent constraints, §6 seed PBIs, §7 CopilotRuntime/EGM gates, §9 ASSUMPTIONs 11–13. Assemble-first claims no writes; this EGM worker also performed **zero** writes to the master spec.

Stages **5–7** audited an earlier snapshot. Stage **8** and the consolidated report re-checked the **dirty current** file and mark mid-run mitigations vs residuals. Treat Stages 5–7 raw findings as historical relative to start; prefer Stage 8 + consolidated for “still true now.”

---

## Install & invoke

| Path | Role |
|------|------|
| `~/.cursor/plugins/local/egm/` | Cursor local Agent Plugin (full tree from Project artifacts) |
| `/agent/elephant-goldfish-model/` | Workspace clone |
| Project `artifacts/elephant-goldfish-model/` | Durable source copy |

**README invoke path used:** `/egm-review` against an existing design/production-plan doc → fresh-context Goldfish stages (not brainstorm/draft). Cursor is **not** a verified upstream harness ([#145](https://github.com/google/elephant-goldfish-model/issues/145)); **Cursor reload / new session** may be required for native `/egm-*` skill discovery. This run **tried anyway** by loading skill text from the installed plugin and dispatching **fresh Task subagents** as Goldfish (direct dispatch; no nested synthesizer tool).

**Preset chosen:** Consolidated feature-spec flow (Stages 5–8). No `## Detailed Implementation Plan` → `FeatureRange = full file`, `DetailedRange = N/A`, **Stage 9 skipped**. No interactive checkpoints; no `egm-resolve`.

**Artifact directory:** [`internal/egm-master-spec-review/`](../internal/egm-master-spec-review/)

---

## What EGM did

1. Confirmed/restored plugin install under `~/.cursor/plugins/local/egm/` (+ `/agent` clone).
2. Semantic split discovery: production plan only → feature-spec gates.
3. Spawned isolated Goldfish reviewers:
   - Stage 5 `egm-zoom-out` → `zoom_out_report.md`
   - Stage 6 `egm-comprehension` → `comprehension_report.md`
   - Stage 7 `egm-design` / `egm-structural` / `egm-style` → raw + `critic_report.md`
   - Stage 8 intermediate `egm-zoom-out` on dirty baseline → `intermediate_zoom_out_report.md`
4. Elephant consolidated → `consolidated_review_report.md`.
5. Did **not** rewrite `factory-master-spec.md`.

---

## Analysis (summary)

**Early baseline (S5–7) hot spots:** parallel Spec/PBI/LogicSRC before M1 slice (Blocker); missing Alternatives + Risks (Blockers); CopilotRuntime vs ADR-011; PBI-002 omitting ADR-011; Beads/Polygraph/Trailcode undefined; absolute “zero open questions”; altitude weeds / atlas DoD.

**Mitigated by mid-run peer edits (dirty file):** CopilotRuntime removed from §7; PBI-002 → ADR-001…011; live Port `factory_*` / execution blueprints; EGM + Compound gates + ASSUMPTIONs 12–13 / PBI-015; partial §4.5 display-channel framing.

**Residual FAIL themes (current file):** still full parallel first wave; still no Alternatives/Risks sections; premature ceilings/multi-repo; atlas weeds; LogicSRC breadth; Beads/Polygraph Spec/DDD gaps; Problem/Goals missing; topology desktop vs Vercel unresolved.

Full prioritized list: [`internal/egm-master-spec-review/consolidated_review_report.md`](../internal/egm-master-spec-review/consolidated_review_report.md).

---

## Errors / caveats

| Item | Detail |
|------|--------|
| Cursor native plugin UX | Reload may be needed for `/egm-review` picker; run used manual skill + Task Goldfish |
| No MCP/CLI binary | EGM is skill/persona plugin, not a standalone CLI |
| Dirty mid-run target | Analysis target changed under the reviewers; S5–7 ≠ final text |
| Stage 9 | Skipped — no implementation-plan section |
| Resolve | Not run (report-only; master spec frozen) |
| Nested synthesizer | Direct Goldfish dispatch (Cursor has Task, not named `egm-*` personas) |

---

## Success / fail

| Dimension | Result |
|-----------|--------|
| Install usable | **Success** |
| End-to-end Goldfish Stages 5–8 | **Success** (artifacts written) |
| Document passes EGM feature-spec / zoom-out bar | **Fail** |
| Master-spec remediation | **Not attempted** (by instruction) |

**Overall:** EGM review **run succeeded**; master-spec **quality gate failed**; baseline **dirty** relative to start.
