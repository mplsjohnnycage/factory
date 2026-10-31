# Factory Meta — Claude Code handoff

> **SoT resume (2026-10-29 evening):** [`multi-agent-handoff.md`](./multi-agent-handoff.md) — Orca / OpenCode / Codex / Antigravity / Cursor / Grokbot.  
> **Orca one-block paste:** [`orca-resume-paste.md`](./orca-resume-paste.md).  
> Prefer those for Queued FE (181…183 · 189 · 198 · 199), `main` tip `42fa340` (#98–#104), Funnel live, `STOP_CLOUD_KITS`, author≠reviewer / collab APPROVE / `meta-ci-presence`, and merge playbook.  
> This Claude export remains useful for OAuth/Port history only; sections claiming desktops offline / open FE-128 / pre-#98 `main` tip are **stale**.

**Exported:** 2026-10-29 ~03:27 America/Chicago · **pointer refresh** post-#104 Providers  
**Audience:** Johnny Cage continuing Factory Meta in **Claude Code** if Cursor quota dies  
**Repo:** https://github.com/mplsjohnnycage/factory (**PUBLIC** — never flip private)  
**Project store:** `/cursor/stores/self/` (same mount as `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/`)  
**Do not re-ask** decisions already locked below. No secrets/tokens in this file.  
**Desktop status (at export):** Johhny-NET + DESKTOP-3APDBKG **offline** — superseded: Funnel `/health` **PASS** on `https://desktop-3apdbkg.taildf3a4b.ts.net` — see [`desktop-live-checks-tick.md`](./desktop-live-checks-tick.md) + [`multi-agent-handoff.md`](./multi-agent-handoff.md).

---

## 1. What this Project is

| Concept | Meaning |
|---------|---------|
| **Factory Meta** | Building the Factory itself — kernel Specs/ADRs, seed PBIs, Meta Beads, Port control plane, Dev OS, gateway. Lane = **Meta only**. |
| **Factory Product** | What Factory does when it builds *user* projects. **Never blur** Meta ↔ Product (boards, Beads instances, repos). |
| **Repo** | `mplsjohnnycage/factory` — public GitHub; all-rights-reserved LICENSE on `main`. |
| **Control plane** | **Port EU Single-MCP** — `https://mcp.port.io/v1` is the *only* Factory control-plane MCP entry (ADR-001 · master §18.5 · OpenMCP). |
| **Dev OS** | Next.js on Vercel project `factory-developer-os` — display + Port OAuth BFF + Rivet stream client. **Not** a second MCP runtime. |
| **Master SoT** | `/cursor/stores/self/docs/factory-master-spec.md` lives in the **Project store** (not a full copy in the repo). Repo has pointers/specs derived from it. Assemble-first lead **already applied** store-side (FE-125). |

**One sentence:** Meta = construct Factory; Product = Factory constructs other software.

---

## 2. Hard invariants / preferences

From `/cursor/stores/self/preferences.md` + Johnny locks in notes/docs:

| Rule | Detail |
|------|--------|
| **Author ≠ reviewer** | PR implementer/author agent is **excluded** from review. Use Codex, Linear, OpenCode, or a **fresh** Cursor/Claude session — never the author session. |
| **Auto models** | Use **auto** (omit model) for independent reviews and implementing/authorship. |
| **No Linear→Cursor coding delegate** | Do **not** delegate Linear Factory Meta issues to the Cursor Linear integration for implementation. Drive coding via Project workers / Claude Code / pool review. |
| **Fresh branches from `main`** | Never hard-code working branch names in PBI/Linear text. Implementer creates a fresh branch from current `main`. Never “fix” missing branches with empty placeholder remotes. |
| **Public repo** | Stay public. Do not flip private (does not unlock Hive CI or gateway hosting). |
| **Port Single-MCP** | All privileged Factory control routes through Port remote MCP. Dev OS is client/BFF. Factory MCP Apps (post-M1) sit behind Port RBAC — do **not** host control-plane MCP in App Router. |
| **No Observatory OAuth** | Delete/ignore obsolete Observatory External Interface apps. Keep **only** live Factory OAuth app. Revoke alone is not enough if Johnny still sees the old app. |
| **Formal APPROVE** | `main` protection needs write-access APPROVE. Collab `skysthelimitpainting1779-collab` has write. COMMENT “APPROVE” does **not** count. Do not drop `required_approving_review_count` to 0. |
| **CI gate** | `main`: PR + 1 approval + green **`meta-ci-presence`**. |
| **PBI-015 hold** | CE compound writeback held until human `/ce-compound` **and** gateway remount go — not morning-critical coding. |
| **No Port OAuth create/delete** from agents unless Johnny explicitly authorizes Meta ops (already done for Factory create + Observatory revoke). |
| **No dual-write** Port catalog outside §4.2.1 `factory-gateway`. |
| **No browser→Sandbox Agent**. |
| **Never remount** live WEBHOOKs onto a dead `FACTORY_GATEWAY_BASE_URL` (FE-106). |

---

## 3. Live systems snapshot

### GitHub

| Item | Value |
|------|-------|
| Repo | https://github.com/mplsjohnnycage/factory |
| Visibility | **PUBLIC** |
| `main` tip | `b489d2c` (OAuth pin [#42](https://github.com/mplsjohnnycage/factory/pull/42) merge commit) |
| Morning Meta PRs | **#39 #40 #41 #42 MERGED** — OpenAccess redirects, remount dry-run kit, gateway Dockerfile, OAuth hard-pin |
| Open Meta PRs | None from this morning board |
| Branch protection | PR + 1 write APPROVE + `meta-ci-presence` |
| Pilot desktops | **Offline** (Johhny-NET, DESKTOP-3APDBKG) — Funnel/human login blocked on Johnny |

### Vercel — Developer OS

| Item | Value |
|------|-------|
| Team | `johnnyc` |
| Project | `factory-developer-os` (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`) |
| Stable URL | `https://factory-developer-os.vercel.app` |
| Env pin | `NEXT_PUBLIC_DEVOS_URL=https://factory-developer-os.vercel.app` (id `ySZHzGmEbWZPoL5J`) on production + preview + development |
| Role | Shell / Port OAuth BFF / Rivet stream — **not** factory-gateway |

### Port — Factory External Interface (OAuth)

| Field | Value |
|-------|--------|
| Name | `Factory` |
| App id | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` |
| Client id | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| Org | `mplsjohnnycage` / `org_rNq4tjSc8DXL1ceL` |
| Auth | Public/PKCE (no client secret for humans) |
| Observatory | **Absent** (revoked id `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP`) |

**Canonical callback path:** `/api/auth/callback`  
(login starts at `/api/auth/port/login` — callback is **not** under `/port/`)

**Stable redirect (keep):**  
`https://factory-developer-os.vercel.app/api/auth/callback`  
+ localhost / 127.0.0.1 `:3000/api/auth/callback`

**OAuth diagnosis (FE-119/120/127/128):** Failure host `factory-developer-4vf3fb75w-johnnyc.vercel.app` = **same** Factory client minting `VERCEL_URL`-based `redirect_uri` from a stale deploy — **not** a second Port app. “Port Production EU” on Auth0 error page is branding. Permanent fix = [#42](https://github.com/mplsjohnnycage/factory/pull/42) hard-pin — **MERGED** @ `b489d2c`. FE-128 stable-alias curl still PASS post-merge. Human Sign in with Port + prune temp `n5tdoht4l` URI = **blocked on Johnny** (desktops offline); **do not prune** this run. FE-128 stays open.

### Port MCP / Ocean

| Surface | Live |
|---------|------|
| Sole exposed MCP connector | `port-eu-mcp` → `https://mcp.port.io/v1` (`exposed: true`) |
| `_mcp_server` registry | 13 entities; 12 vendor/US rows `exposed: false` (metadata only) |
| Ocean installs | `github-ocean`, `factory-pilot-github`, `linear`, `vercel-ocean`, `convex-ocean` — catalog sync **≠** MCP connectors |
| `factory_*` tools | **7/7** present as self-service triggers |

### Port WEBHOOKs (critical)

| Check | Result |
|-------|--------|
| `factory_*` WEBHOOK hosts | **7/7 still on `https://api.port.io/...`** (fencing GETs/search) |
| Gateway hops | **0** |
| Meta SS `ss_convex_*` | Already templated → `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/handlers/self-service` — secret unused until Funnel |

### factory-gateway

| Item | Status |
|------|--------|
| Code | On `main` (`apps/factory-gateway`) — `/health`, `/webhooks/port/<factory_*>`, `/handlers/self-service` |
| Public HTTPS URL | **None** yet — remount **armed**; wait for Johnny public `/health` |
| Recommended path | Tailscale **Funnel** → local `:8787` on Muse/operator desktop (both desktops offline now) |
| Remount dry-run kit | **Merged [#40](https://github.com/mplsjohnnycage/factory/pull/40)** — `scripts/gateway-remount-dry-run.mjs` (mock OK; no Port mutate) |
| Dockerfile | **Merged [#41](https://github.com/mplsjohnnycage/factory/pull/41)** — optional PaaS later; Funnel still M1 path |
| Cloud VMs | **Cannot** Funnel (no Tailscale/Docker) |

### Meta Beads

| Item | Status |
|------|--------|
| Hybrid Dolt | Seeded via PR #24; `bd bootstrap --yes` on clone |
| Ready beads | 3 ops beads (`factory-r9f`, `factory-w3n`, `factory-cvl`) — **not** coding PBI admits |
| Live coding admit | **NO** without Port bypass — `BdMetaBeads` class missing (`factory-cvl`); supervisor Memory-only |

---

## 4. Merged PRs / done Meta

### Seed PBIs on `main`

| PBI | PR | Topic |
|-----|-----|-------|
| 001 | [#1](https://github.com/mplsjohnnycage/factory/pull/1) | Spec stubs |
| 002 | [#10](https://github.com/mplsjohnnycage/factory/pull/10) | Full Nygard ADR-001…011 |
| 003 | [#11](https://github.com/mplsjohnnycage/factory/pull/11) | OpenStack agents pack |
| 004 | [#12](https://github.com/mplsjohnnycage/factory/pull/12) | Rivet Compose |
| 005 | [#13](https://github.com/mplsjohnnycage/factory/pull/13) | factory-gateway |
| 006 | [#14](https://github.com/mplsjohnnycage/factory/pull/14) | Sandbox harness Claude M1 |
| 007 | [#15](https://github.com/mplsjohnnycage/factory/pull/15) | ProjectSupervisor + Meta Beads |
| 008 | [#16](https://github.com/mplsjohnnycage/factory/pull/16) | Developer OS shell |
| 009 | [#18](https://github.com/mplsjohnnycage/factory/pull/18) | Rivet realtime Dev OS |
| 010 | [#19](https://github.com/mplsjohnnycage/factory/pull/19) | OpenAccess / OpenMCP well-knowns |
| 011 | [#20](https://github.com/mplsjohnnycage/factory/pull/20) | CI accept SHA |
| 012 | [#21](https://github.com/mplsjohnnycage/factory/pull/21) | OpenFleet ceilings |
| 013 | [#22](https://github.com/mplsjohnnycage/factory/pull/22) | Local gate |
| 014 | [#23](https://github.com/mplsjohnnycage/factory/pull/23) | OpenPRD 0001–0005 |

Seed docs still labeled “DEFERRED-012-015” are **stale for 012–014** — prefer Linear Done + merged PRs. **015** remains HITL deferred.

### Notable follow-on Meta PRs

| PR | Topic |
|----|-------|
| [#17](https://github.com/mplsjohnnycage/factory/pull/17) | Meta CI presence + accept-SHA foundation |
| [#24](https://github.com/mplsjohnnycage/factory/pull/24) | Meta Beads Dolt bootstrap |
| [#25](https://github.com/mplsjohnnycage/factory/pull/25) | Vercel CI Turborepo tags (Hive still blocked while public) |
| [#27](https://github.com/mplsjohnnycage/factory/pull/27) | Port Meta blueprints (`catalogVersion`) |
| [#28](https://github.com/mplsjohnnycage/factory/pull/28) | Port WEBHOOK → gateway path (in-repo prove; live remount pending Funnel) |
| [#29](https://github.com/mplsjohnnycage/factory/pull/29) | Ocean/MCP Meta write fencing |
| [#30](https://github.com/mplsjohnnycage/factory/pull/30) | Port OAuth PKCE e2e Dev OS |
| [#33](https://github.com/mplsjohnnycage/factory/pull/33) | Meta self-service handlers via gateway |
| [#38](https://github.com/mplsjohnnycage/factory/pull/38) | Referenced as PBI-015 readiness (FE-115) — confirm live state; coding for 015 still **held** |
| [#42](https://github.com/mplsjohnnycage/factory/pull/42) | OAuth redirect hard-pin (`57dd`) — **MERGED** → `b489d2c` |
| [#41](https://github.com/mplsjohnnycage/factory/pull/41) | Gateway Dockerfile — **MERGED** |
| [#40](https://github.com/mplsjohnnycage/factory/pull/40) | Gateway remount dry-run kit — **MERGED** |
| [#39](https://github.com/mplsjohnnycage/factory/pull/39) | OpenAccess stable Dev OS redirect — **MERGED** |

### Done Project tasks (high-signal FE-* from notes)

FE-125 assemble-first applied · FE-123 Single-MCP live PASS · FE-124 Funnel ops (cloud cannot) · FE-120 stable Dev OS URL env · FE-113/119 OAuth HTTPS + callback diagnosis · FE-114 gateway public URL path · FE-106…111 Port/Ocean wave · FE-88…94 PBI-011…014 merge wave · FE-59/85 Factory OAuth live / Observatory delete · FE-1…58 research/spec foundation.

Full condensed list → **§10 Appendix**.

---

## 5. Open work NOW

Mirror of `/cursor/stores/self/notes.md` active rows + morning blockers.  
Ops tick: `/cursor/stores/self/docs/offline-desktop-ops-tick.md`.

### For Review

| ID | Task | Doc |
|----|------|-----|
| **FE-129** | Muse Funnel then Port WEBHOOK remount — **armed**; both desktops offline; wait for Johnny public `/health` | `/cursor/stores/self/docs/funnel-remount-status.md` |

### In Progress

| ID | Task | Doc / agent |
|----|------|-------------|
| **FE-128** | Live prod OAuth verify (stable alias) — curl PASS post-#42; human login + prune **blocked on Johnny**; FE-128 stays open | `/cursor/stores/self/docs/fe-128-oauth-prod-verify.md` |
| **FE-122** | Morning parallel sprint ~10–11am CT — paused (desktops offline) | `/cursor/stores/self/docs/morning-parallel-sprint.md` |

### Done this morning (merged)

| ID / PR | Note |
|---------|------|
| **FE-127** / [#42](https://github.com/mplsjohnnycage/factory/pull/42) | OAuth hard-pin on `main` @ `b489d2c` |
| [#39](https://github.com/mplsjohnnycage/factory/pull/39) | OpenAccess stable redirects |
| [#40](https://github.com/mplsjohnnycage/factory/pull/40) | Gateway remount dry-run kit |
| [#41](https://github.com/mplsjohnnycage/factory/pull/41) | Gateway Dockerfile |

### Morning critical path (~10–11am America/Chicago)

1. **Johnny:** bring desktop online → Tailscale Funnel (or PaaS) → public `FACTORY_GATEWAY_BASE_URL` + `/health` 200 off-tailnet — **confirm URL before remount**  
2. **Port WEBHOOK remount** only after (1) — agents: **additive notify** nodes only; keep fencing GETs on `api.port.io`  
3. **Human Sign in with Port** on stable alias → then (and only then) prune `n5tdoht4l` — **not this run**  
4. **Beads → supervisor** (`BdMetaBeads`) or audited Port bypass — else no coding admit  
5. Desktop Rivet if VM cannot Compose  
6. **PBI-015** HITL still deferred — **do not start** until remount green + Johnny `/ce-compound`  

Board: `/cursor/stores/self/docs/morning-parallel-sprint.md`  
Gap map: `/cursor/stores/self/docs/m1-morning-gap-map.md`  
Issues triage (no GH issue blocks ship): `/cursor/stores/self/docs/open-issues-morning-triage.md`

### Landed morning workers (PRs merged / audits done)

| Track | Agent id |
|-------|----------|
| Gateway Dockerfile PR | `bc-00107faf-0d7d-5d6e-bad9-eae7a474acc0` → **#41 merged** |
| OpenAccess redirects PR | `bc-b72d1edc-748d-5fb6-a949-365f5995e904` → **#39 merged** |
| Remount dry-run kit | `bc-5dba8e26-5ac1-5695-a948-938543c7273f` → **#40 merged** |
| OAuth hard-pin | `bc-599afc58-68b9-5bc9-a71f-a597660457dd` → **#42 merged** |
| M1 gap map | `bc-26ab8119-c3b5-59a9-93af-d93f08c6645d` |
| Rivet compose VM | `bc-13b00e32-29fe-584b-9995-15788680c465` |
| Sandbox harness audit | `bc-2f67e149-b5d4-5f5a-b6d2-c0ac8b05bcbf` |
| ProjectSupervisor audit | `bc-66cfc00b-cc13-5ad1-b36b-cf030db50a3f` |

---

## 6. How to continue the coding loop

### Loop shape (locked)

`task → standardize → PR → build → loop`  
(Derived: `/cursor/stores/self/docs/factory-coding-loop.md` ← master §0.4)

### Process

1. Pick next unit (PBI ≡ typed contract ≡ Linear ≡ bead ≡ GH issue — **one unit, five names**).  
2. Standardize against Spec/Contract + assemble-first (master §0.0 / §4.2.2).  
3. Fresh branch from **current `main`**. Open PR early.  
4. Local gate + CI on PR SHA; `meta-ci-presence` must green.  
5. **Independent review** (author ≠ reviewer). Formal write APPROVE from collab or human.  
6. Merge; loop.

### Next / deferred coding

| PBI | Status | Action |
|-----|--------|--------|
| 001–014 | Merged on `main` | Do not re-author |
| **015** CE compound writeback | **HITL hold** | Start only after Johnny flags `/ce-compound` **and** gateway remount is green enough; fresh branch from then-`main` |
| Follow-ons | Ops-first | Funnel remount, `BdMetaBeads` (`factory-cvl`), Rivet Serve, Sandbox live host — see gap map G1–G10 |

### CI / merge

- Required check: **`meta-ci-presence`**  
- Vercel Hive CI remains **product-blocked** while repo public — keep GHA; do not flip private for Hive  
- Formal APPROVE from write collaborator (`skysthelimitpainting1779-collab`) or Johnny  

### Do not

- Linear→Cursor issue-delegate for implementation  
- Self-review / author-session re-review  
- Port OAuth app create/delete/revoke without Johnny  
- Remount WEBHOOKs before public `/health`  
- Dual-write catalog outside gateway §4.2.1  

---

## 7. Exact Muse / Johnny steps (Funnel → remount)

**Source of truth:** `/cursor/stores/self/docs/funnel-remount-status.md` — do not invent. Summary:

### A — Gateway on pilot host (Tailscale logged in, Node 20+, `main` ≥ `b489d2c`)

```bash
cd /path/to/factory/apps/factory-gateway
git fetch origin main && git checkout main && git pull
export PORT_CLIENT_SECRET='…'
export FACTORY_GATEWAY_HANDLER_TOKEN='…'
export CONVEX_TEAM_TOKEN='…'   # ss_convex_* only
npm ci && npm start            # 0.0.0.0:8787
curl -fsS http://127.0.0.1:8787/health
# → {"ok":true,"service":"factory-gateway"}
```

### B — Funnel (public), not Serve-only

```bash
tailscale funnel 8787
# or: tailscale funnel --bg 8787
tailscale funnel status
```

Record base URL **without** trailing slash.

### C — Prove from non-tailnet

```bash
curl -fsS "https://<hostname>.<tailnet>.ts.net/health"   # must 200
```

### D — Port secrets (UI/MCP secrets — **no** OAuth app create)

| Port secret | Value |
|-------------|-------|
| `FACTORY_GATEWAY_BASE_URL` | Funnel URL, no trailing slash |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | Same as gateway env |
| Classic webhook / EI client secret | Match gateway `PORT_CLIENT_SECRET` |

### E — Remount

- **SS:** `ss_convex_*` already templated — set secrets then smoke.  
- **`factory_*`:** **Add** synchronized notify/admit WEBHOOK after lease/write →  
  `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<factory_*>`  
  with HMAC. **Do not** replace fencing GETs on `api.port.io`.

Canonical workflow ids:

```
factory_create_execution_contract
factory_start_delivery_run
factory_claim_next_job
factory_heartbeat
factory_submit_evidence
factory_record_review_verdict
factory_request_release
```

### Smoke

| Probe | Expect |
|-------|--------|
| `GET {BASE}/health` | 200 |
| SS → `/handlers/self-service` | 2xx; bad bearer → 401 |
| Admit WEBHOOK → `/webhooks/port/factory_*` | **202**; bad HMAC → **401** |

Funnel ≠ auth. HMAC + bearer still required.

Full detail: `/cursor/stores/self/docs/funnel-remount-status.md` · URL options: `/cursor/stores/self/docs/factory-gateway-public-url.md`

---

## 8. Decisions already made (do not re-ask)

| Decision | Locked answer |
|----------|---------------|
| Where is Factory control-plane MCP? | **Port** `mcp.port.io/v1` — not Dev OS App Router |
| Dev OS role? | Client / BFF / display / Rivet stream — **not** MCP runtime |
| Factory MCP Apps? | Behind Port RBAC; post-M1; no empty scaffold now |
| Assemble-first master lead? | **Applied** in Project store SoT (FE-125); **no** GitHub PR required for master |
| Master SoT location? | Project store `docs/factory-master-spec.md` — repo has Specs/pointers |
| OAuth mismatch “second app”? | **Same** Factory EI client; ephemeral `VERCEL_URL` host — pin stable origin |
| Callback path? | `/api/auth/callback` (not `/api/auth/port/callback`) |
| Observatory? | Revoked; never reconfigure as Factory client |
| Repo visibility? | Stay **public** |
| Gateway on Vercel / hitchhike Dev OS? | **No** as-is; Funnel first; PaaS/Dockerfile optional later |
| Remount before Funnel health? | **Forbidden** |
| PBI-012…014 deferred seed labels? | **Stale** — merged; only **015** still HITL deferred |
| Who reviews merges? | Non-author + write APPROVE |
| Linear coding delegate? | **Forbidden** — Project workers / Claude Code |
| Ocean vs MCP? | Ocean = catalog sync; not MCP connectors |
| Vendor `_mcp_server` rows? | Keep `exposed: false` unless explicit ops + RBAC |
| Meta XOR Product? | Never Both; separate Beads instances |
| Unit of work? | PBI ≡ typed contract ≡ Linear ≡ bead ≡ GH issue (19 fields) |

---

## 9. Agent / store map

### Stores

| Path | Role |
|------|------|
| `/cursor/stores/self/` | **Current Project store** (notes, preferences, docs, internal, media) |
| `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/` | Same Project store (symlink target / older absolute links in notes) |

Prefer `/cursor/stores/self/docs/…` going forward. Older notes links to `bc-72015999-…/docs/` usually resolve to the same files.

### Key docs (absolute)

| Purpose | Path |
|---------|------|
| Task tracker | `/cursor/stores/self/notes.md` |
| Preferences | `/cursor/stores/self/preferences.md` |
| Master SoT | `/cursor/stores/self/docs/factory-master-spec.md` |
| This handoff | `/cursor/stores/self/docs/claude-code-handoff.md` |
| Morning board | `/cursor/stores/self/docs/morning-parallel-sprint.md` |
| Funnel checklist | `/cursor/stores/self/docs/funnel-remount-status.md` |
| Offline desktop ops tick | `/cursor/stores/self/docs/offline-desktop-ops-tick.md` |
| FE-128 OAuth verify | `/cursor/stores/self/docs/fe-128-oauth-prod-verify.md` |
| Gateway URL | `/cursor/stores/self/docs/factory-gateway-public-url.md` |
| OAuth pin | `/cursor/stores/self/docs/port-oauth-redirect-pin.md` |
| Stable URL env | `/cursor/stores/self/docs/devos-stable-oauth-url.md` |
| Single-MCP | `/cursor/stores/self/docs/mcp-port-single-fanout.md` |
| MCP live verify | `/cursor/stores/self/docs/mcp-connector-live-verify.md` |
| WEBHOOK audit | `/cursor/stores/self/docs/port-factory-workflows-live.md` |
| Beads morning | `/cursor/stores/self/docs/beads-morning-ready.md` |
| Backlog map | `/cursor/stores/self/docs/meta-backlog-remaining.md` |
| Gap map | `/cursor/stores/self/docs/m1-morning-gap-map.md` |

### Active / recent agents (from docs)

| Role | Id / note |
|------|-----------|
| Dev OS stable URL env | `bc-25b649a6-5a55-5473-b8cc-9f43936781e8` |
| OAuth redirect pin | `bc-599afc58-68b9-5bc9-a71f-a597660457dd` · branch `cursor/port-oauth-redirect-pin-57dd` |
| Gateway Dockerfile | `bc-00107faf-0d7d-5d6e-bad9-eae7a474acc0` · PR #41 |
| Assemble-first apply | `bc-ed70a4cb-5786-5fd9-984c-3ed87d5f5a6b` / status `bc-b28b7b26-28b8-53f2-941a-bf3bf20dce90` |
| Beads morning | `bc-399dadb1-09a3-53f2-824a-501c685bb8ea` |
| Live MCP connectors | `bc-fce93993-4a04-50ee-84b1-310c5ed5d17f` |

Coordinator owns `notes.md` status flips. Workers write `docs/` + `internal/`.

### GitHub / Port identity (non-secret)

- GitHub: `mplsjohnnycage/factory`  
- Port org: `mplsjohnnycage` · Johnny Admin for MCP reads  
- Linear team: Factory Meta (STL-162…183 adjacent)  
- Collab reviewer: `skysthelimitpainting1779-collab` (write APPROVE)

---

## 10. Appendix

### A. Condensed notes.md task list

#### For Review
- FE-129 Muse Funnel then Port WEBHOOK remount (armed; desktops offline) → `docs/funnel-remount-status.md`

#### In Progress
- FE-128 Prod Port OAuth live verify — curl PASS; human login + prune blocked on Johnny  
- FE-122 Morning parallel sprint ~10–11am CT (paused)  

#### Done (this morning)
- FE-127 / #42 OAuth redirect hard-pin → `main` @ `b489d2c`  
- #39 OpenAccess · #40 remount dry-run · #41 gateway Dockerfile  


#### Done (FE-125 → FE-1 condensed)

| Range | Highlights |
|-------|------------|
| FE-125…120 | Assemble-first apply; Funnel ops report; MCP live verify; issues triage; App Router MCP Q; stable Dev OS URL |
| FE-119…112 | OAuth callback mismatch; remount checklist; gateway public URL; open PR sweep; OAuth HTTPS; painter-os retarget; Ocean unmap; Vercel CI |
| FE-111…104 | Ocean write fencing #29; Port SS #33; Port OAuth #30; Linear auto-review; Port WEBHOOK #28; Meta blueprints #27 |
| FE-103…94 | Port prep inventory; Beads Dolt #24; PBI-014 #23; CI protect verify; backlog map; Beads/Port auth status |
| FE-93…80 | Vercel CI today; PBI-012/013; branch-name scrub; PBI-011 merge; Observatory delete; CI protection; PBI-010…009 |
| FE-79…60 | PBI-008…001 coding loop + independent reviews; CI accept path; Meta Beads scaffold; Factory OAuth live |
| FE-59…40 | OAuth cutover; Notion mirror; spec remaster; capability matrix; Meta vs Product; research reconcile; workflow/coding-loop; EGM/spec canvas |
| FE-39…20 | Spec/UI/Port fencing; Linear MCP Apps; EGM runs; Port/Rivet capacity; open standards; Convex models; OSS analogs; skills inventory |
| FE-19…1 | Diamond/compound; master spec; stack audits; Goldfish/Elephant; claims verify; Rivet sandbox; LogicSRC; ISO 12207; Port drop Clerk; Rivet eng spec |

#### Canceled
- FE-52 Halt premature plugin · FE-14 Replace Observatory (superseded) · FE-11 Create dedicated OAuth (superseded by FE-59)

### B. Doc inventory (`/cursor/stores/self/docs/`)

One-line purpose each (filename relative to `docs/`).

| File | Purpose |
|------|---------|
| `assemble-first-apply-plan.md` | Plan to paste assemble-first lead into master (A–D blocks) |
| `assemble-first-apply-status.md` | FE-125 status — store SoT already has assemble-first |
| `assemble-first-lead-applied.md` | Sibling evidence that A–D landed in master |
| `assemble-first-master-lead-draft.md` | FE-108 draft paste blocks |
| `assemble-first-status.md` | Pre-apply status check |
| `beads-morning-ready.md` | Morning Beads admit readiness — coding admit = NO |
| `beads-setup-status.md` | Earlier Beads setup partial |
| `ci-morning-check.md` | Morning CI accept-on-SHA green |
| `ci-protection-live-verify.md` | Live branch protection + meta-ci-presence |
| `convex-components-data-models.md` | Convex component data model survey |
| `devos-oauth-morning-smoke.md` | Morning Dev OS OAuth smoke PASS |
| `devos-stable-oauth-url.md` | FE-120 `NEXT_PUBLIC_DEVOS_URL` pin |
| `diamond-compound-cross-plugin.md` | Cross-plugin diamond/compound sweep |
| `diamond-compound-engineering.md` | Diamond + compound engineering lookup |
| `egm-master-spec-run.md` | EGM run on master spec |
| `egm-nits-n1-n9-fixes.md` | EGM nits N1–N9 fixes |
| `egm-skill-leverage-loop.md` | EGM skill leverage loop |
| `factory-agent-capability-matrix.md` | Agent capability/cost matrix |
| `factory-agents-md.staged.md` | Staged AGENTS.md content |
| `factory-architecture-map.md` | Meta vs Product architecture map (derived) |
| `factory-builder-plugin/README.md` | Factory builder plugin (halted FE-52) |
| `factory-builder-plugin/install.md` | Plugin install notes |
| `factory-builder-plugin/quality-gates.md` | Plugin quality gates |
| `factory-ci-setup-check.md` | Factory CI / branch protection setup |
| `factory-claims-verification.md` | Evidence-verify ten Factory claims |
| `factory-coding-loop.md` | Five-step coding loop (derived) |
| `factory-gateway-public-url.md` | Options for public gateway HTTPS; Funnel recommended |
| `factory-master-spec-linked-docs.md` | Docs linked from master |
| `factory-master-spec.md` | **Canonical SoT** — architecture, ADRs, PBIs, gates |
| `factory-meta-setup-status.md` | Meta Linear seed + repo scaffold status |
| `factory-meta-vs-product.md` | Hard Meta XOR Product separation (derived) |
| `factory-open-standards.md` | Factory-relevant open standards catalog |
| `factory-oss-analogs.md` | OSS Factory analogs survey |
| `factory-research-300-qa.md` | ~300 research Q&A pack |
| `factory-research-reconciliation.md` | Research ↔ docs reconciliation |
| `factory-skill-leverage.md` | Skills applied to master |
| `factory-spec-remaster-report.md` | Spec remaster report |
| `factory-stack-audit.md` | Full stack audit (Next/Vercel/AG-UI/…) |
| `factory-stack-gap-solutions.md` | Stack open-gap solutions |
| `factory-verify.html` | HTML visual verifier / cockpit |
| `factory-workflow.md` | Standardized Factory workflow (derived) |
| `funnel-remount-status.md` | FE-124 Funnel + remount Muse checklist |
| `goldfish-elephant-install.md` | Goldfish/Elephant skills install |
| `infinity-stack-fit.md` | Infinity stack fit eval |
| `iso-12207-overview.md` | ISO/IEC/IEEE 12207 overview |
| `linear-auto-review-next.md` | Linear auto-review click path next |
| `linear-auto-review-setup.md` | Linear auto-review setup |
| `linear-factory-task-manager.md` | Linear as Factory task manager eval |
| `linear-github-painter-os-retarget.md` | painter-os → factory retarget |
| `linear-mcp-apps-verify.md` | Linear MCP Apps existence verify |
| `linear-pbi-seed/README.md` | Seed PBI pack index (partially stale on 012–014) |
| `linear-pbi-seed/DEFERRED-012-015.md` | Deferred note — **stale for 012–014** |
| `linear-pbi-seed/PBI-001-spec-stubs.md` | Seed body PBI-001 |
| `linear-pbi-seed/PBI-002-full-adrs.md` | Seed body PBI-002 |
| `linear-pbi-seed/PBI-003-openstack-agents.md` | Seed body PBI-003 |
| `linear-pbi-seed/PBI-004-rivet-compose.md` | Seed body PBI-004 |
| `linear-pbi-seed/PBI-005-factory-gateway.md` | Seed body PBI-005 |
| `linear-pbi-seed/PBI-006-sandbox-claude.md` | Seed body PBI-006 |
| `linear-pbi-seed/PBI-007-supervisor-beads.md` | Seed body PBI-007 |
| `linear-pbi-seed/PBI-008-devos-shell.md` | Seed body PBI-008 |
| `linear-pbi-seed/PBI-009-rivet-realtime.md` | Seed body PBI-009 |
| `linear-pbi-seed/PBI-010-openaccess-openmcp.md` | Seed body PBI-010 |
| `linear-pbi-seed/PBI-011-ci-accept-sha.md` | Seed body PBI-011 |
| `linear-pbi-seed/PBI-012-openfleet-ceilings-DEFERRED.md` | Seed — merged despite name |
| `linear-pbi-seed/PBI-013-local-gate-DEFERRED.md` | Seed — merged despite name |
| `linear-pbi-seed/PBI-014-openprd-batch-DEFERRED.md` | Seed — merged despite name |
| `linear-pbi-seed/PBI-015-compound-writeback-DEFERRED.md` | Seed — still HITL deferred |
| `linked-pack-ir-check.md` | Linked pack + IR presence check |
| `logicsrc-artifact-inventory.md` | LogicSRC artifact inventory |
| `logicsrc-monorepo.md` | LogicSRC monorepo notes |
| `logic-src-overview.md` | Logic SRC resource overview |
| `loop-development-tick.md` | Latest coding-loop tick (morning ship) |
| `loop-tick-bc591-*.md` | Earlier loop tick snapshots |
| `loop-tick-bc591-standdown.md` | Loop stand-down note |
| `m1-morning-gap-map.md` | Vertical-slice gap map G1–G21 |
| `mcp-connector-live-verify.md` | FE-123 live `_mcp_server` / Single-MCP PASS |
| `mcp-port-single-fanout.md` | FE-122 Single-MCP fan-out closed |
| `meta-backlog-remaining.md` | Remaining Meta backlog map |
| `meta-beads-dolt-independent-review.md` | Independent review Beads Dolt |
| `meta-beads-dolt-setup.md` | FE-102 Beads Dolt setup |
| `meta-beads-scaffold.md` | Meta Beads hybrid scaffold |
| `morning-parallel-sprint.md` | FE-122 morning board + blockers |
| `notion-factory-mirror.md` | Notion mirror of Factory plans |
| `ocean-mcp-write-fencing.md` | Ocean/MCP write fencing summary |
| `ocean-mcp-write-fencing-independent-review.md` | Independent review fencing |
| `ocean-meta-unmap.md` | Unmap Ocean from Meta-fenced blueprints |
| `offline-desktop-ops-tick.md` | Ops tick while Johnny desktops offline; remount armed |
| `openaccess-linkage-smoke.md` | OpenAccess linkage smoke |
| `open-issues-morning-triage.md` | Open GH issues triage — none block ship |
| `open-pr-sweep.md` | Open PR sweep — 0 Meta open (pre-#41) |
| `pbi-001-independent-review.md` | IR PBI-001 |
| `pbi-001-merge-pbi-002-start.md` | Merge 001 start 002 |
| `pbi-003-independent-review.md` … `pbi-014-independent-review.md` | Independent reviews per PBI |
| `pbi-011-independent-rereview.md` | Re-review PBI-011 |
| `pbi-012-015-branch-fix.md` | Correct branch policy for deferred PBIs |
| `pbi-ci-accept-path-independent-review.md` | IR CI accept path |
| `port-auth-linkage-status.md` | Port auth linkage check |
| `port-capabilities.md` | Port capabilities; drop Clerk |
| `port-factory-data-model.md` | Native-first Port Factory data model |
| `port-factory-oauth-live.md` | Live Factory EI OAuth record |
| `port-factory-workflows-live.md` | Live `factory_*` WEBHOOK targets still api.port.io |
| `port-full-capacity.md` | Port full capacity from docs |
| `port-meta-blueprints.md` | Port Meta blueprints upsert summary |
| `port-meta-blueprints-independent-review.md` | IR Meta blueprints |
| `port-oauth-delete-status.md` | Observatory delete / Factory keep |
| `port-oauth-e2e-independent-review.md` | IR Port OAuth e2e |
| `port-oauth-https-done.md` | HTTPS redirects + live login done |
| `port-oauth-redirect-pin.md` | Permanent code pin vs VERCEL_URL |
| `port-prep-inventory.md` | Port Context Lake / Ocean prep inventory |
| `port-redirect-uri-hygiene.md` | Recommend drop ephemeral redirect URIs |
| `port-ss-handlers.md` | Meta self-service handlers summary |
| `port-ss-handlers-independent-review.md` | IR SS handlers |
| `port-workflow-webhooks.md` | Port WEBHOOK → gateway contract |
| `port-workflow-webhooks-independent-review.md` | IR WEBHOOK path |
| `pr-morning-sweep.md` | Morning open PR sweep |
| `rivet-claim-fencing.md` | Rivet claim fencing + Port→Rivet path |
| `rivet-compose-vm-smoke.md` | Rivet Compose VM smoke attempt |
| `rivet-engineering-spec.md` | Rivet platform engineering spec |
| `rivet-full-capacity.md` | Rivet full capacity from docs |
| `rivet-sandbox-agent.md` | Rivet Sandbox Agent harness |
| `sandbox-morning-ready.md` | Sandbox harness morning audit |
| `stale-for-review-triage.md` | Stale For Review triage |
| `stl-178-done.md` / `stl-179-done.md` | Linear FE-61 child Done notes |
| `supervisor-morning-ready.md` | ProjectSupervisor admit morning audit |
| `vercel-ci-independent-review.md` | IR Vercel CI |
| `vercel-ci-setup.md` | Vercel CI beta setup (Hive blocked public) |
| `vercel-ci-today.md` | Vercel CI launched-today look |
| `widget-ui-prompts.md` | MCP widget / cockpit UI prompts |
| `widget-ui-prompts.*.conflict.md` | Conflicted prompts snapshot |
| `workspace-skills-inventory.md` | Workspace skills/plugins inventory |
| `claude-code-handoff.md` | **This file** — Claude Code resume pack |

**Missing linked from notes (do not invent):** `pbi-015-readiness.md`, `port-callback-mismatch-fix.md`, `port-remount-checklist.md` — remount steps reconstructed in `funnel-remount-status.md`.

### C. Quick resume checklist for Claude Code

1. Clone/open `mplsjohnnycage/factory` (public); `git fetch`; branch from `main`.  
2. Attach/paste this handoff + skim `notes.md` For Review / In Progress.  
3. If ops: Funnel §7 then remount — else coding only after remount/Beads path clear.  
4. Honor author≠reviewer, auto models, no Linear→Cursor coding delegate, public repo, Single-MCP, no Observatory, formal write APPROVE.  
5. Do not re-open settled OAuth/MCP/assemble-first debates (§8).  

---

*End of handoff. Prefer updating this file in-place when FE-127/128/129 close rather than spawning parallel “resume” docs.*
