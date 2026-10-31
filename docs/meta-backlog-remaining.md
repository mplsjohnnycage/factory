# Factory Meta — remaining backlog map

**Checked:** 2026-10-29 ~06:26Z  
**Repo:** https://github.com/mplsjohnnycage/factory (`main` @ `2546716` = PBI-013 / #22)  
**Sources:** Linear Factory Meta (STL-162…176 + adjacent), `gh` open/merged PRs, Project `notes.md` / seed docs, live cloud agents  
**Lane:** Meta only. No code changes in this pass.

## Remaining PBIs (actionable)

| PBI | Linear | Live status | Next |
|-----|--------|-------------|------|
| **PBI-014** OpenPRD 0001–0005 | [STL-175](https://linear.app/johnny-cage/issue/STL-175) **Backlog** + Deferred label | **In Progress (Project)** — author [bc-e483d628](https://cursor.com/agents/bc-e483d628-c0b4-5db0-a68c-4f8e81c1880b); Linear/seed lag | Let sole author finish → open PR → independent review. Do **not** dual-author. |
| **PBI-015** CE compound writeback | [STL-176](https://linear.app/johnny-cage/issue/STL-176) **Backlog** + Deferred | **Hold / HITL** — seed + Linear still deferred; no live author | Start **only** after human flags `/ce-compound`; Project worker from then-`main`. |

Everything else in STL-162…174 is **Done** (merged).

## Parallel-safe next (no collision)

**Already live — do not overlap:**

| Agent | Work | Avoid |
|-------|------|--------|
| [bc-e483d628](https://cursor.com/agents/bc-e483d628-c0b4-5db0-a68c-4f8e81c1880b) | PBI-014 OpenPRD author | Second OpenPRD / `specs/` product-intent PR |
| [bc-05527a21](https://cursor.com/agents/bc-05527a21-0a3c-5346-bbce-22428e8c57b0) | Vercel CI beta | Competing `.github/workflows/*` / Vercel project CI edits |
| [bc-97efa352](https://cursor.com/agents/bc-97efa352-c209-5b58-b348-d783768e0727) | Meta Beads audit | Competing `.beads/` mutate / `bd init` |
| [bc-d80c288a](https://cursor.com/agents/bc-d80c288a-dd58-5e17-979e-6f65be4df077) | Port auth linkage audit | Port External Interface create/delete/revoke |

**Safe to run in parallel now:**

1. **Linear FE-61 click path** — STL-178…183 / [STL-177](https://linear.app/johnny-cage/issue/STL-177) (GitHub app access, PR automations, Autolink, painter-os retarget, review-pool apps). Config/HITL; no factory kernel code.
2. **Independent review of PBI-014** — only after its PR opens (author ≠ reviewer).
3. **Read-only audits** already spinning (CI protection, OpenAccess smoke, assemble-first, stale For Review) — keep read-only; no merge ownership fights.
4. **Hygiene (optional, docs-only):** scrub seed `PBI-012/013-*-DEFERRED.md` + `DEFERRED-012-015.md` / README — live Linear+GitHub show 012/013 **Done**; seed still says deferred. Prefer Project-store-only unless coordinating a tiny meta docs PR that avoids Vercel-CI files.

**Do not start:** PBI-015 (HITL); second PBI-014 author; Port OAuth app mutations; Beads DB blob commits.

---

## 1. Linear STL-162…176

| ID | PBI | Linear status | Evidence |
|----|-----|---------------|----------|
| STL-162 | 001 Spec stubs | **Done** | [#1](https://github.com/mplsjohnnycage/factory/pull/1) |
| STL-163 | 002 ADRs | **Done** | [#10](https://github.com/mplsjohnnycage/factory/pull/10) |
| STL-164 | 003 OpenStack/AGENTS | **Done** | [#11](https://github.com/mplsjohnnycage/factory/pull/11) |
| STL-165 | 004 Rivet Compose | **Done** | [#12](https://github.com/mplsjohnnycage/factory/pull/12) |
| STL-166 | 005 gateway | **Done** | [#13](https://github.com/mplsjohnnycage/factory/pull/13) |
| STL-167 | 006 sandbox | **Done** | [#14](https://github.com/mplsjohnnycage/factory/pull/14) |
| STL-168 | 007 supervisor+Beads | **Done** | [#15](https://github.com/mplsjohnnycage/factory/pull/15) |
| STL-169 | 008 Dev OS shell | **Done** | [#16](https://github.com/mplsjohnnycage/factory/pull/16) |
| STL-170 | 009 Rivet realtime | **Done** | [#18](https://github.com/mplsjohnnycage/factory/pull/18) |
| STL-171 | 010 OpenAccess/MCP | **Done** | [#19](https://github.com/mplsjohnnycage/factory/pull/19) |
| STL-172 | 011 CI accept SHA | **Done** | [#20](https://github.com/mplsjohnnycage/factory/pull/20) |
| STL-173 | 012 OpenFleet | **Done** | [#21](https://github.com/mplsjohnnycage/factory/pull/21) @ `505a336` |
| STL-174 | 013 local gate | **Done** | [#22](https://github.com/mplsjohnnycage/factory/pull/22) @ `2546716` |
| STL-175 | 014 OpenPRD | **Backlog** (label Deferred) | Live author FE-94 / bc-e483d628 — treat as **In Progress** |
| STL-176 | 015 CE compound | **Backlog** (label Deferred) | HITL hold — treat as **Todo / deferred** |

**Counts (operational):** Done **13** (001–013) · In Progress **1** (014) · Todo/deferred **1** (015).

### Seed docs vs live issues (014/015 + 012/013 lag)

| Artifact | Says | Live truth |
|----------|------|------------|
| `docs/linear-pbi-seed/DEFERRED-012-015.md` + per-PBI `*-DEFERRED.md` | 012–015 deferred / not seed wave | **012–013 Done** (merged). **014** authoring live. **015** still deferred/HITL. |
| `docs/linear-pbi-seed/README.md` | “Seed: PBI-001–011 live. Deferred: 012–015.” | Stale for 012–013 (and 014 in flight). |
| STL-175 / STL-176 issue bodies | DEFERRED / later | Align with seed for **015**; **014** body not flipped to In Progress despite Project worker. |
| STL-173 / STL-174 titles/bodies | Were deferred-for-seed; now Done | Status caught up; seed files did not. |

**Rule:** Prefer **Linear status + merged PRs** over seed filenames for Done/Todo. Prefer **Project notes + live agents** over Linear Backlog for PBI-014 in-flight.

## 2. Open GitHub PRs → Meta PBI map

**Open PRs on `mplsjohnnycage/factory`: none** (`gh pr list --state open` → `[]`).

No open PR ↔ PBI mapping right now. PBI-014 has **no** remote branch / PR yet (`git ls-remote` no `pbi-014` / `openprd`).

### Recently merged (context)

| PR | PBI | Linear |
|----|-----|--------|
| #22 | 013 | STL-174 |
| #21 | 012 | STL-173 |
| #20 | 011 | STL-172 |
| #19 | 010 | STL-171 |
| #18 | 009 | STL-170 |
| #17 | meta-ci foundation (not numbered PBI) | — |
| #16…#1 | 008…001 | STL-169…162 |

## 3. Adjacent Meta (not STL-162…176; parallel context)

| ID | Title | Status |
|----|-------|--------|
| STL-177 | FE-61 Linear auto-review | In Progress |
| STL-178…183 | FE-61 children (app access, automations, Loop, Autolink, painter-os, review pool) | Todo / In Progress |

These are **safe parallel** with PBI-014 (config/HITL, not kernel Specs).
