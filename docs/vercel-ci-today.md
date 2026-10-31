---
cursor:
  subagentId: "bc-8b9cbd66-0011-51b4-9c34-2f1dd3367f52"
---

# Vercel CI / deployments — 2026-10-29

**Scope:** `mplsjohnnycage/factory` + Vercel team `johnnyc`  
**Window:** UTC calendar day 2026-10-29 (00:00Z → ~06:15Z). Chicago (CDT, UTC−5): most Meta-loop #16–#19 activity fell on **local Oct 28 evening**; Chicago Oct 29 starts 05:00Z.  
**Sources:** `gh` Actions/PRs + Vercel MCP (`list_projects`, `list_deployments`, `get_deployment`, `get_project`). Vercel CLI not installed; Vercel CI invocations API returned empty (no Vercel CI product runs).

## Verdict

**Healthy overall.** Only `factory-developer-os` deployed today. Meta loop PRs **#16–#21** drove expected preview+prod churn (18 deploys). **One preview ERROR** (#17, missing lockfile) self-healed on the next commit. **Two GitHub Action failures** on #20’s first SHA (gateway typecheck / accept-matrix) were fixed and merged. No unexpected projects firing. Prod alias: https://factory-developer-os.vercel.app (latest READY = #21 merge `505a336`).

## Projects checked

| Project | Today deploys | Notes |
|---------|---------------|--------|
| **factory-developer-os** (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`) | **18** | Linked to `mplsjohnnycage/factory`. Created ~04:40Z with PBI-008. |
| factory-capabilities | **0** | Quiet |
| factory-control-plane | **0** | Quiet |

## Vercel deployments (`factory-developer-os`) — newest first

| UTC | CDT | State | Target | SHA | Trigger | Preview / deploy URL |
|-----|-----|-------|--------|-----|---------|----------------------|
| 06:10 | 01:10 | READY | **prod** | `505a336` | **#21** merge PBI-012 | https://factory-developer-ayns0yozw-johnnyc.vercel.app |
| 05:44 | 00:44 | READY | preview | `2969a3b` | **#21** PR | https://factory-developer-pz16ark70-johnnyc.vercel.app |
| 05:16 | 00:16 | READY | **prod** | `107a7be` | **#20** merge PBI-011 | https://factory-developer-brzz43yoa-johnnyc.vercel.app |
| 05:13 | 00:13 | READY | preview | `2a100ec` | #20 fix TS2783 | https://factory-developer-kynky3wtw-johnnyc.vercel.app |
| 05:08 | 00:08 | READY | preview | `6ca0072` | #20 fix | https://factory-developer-bpfpuc9q6-johnnyc.vercel.app |
| 05:03 | 00:03 | READY | preview | `a95adae` | **#20** open | https://factory-developer-n0k3ssh33-johnnyc.vercel.app |
| 05:02 | 00:02 | READY | **prod** | `e57d70b` | license chore (main) | https://factory-developer-rbnuqwe40-johnnyc.vercel.app |
| 05:00 | 00:00 | READY | **prod** | `443d03d` | **#19** merge PBI-010 | https://factory-developer-nj6j2cz9c-johnnyc.vercel.app |
| 04:56 | 23:56* | READY | preview | `871e2fa` | **#19** PR | https://factory-developer-84vp55d80-johnnyc.vercel.app |
| 04:54 | 23:54* | READY | **prod** | `938fb7d` | **#18** merge PBI-009 | https://factory-developer-ze25hkke9-johnnyc.vercel.app |
| 04:53 | 23:53* | READY | **prod** | `c9bd7fb` | **#17** merge meta-ci | https://factory-developer-rjg2z842u-johnnyc.vercel.app |
| 04:49 | 23:49* | READY | preview | `c2ffe47` | **#18** PR | https://factory-developer-ini4fq25n-johnnyc.vercel.app |
| 04:48 | 23:48* | READY | preview | `76db83d` | #17 retry | https://factory-developer-kzg8j7db9-johnnyc.vercel.app |
| 04:46 | 23:46* | **ERROR** | preview | `87afd29` | **#17** | https://factory-developer-ivmemd8sl-johnnyc.vercel.app |
| 04:45 | 23:45* | READY | **prod** | `7a145d5` | **#16** merge PBI-008 | https://factory-developer-58rqiefsl-johnnyc.vercel.app |
| 04:41 | 23:41* | READY | preview | `702c99e` | #16 chore | https://factory-developer-ey6lv3hnq-johnnyc.vercel.app |
| 04:40 | 23:40* | READY | preview | `0ac70ae` | **#16** scaffold | https://factory-developer-1bmg2t9uz-johnnyc.vercel.app |
| 04:40 | 23:40* | READY | **prod** | `0ac70ae` | #16 initial (same SHA) | https://factory-developer-dc6qbupta-johnnyc.vercel.app |

\*CDT Oct **28** (before Chicago midnight).

**Stable aliases:** `factory-developer-os.vercel.app` · `factory-developer-os-johnnyc.vercel.app` · `factory-developer-os-git-main-johnnyc.vercel.app`

## Meta loop noise (#16–#21)

Expected churn from rapid sequential Meta PBIs:

| PR | State (as of report) | Vercel footprint |
|----|----------------------|------------------|
| #16 PBI-008 Dev OS shell | MERGED | Project birth + 2 previews + prod merge (+ duplicate prod on first SHA) |
| #17 meta-ci accept path | MERGED | **1 ERROR** preview → READY retry → prod merge |
| #18 PBI-009 Rivet realtime | MERGED | preview + prod |
| #19 PBI-010 OpenAccess/MCP | MERGED | preview + prod |
| #20 PBI-011 accept-on-SHA | MERGED | 3 previews (open + 2 fixes) + prod; GH Actions failed once then green |
| #21 PBI-012 OpenFleet | MERGED | preview + prod |

Previews fire on **every** branch push even when the diff is mostly gateway/CI (Vercel still builds `apps/developer-os`). That is the main noise source — not rogue projects.

## What’s wrong / notable

1. **Vercel ERROR** `dpl_HmqksckB1zBn9sN5LWjiKfy3uDcW` (#17, `87afd29`): `errorCode=missing_lock_file`, `npm ci` exit 1. Next push (`76db83d`) READY. Transient Meta-loop flake.
2. **GHA failures (not Vercel):** first #20 SHA — `factory-gateway` + `meta-accept-matrix` failed typecheck (TS2783 duplicate `ok`); fixed in follow-up commits; merge green.
3. **Extra prod deploy:** main license chore (`e57d70b`) between #19 and #20 — intentional push, not a loop PR.
4. **Dual prod+preview** on first #16 SHA — project create / production promote from the feature branch; not a second app.
5. **No unexpected launches** from `factory-capabilities` / `factory-control-plane`. No Vercel CI (Hive) invocations.

## GitHub Actions today (companion)

~60 completed runs UTC today; **58 success / 2 failure** (both #20 first attempt). Workflows: `meta-ci`, `meta-accept-matrix`, `meta-accept-gate`, `factory-gateway`, `developer-os`, `compose-lint`, `project-supervisor`, `sandbox-harness`. ~29 runs on Meta-loop #16–#21 branches alone.

## Prod now

- **Production:** https://factory-developer-os.vercel.app  
- **Latest deploy:** `505a336` — PBI-012 / #21 merge (READY)  
- **Inspector:** https://vercel.com/johnnyc/factory-developer-os/76fwRmPScasTRNKsik4C9hB8dpjF
