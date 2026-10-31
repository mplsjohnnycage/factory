# Ocean Meta unmap — Meta-fenced blueprints

**Date:** 2026-10-29  
**Lane:** Meta  
**Ops:** Port MCP (`update_integration_mapping`) — desktop UI blocked (Google login not signed in on agent desktop)  
**Context:** FE-111 / PR #29 merged; follow-up to [`ocean-mcp-write-fencing.md`](./ocean-mcp-write-fencing.md) + [`port-prep-inventory.md`](./port-prep-inventory.md) §4  
**Org:** `mplsjohnnycage` / `org_rNq4tjSc8DXL1ceL`

## Goal

Unmap Ocean from Meta-fenced blueprints only (`product` / `executionContract` / Factory-governed). Do **not** delete Ocean installs. Confirm `catalogVersion` on those BPs. Leave non-Meta Ocean mirrors alone.

## Before

| Check | Result |
|-------|--------|
| Ocean installs | `github-ocean`, `factory-pilot-github`, `linear`, `vercel-ocean`, `convex-ocean` (all present) |
| Meta-fenced blueprint **targets** in Ocean mappings | **`skill` only** — `factory-pilot-github` `kind: file` → `blueprint: "skill"` (SKILL.md under `docs/skills/**` + `.claude/skills/**`) |
| `product` / `executionContract` as Ocean targets | **Not mapped** on any install |
| Other Meta-fenced BPs as Ocean targets | None (`service` appears only as **relation** search targets on mirrors — not a resource blueprint write) |
| Non-Meta mirrors | github\* / linear\* / vercel\* / convex\* (+ `deployment` EI) untouched |
| `factory-pilot-github` resource count | **18** (incl. file→skill) |
| `catalogVersion` on `product` | Present on BP + entity `factory-meta` = **0** (FE-105) |
| `catalogVersion` on `executionContract` | Present on BP + entity `factory-meta-bootstrap-contract` = **0** (FE-105) |

## Change applied

1. Port MCP `update_integration_mapping` on **`factory-pilot-github`**: removed the single `kind: file` → `skill` resource.
2. Brief mid-ops truncation to 5 resources during apply; **restored** full mirror set (**17** resources, no skill) from prepared payload `/tmp/port-ocean-unmap/restore-final.json`.
3. **No** Ocean install deleted. **No** mapping edits on `github-ocean`, `linear`, `vercel-ocean`, `convex-ocean`.

## After

| Check | Result |
|-------|--------|
| Ocean installs | All **5** still present (none deleted) |
| `factory-pilot-github` resources | **17** — organization, team, user, repository, PR, workflow, workflow-run, issue (painter-os mirrors) |
| Ocean → Meta-fenced blueprint targets | **None** (`skill` unmapped; `product` / `executionContract` still unmapped) |
| Non-Meta Ocean mirrors | Left alone |
| `catalogVersion` `product` | Confirmed — entity `factory-meta` = **0** |
| `catalogVersion` `executionContract` | Confirmed — entity `factory-meta-bootstrap-contract` = **0** |
| Post-apply resync | `factory-pilot-github` resync **running** after restore (expected); other installs completed earlier |

## Explicit non-touches

- No delete/revoke of Ocean installs  
- No External Interface OAuth mutations  
- No changes to github/linear/vercel/convex mirror blueprint mappings on other installs  
- Existing `skill` entities left in catalog (unmap stops future Ocean dual-write; no mass delete)

## Notes / residual

- Desktop Port UI path blocked: agent Chrome had no Google session — MCP path used instead.  
- `service` remains a **relation** target from some Ocean PR/run mappings (`createMissingRelatedEntities: true` on the two GitHub Oceans). Not a Meta-fenced **resource blueprint** mapping; left as-is per “leave non-Meta Ocean mirrors alone.”  
- Other Meta-fenced BPs still lack live `catalogVersion` property rollout (deliveryRun, executionAttempt, …) — out of this unmap scope; confirm-only was for product/executionContract.
