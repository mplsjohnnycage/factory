---
cursor:
  subagentId: "bc-cf31d08c-e215-50d9-900b-68cb0de65840"
---

# Factory Meta — Multi-agent handoff (Orca · OpenCode · Codex · Antigravity · Cursor · Claude · Grokbot)

**Exported:** 2026-10-29 · **refreshed** ~15:23 CDT (post-#104 Providers on `main`)  
**Audience:** Any non-author agent picking up Factory Meta — **Orca**, **OpenCode**, **Codex**, **Antigravity**, Cursor (fresh), Claude Code, Grokbot/Reason, Linear review pool  
**Orca paste block:** [`orca-resume-paste.md`](./orca-resume-paste.md)  
**Claude historical:** [`claude-code-handoff.md`](./claude-code-handoff.md) (OAuth/Port history only — **prefer this file** for Queued / `main` tip / merge rules)  
**Repo:** https://github.com/mplsjohnnycage/factory (**PUBLIC** — never flip private)  
**Project store:** `/cursor/stores/self/` ≡ `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/`  
**Board SoT:** `/cursor/stores/self/notes.md` · **Prefs:** `/cursor/stores/self/preferences.md`  
**No secrets/tokens in this file. Zero spend default. Do not re-ask locked decisions below.**

**UI design direction (locked 2026-10-29, on `main` via [#98](https://github.com/mplsjohnnycage/factory/pull/98)):** [`ui-design-direction.md`](./ui-design-direction.md) · media `/cursor/stores/self/media/ui-mockups/` — Factory Cockpit v3 · Code Atlas v5 · Intelligence · provider widgets. Do not invent a second visual language.

---

## 0. One-sentence mission

**Meta = build Factory itself** (kernel Specs/ADRs, gateway, Rivet, Beads, Port, Dev OS).  
**Product = what Factory builds for other projects.** Never blur Meta ↔ Product boards / Beads / repos.

---

## 1. Snapshot NOW (read this first)

| Item | Value |
|------|--------|
| `main` tip | `42fa340` — Providers [#104](https://github.com/mplsjohnnycage/factory/pull/104) (includes [#102](https://github.com/mplsjohnnycage/factory/pull/102) Intelligence · [#100](https://github.com/mplsjohnnycage/factory/pull/100) Atlas · [#99](https://github.com/mplsjohnnycage/factory/pull/99) Cockpit · [#98](https://github.com/mplsjohnnycage/factory/pull/98) design) |
| Open product UI PRs | **None** — #98 · #99 · #100 · #102 · #104 all merged |
| Cloud ops dry-run kits | **`STOP_CLOUD_KITS=yes`** for Meta ops kits — see [`meta-kit-exhaustion.md`](./meta-kit-exhaustion.md) |
| Funnel health | **PASS** — `https://desktop-3apdbkg.taildf3a4b.ts.net` `/health` → `{"ok":true,"service":"factory-gateway"}` ([`desktop-live-checks-tick.md`](./desktop-live-checks-tick.md)) |
| Remount dry-run (live URL) | **PASS** — `node scripts/gateway-remount-dry-run.mjs --base-url 'https://desktop-3apdbkg.taildf3a4b.ts.net'` |
| Port WEBHOOK remount | **Still operator/PM** — health green ≠ authorize upsert; runbook [`remount-armed-runbook.md`](./remount-armed-runbook.md) |
| Windows Register | **FE-189** — still needs **Grokbot/Reason** on `DESKTOP-3APDBKG` |
| FE-142 HMAC / handler-token | **CLOSED** — never re-ask |
| FE-172 Port human Sign-in | **CLOSED** — never re-ask Johnny |
| FE-192…197 UI wave | **Done** — design · Cockpit · Atlas · Intelligence · Providers on `main` |
| PBI-015 `/ce-compound` | **HITL hold** — skip until human runs `/ce-compound` |
| Audience | **Projects Manager** (PM) — 3-line end summaries; Johnny only for bids/emails/keys/spend/desktop human-only |

### Queued / active (notes.md — single “what's next”)

| ID | Work | Owner class |
|----|------|-------------|
| **FE-181** | Retarget ASDLC Issues Sync off painter-os | HITL / Linear config (STL-182) |
| **FE-182** | Connect Claude · OpenCode · Grok into Linear review pool | HITL / Linear Loops + apps |
| **FE-183** | Enable personal Code reviews + Autolink `STL-` | HITL / Linear + GitHub |
| **FE-189** | Windows logon **Register** verify on desktop | **Desktop** Grokbot/Reason on `DESKTOP-3APDBKG` |
| **FE-198** | Live Ask Factory → Rivet wiring | Live / desktop-capable (not cloud Meta kit) |
| **FE-199** | Live Port Context Lake wiring | Live / Port lake (PM-authorized as needed) |

Cloud agents: **do not invent new Meta ops dry-run kits** (`STOP_CLOUD_KITS` still yes). Prefer FE-181…183 (HITL docs/assist), FE-189 (desktop), FE-198 / FE-199 (live wiring), or independent review of any new Meta PR.

---

## 2. Hard invariants (all agents)

| Rule | Detail |
|------|--------|
| **Author ≠ reviewer** | Implementer session **never** reviews/merges its own PR. Use Codex / OpenCode / Orca / Antigravity / Linear / **fresh** Cursor — never the author `bc-…`. |
| **Formal GitHub APPROVE** | Must be write-access account **`skysthelimitpainting1779-collab`**. COMMENT “APPROVE” does **not** count. Do **not** dip `required_approving_review_count` to 0. |
| **Merge gate** | Squash-merge when: formal collab APPROVE **+** green **`meta-ci-presence`**. |
| **Vercel rate-limit FAILURE** | Free-tier build rate limit — **NOT a merge gate**. Ignore until quota resets. |
| **Branch policy** | Fresh branch from current `main`. Never hard-code branch names in Linear/PBI. Never “fix” missing remotes with empty pushes. Prefix pattern for cloud: `cursor/<kebab>-<suffix>`. |
| **Port schema** | **No** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke unless PM explicitly authorizes a named remount/ops unit. Dry-run / read-only default. |
| **Single-MCP** | Control plane = Port remote MCP (`https://mcp.port.io/v1`). Dev OS = client/BFF only. No browser→Sandbox Agent. |
| **No Observatory OAuth** | Keep only live Factory External Interface app. |
| **Secrets** | Never print. Prefer **PM** for secret ops. FE-142/FE-172 closed — no Johnny HMAC / Sign-in pings. |
| **Zero spend** | Default. No Adapter paid calls / Anthropic spend without PM. |
| **Meta only** | Never Product Beads / product Linear boards from this repo. |
| **Shared Beads** | Prefer shared Dolt (`bd dolt` / remote `refs/dolt/data`) across sprites/boxes — local-only Beads does not help multi-machine work. |
| **Models** | Prefer **auto** (omit model) for implement + independent review unless user names one. |

---

## 3. Role routing (who should do what)

| Agent | Best fit |
|-------|----------|
| **Cursor cloud (fresh)** | Implement Meta PR **or** independent review — never both on same PR. Conflict resolve + Composio APPROVE/merge playbook proven. |
| **Codex** | Independent review / merge; alternate implementer when Cursor author is busy. |
| **OpenCode** | Same as Codex when connected; FE-182 is about wiring it into Linear review pool. |
| **Orca** | Parallel review pool / implement when Cursor quota or author≠reviewer requires a different engine. Same hard rules. Paste: [`orca-resume-paste.md`](./orca-resume-paste.md). |
| **Antigravity** | Same pool — treat as non-author reviewer or implementer; follow this handoff + prefs. |
| **Claude Code** | Local/desktop coding when Cursor quota dies; historical deep context in [`claude-code-handoff.md`](./claude-code-handoff.md). |
| **Grokbot / Reason** | **Desktop host** `DESKTOP-3APDBKG` — Windows logon Register (FE-189), Funnel ops, reboot+logon. Commands in [`desktop-live-checks-tick.md`](./desktop-live-checks-tick.md). |
| **Linear (human / Loops)** | FE-181…183 click-paths; STL-177 parent auto-review. Do **not** use Cursor Linear integration to *implement* Meta coding PBIs. |
| **Projects Manager** | CEO/ops bot — secrets, remount authorization, wakes on 3-line summaries. |

---

## 4. Independent review → merge playbook (proven)

Use when any Meta PR opens (author ≠ you):

1. **Identity check** — your `bc-…` ≠ author session in PR footer.  
2. **Diff review** — docs/scripts only? Port upserts? Secrets? Overlap with existing kits?  
3. **Conflict** — if `package.json` dry-run script race: **keep both** (all) scripts; merge `origin/main` into PR branch; push.  
4. **Live verify** — `npm run dry-run:<kit>` exit 0; optional flags as documented.  
5. **CI** — require **`meta-ci-presence` SUCCESS**. Ignore Vercel free-tier rate-limit FAIL.  
6. **Formal APPROVE** — Composio GitHub account **`github_busky-styful`** = `skysthelimitpainting1779-collab` → `GITHUB_CREATE_A_REVIEW_FOR_A_PULL_REQUEST` with `event: APPROVE` on tip SHA.  
7. **Squash-merge** — Composio **`github_retier-fice`** = `mplsjohnnycage` → `GITHUB_MERGE_A_PULL_REQUEST` `merge_method: squash` with tip `sha`.  
8. **Report** — `/cursor/stores/self/docs/pr-<N>-independent-review.md` with YAML frontmatter `subagentId` of the **reviewer**.  
9. **PM 3-line** — Board / Shipped / Next.

Recent examples: [#98](./pr-98-independent-review.md) · [#99](./pr-99-independent-review.md) · [#100](./pr-100-independent-review.md) · [#102](./pr-102-independent-review.md) · [#104](./pr-104-independent-review.md).

---

## 5. Ops dry-run kits on `main` (do not duplicate)

| npm script | PR | Owns |
|------------|-----|------|
| `dry-run:ci-protection-verify` | #94 | Branch protection + meta-ci presence docs |
| `dry-run:assemble-first-apply` | #92 | Assemble-first + Ocean/meta-fence markers |
| `dry-run:funnel-remount-checklist` | #90 | Offline Funnel remount checklist |
| `dry-run:factory-queue-mirror` | #88 | notes.md Queued mirror from bd/Linear |
| `dry-run:openaccess-linkage` | #85 | OpenAccess + OpenMCP well-knowns |
| `dry-run:beads-dolt-health` | #84 | `refs/dolt/data` + bootstrap-safe |
| `dry-run:gateway-dockerfile-health` | #82 | Gateway image `/health` contract |
| `dry-run:bdmetabeads` | #80 | BdMetaBeads adapter + `--memory` |
| `dry-run:sandbox-harness` | #78 | Sandbox harness readiness |
| `dry-run:rivet-compose-serve` | #76 | Rivet Compose + Tailscale Serve |
| `dry-run:windows-logon` | #73/#59 | Windows Task Scheduler kit |
| `dry-run:gateway-signed` | #71 | Signed HMAC admit (env-only) |
| `dry-run:supervisor-admit` | #68 | Offline admit |
| `dry-run:gateway-unsigned` | #66 | Unsigned Funnel admit gates |
| `dry-run:omniroute-desktop` | #64 | OmniRoute desktop install docs |
| (+ remount) `node scripts/gateway-remount-dry-run.mjs` | #40 | Live/base-url remount health |

In-repo ops docs: `docs/ops/*.md`. Project-store runbooks: `docs/remount-armed-runbook.md`, `docs/meta-beads.md` (store + repo).

---

## 6. Live systems (compact)

### GitHub

- Repo public · protection: PR + 1 write APPROVE + `meta-ci-presence`  
- LICENSE: all-rights-reserved on `main`  
- Composio collab dual IDs exist — prefer **`github_busky-styful`** for APPROVE  

### Vercel — Developer OS

- Project `factory-developer-os` · stable `https://factory-developer-os.vercel.app`  
- Shell / Port OAuth BFF / Rivet stream — **not** factory-gateway  
- Free-tier rate-limit often red on PRs — **ignore for merge**

### Port

- Single exposed MCP: Port EU `https://mcp.port.io/v1`  
- Factory OAuth EI live; Observatory gone  
- FE-142: org `FACTORY_GATEWAY_BASE_URL` + `FACTORY_GATEWAY_HANDLER_TOKEN` already set (closed)  
- Remount: fencing GETs stay on `api.port.io`; admit notify → Funnel `/webhooks/port/factory_*` when PM remounts  

### Funnel / desktop

| Host | Status |
|------|--------|
| Funnel URL | `https://desktop-3apdbkg.taildf3a4b.ts.net` — **/health PASS** (2026-10-29) |
| Local gateway | `:8787` on `DESKTOP-3APDBKG` |
| Windows logon task | Kit on `main`; **Register + reboot verify = FE-189** (desktop / Grokbot/Reason only) |
| Env file | `%USERPROFILE%\.factory\gateway.env` — never commit; never paste values |

### Meta Beads

- Hybrid: track `.beads/config.yaml` + `metadata.json`; gitignore `embeddeddolt/`  
- SoT tip: `refs/dolt/data` on origin  
- Prefer shared Dolt (`bd dolt`) for multi-agent / multi-box work  
- Prefer `./scripts/bd-bootstrap-safe.sh --dry-run` then `--execute`  
- Never `bd dolt push` from cloud kits; never Product Beads; never `bd init` per worktree  
- Morning: `npm run dry-run:beads-dolt-health` (+ `--ls-remote`)

---

## 7. Spec / ADR index (repo)

| Domain | Path |
|--------|------|
| factory-kernel | `specs/factory-kernel/spec.md` |
| port-governance | `specs/port-governance/spec.md` |
| rivet-execution | `specs/rivet-execution/spec.md` |
| sandbox-harness | `specs/sandbox-harness/spec.md` |
| developer-os | `specs/developer-os/spec.md` |
| auth-port-oauth | `specs/auth-port-oauth/spec.md` |
| … | see root `AGENTS.md` |

ADRs: `docs/adrs/` ADR-001…011. **ADR-007 superseded by ADR-011.** Immutable after PBI-002 — supersede, don’t edit.

Master narrative (store, not full repo dump): [`factory-master-spec.md`](./factory-master-spec.md).

Apps: `apps/factory-gateway/` · `apps/project-supervisor/` · `apps/sandbox-harness/` · `apps/developer-os/`.

---

## 8. Linear FE-61 / painter-os (FE-181…183)

Parent: **STL-177** FE-61 auto-review. Children still open for HITL:

| FE | Linear | Intent |
|----|--------|--------|
| FE-181 | STL-182 | Retarget ASDLC Issues Sync **off** `painter-os` → `mplsjohnnycage/factory` (or disable) |
| FE-182 | (STL-180-ish / pool) | Wire Claude · OpenCode · Grok into Linear review pool |
| FE-183 | STL-181 | Personal Code & reviews + GitHub Autolink `STL-` |

Runbooks: [`linear-auto-review-setup.md`](./linear-auto-review-setup.md) · [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md) · [`linear-auto-review-next.md`](./linear-auto-review-next.md).

**Do not** implement Meta coding PBIs by assigning them to Cursor Linear automation.

---

## 9. Explicit non-goals / refusals

- No new cloud Meta ops dry-run kit unless a *real* gap survives [`meta-kit-exhaustion.md`](./meta-kit-exhaustion.md) review  
- No Port schema upsert / WEBHOOK remount without PM-named unit  
- No secret print / FE-142 / FE-172 re-ask  
- No self-APPROVE / protection admin override  
- No Product Beads / Observatory / dual Port MCP  
- No calendar-day effort estimates in plans  
- No mass-close of stale GitHub issues mirrored from Linear  

---

## 10. First 15 minutes for a new agent

1. Read this file + `preferences.md` + top of `notes.md` (Queued).  
2. `git fetch origin main && git log origin/main -5 --oneline` — confirm tip ≥ `42fa340` (#104).  
3. `gh pr list --repo mplsjohnnycage/factory --state open` — if any PR, **independent review** path (§4) unless you are already the assigned reviewer or the author.  
4. Product UI wave landed (#98–#104); next live wiring = **FE-198** Ask→Rivet · **FE-199** Port lake — do **not** invent Meta ops dry-run kits.  
5. If desktop-capable: FE-189 Windows Register from [`desktop-live-checks-tick.md`](./desktop-live-checks-tick.md) via Grokbot/Reason.  
6. If HITL config: FE-181…183 with Linear docs — produce checklist report under `docs/`, don’t invent GitHub PRs unless code changes.  
7. End with **3-line PM summary** (Board / Shipped or Blocked / Next).

---

## 11. Key absolute paths (this machine / store)

| Artifact | Path |
|----------|------|
| This handoff | `/cursor/stores/self/docs/multi-agent-handoff.md` |
| Orca paste | `/cursor/stores/self/docs/orca-resume-paste.md` |
| Board | `/cursor/stores/self/notes.md` |
| Prefs | `/cursor/stores/self/preferences.md` |
| UI direction | `/cursor/stores/self/docs/ui-design-direction.md` |
| Kit exhaustion | `/cursor/stores/self/docs/meta-kit-exhaustion.md` |
| Funnel live | `/cursor/stores/self/docs/desktop-live-checks-tick.md` |
| Remount armed | `/cursor/stores/self/docs/remount-armed-runbook.md` |
| Claude historical | `/cursor/stores/self/docs/claude-code-handoff.md` |
| #98…#104 reviews | `/cursor/stores/self/docs/pr-98-independent-review.md` · `pr-99-…` · `pr-100-…` · `pr-102-…` · `pr-104-…` |
| Repo checkout | `/workspace` → `mplsjohnnycage/factory` |

---

## 12. PM 3-line (handoff itself)

- **Board:** Handoff refreshed — `main` @ `42fa340` (#98 design · #99 Cockpit · #100 Atlas · #102 Intelligence · #104 Providers); Queued FE-181…183 · FE-189 · FE-198 · FE-199; **STOP_CLOUD_KITS** yes for Meta ops kits.  
- **Live:** Funnel `/health` PASS on `desktop-3apdbkg`; remount dry-run PASS; Windows Register still Grokbot/Reason (FE-189); FE-142/FE-172 CLOSED.  
- **Next:** FE-181…183 HITL · FE-189 desktop · FE-198 live Ask→Rivet · FE-199 live Port lake — no new cloud Meta dry-run kits.
