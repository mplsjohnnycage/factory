# Factory Meta setup status (FE-49)

**Date:** 2026-10-28  
**Worker:** `bc-3bad009e-bc57-53fa-9f3a-5ac7be7aade8`  
**Lane:** Meta only — no FE-24, no Product Beads, no Port OAuth create/delete, no coding-loop builds beyond init.

---

## Johnny’s 7 items

| # | Item | Status | Paths / evidence |
|---|------|--------|------------------|
| **1** | Inventory existing Factory **git repo** scaffold | **Not found** (pre-existing) → **Done** (staged new) | No prior Factory meta git tree in Project store, `/agent`, or uploads. Closest unrelated: `artifacts/elephant-goldfish-model/` (EGM skill clone). **New staging repo:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/factory/` (`main` @ `4ce02d6`) |
| **2** | Locate ASDLC zip Johnny mentioned | **Done** | Zip: `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/internal/asdlc-skill.zip` (250 466 bytes). Extracted skill: `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/` (FE-16). |
| **3** | What “February OpenAI” scaffolding means (research + cite) | **Done** (researched; no local copy found) | See [§ February OpenAI](#february-openai-scaffolding--research). No OpenAI Agents SDK / Swarm / agents.md scaffold tree found in Project store or `/agent`. |
| **4** | Seed Linear **Factory Meta** project with **PBI-001–011** typed contracts | **Done** | Project: [Factory Meta](https://linear.app/johnny-cage/project/factory-meta-1c7e5c372e3d) (ASDLC / STL). Issues **STL-162…STL-172**. Bodies + mirrors: `docs/linear-pbi-seed/`. |
| **5** | Note **PBI-012–015** as later/deferred | **Done** | Linear **STL-173…STL-176** labeled Deferred; files under `docs/linear-pbi-seed/*-DEFERRED.md` + `DEFERRED-012-015.md`. |
| **6** | Create/init GitHub Factory Meta repo (+ `AGENTS.md`) | **Done** (remote) | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) — coordinator logged in as `mplsjohnnycage`, pushed `main`. Workflow file temporarily omitted (OAuth missing `workflow` scope). Local staging still at `artifacts/factory/`. |
| **7** | Write this status report | **Done** | This file: `docs/factory-meta-setup-status.md`. |
| **+** | Linear painter-os sync contamination | **Partial** | STL-162…172 painter-os attachments **detached**. Team ASDLC↔painter-os mapping still needs Johnny UI Edit Link → `mplsjohnnycage/factory` or disable. Full steps: [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md). |

---

## February OpenAI scaffolding — research

Johnny’s phrase most likely points at OpenAI’s early‑2025 agent packaging, not a Factory-owned zip:

| Candidate | When | What it is | Fit for Factory Meta |
|-----------|------|------------|----------------------|
| **OpenAI Agents SDK** (Python) | Announced **2025-03-11** ([OpenAI: New tools for building agents](https://openai.com/index/new-tools-for-building-agents/); repo [openai/openai-agents-python](https://github.com/openai/openai-agents-python) created 2025-03-11) | Multi-agent orchestration SDK (successor narrative to Swarm); examples + quickstart, **not** a full product-repo template matching master §2 | Useful pattern reference only. Factory M1 coding harness is **Rivet Sandbox Agent + Claude Code** (ADR-006 / PBI-006), not OpenAI Agents SDK as control plane. |
| **OpenAI Swarm** | 2024 experimental; educational examples under `examples/basic` | Lightweight handoffs; superseded for production by Agents SDK | Do not scaffold Factory on Swarm. |
| **AGENTS.md convention** | Open format; ETH/agents.md research ~Feb 2026 in ASDLC skill cites; site [agents.md](https://agents.md) | Repo-level agent index file | **Adopted** in meta scaffold as index-only `AGENTS.md` per ASDLC `practices/agents-md-spec.md` + master §1 / PBI-003. |

**Local search:** no `openai-agents*`, Swarm checkout, or “February OpenAI” zip under Project store / `/agent` / uploads. Scaffolding used: master §2 layout + ASDLC skill conventions + thin placeholders — **not** a vendored OpenAI template tree.

---

## Linear map (Meta)

| PBI | Linear | Deps wired |
|-----|--------|------------|
| PBI-001 | [STL-162](https://linear.app/johnny-cage/issue/STL-162) | — |
| PBI-002 | [STL-163](https://linear.app/johnny-cage/issue/STL-163) | blockedBy STL-162 |
| PBI-003 | [STL-164](https://linear.app/johnny-cage/issue/STL-164) | blockedBy STL-162 |
| PBI-004 | [STL-165](https://linear.app/johnny-cage/issue/STL-165) | blockedBy STL-163 |
| PBI-005 | [STL-166](https://linear.app/johnny-cage/issue/STL-166) | blockedBy STL-165 |
| PBI-006 | [STL-167](https://linear.app/johnny-cage/issue/STL-167) | blockedBy STL-165 |
| PBI-007 | [STL-168](https://linear.app/johnny-cage/issue/STL-168) | blockedBy STL-166, STL-167 |
| PBI-008 | [STL-169](https://linear.app/johnny-cage/issue/STL-169) | blockedBy STL-164 |
| PBI-009 | [STL-170](https://linear.app/johnny-cage/issue/STL-170) | blockedBy STL-167, STL-169 |
| PBI-010 | [STL-171](https://linear.app/johnny-cage/issue/STL-171) | blockedBy STL-164 |
| PBI-011 | [STL-172](https://linear.app/johnny-cage/issue/STL-172) | blockedBy STL-168 |
| PBI-012…015 | STL-173…176 | Deferred label |

Paste-ready / full mirrors: `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/docs/linear-pbi-seed/`.

### Sync warning (Meta vs Product) — remediation

**Root cause:** ASDLC team two-way GitHub Issues Sync → `johnnyc-9164/painter-os`, so Meta seeds STL-162…176 auto-created painter-os#277–291.

**Done (MCP):** Removed painter-os sync attachments from **STL-162…172** (Linear issues kept). Deferred STL-173…176 still attached.

**Johnny UI remaining:** Linear → Settings → Integrations → GitHub → GitHub Issues → ASDLC mapping → **Edit Link** to [`mplsjohnnycage/factory`](https://github.com/mplsjohnnycage/factory), **or** disable two-way / use a dedicated Meta team. Details: [`linear-github-painter-os-retarget.md`](./linear-github-painter-os-retarget.md).

---

## Git staging + remote

**Remote:** [https://github.com/mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (`main` pushed; owner `mplsjohnnycage`)

**Local staging:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/factory/`

- `AGENTS.md` (index only)
- `OpenStack.md` + `.well-known/*` placeholders
- Ten `specs/*/spec.md` stubs (scaffold — PBI-001 authors)
- Eleven `docs/adrs/ADR-*` placeholders (PBI-002 authors)
- `apps/factory-gateway/`, `apps/developer-os/` README stubs
- `bin/install.sh` (CI workflow temporarily not on remote — restore after `gh auth refresh -s workflow`)

---

## Explicit non-actions (constraints honored)

- Did **not** execute FE-24 / Feature Assembly / coding-loop beyond init.
- Did **not** create/delete Port OAuth apps.
- Did **not** seed or touch Product Beads.
- Did **not** implement PBI-001…011 code work — tickets + scaffold only.
