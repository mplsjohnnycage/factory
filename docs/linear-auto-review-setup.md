# Linear ↔ GitHub auto-review setup (Factory Meta)

**Date:** 2026-10-29  
**Worker:** `bc-c47cf878-efe6-5104-9ece-50eb646bc9ba`  
**Lane:** Meta only — ASDLC / Factory Meta / `mplsjohnnycage/factory`  
**Related:** [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md) · [`factory-meta-setup-status.md`](./factory-meta-setup-status.md)

---

## Goal

When a PR opens on [`mplsjohnnycage/factory`](https://github.com/mplsjohnnycage/factory) for Factory Meta issues (**STL-162+**):

1. Linear **auto-links** the PR to the issue (branch / title / magic words).
2. Linked-issue **status** advances on open → review requested → merge.
3. PR appears in Linear **Reviews** with review request / review state.
4. (Optional) A **Loop** with a pull-request trigger runs an AI first-pass review.

Prefer Linear native: GitHub integration, PR linking, team PR automations, Reviews, Loops. No custom webhook service.

---

## Hygiene (always)

| Rule | Practice |
|------|----------|
| **Always assign someone** | Every Factory Meta issue gets an assignee. Prefer **Cursor** (or Codex) for agent coding units; Johnny only for UI-click / HITL tickets. Never leave Meta tickets unassigned. |
| **Independent reviewers** | Never request Johnny or the PR author / issue **delegate** as reviewer. Use the **balanced rotation** below (Cursor, Codex, Claude Code, OpenCode, Grok, Claude, Linear). |
| **Relations when they exist** | Wire `blockedBy` / `blocks` / `relatedTo` from the PBI dependency map (and deferred deps). Do not invent fake blockers. |
| **Sub-issues when multi-step** | Click-lists and multi-step UI work become Linear **sub-issues** under a parent — not comments-only. |

**Johnny out of review loop (2026-10-29):** PR #1 — Johnny removed; **Codex + Linear** requested (Cursor excluded as issue delegate). STL-162 delegate → Cursor.

---

## Balanced review rotation

Switch reviewers across the Factory coding roster so the same agent is not always first-pass.

### Desired pool (order)

| # | Agent | Linear requestable now? |
|---|--------|-------------------------|
| 1 | **Cursor** | Yes |
| 2 | **Codex** | Yes |
| 3 | **Claude Code** | **No** — not a workspace user yet |
| 4 | **OpenCode** | **No** |
| 5 | **Grok** | **No** |
| 6 | **Claude** (chat) | **No** |
| 7 | **Linear** Agent | Yes |

Connect missing apps → [sub-issue under STL-177](https://linear.app/johnny-cage/issue/STL-177) / new “Connect Claude / OpenCode / Grok…” ticket. Until then, `REVIEW_POOL_LIVE = [Cursor, Codex, Linear]`.

### Algorithm (every Meta PR on `factory`)

1. Build `eligible` = live pool **minus** Johnny, PR author GitHub identity, and issue **delegate** / implementer.
2. Let `n` = PR number. Pick **two** reviewers:  
   `i = ((n - 1) * 2) % len(eligible)` → `eligible[i]`, `eligible[(i+1) % len(eligible)]`.
3. `update_diff` those two via `addedReviewRequests`; `removedReviewRequests` for anyone excluded (esp. Johnny).
4. Loop first-pass may still comment, but **must not** only ping Johnny; mention the two selected reviewers in the Loop comment.

### Applied to factory#1

- Delegate = Cursor → excluded from reviewers.  
- `eligible` = `[Codex, Linear]` (Cursor removed).  
- Requested: **Codex** + **Linear**.

### Next PRs (examples with live pool only)

| PR # | If delegate=Cursor | Reviewers |
|------|--------------------|-----------|
| 1 | exclude Cursor | Codex, Linear |
| 2 | exclude Cursor | Linear, Codex (wrap) |
| 3 | exclude Cursor | Codex, Linear |
| … | rotate | … |

When Claude Code / OpenCode / Grok join Linear, they enter `eligible` automatically and the same formula spreads load across the fuller set.

---

## Live vs Johnny must click

| Item | Status | How |
|------|--------|-----|
| Workspace GitHub integration (PR linking works) | **Live** | Evidence: `factory#1` synced into Linear Diffs |
| PR #1 ↔ STL-162 (`closes`) | **Live** | Attachment + `update_diff` issue link |
| PR #1 independent review submitted | **No** | No review threads; no approve/changesRequested; Loop has not left a decision yet |
| PR #1 reviewers (balanced) | **Live** | **Codex** + **Linear** (Cursor excluded as delegate; Johnny out) |
| Reviewer pool Claude/OpenCode/Grok | **Johnny click** → [STL-183](https://linear.app/johnny-cage/issue/STL-183) | Not Linear users yet — connect apps to expand rotation |
| STL-162 → **In Review** + `needs-review` | **Live** | Linear MCP `save_issue` |
| Linear Reviews URL for PR #1 | **Live** | [open in Linear](https://linear.app/johnny-cage/review/pbi-001-author-ten-domain-spec-stubs-stl-162-b89e076aac4f) |
| Confirm Linear / Linear Code App includes `mplsjohnnycage/factory` | **Johnny click** → [STL-178](https://linear.app/johnny-cage/issue/STL-178) | GitHub → Settings → Applications → Linear (+ Linear Code) → repository access |
| ASDLC team **PR & commit automations** mapped to In Review / Done | **Johnny click** → [STL-179](https://linear.app/johnny-cage/issue/STL-179) | Team Settings → Workflows & automations (MCP has no integration API) |
| **Loop** PR first-pass on `factory` | **Live** → [loop](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec) · [STL-180](https://linear.app/johnny-cage/issue/STL-180) | Johnny created; MCP cannot read/edit Loops |
| MCP create/list/enable/inspect Loop | **Not possible** | Confirmed: no `loop*` tools; agent skills empty |
| Loop first Run history success | **Verify pending** | Needs matching PR Created (or Ready for review) event on `factory` |
| Personal **Code & reviews** + Autolink `STL-` | **Johnny click** → [STL-181](https://linear.app/johnny-cage/issue/STL-181) | Settings → Account → Code & reviews; repo Autolink references |
| ASDLC Issues Sync retarget off painter-os | **Johnny click** → [STL-182](https://linear.app/johnny-cage/issue/STL-182) | Still open from FE-57; see retarget doc |
| FE-61 parent (sub-issues above) | **Live** | [STL-177](https://linear.app/johnny-cage/issue/STL-177) · assignee Johnny · relatedTo STL-162 |
| Agent `gh` credentials on this pod | **Not available** | No `GH_TOKEN`; GitHub API 404 unauthenticated — PR ops via Linear Diffs MCP only |

---

## What was configured live (this pass)

### A — Wired PR #1 (STL-162 / PBI-001)

| Field | Value |
|-------|--------|
| GitHub | https://github.com/mplsjohnnycage/factory/pull/1 |
| Linear Reviews | https://linear.app/johnny-cage/review/pbi-001-author-ten-domain-spec-stubs-stl-162-b89e076aac4f |
| Branch | `cursor/pbi-001-spec-stubs-a364` → `main` |
| Relationship | **closes** STL-162 |
| Reviewers | **Codex** + **Linear** (balanced; Cursor = delegate → excluded; Johnny removed) |
| Issue status | **In Review** |
| Labels | `Factory Meta`, `needs-review` |
| Head SHA | `63d370e7d7c6be5f9670da57ed3e3e41fab3ef3e` |

MCP calls used:

1. `get_diff` / `list_diffs` — confirmed PR visible under `mplsjohnnycage/factory`.
2. `update_diff` — `addedReviewRequests: Johnny Cage`, `addedIssueLinks: closes STL-162`, `statusAction: markReadyForReview`.
3. `save_issue` — state `In Review`, add label `needs-review`.
4. `save_comment` — setup note on STL-162.

### B — Verified workspace context

| Object | Value |
|--------|--------|
| Workspace | [Johnny Cage](https://linear.app/johnny-cage) (`c0507e52-4062-4ced-b613-a3d677d5500e`) |
| Team | ASDLC (`STL`, `e7431ffa-1665-4ebd-81c6-2fd65d36d00b`) |
| Project | [Factory Meta](https://linear.app/johnny-cage/project/factory-meta-1c7e5c372e3d) |
| Statuses used | Backlog, Todo, In Progress, **In Review**, Done, Canceled, Duplicate |
| Meta issues | STL-162…176 (active 162–172; deferred 173–176) |

### C — Not configurable via Linear MCP

Linear MCP has **no** tools to create/edit:

- GitHub App install / repo allowlist / code access
- Team **Workflows & automations** (PR status maps)
- **Loops** (PR-triggered AI review)
- Issues Sync Edit Link
- GitHub Autolink

Those remain UI (or GraphQL outside this MCP surface).

---

## Exact UI steps (Johnny)

### 1 — GitHub App: include `mplsjohnnycage/factory`

PR linking already works for #1, but confirm **code access** for diffs / Guides / Loops:

1. GitHub → **Settings → Applications → Installed GitHub Apps** → **Linear** (and **Linear Code** if shown separately).
2. **Configure** → Repository access → include **`mplsjohnnycage/factory`** (or All).
3. Save.

Linear side: [Settings → Integrations → GitHub](https://linear.app/settings/integrations/github) — org connected; personal account under [Connected accounts](https://linear.app/settings/connected-accounts).

### 2 — Enable Reviews (personal)

1. [Settings → Account → Code & reviews](https://linear.app/settings/account/code-and-reviews)
2. Toggle **Enable code reviews**
3. Keep **Review requests** notifications on
4. Optional: Auto-convert draft PRs; merge strategy preference

Shortcut: `G` then `R` → Reviews. PR #1: [Linear review](https://linear.app/johnny-cage/review/pbi-001-author-ten-domain-spec-stubs-stl-162-b89e076aac4f) or `linear.review/mplsjohnnycage/factory/pull/1`.

### 3 — ASDLC PR status automations (core auto-review workflow)

Path: **Settings → Teams → ASDLC → Workflows & automations → Pull request and commit automations**  
Docs: [Issue status updates](https://linear.app/docs/github#issue-status-updates)

Recommended Meta mapping (statuses already on ASDLC):

| PR event | Set issue status to |
|----------|---------------------|
| Draft opened | In Progress |
| PR opened (ready) | In Progress |
| Review requested / review activity | **In Review** |
| Ready for merge | In Review |
| Merged (closing magic word / closes link) | **Done** |

Notes from Linear docs:

- Default is often Open → In Progress, Merge → Done; add the **review requested** → **In Review** row explicitly.
- “Ready for merge” needs GitHub to report a stable/mergeable state (failed checks block it).
- `main` branch protection is **live** (public repo: PR + 1 approval + green `meta-ci-presence` — [`factory-ci-setup-check.md`](factory-ci-setup-check.md)); review → ready-for-merge should respect that gate. Still set review automation for Meta.
- Optional branch-specific rule: target `main` → Done on merge.

Closing magic words (`fixes`, `closes`, …) apply the merge → Done transition; non-closing (`ref`, `part of`, …) do not. Relation words (`related to`) link only.

### 4 — Loops: Factory Meta PR Created → auto-review

**Status: LIVE (Johnny created).** Loop URL:

**[Factory Meta PR first-pass review](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec)**  
(`factory-meta-pr-first-pass-review-7bdcef0f54ec`)

| Aspect | Status |
|--------|--------|
| Loop object exists | **Live** (Johnny UI) |
| Create / edit / inspect Loop via Linear MCP | **Not possible** — MCP has **0** Loop tools |
| First successful Run history on a `factory` PR | **Verify** — open or push a matching Meta PR (`STL-…`); PR triggers have no **Run now** |
| Tracking | [STL-180](https://linear.app/johnny-cage/issue/STL-180) |

Paid plans + AI credits. Docs: [Loops](https://linear.app/docs/loops) · [PR triggers](https://linear.app/docs/loops#pull-request-triggers).

#### Exact UI click path (reference / recreate)

Use if the Loop above is deleted or needs a twin (e.g. Ready for review).

**A — Allow code access for Loops (admin, once)**

1. Open Linear → **Settings** (workspace).
2. Go to **Loops** (or **Settings → Loops**).
3. Open **Allow loops to access code**.
4. Add / allow repository **`mplsjohnnycage/factory`**.
5. Save.

Prerequisite: GitHub integration already includes this repo (and Linear Code access if diffs are needed) — see §1 / [STL-178](https://linear.app/johnny-cage/issue/STL-178).

**B — Create the Loop**

1. Sidebar → **Loops** (workspace), **or** team **ASDLC → Loops** tab.
2. Click **New loop**.
3. Choose **Start from scratch** (not a template — PR triggers cannot be saved as workspace templates).
4. If prompted for location: prefer **ASDLC** team (Factory Meta lives there) or workspace-level with team access including ASDLC.
5. Name: `Factory Meta — PR Created auto-review`.
6. **Trigger → Pull request →** select **Created**  
   (optional second Loop or extra event: **Ready for review**).
7. **Repositories:** select **`mplsjohnnycage/factory`** only (do not include painter-os).
8. **Filters** (recommended):
   - Title or body contains `STL-`, **or**
   - Linked issue / project = **Factory Meta** (if the filter UI exposes project).
9. **Instructions** — paste the block below.
10. **Capabilities & access:**
    - **Team access:** ASDLC (or all public teams if workspace Loop).
    - **Access code:** **Read** (not Read & write — review-only).
    - **Web access:** off unless needed.
    - **Allow changes outside of triggering entity:** on only if the Loop must move the linked Linear issue to In Review / set assignee.
    - **Externally synced issues and comments:** leave off unless you intentionally want painter-os/public sync side effects.
11. **Reasoning level:** Auto or Medium.
12. Click **Create loop** → ensure the Loop is **Enabled** (right-click → Enable if created disabled).

**C — Verify**

1. Open the Loop → **Run history** (empty until a matching PR event).
2. PR triggers **cannot** use **Run now** — open a new PR on `factory` (or mark ready for review) that references `STL-…`.
3. Confirm: Loop run appears; review-style comment on the PR; linked issue In Review + assignee if it was empty.
4. Mark [STL-180](https://linear.app/johnny-cage/issue/STL-180) Done when verified.

#### Instructions to paste

```text
When a pull request opens on mplsjohnnycage/factory that links a Factory Meta
Linear issue (STL-162+ / project Factory Meta):

1. Read the PR diff and the linked issue contract (acceptance criteria, DoD, guardrails).
2. Post a single review-style comment on the PR summarizing: what changed, whether
   Spec/ADR paths match the issue, missing acceptance criteria, and a go / no-go.
3. If the linked issue is not yet In Review, move it to In Review and ensure label
   needs-review is present.
4. If the linked issue has no owner, delegate to an agent from the roster (rotate
   implementers too: Cursor / Codex / Claude Code / OpenCode / …) — not Johnny.
5. Pick **two** independent reviewers with the balanced rotation in
   docs/linear-auto-review-setup.md (exclude Johnny, author, and issue delegate).
   Live pool today: Cursor, Codex, Linear. Prefer naming them in your comment.
6. If the issue body lists Dependencies / blockedBy that are missing as Linear relations,
   add those relations. Add sub-issues only when the PR clearly splits multi-step work.
7. Do not approve or merge. Do not touch Product Beads or painter-os.
   Do not @/notify Johnny for routine first-pass review.
```

### 5 — GitHub Autolink (nice-to-have)

Repo **Settings → General → Autolink references**:

| Key prefix | Target URL |
|------------|------------|
| `STL-` | `https://linear.app/johnny-cage/issue/STL-<num>` |

### 6 — Issues Sync (contamination fix — still open)

ASDLC two-way sync still pointed at `johnnyc-9164/painter-os` historically. Detach done for STL-162…172; mapping Edit Link is still Johnny UI. Prefer dedicated Meta team long-term. Full steps: [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md).

---

## Agent / API playbook (repeatable)

For future Meta PRs when Linear Diffs MCP is available (no `gh` required):

```text
1. get_diff / list_diffs  owner=mplsjohnnycage repo=factory
2. Pick reviewers via Balanced review rotation (PR number + exclude Johnny/author/delegate)
3. update_diff
     addedIssueLinks: [{ issue: "STL-NNN", type: "closes" }]
     addedReviewRequests: [ /* two from eligible pool */ ]
     removedReviewRequests: [{ user: "Johnny Cage" }, /* + implementer if listed */]
     statusAction: markReadyForReview
4. save_issue id=STL-NNN
     state="In Review"
     addLabels=["needs-review"]
     delegate=<rotated implementer>     # not always Cursor; Johnny only for HITL clicks
     blockedBy=[...]
5. If multi-step leftover UI/clicks: sub-issues (assignee=Johnny only if he must click)
6. save_comment on STL-NNN with PR + Linear Reviews URLs + named reviewers
```

PR authors should still include in description:

```text
Fixes STL-162
```

(or branch / title containing `STL-162`) so linking works even without MCP.

### MCP tools used for review surface

| Tool | Role |
|------|------|
| `list_diffs` / `get_diff` | Locate PR, reviewers, issue links |
| `update_diff` | Reviewers, issue links, draft/ready |
| `submit_diff_review` | Approve / request changes / comment |
| `save_diff_comment` | Inline / PR discussion |
| `save_issue` / `save_comment` | Status + audit trail |

There is **no** MCP tool for team PR automations or Loops create.

---

## Verify checklist

- [x] `factory#1` visible in Linear Diffs / Reviews
- [x] STL-162 attachment points at PR #1
- [x] Johnny removed from PR #1 review; balanced **Codex + Linear** (Cursor = delegate excluded)
- [ ] Independent review **submitted** (approve / request changes / Loop decision)
- [ ] Expand pool: Claude Code / OpenCode / Grok connected ([STL-183](https://linear.app/johnny-cage/issue/STL-183))
- [x] STL-162 is **In Review** with `needs-review`
- [ ] New Meta PR auto-moves to **In Review** on review request (needs Step 3)
- [ ] Optional Loop posts first-pass comment on new factory PR (needs Step 4)
- [ ] Issues Sync no longer seeds painter-os for Meta (needs Step 6)

---

## Contaminations to avoid

- Do not re-attach painter-os GitHub Issues Sync to Meta tickets.
- Do not point ASDLC two-way sync at `factory` if product work must stay on painter-os — use a dedicated Meta team (retarget doc option C).
- Do not enable Loop **Read & write** / coding sessions for review-only automation.
- Do not approve/merge Meta PRs from Loops without an independent agent/human decision.
- Do not put Johnny on review requests when he is the GitHub PR author identity.
- **Johnny edit Loop:** open [live Loop](https://linear.app/johnny-cage/loop/factory-meta-pr-first-pass-review-7bdcef0f54ec) → paste updated §4 instructions (balanced rotation; no Johnny). MCP cannot edit Loops.
- **Johnny expand pool:** [STL-183](https://linear.app/johnny-cage/issue/STL-183) connect Claude Code / OpenCode / Grok into Linear so rotation can include them.

---

## Sources

- [Linear GitHub integration](https://linear.app/docs/github) — linking, magic words, status automations, Loops PR triggers
- [Reviews / Diffs](https://linear.app/docs/diffs) — code access, review UI
- [Code & reviews settings](https://linear.app/docs/code-and-reviews)
- [Loops](https://linear.app/docs/loops) — pull request triggers
- Live Linear MCP against workspace Johnny Cage + `mplsjohnnycage/factory#1`
