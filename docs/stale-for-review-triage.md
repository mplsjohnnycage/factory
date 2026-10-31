# Stale For Review triage — FE-72 / FE-61 / FE-57 / FE-49

**Date:** 2026-10-29  
**Worker:** `bc-19415a86-f3b3-5431-acd1-d4e2d4c7cd6f`  
**Mode:** Read-only triage — no Linear/GitHub mutations  
**Sources:** [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md) · [`linear-auto-review-setup.md`](./linear-auto-review-setup.md) · [`factory-meta-setup-status.md`](./factory-meta-setup-status.md) · live Linear MCP + `gh` API

---

## Verdict table

| FE | Verdict | Recommended action |
|----|---------|-------------------|
| **FE-72** painter-os sync / Cursor default repo | **still open/actionable** | Keep For Review. Johnny: Cursor default repo = `mplsjohnnycage/factory` + ASDLC Issues Sync Edit Link (or Meta team split). Coordinator: close painter-os `#277–#291` not-planned. Do **not** cancel — sync map risk is live. |
| **FE-61** Linear auto review for Factory | **still open/actionable** | Keep For Review (or track only Linear). Johnny next: [STL-178](https://linear.app/johnny-cage/issue/STL-178) + [STL-179](https://linear.app/johnny-cage/issue/STL-179); verify Loop run on [STL-180](https://linear.app/johnny-cage/issue/STL-180). Defer [STL-183](https://linear.app/johnny-cage/issue/STL-183). Do **not** cancel parent [STL-177](https://linear.app/johnny-cage/issue/STL-177). |
| **FE-57** GitHub login push factory | **done-in-practice** | Mark Project FE-57 **Done**. Push goal satisfied (`mplsjohnnycage/factory` live, `pushed_at` 2026-10-29). Painter-os remainder stays on **FE-72** / [STL-182](https://linear.app/johnny-cage/issue/STL-182) — do **not** cancel STL-182. |
| **FE-49** Meta Linear seed and repo scaffold | **cancel-safe** (Project card) | Mark Project FE-49 **Done**. Seed + scaffold complete; PBI wave already through PBI-013. No Linear issue cancel — STL-162+ are real PBIs, not noise. |

---

## Per-item evidence

### FE-72 — painter-os sync / Cursor default repo

| Check | State |
|-------|--------|
| Linear attachments STL-162…176 → painter-os | **Detached** (re-checked: STL-173 has factory PR only; STL-175/176 none) |
| Factory PR bodies free of painter-os | **Yes** (prior retarget pass) |
| painter-os `#277–#291` | **Still open** (gh API 2026-10-29) — not closed not-planned |
| [STL-182](https://linear.app/johnny-cage/issue/STL-182) Edit Link | **Todo** · assignee Johnny |
| Cursor Cloud Agents default repo | **Unchecked** in retarget checklist; early STL-164/165/166 bot failures (“No default repository”). Later coding succeeded via Project workers resolving `factory` by other paths — **not** proof dashboard default is set |

**Why not cancel-safe:** Unfixed ASDLC↔painter-os Issues Sync can re-contaminate Meta. Open painter-os mirrors are still Product-lane noise until closed.

---

### FE-61 — Linear auto review

| Check | State |
|-------|--------|
| Runbook | Live — `docs/linear-auto-review-setup.md` |
| PR linking / Reviews | Live — e.g. factory Diffs; coding loop reviews in practice |
| Loop object | Live — [factory-meta-pr-first-pass-review](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec); first Run history still **verify** ([STL-180](https://linear.app/johnny-cage/issue/STL-180) In Progress) |
| Parent [STL-177](https://linear.app/johnny-cage/issue/STL-177) | **In Progress** |
| Sub-issues still open | STL-178, 179, 181, 182 **Todo**; STL-183 **Todo** (pool expand); STL-180 **In Progress** |

**Why still actionable:** Core agent wiring is done, but DoD Johnny clicks (App access, PR→status automations, Loop verify) are unfinished. Canceling would bury HITL work that is still the auto-review gap vs MCP playbook.

---

### FE-57 — GitHub login push factory

| Check | State |
|-------|--------|
| Original FE title | GitHub login + push factory (child of FE-49) |
| Remote | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) — `main`, last push **2026-10-29T06:22:39Z**, open_issues=7 |
| Downstream proof | Merged Meta PRs through at least #20–#22; setup status item 6 **Done** |

**Scope note:** Retarget doc labels STL-182 as “FE-57,” but that is the **painter-os retarget** follow-on, now owned by FE-72. Closing the Project FE-57 card does not close STL-182.

---

### FE-49 — Meta Linear seed and repo scaffold

| Johnny item (setup status) | Outcome |
|----------------------------|---------|
| 1–7 inventory / zip / research / PBI seed / deferred / GitHub+AGENTS / status report | All **Done** in [`factory-meta-setup-status.md`](./factory-meta-setup-status.md) |
| Linear seed | STL-162…176 exist; PBI-001…011 **Done**; PBI-012/013 Done; 014/015 Backlog Deferred |
| Partial painter-os note | Absorbed by FE-72 / STL-182 |

**Cancel-safe meaning:** Safe to clear the **Project For Review** card as Done. **Not** safe to cancel the seeded Linear PBIs.

---

## Explicit non-actions (this pass)

- Did **not** close/cancel any Linear issue  
- Did **not** close painter-os GitHub issues  
- Did **not** edit Project `notes.md` (coordinator owns For Review moves)  
- Did **not** change Cursor dashboard or Linear Integrations UI  

---

## Suggested Project notes moves (coordinator)

1. FE-49 → Done  
2. FE-57 → Done (comment: sync remainder = FE-72 / STL-182)  
3. FE-61 → keep For Review until STL-178 + STL-179 (+ Loop verify)  
4. FE-72 → keep For Review until Edit Link + Cursor default repo + painter-os `#277–#291` closed  
