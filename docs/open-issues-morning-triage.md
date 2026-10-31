# Open issues morning triage — mplsjohnnycage/factory

**Checked:** 2026-10-29T08:20:43Z  
**Repo:** https://github.com/mplsjohnnycage/factory (PUBLIC)  
**Sources:** `gh issue list --state open` (11 open) · Linear Factory Meta / ASDLC · [open-pr-sweep.md](./open-pr-sweep.md) · merge map on `main`  
**Mode:** Triage only — **no issue closes**, no merges, no Port mutations

---

## Verdict

| Question | Answer |
|----------|--------|
| Open GitHub issues | **11** |
| Open Meta PRs | **0** (all recent Meta PRs merged) |
| Open GH issues that **block morning Meta ship**? | **None as coding blockers** |
| What still blocks morning ship? | **Ops outside this issue board** — gateway public URL (Funnel) → Port remount; OAuth login confirm; PBI-015 HITL ([STL-176](https://linear.app/johnny-cage/issue/STL-176)) |

Most open GH facets are **stale tracker mirrors**: Linear already **Done**, code already on `main`, but PRs lacked `Fixes`/`Closes` so GitHub stayed open. Do **not** mass-close; close only after a human/sync pass with a citing comment.

---

## Morning-ship definition (used here)

Meta morning ship = kernel path usable for admit/accept today:

1. Specs/ADRs/PBIs through seed wave on `main` (done — open-pr-sweep)
2. GHA accept-on-SHA + branch protection (done; Vercel Hive **not** required while public)
3. Live Port → factory-gateway hop (WEBHOOK / SS) needs a **reachable** `FACTORY_GATEWAY_BASE_URL` — **not represented as an open GH issue**
4. Dev OS Port OAuth live login confirm (ops; code landed [#30](https://github.com/mplsjohnnycage/factory/pull/30))
5. PBI-015 CE compound writeback = HITL / deferred coding ([STL-176](https://linear.app/johnny-cage/issue/STL-176) In Progress) — no open GH facet in this set

---

## Bucket A — Stale open (code/docs landed; Linear Done)

Do **not** treat as morning blockers. Recommend coordinated close (comment + Linear sync or intentional GH close) — **not** random bulk close.

| GH | Title | Linear | Merged PR | Why open still |
|----|-------|--------|-----------|----------------|
| [#26](https://github.com/mplsjohnnycage/factory/issues/26) | Bootstrap Meta Beads from Dolt history | [STL-184](https://linear.app/johnny-cage/issue/STL-184) **Done** | [#24](https://github.com/mplsjohnnycage/factory/pull/24) `8568858cadaf` | No closing keyword on PR |
| [#32](https://github.com/mplsjohnnycage/factory/issues/32) | Add catalogVersion to product/executionContract | [STL-187](https://linear.app/johnny-cage/issue/STL-187) **Done** | [#27](https://github.com/mplsjohnnycage/factory/pull/27) `de82c1f943f1` | Same |
| [#34](https://github.com/mplsjohnnycage/factory/issues/34) | Prove factory_* WEBHOOK → gateway | [STL-188](https://linear.app/johnny-cage/issue/STL-188) **Done** · labels `launch` | [#28](https://github.com/mplsjohnnycage/factory/pull/28) `e0505a4a2c53` | In-repo path **proven**; **live remount** still blocked on gateway URL ([port-workflow-webhooks.md](./port-workflow-webhooks.md)) — remount is **ops**, not this issue’s remaining coding |
| [#35](https://github.com/mplsjohnnycage/factory/issues/35) | Wire Meta self-service handlers | [STL-189](https://linear.app/johnny-cage/issue/STL-189) **Done** | [#33](https://github.com/mplsjohnnycage/factory/pull/33) `eddc239e6489` | Handlers on `main`; live SS URLs wait on `FACTORY_GATEWAY_BASE_URL` secret |
| [#36](https://github.com/mplsjohnnycage/factory/issues/36) | Disallow Ocean/MCP Meta-fenced bypass | [STL-190](https://linear.app/johnny-cage/issue/STL-190) **Done** | [#29](https://github.com/mplsjohnnycage/factory/pull/29) `b07e6cd547c4` | Fencing merged |
| [#37](https://github.com/mplsjohnnycage/factory/issues/37) | Document Vercel CI Hive blocker (public) | [STL-191](https://linear.app/johnny-cage/issue/STL-191) **Done** · `blocked-external` `launch` | [#25](https://github.com/mplsjohnnycage/factory/pull/25) `a0237803ca8c` | Docs/scaffold landed; **Hive stays 409** while public — accept **GHA** as Meta CI ([vercel-ci-setup.md](./vercel-ci-setup.md)). Not a morning coding blocker unless ship definition requires Hive |

**#34 nuance:** labeled `launch`, but the *prove* work is done. Morning ship still needs Funnel/public gateway + remount — track that via [factory-gateway-public-url.md](./factory-gateway-public-url.md), not by reopening coding on #34.

---

## Bucket B — FE-61 HITL / hygiene (open by design)

Parent: [#2](https://github.com/mplsjohnnycage/factory/issues/2) ↔ [STL-177](https://linear.app/johnny-cage/issue/STL-177) **In Progress** (sub-issues 2/6 completed on GH: #3+#4 closed).

| GH | Title | Linear | Morning ship? | Notes |
|----|-------|--------|---------------|-------|
| [#2](https://github.com/mplsjohnnycage/factory/issues/2) | FE-61 Linear auto-review | STL-177 In Progress | **No** (process) | Agent runbook done; STL-178/179 **Done** (Johnny). Leave open until Loop verify + intentional parent close |
| [#5](https://github.com/mplsjohnnycage/factory/issues/5) | Optional Loop first-pass | [STL-180](https://linear.app/johnny-cage/issue/STL-180) In Progress | **No** | Optional; verify on next Meta PR |
| [#6](https://github.com/mplsjohnnycage/factory/issues/6) | Code & reviews + Autolink STL- | [STL-181](https://linear.app/johnny-cage/issue/STL-181) Todo | **No** | Nice-to-have HITL |
| [#7](https://github.com/mplsjohnnycage/factory/issues/7) | Retarget ASDLC sync off painter-os | [STL-182](https://linear.app/johnny-cage/issue/STL-182) Todo · High | **Soft hygiene** | Attachments detached ([linear-github-painter-os-retarget.md](./linear-github-painter-os-retarget.md)); **Edit Link / default repo still Johnny UI**. Contaminates trackers if ignored — does **not** block gateway/CI ship |
| [#8](https://github.com/mplsjohnnycage/factory/issues/8) | Connect Claude/OpenCode/Grok review apps | [STL-183](https://linear.app/johnny-cage/issue/STL-183) Todo | **No** — defer | Review-pool expansion; Cursor/Codex/Linear already usable |

---

## What is *not* on this open-issue board (actual morning blockers)

| Blocker | Why it matters | Tracker |
|---------|----------------|---------|
| No public `FACTORY_GATEWAY_BASE_URL` | Port remount of WEBHOOK/SS would break tools without it | [factory-gateway-public-url.md](./factory-gateway-public-url.md) — Funnel recommended |
| Live Port WEBHOOK still → `api.port.io` | Admit path not on gateway yet | Follow-on after Funnel; do not remount early |
| Port OAuth live login confirm | Dev OS callback/HTTPS work reported; operator login smoke | FE-119/120 reports |
| PBI-015 CE compound HITL | Post-coding writeback; deferred seed | [STL-176](https://linear.app/johnny-cage/issue/STL-176) In Progress — **no** open GH issue here |
| Assemble-first master lead apply | Spec remaster, not an open GH issue | FE-125 / FE-24 |

---

## Close hygiene (explicit — no random closes)

1. **Do not** close Bucket B until Johnny confirms HITL done (especially #2 parent after #5 verify).
2. **Do not** bulk-close Bucket A without a one-line comment citing merge SHA + Linear Done id.
3. Prefer Linear→GitHub sync closing magic after PRs that already merged (retroactive comment is fine); avoid agent `gh issue close` spam.
4. **#37:** keep open *or* close-as-documented with note that Hive remains product-blocked — either is fine; do not reopen coding for Hive while repo stays public.
5. **#34 / #35:** closing the GH facet must **not** be read as “live Port remount done.”

---

## Recommended morning order (outside closes)

1. Funnel (or durable host) → `GET /health` from non-tailnet → set `FACTORY_GATEWAY_BASE_URL`
2. Remount only the admit/notify WEBHOOK + SS secrets (per port-workflow-webhooks checklist)
3. Confirm Dev OS Port OAuth login
4. Optional: Johnny Edit Link for #7 / STL-182; Loop verify #5
5. Tracker pass: comment+close Bucket A facets

---

## Inventory (complete open set)

```text
#2  FE-61 Linear auto-review          Factory Meta          HITL parent
#5  Optional Loop first-pass          Factory Meta          HITL optional
#6  Code & reviews + Autolink         Factory Meta          HITL nice
#7  painter-os Issues Sync retarget   Factory Meta          HITL soft
#8  Expand Linear review pool apps    Factory Meta          defer
#26 Meta Beads Dolt bootstrap         Factory Meta Feature  stale (PR #24)
#32 catalogVersion blueprints         Factory Meta Feature  stale (PR #27)
#34 factory_* WEBHOOK prove           Meta+launch           stale code; remount ops
#35 Meta SS handlers                  Factory Meta Feature  stale (PR #33)
#36 Ocean/MCP Meta fence              Factory Meta Feature  stale (PR #29)
#37 Vercel CI Hive public blocker     launch+blocked-ext    docs done; Hive external
```

**Open PR count:** 0.
