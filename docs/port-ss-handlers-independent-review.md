---
cursor:
  subagentId: "bc-ff0242b1-011e-5353-b25d-4a62bf1ca54e"
---

# FE-107 — Port Meta self-service handlers — Independent review (PR #33)

**PR:** https://github.com/mplsjohnnycage/factory/pull/33  
**Head reviewed:** `23aede9508ba36e9ebe6502f4a1e739423dbbaa5` · branch `cursor/port-ss-handlers-0ff6` · base `main` @ `e0505a4` (PR BEHIND; auto-merge clean)  
**Author session:** `bc-4f87cec4` (PR footer)  
**Reviewer session:** `bc-ff0242b1` — **not** the author  
**Lane:** Meta (Factory kernel / `factory-gateway` + Port as-code)  
**Content + formal GitHub verdict:** **APPROVE**

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/33#pullrequestreview-5693956479 |
| Cursor App `gh` APPROVE | Not used (App token cannot count for protection) | Formal path is write collab |
| Author report | Prior art | [`port-ss-handlers.md`](./port-ss-handlers.md) |

No implementation. No merge from this session. Protection `required_approving_review_count` unchanged. Author ≠ reviewer.

## Acceptance checklist

Must all pass → APPROVE. Any fail on Meta-only `ss_convex_*`, unmarked Product backends, oauth/vercel/beads collision, or required CI → REQUEST_CHANGES.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Meta-only wired actions | `META_SELF_SERVICE_ACTIONS` + `port/workflows/ss_convex_*.json` | **PASS** | Only `ss_convex_create_preview`, `ss_convex_set_env` |
| Gateway route + auth | `POST /handlers/self-service` in `server.ts` | **PASS** | Port HMAC **or** Bearer `FACTORY_GATEWAY_HANDLER_TOKEN`; timing-safe compare |
| Convex Management client | `convex-management.ts` | **PASS** | `create_deployment` + `update_default_environment_variables` |
| Catalog project optional | create-preview + `CatalogWriter` | **PASS** | Projects `convexDeployment` when writer present |
| Product stubs marked (live Port) | Port MCP `list_workflows` | **PASS** | Titles include `[product lane]`; descriptions say PRODUCT LANE / Meta does not wire |
| Product stubs refuse on gateway | `product_lane_stub` → HTTP 501 | **PASS** | Unit-tested; Spec scenario asserts 501 |
| Live Meta workflows match as-code | Port MCP `get_workflow` `ss_convex_create_preview` | **PASS** | WEBHOOK → `/handlers/self-service` with Bearer secret |
| Spec same-PR Contract change | `specs/port-governance/spec.md` | **PASS** | Constraint + Gherkin scenario added |
| No OAuth External Interface | Diff name-only + content | **PASS** | No EI create/delete/revoke; Spec retains `no_port_oauth_mutation` |
| No Vercel CI collision | Diff name-only | **PASS** | No `vercel.json`, no `.github/workflows`, no Dev OS app edits |
| No Beads collision | Diff name-only | **PASS** | Zero `.beads` / bd paths |
| No `factory_*` admit remount here | PR body + scope | **PASS** | Explicit out-of-scope (FE-106 already on main) |
| Local reproduce | `npm ci && typecheck && test` on head | **PASS** | **33 pass / 0 fail**; typecheck clean |
| Merge onto current main | worktree merge + test | **PASS** | Auto-merge; **41/41** incl. webhook suite |
| **CI green on exact SHA `23aede9`** | Actions + Vercel | **PASS** | `gateway-typecheck-test`, `local-gate-refuse`, `meta-ci-presence`, Vercel, Preview Comments — all SUCCESS |
| Author ≠ this reviewer | session ids | **PASS** | `bc-4f87cec4` ≠ `bc-ff0242b1` |
| Formal APPROVE counts for protection | write COLLABORATOR | **PASS** | Submitted as `skysthelimitpainting1779-collab` |

## Consistency skim

- Scope matches author claim: Meta NEEDS HANDLER → gateway; Prospect/Painter stay stubs; OAuth / Vercel CI / Beads / `factory_*` admit out of scope.
- Live Port already upserted Meta Convex workflows (author ops); repo as-code under `port/workflows/` mirrors that.
- Aligns with `specs/port-governance` WEBHOOK→gateway + §4.2.1 single-writer for optional catalog project.
- Bearer auth on SS path is intentional for Port WEBHOOK secrets; classic HMAC still accepted when Port signs.

## Findings

### Blocking

None.

### Non-blocking

1. Branch is **BEHIND** `main` (#27 blueprints, #28 `factory_*` webhooks) but merges cleanly; update branch before squash-merge so tip CI re-runs on the merged tree.
2. Live E2E still needs deployed gateway + Port secrets (`FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN`) and gateway `CONVEX_TEAM_TOKEN` — correctly documented; merge ≠ live Convex call.
3. No HTTP integration test for `/handlers/self-service` status codes (dispatch + bearer covered at unit layer) — acceptable for this PR.
4. `ss_convex_set_env` value travels in WEBHOOK body; docs warn to prefer Port secret inputs — ops caution, not a code reject.

## Recommendation / outcome

Content **APPROVE**. Formal write-access **APPROVE** landed. CI green on exact head SHA. Ready for squash-merge by a non-author after optional branch update (not this reviewer’s merge unless the coordinator assigns).

| Item | Value |
| --- | --- |
| Decision | **APPROVE** |
| PR | https://github.com/mplsjohnnycage/factory/pull/33 |
| Head SHA | `23aede9508ba36e9ebe6502f4a1e739423dbbaa5` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/33#pullrequestreview-5693956479 |
| Model | omitted (auto) |
