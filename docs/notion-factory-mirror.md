# Notion Factory mirrors (status)

**Status:** Live — Meta-lane mirrors + setup ops page; Port Ocean noted  
**Date:** 2026-10-28  
**Lane:** Meta only  
**Worker:** FE-53 (`bc-0b18a434-1b83-5282-92bd-a9e92b106fc2`; continue [Finish setup Notion mirror](bc-b86407d8-47fa-5d02-a777-de21c16b20a8))  
**Workspace:** Johnny Cage’s Space (private drafts — move when a shared destination is named)  
**Last refresh:** post–FE-54 remaster + setup mirror + Port Ocean live check

---

## Hard rule

**SoT = Project store `docs/` + git repo.** Notion pages below are **mirrors / human wiki only** — not Spec, not accept, not claim, not Linear/PBI/Beads replacement. If Notion and SoT diverge, **SoT wins**.

---

## Index (parent)

| Page | URL |
|------|-----|
| Factory docs — Notion mirrors (NOT SoT) | https://app.notion.com/p/407af2184a9e812b9429f79100bbffc8?pvs=204 |

---

## Child mirrors

| Mirror title | SoT file | Notion URL |
|--------------|----------|------------|
| [MIRROR] Factory workflow summary | `docs/factory-workflow.md` | https://app.notion.com/p/407af2184a9e8182b976e4849414e0ad?pvs=204 |
| [MIRROR] Factory coding loop | `docs/factory-coding-loop.md` | https://app.notion.com/p/407af2184a9e818f8b4af8afb22cc28a?pvs=204 |
| [MIRROR] Meta vs Product line | `docs/factory-meta-vs-product.md` | https://app.notion.com/p/407af2184a9e8129a0b8ff570763a359?pvs=204 |
| [MIRROR] Factory architecture map (pointer) | `docs/factory-architecture-map.md` | https://app.notion.com/p/407af2184a9e81fa9e43f7128217d8f9?pvs=204 |
| [MIRROR] Meta setup live — Linear · repo · Beads | `docs/factory-meta-setup-status.md` (+ Port Ocean live) | https://app.notion.com/p/407af2184a9e81c29c57e2dd92813dea?pvs=204 |

Architecture map page is a **pointer + structured caption** (Mermaid stays in the store derived companion; canonical SoT = master).

### Johnny ops confirmation (Meta)

Johnny confirmed **Linear / Factory meta repo / Beads** are fully configured for the Meta lane. Notion remains **mirror-only** (not SoT). **OQ-1 locked hybrid:** Meta Beads scaffolded now; Linear/PBI still admit/claim SoT until PBI-007 ([`meta-beads-scaffold.md`](./meta-beads-scaffold.md)). **painter-os** GitHub sync retarget residual remains — see `docs/linear-github-painter-os-retarget.md`.

### Mirror layers (do not conflate)

| Layer | What | Role |
|-------|------|------|
| **Port Ocean** | Live: `linear`, `github-ocean`, `factory-pilot-github`, `vercel-ocean`, `convex-ocean` (resync completed 2026-10-28) | Catalog / Context Lake mirror of Linear + GitHub (ADR-001). **Not** Notion. |
| **Notion** | This page tree | Human wiki only |
| **Beads** | Ready/claim | **Not** a Port Ocean source |

### Remaster sync (continue pass)

All four plan child mirrors were **replaced** to match remastered derived companions:
- Status line → **Derived from** `factory-master-spec.md` (not independent SoT)
- §0.7 roster + `personal-agent` / `coding-agent`
- 19-field PBI body (C1–C3 + 1–16); field 7 = roster + task kind
- Meta Beads naming; no independent-review / “Merge!” step
- OQ-2 closed + pointer to this status file

---

## MCP / OQ-2 / Port

| Item | State |
|------|--------|
| Notion MCP | **Authenticated** (ready) |
| OQ-2 | **Resolved (Johnny):** mirror allowed; not SoT |
| Port Ocean | **Live** Linear + dual GitHub (+ Vercel/Convex custom) — checked via Port `list_integrations` |
| Page visibility | Private drafts in workspace — offer move when Johnny names a shared destination |

---

## Store docs updated (stale needsAuth scrub)

| Doc | Change |
|-----|--------|
| `factory-workflow.md` A11 / OQ-2 | Point at this status file; mirrors live |
| `factory-research-reconciliation.md` | Point at this status file |
| `factory-research-300-qa.md` Q146/Q147 | Authenticated + status path |
| `factory-spec-remaster-report.md` | Notion mirror unblocked; R1 closed |

---

## Document control

| Doc | Role |
|-----|------|
| **This file** | Status + URLs for Notion Factory mirrors |
| SoT companions | `factory-workflow.md` · `factory-coding-loop.md` · `factory-meta-vs-product.md` · `factory-architecture-map.md` · `factory-meta-setup-status.md` |
