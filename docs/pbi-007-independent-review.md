---
cursor:
  subagentId: "bc-0a1a85e6-4f9b-5b35-b6c3-042596eddd0b"
---

# PBI-007 / STL-168 — Independent review (PR #15)

**PR:** https://github.com/mplsjohnnycage/factory/pull/15 (open)  
**Head:** `96a673d` · branch `cursor/pbi-007-supervisor-beads-938b` · base includes PBI-006 `#14` @ `37625bf`  
**Linear:** [STL-168](https://linear.app/johnny-cage/issue/STL-168) · [diff review](https://linear.app/johnny-cage/review/pbi-007-projectsupervisor-meta-beads-ready-gate-stl-168-b8a4d384af73)  
**Reviewer role:** Independent (fresh Cursor review-pool session). **Not** implementer `bc-c3afcbd5`.  
**Content decision:** **APPROVE** — authored supervisor + Meta Beads gate matches STL-168 contract + Specs; CI green.

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **Blocked** — 404 / no access on private repo | — |
| GitHub formal `APPROVE` via Composio (`mplsjohnnycage`) | **Skipped** — would 422 own-PR | — |
| GitHub PR review (`COMMENT`, APPROVE checklist) | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/15#pullrequestreview-5692901213 |
| GitHub issue comment | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/15#issuecomment-6488042757 |
| Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | — |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body) | comment `21eda1a4-…` on Linear review URL |
| Linear issue comment on STL-168 | Posted | https://linear.app/johnny-cage/issue/STL-168 · comment `d3d86f8a-…` |

No implementation. No merge. Johnny out of review (review requests: Codex + Linear only).

## Acceptance checklist (STL-168 / seed / Spec)

Must all pass → APPROVE.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Duplicate admit → one attempt | `apps/project-supervisor/src/project-supervisor.ts` `#byWorkKey` + suite | **PASS** | Identical `workKey` returns same `workAttemptId`, `duplicate: true` |
| Claim id required | admit path + “claim id required” suite | **PASS** | Refuses without `beadId` / bypass; accepts audited `portBypassId` |
| Meta Beads ready gate | `src/meta-beads.ts` `MemoryMetaBeads` + `.beads/` | **PASS** | `bead_not_ready` refuse; Meta prefix/`factory` Dolt metadata; never Product Beads |
| Port-authorized recover | `recover()` + suite | **PASS** | Same attempt id; status `recovered`; unauthorized refused |
| Port projections | `src/port-projections.ts` + Memory catalog | **PASS** | `executionContract` / `deliveryRun` / `executionAttempt` via §4.2.1-shaped writer |
| CI invariant tests | `.github/workflows/project-supervisor.yml` | **PASS** | Check runs **SUCCESS** on head; local → **7/7** |
| Same-PR Spec update | `specs/factory-kernel/spec.md`, `specs/rivet-execution/spec.md` | **PASS** | ReadyTaskEvent + Gherkin for fence / claim / recover |
| Task / seed mirror | `tasks/PBI-007-…`, `docs/linear-pbi-seed/PBI-007-…` | **PASS** | Deliverables + verification match STL-168 |
| Dependencies PBI-005, PBI-006 | base `37625bf` (#14) | **PASS** | Ancestor of PR head |
| Lane hard rules | (diff scope) | **PASS** | Meta Beads only; no Port OAuth create/delete; no catalog dual-write bypass |

## Consistency skim

- Contract AC matches seed + Linear STL-168: duplicate fence, claim gate, Port-authorized recover, CI invariants.
- Spec refined in-PR to Rivet-shaped `ProjectSupervisorActor` under `apps/project-supervisor/` — appropriate for M1 before live Rivet Actor wiring.
- Memory Meta Beads + Memory catalog are CI SoT; live `bd` / gateway writer remain interfaces.
- Author self-identified as implementer and correctly requested Codex + Linear (Johnny out); this session is independent.
- No secrets committed.

## Findings (non-blocking)

1. In-process Memory stand-ins (Beads + catalog) — intentional for CI; live `bd` / Port writer wiring is follow-on.
2. `rivet-execution` Spec reshuffle drops an explicit Product-Beads/OAuth guardrail line; still covered in `factory-kernel` + PR lane notes.
3. Formal GitHub `APPROVE` and Linear `approved` events could not be cast from available identities (own-PR / App scope / GitHub sync). Content verdict remains APPROVE via COMMENT channels — same constraint as PBI-003…006 independent reviews.

## Recommendation

Content is **APPROVE**. **STL-168 may advance on authored artifacts.** Formal GitHub `APPROVE` still needs Codex / Linear reviewer identity if a green check event is required for process hygiene. Do not merge from this review session; coordinator owns merge.
