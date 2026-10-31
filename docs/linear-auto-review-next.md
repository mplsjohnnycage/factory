# FE-61 next: STL-178 / STL-179 Johnny click path

**Date:** 2026-10-29  
**Parent:** [STL-177](https://linear.app/johnny-cage/issue/STL-177) · Project **FE-61**  
**Sources:** [`linear-auto-review-setup.md`](./linear-auto-review-setup.md) · [`stale-for-review-triage.md`](./stale-for-review-triage.md)  
**Mode:** Config / HITL only — **Johnny clicks**. Agents must not `delegate` these to Cursor (or any coding agent) and must not treat them as implementable PBIs.

---

## Verdict

| Item | State | Action |
|------|--------|--------|
| Agent wiring (Diffs, Reviews, PR↔issue, Loop object, MCP playbook) | **Done** | Keep runbook; no more coding for FE-61 core |
| [STL-178](https://linear.app/johnny-cage/issue/STL-178) Linear + Linear Code App → `factory` | **Todo** · assignee Johnny | **Do next** — UI only |
| [STL-179](https://linear.app/johnny-cage/issue/STL-179) ASDLC PR→status automations | **Todo** · assignee Johnny | **Do next** — UI only |
| [STL-180](https://linear.app/johnny-cage/issue/STL-180) Loop Run history verify | In Progress · Loop [live](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec) | After 178 (code access); verify on next Meta PR — no recreate unless deleted |
| STL-181 Autolink / Code & reviews | Todo | Nice-to-have — after 178/179 |
| STL-182 painter-os Issues Sync | Todo | Owned by **FE-72**, not this click path |
| STL-183 expand review pool apps | Todo | **Defer** (triage) |

**FE-61 stays For Review** until STL-178 + STL-179 are Done (Loop verify on STL-180 closes the optional auto-comment gap). Do **not** cancel STL-177.

---

## Hard rule (agents)

- These tickets are **HITL / settings**. Leave assignee = **Johnny Cage**.
- Do **not** set Linear `delegate` → Cursor / Codex / etc.
- Do **not** open coding cloud agents, PRs, or Beads for “implementing” App access or team automations.
- MCP cannot flip GitHub App allowlists or team Workflows — only Johnny’s browser can.

---

## 1 — STL-178: Confirm Linear (+ Linear Code) can see `mplsjohnnycage/factory`

**Why first:** PR #1 already syncs into Linear Diffs, but Loops / file contents / Guides need explicit repo access. STL-179 automations and STL-180 Loop runs assume this repo is on the App.

### Click path (GitHub)

1. Open GitHub → **Settings → Applications → Installed GitHub Apps**.
2. Open **Linear** → **Configure**.
3. Under **Repository access**, ensure **`mplsjohnnycage/factory`** is included (or “All repositories”).
4. **Save**.
5. If **Linear Code** appears as a separate installed app, repeat Configure → include **`mplsjohnnycage/factory`** → Save.

### Click path (Linear check)

1. [Settings → Integrations → GitHub](https://linear.app/settings/integrations/github) — org / account still connected.
2. Optional: [Connected accounts](https://linear.app/settings/connected-accounts) — personal GitHub linked.
3. Open any factory Diff in Linear Reviews (e.g. recent Meta PR) and confirm **file contents** load (not just metadata).

### Done when

- [ ] `mplsjohnnycage/factory` is on Linear (and Linear Code if present) repository access.
- [ ] A factory PR Diff in Linear shows readable code.
- [ ] Mark [STL-178](https://linear.app/johnny-cage/issue/STL-178) **Done**.

---

## 2 — STL-179: ASDLC PR & commit automations → In Review / Done

**Why next:** Without this map, Meta issues stay stuck until someone manually sets **In Review** / **Done**. This is the core “auto-review workflow” gap called out in triage.

### Click path

1. Linear → **Settings → Teams → ASDLC**.
2. Open **Workflows & automations** → **Pull request and commit automations**.  
   Docs: [Issue status updates](https://linear.app/docs/github#issue-status-updates)
3. Set (or confirm) this mapping — statuses already exist on ASDLC:

| PR event | Set issue status to |
|----------|---------------------|
| Draft opened | In Progress |
| PR opened (ready) | In Progress |
| Review requested / review activity | **In Review** |
| Ready for merge | In Review |
| Merged (closing magic word / `closes` link) | **Done** |

4. Add the **review requested → In Review** row explicitly if the UI only shows Open → In Progress and Merge → Done by default.
5. Optional: branch-specific rule — target `main` → Done on merge.
6. Save.

### Notes while clicking

- Closing words (`fixes` / `closes` / …) drive merge → Done; `related to` only links.
- “Ready for merge” needs GitHub mergeable/stable; failed checks can block that row — still keep review → In Review for Meta.
- Do **not** retarget ASDLC Issues Sync here (that is STL-182 / FE-72).

### Done when

- [ ] Mapping above is saved on ASDLC.
- [ ] Smoke: a Meta issue with a review-requested factory PR moves to **In Review** without a manual status edit (use next Meta PR or re-request review on an open one).
- [ ] Mark [STL-179](https://linear.app/johnny-cage/issue/STL-179) **Done**.

---

## After 178 + 179 (still Johnny, light)

| Step | Ticket | What to click / check |
|------|--------|------------------------|
| A | [STL-180](https://linear.app/johnny-cage/issue/STL-180) | Open [live Loop](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec) → confirm Enabled + **Allow loops to access code** includes `factory` → on next Meta PR with `STL-…`, check **Run history** → Done when a successful run + first-pass comment appear. No MCP edit path. |
| B | [STL-181](https://linear.app/johnny-cage/issue/STL-181) | Optional: [Code & reviews](https://linear.app/settings/account/code-and-reviews) toggle; GitHub Autolink `STL-` → `https://linear.app/johnny-cage/issue/STL-<num>`. |
| C | Defer | [STL-183](https://linear.app/johnny-cage/issue/STL-183) pool expand; [STL-182](https://linear.app/johnny-cage/issue/STL-182) stays under FE-72. |

---

## Order of operations (checklist)

```text
[ ] STL-178 — GitHub Apps Linear (+ Linear Code) include mplsjohnnycage/factory
[ ] STL-178 — Diff file contents load → mark Done
[ ] STL-179 — ASDLC PR automations table saved (esp. review → In Review, merge → Done)
[ ] STL-179 — smoke status move → mark Done
[ ] STL-180 — Loop Run history success on a factory Meta PR (after code access)
[ ] FE-61 / STL-177 — Done only when 178+179 Done (180 recommended)
```

---

## Out of scope this doc

- Coding PRs, Spec/ADR edits, Beads, Port mutations  
- Linear → Cursor **delegate** / cloud-agent “implement FE-61”  
- Closing painter-os `#277–#291` or Cursor default-repo (FE-72)  
- Expanding REVIEW_POOL beyond Cursor / Codex / Linear (STL-183)  
