# PBI-015: CE compound writeback after first coding PBI

| Field | Value |
|-------|-------|
| Linear | [STL-176](https://linear.app/johnny-cage/issue/STL-176) |
| Lane | Meta only |
| Branch | Fresh from `main` at start (`cursor/pbi-015-compound-prep-7293`) |
| Status | **Authoring / HITL-ready** — planning+build unblocked; interactive `/ce-compound` Full remains HITL |

## Directive

After verified Meta coding PBIs, run Compound Engineering `/ce-compound` to capture **one** durable learning under `docs/solutions/`. Specs stay authoritative for contracts; learning docs only — no Port catalog dual-write, no External Interface mutate, no Observatory.

## Contract (C1–C3)

| Field | Content |
|-------|---------|
| **C1** | One solved+verified Meta coding episode; durable-learning bar; Full `/ce-compound` (HITL) or non-interactive when free/reversible |
| **C2** | One `docs/solutions/<category>/<slug>.md` (or explicit skip); optional `CONCEPTS.md` / AGENTS tip **with consent** |
| **C3** | git (`docs/solutions/…`); Linear STL-176; **not** Port catalog |

## Acceptance

1. Qualifying durable learning landed **or** skip report with durable-bar rationale.
2. Frontmatter/claims validated per CE skill.
3. HITL discoverability consent honored (no AGENTS tip without Johnny).
4. Rollback: revert learning PR; keep Meta lane clean.

## Dry-run + rollback

| Step | Action | Reversible? |
|------|--------|-------------|
| 1 | Prep branch + task/seed activation (this PR) | Yes — close/revert PR |
| 2 | Non-interactive lightweight learning when bar passes | Yes — delete/revert `docs/solutions/**` |
| 3 | Interactive Full `/ce-compound` | HITL — leave ready until Johnny runs |
| 4 | Rollback | `git revert` learning commit; restore Deferred seed if needed |

## Out of scope

- Port OAuth create/delete/revoke
- Port schema live apply
- Product Beads
- Batching multiple learnings in one run
