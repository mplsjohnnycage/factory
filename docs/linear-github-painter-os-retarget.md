# Linear → GitHub: painter-os auto-attach → factory retarget

**Updated:** 2026-10-29 · Worker `bc-4839f3fd-2440-5baa-ab7e-ced8d686ab1d`  
**Lane:** Meta only — no Port OAuth.  
**Tracker:** [STL-182](https://linear.app/johnny-cage/issue/STL-182/retarget-asdlc-issues-sync-off-painter-os-fe-57) (FE-57) · factory facet [mplsjohnnycage/factory#7](https://github.com/mplsjohnnycage/factory/issues/7)  
**Related:** [`factory-meta-setup-status.md`](./factory-meta-setup-status.md) · [`linear-auto-review-setup.md`](./linear-auto-review-setup.md)

---

## Short status

| Item | State |
|------|--------|
| Root cause (GH mirrors) | ASDLC team **GitHub Issues Sync** created Meta PBIs as `johnnyc-9164/painter-os` **#277–#291** |
| Root cause (Cursor fail) | Linear→Cursor agent spawn posts **“No default repository configured”** until Cursor Cloud Agents default repo = `mplsjohnnycage/factory` |
| Linear attachments STL-162…176 | **Detached** from painter-os (162–172 earlier; **173–176 this pass**). Factory PR links kept where present |
| Orphan sync comments | Still visible on Linear (“synced to painter-os#N”) — MCP `delete_comment` **403** (no scope). Cosmetic only after detach |
| painter-os #277–#291 | Coordinator closing **not-planned** with explanatory comments |
| Factory PRs #1,#9–#14 | Clean — Linear STL links only; **no** painter-os URLs in PR bodies |
| ASDLC Edit Link / Cursor default repo | **Johnny UI only** — MCP cannot change either |

---

## One-sentence root causes

1. **Painter-os contamination:** ASDLC (`STL`) two-way GitHub Issues Sync was (or was) mapped to `johnnyc-9164/painter-os`, so Factory Meta seed PBIs auto-created GH issues **#277–#291** there.  
2. **Cursor “No default repository”:** Linear Cursor agent sessions need a **Cursor dashboard Cloud Agents default repository**. Without it, spawn fails with that exact bot comment (seen on STL-164 / 165 / 166). Successful coding agents (e.g. `bc-f36562ae` → factory PR #10) were ones that already resolved `mplsjohnnycage/factory` by another path — not proof the dashboard default is set.

---

## Evidence — Cursor “No default repository”

| Linear | When (UTC) | Cursor bot comment | Later real work |
|--------|------------|--------------------|-----------------|
| [STL-164](https://linear.app/johnny-cage/issue/STL-164) | 2026-10-29 03:46 | No default repository configured | factory [PR #11](https://github.com/mplsjohnnycage/factory/pull/11) (merged) via other agent |
| [STL-165](https://linear.app/johnny-cage/issue/STL-165) | 2026-10-29 04:04 | same | factory [PR #12](https://github.com/mplsjohnnycage/factory/pull/12) |
| [STL-166](https://linear.app/johnny-cage/issue/STL-166) | 2026-10-29 04:12 | same | factory [PR #13](https://github.com/mplsjohnnycage/factory/pull/13) |

Dashboard link in bot text: <https://www.cursor.com/dashboard?tab=cloud-agents>

**Note on `bc-f36562ae`:** That run is Linear-sourced for **STL-163**, status IDLE, `repoUrl=github.com/mplsjohnnycage/factory`, opened [PR #10](https://github.com/mplsjohnnycage/factory/pull/10). The “no default repo” failures are the bot replies on **164–166**, not a failed pod for `bc-f36562ae` itself. Same class of misconfig either way.

---

## Evidence — painter-os Meta mirrors

| Linear | Was GH facet | Status after cleanup |
|--------|--------------|----------------------|
| STL-162…172 | painter-os **#277–#287** | Attachments **removed**; factory PR attachments remain on Done PBIs |
| STL-173…176 | painter-os **#288–#291** | Attachments **removed this pass** |
| STL-182 | factory **#7** | Correct Meta facet already |

Open painter-os mirrors (coordinator closing): [#277](https://github.com/johnnyc-9164/painter-os/issues/277)–[#291](https://github.com/johnnyc-9164/painter-os/issues/291) (titles match PBI-001…015).

Team: ASDLC · Project: [Factory Meta](https://linear.app/johnny-cage/project/factory-meta-1c7e5c372e3d)

---

## What agents fixed (MCP)

1. Confirmed factory open/merged PRs link **only** STL / `mplsjohnnycage/factory` — no painter-os in PR bodies.  
2. Detached remaining painter-os Resources on **STL-173…176**.  
3. Re-verified STL-162…172 have factory PR attachments (or none), not painter-os.  
4. Documented Cursor default-repo + Linear Edit Link UI (below).  
5. Could **not**: change ASDLC Issues Sync map; set Cursor default repo; delete GitHub-authored sync comments (403); invent Port OAuth.

---

## Johnny UI (required — MCP cannot)

### 1 — Cursor Cloud Agents default repository

1. Open <https://www.cursor.com/dashboard?tab=cloud-agents>  
2. Set **default repository** to **`mplsjohnnycage/factory`**.  
3. Spot-check: from a Meta Linear issue, start a Cursor agent → must **not** reply “No default repository configured”.

### 2 — Linear ASDLC Issues Sync (stop future painter-os Meta mirrors)

1. GitHub → Settings → Applications → **Linear** → ensure access includes **`mplsjohnnycage/factory`**.  
2. Linear → **Settings → Features → Integrations → GitHub → GitHub Issues**.  
3. Find **ASDLC ↔ …** link → **⋯ → Edit Link**.  
4. Confirm repository is **`mplsjohnnycage/factory`** (not `johnnyc-9164/painter-os`).  
   - If still painter-os: change to `mplsjohnnycage/factory`, **or** disable two-way / switch one-way GitHub→Linear.  
5. Save. Throwaway ASDLC test issue must land under `factory`, not painter-os.

**Caveat:** If product ASDLC work must keep syncing to painter-os, prefer a **dedicated Meta Linear team** mapped only to `factory` (option C below), then move Factory Meta issues there.

### 3 — Optional UI hygiene

- Delete or ignore orphan Linear comments “synced to painter-os#N” (MCP cannot).  
- Confirm painter-os #277–#291 closed not-planned (coordinator).  
- Mark [STL-182](https://linear.app/johnny-cage/issue/STL-182) Done after steps 1–2 verified.

### Option C — Clean Meta lane (recommended long-term)

1. Create Linear team **Factory Meta** (or similar).  
2. Two-way map **that team only** → `mplsjohnnycage/factory`.  
3. Move STL-162…176 / Meta issues onto the Meta team.  
4. Leave ASDLC ↔ painter-os for product.

---

## Verify checklist

- [x] STL-162…176 have **no** painter-os attachment  
- [x] Factory PR bodies free of painter-os links  
- [ ] Cursor dashboard default repo = `mplsjohnnycage/factory` (**Johnny**)  
- [ ] ASDLC Edit Link shows `mplsjohnnycage/factory` or Meta team split (**Johnny**)  
- [ ] New Meta Linear issue does not create painter-os GH issue  
- [ ] Linear→Cursor agent spawn succeeds without “No default repository”  
- [ ] painter-os #277–#291 closed / not treated as Product SoT  

---

## Contaminations to avoid

- Do not treat painter-os #277–#291 as Meta SoT.  
- Do not delete Linear Factory Meta issues to “fix” sync.  
- Do not leave Cursor Cloud Agents without a default repo if Linear keeps spawning Cursor.  
- Do not invent Port OAuth from this lane.
