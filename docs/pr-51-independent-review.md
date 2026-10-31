---
cursor:
  subagentId: "bc-aa1c7119-2e81-5379-9319-51feb5905f52"
---

# Code Atlas four-overlay (STL-154) — Independent review + merge (PR #51)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/51 (**MERGED**) |
| Branch | `cursor/code-atlas-four-overlay-7293` |
| Content head reviewed | `792de3a28abbf8c32c9e74752e5f742fa5571c67` |
| Merge tip (post update-from-main) | `d0705b9168f7396e4c148e3e2d59a02b05a685fc` |
| **Merge SHA** | `5ea96a05c3f7e763b5d31b0b252813fb1d932052` |
| Merged at | `2026-10-29T15:41:53Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-1ca339e3-d7cd-5bd0-b569-36d76db47293` |
| Independent review session | `bc-aa1c7119-2e81-5379-9319-51feb5905f52` (**≠ author**; Auto) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `792de3a` (retained through branch updates → tip `d0705b9`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/51#pullrequestreview-5700546543 |
| Squash-merge via Composio (`mplsjohnnycage`) | **MERGED** | merge SHA `5ea96a05c3f7e763b5d31b0b252813fb1d932052` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-1ca339e3…` ≠ reviewer `bc-aa1c7119…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (content head `792de3a` / merge tip `d0705b9`)

| # | Check | Result |
| --- | --- | --- |
| 1 | Four overlays Beads / Polygraph / Graft / Langfuse as separate graphs | **PASS** |
| 2 | Proven joins require `sourceSystem`/`sourceId`/`target`/`evidence`/`observedAt`; unknown stays unknown | **PASS** |
| 3 | Bounded tools: `atlas.find_node`, `expand_dependencies`, `get_task_impact`, `get_related_sessions`, `get_agent_traces` | **PASS** |
| 4 | Access/redaction: anonymous hides restricted + Langfuse cost fields; operator sees traces | **PASS** |
| 5 | Langfuse refused as live session owner (`langfuse_not_live_owner`; Rivet owns live) | **PASS** |
| 6 | `/.well-known/openmcp.json` advertises atlas.* tools only | **PASS** |
| 7 | Spec + README updated with STL-154 Contract | **PASS** |
| 8 | Local `npm typecheck` + `npm test` (**22/22**) + `npm run build` | **PASS** |
| 9 | Formal write APPROVE + green `meta-ci-presence` before merge | **PASS** |
| 10 | No Observatory / no protection dip | **PASS** |
| 11 | Repo public; author ≠ formal reviewer | **PASS** |
| 12 | Live Port schema apply | **Not in this PR** — Johnny approved sibling apply; this review session did **not** apply Port schema |

## Diff scope

14 files · +1340 / −23 vs `main` · tip `792de3a` (+ merge commits from main updates before squash).

| Path | Role |
| --- | --- |
| `apps/developer-os/src/lib/atlas/*` | Types, fixture graph, projection, redaction, MCP tool dispatcher |
| `apps/developer-os/src/app/api/atlas/subgraph` | Viewport-capped read projection API |
| `apps/developer-os/src/app/api/atlas/tools` | List + invoke bounded `atlas.*` tools |
| `apps/developer-os/src/components/AtlasHero.tsx` (+ CSS) | Overlay toggles + subgraph fetch into hero |
| `apps/developer-os/test/atlas-projection.test.ts` | Provenance / redaction / tool refusal coverage |
| `apps/developer-os/README.md` | Atlas operator docs |
| `specs/developer-os/spec.md` | STL-154 Contract + scenarios |
| `.well-known/openmcp.json` | Advertise atlas.* tool names |

## CI at merge tip `d0705b9`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `developer-os-typecheck-test-build` | pending→pass race; not required gate |
| `local-gate-refuse` | pending→pass race; not required gate |
| Vercel – factory-developer-os | pending/pass race |

`mergeable: MERGEABLE` + write APPROVE + green `meta-ci-presence` → squash-merge succeeded.  
Branch was updated twice onto advancing `main` (#50 then #54) before merge; collab APPROVE remained `APPROVED` on tip.

## Consistency skim

- Read projection only — no Port blueprint/workflow upsert from this PR or this review session.
- OpenMCP advertise ≠ live Port MCP bind; sibling agent owns Johnny-approved schema apply.
- Provenance demotion of invent-proven edges + unknown join tracking matches Spec authority rules.
- Langfuse `liveOwner: false` forced in redaction and tool responses.

## Findings

### Blocking

None.

### Non-blocking

1. Fixture graph is memory-only — expected for M4; live Beads/Polygraph/Graft/Langfuse joins remain follow-on.
2. Hero defaults Langfuse overlay off — good safety default; operators toggle on.
3. Anonymous `get_agent_traces` returns public redacted traces when present; restricted-only empty path returns `forbidden` — intentional asymmetry, covered by tests.

## Explicit non-actions (honored)

- No Port schema / blueprint / workflow live apply from this review session (sibling apply lane)
- No Observatory
- No OAuth URI mutation
- No Product Beads
- No protection dip / admin override

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/51 |
| Merge SHA | `5ea96a05c3f7e763b5d31b0b252813fb1d932052` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/51#pullrequestreview-5700546543 |
| Protection | Write APPROVE kept; count not dipped |
| Port schema | Not applied here; Johnny-approved sibling apply |
| Observatory | None |
