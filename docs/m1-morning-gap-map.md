# M1 morning gap map — vertical slice

**When:** 2026-10-29 (~03:20 America/Chicago)  
**Deadline:** demo-ready ~10–11am America/Chicago  
**Slice:** Port MCP → workflow → webhook → `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent → GitHub CI accept → Dev OS visibility  
**Sources:** `/workspace` `main` @ `fd4a774` · store docs (gateway URL, Funnel remount, Port WEBHOOK/SS, Beads, CI, Dev OS OAuth, morning sprint/triage)  
**Lane:** Meta · public repo · no Observatory · no Port OAuth create/delete

## Verdict

**Code for the slice is largely on `main` (PBI-001…014 + Port/Ocean/Vercel wave). The live hop chain is broken at public gateway URL → Port remount, then at Rivet/Beads/Sandbox operator wiring.** Demo today = ops/HITL on Muse desktop, not more Meta coding PRs.

| Slice hop | Code on main | Live / ops |
|-----------|--------------|------------|
| Port MCP (single entry) | OpenMCP → `mcp.port.io` | **Live** — 7 `factory_*` tools |
| Port workflows | YAML + upserted | **Live tools**; WEBHOOK nodes still → `api.port.io` |
| WEBHOOK → gateway | HMAC + allowlist proven | **Blocked** — no public `FACTORY_GATEWAY_BASE_URL` |
| gateway → ProjectSupervisor | In-process queue + optional `RIVET_SUPERVISOR_URL` | **No forward target**; supervisor is library/Memory only |
| Supervisor → Sandbox | Actor + Docker lease + pin | **No live host**; Docker/`ANTHROPIC`/Rivet Actor unset |
| CI accept (exact SHA) | evaluate/record + GHA presence/matrix | **GHA live**; Port catalog accept = Cockpit HITL; ledger in-memory |
| Dev OS visibility | OAuth + Memory session stream | **OAuth PASS**; Rivet stream Memory until Serve URL |

---

## P0 — blocks any live Port→gateway admit (do first)

| # | Gap | Blocked-by | ETA | Parallel? |
|---|-----|------------|-----|-----------|
| **G1** | No public HTTPS `FACTORY_GATEWAY_BASE_URL` (`GET /health` from non-tailnet) | **ops** — Tailscale Funnel on Muse/operator host (VM has no Tailscale/Docker; no Dockerfile/PaaS). See [`factory-gateway-public-url.md`](./factory-gateway-public-url.md), [`funnel-remount-status.md`](./funnel-remount-status.md) | **minutes–1h** (Funnel if desktop ready) | No — serial before remount |
| **G2** | Port secrets unset / unused (`FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN`, HMAC/`PORT_CLIENT_SECRET` match) | **ops/HITL** — Port secrets after G1 health green | **minutes** | After G1 only |
| **G3** | Live `factory_*` WEBHOOKs still → `api.port.io` — **0** admit nodes → gateway | **ops/HITL** — additive notify/admit WEBHOOK after lease write; **do not** replace fencing GETs ([`port-workflow-webhooks.md`](./port-workflow-webhooks.md)) | **minutes–1h** | After G1–G2; SS (G4) parallel with G3 |
| **G4** | Meta SS `ss_convex_*` templated to gateway but secret unused → dead until G1 | **ops** — set secrets; smoke `trigger_run` ([`port-ss-handlers.md`](./port-ss-handlers.md)) | **minutes** | Parallel with G3 after G1–G2 |

**Hard rule:** never remount live tools onto a dead base URL (FE-106).

---

## P1 — needed for “coding admit” demo after Port→gateway

| # | Gap | Blocked-by | ETA | Parallel? |
|---|-----|------------|-----|-----------|
| **G5** | Rivet Compose + Tailscale **Serve** not evidenced live (`:6420` → `FACTORY_RIVET_SERVE_URL` / `RIVET_SERVE_URL`) | **ops** — Docker + Tailscale on Muse; cloud VM has neither ([`compose/`](https://github.com/mplsjohnnycage/factory/tree/main/compose), [`docs/rivet-tailscale-serve.md`](https://github.com/mplsjohnnycage/factory/blob/main/docs/rivet-tailscale-serve.md)) | **hours** (first bring-up) / **minutes** if already installed | Yes — parallel with G1 Funnel (Serve≠Funnel) |
| **G6** | `RIVET_SUPERVISOR_URL` unset → admits stay in gateway in-process queue only | **ops** (+ thin **code** if no HTTP admit entry exists) — ProjectSupervisor is **library** (`createMemorySupervisor`), not a listening Rivet/HTTP service | **hours** | After G5; parallel with G7–G8 design |
| **G7** | Live `BdMetaBeads` missing — supervisor CI/Memory only; comment names adapter, **no class** | **code** (`factory-cvl`) + **ops** (`bd` on PATH, bootstrap) | **hours** | Yes vs Funnel; needed before non-bypass live admit |
| **G8** | Operator Meta Beads graph / claim path for demo bead | **ops** — `bd bootstrap` + `bd ready` / `--claim` (Dolt hybrid on main via #24; `bd` not on default PATH) | **minutes** once `bd` installed | Parallel with G7; serial before real admit |
| **G9** | Sandbox Agent live path unproven (Docker lease + pinned `0.5.4-full` + `ANTHROPIC_API_KEY`) | **ops** — Docker Engine + secrets; no browser→SA | **hours** | Parallel with G5–G8 once host ready |
| **G10** | Supervisor does not yet spawn/wire `AgentSessionActor` / Docker lease (package boundary only) | **code** — Rivet Actor host glue (PBI-007+ follow-on) | **hours** | After G5–G6; can stub Memory lease for dry demo |

---

## P2 — accept + visibility for demo narrative

| # | Gap | Blocked-by | ETA | Parallel? |
|---|-----|------------|-----|-----------|
| **G11** | Port **catalog** accept still Cockpit/human (gateway `/accept/*` = evidence only; in-memory ledger) | **ops/HITL** — human accept after green SHA ([`docs/ci/port-accept-on-sha.md`](https://github.com/mplsjohnnycage/factory/blob/main/docs/ci/port-accept-on-sha.md)) | **minutes** per SHA | Yes — after CI green; needs gateway up for HTTP evidence |
| **G12** | Vertical-slice accept wants `meta-accept-matrix` green on exact SHA (presence alone ≠ full matrix) | **ops** — `gh workflow run meta-accept-matrix.yml -f ref=S` | **minutes** | Yes |
| **G13** | Dev OS session stream uses **Memory** when `RIVET_SERVE_URL` unset — no live Rivet events in UI | **ops** — set Serve URL on Vercel/BFF after G5 | **minutes** after Serve | Parallel after G5 |
| **G14** | Gateway catalog dual-write still possible from live Port `UPSERT_ENTITY` in workflows | **ops** (route writes via `/catalog/write`) + residual **code**/fencing | **hours** | Soft for demo; hard for SoT purity |

---

## P3 — not morning-critical (do not steal Funnel time)

| # | Gap | Blocked-by | ETA | Parallel? |
|---|-----|------------|-----|-----------|
| **G15** | No gateway Dockerfile / durable PaaS | **code** (optional after Funnel proves path) | **hours** | Yes — non-blocking if Funnel works |
| **G16** | Vercel CI Hive 409 on public repo | **missing URL / product** — keep **GHA**; do not flip private ([`vercel-ci-setup.md`](./vercel-ci-setup.md) · #37) | n/a | Ignore for M1 |
| **G17** | Port outbound MCP connectors not live-verified | **ops** read | **hours** | Yes — not on admit path |
| **G18** | PBI-015 CE compound writeback | **HITL** — `/ce-compound` ([STL-176](https://linear.app/johnny-cage/issue/STL-176)) | deferred | No — hold |
| **G19** | Assemble-first master lead apply (FE-24/125) | **code**/docs | **hours** | Yes — docs only; not slice runtime |
| **G20** | Stale GH issues (#26,#32,#34–37) + FE-61 HITL (#2,#5–8) | **HITL** tracker ([`open-issues-morning-triage.md`](./open-issues-morning-triage.md)) | **minutes** | Yes — hygiene only |
| **G21** | painter-os Linear sync Edit Link (#7) | **HITL** | **minutes** | Soft hygiene |

---

## Already green (do not re-work)

| Surface | Evidence |
|---------|----------|
| Kernel PBIs 001–014 on `main`; open Meta PRs = **0** | [`open-pr-sweep.md`](./open-pr-sweep.md) |
| Gateway WEBHOOK HMAC + 7 `factory_*` path allowlist | `apps/factory-gateway` tests · #28 |
| Meta SS handlers code | #33 |
| Ocean Meta write fencing + skill unmap | #29 · [`ocean-meta-unmap.md`](./ocean-meta-unmap.md) |
| Meta Beads hybrid Dolt + bootstrap | #24 |
| `meta-ci-presence` + `main` protection (PR+1 APPROVE) | [`ci-protection-live-verify.md`](./ci-protection-live-verify.md) |
| Dev OS Port OAuth stable callback + login redirect smoke | [`devos-oauth-morning-smoke.md`](./devos-oauth-morning-smoke.md) · FE-113/119/120 |
| Single-MCP lock (Port front door; Dev OS ≠ MCP host) | [`mcp-port-single-fanout.md`](./mcp-port-single-fanout.md) |

---

## Ruthless morning order (~10–11am CT)

```text
1. Muse: gateway :8787 + Funnel → public /health          [G1]   minutes–1h
2. Port secrets                                               [G2]   minutes
3. SS smoke + additive factory_* admit WEBHOOK             [G4+G3] minutes–1h  (parallel)
4. Parallel desktop: Rivet Compose + Serve                 [G5]   hours/min
5. bd claim + Memory or Bd admit path                      [G7+G8] minutes–hours
6. Optional: Docker SA smoke / Memory session in Dev OS    [G9+G13]
7. Pick green SHA → evaluate → Cockpit Port accept         [G11+G12]
```

**Stop condition for “demo-ready”:** Port `trigger_run` / SS → gateway **202**/handler OK; at least one admit visible in gateway logs; Dev OS login works; one SHA evaluate-eligible + human accept story. Full SA→CI→Port accept automation can stay partial if G1–G4 + OAuth + G11 narrative hold.

---

## Top 5 blockers (ruthless)

1. **G1** — Public Funnel/`FACTORY_GATEWAY_BASE_URL` (ops; missing URL)  
2. **G3** — Live `factory_*` admit WEBHOOK remount (ops/HITL; blocked by G1)  
3. **G5/G6** — Rivet Serve + supervisor forward target (ops; supervisor HTTP/Actor missing)  
4. **G7/G8** — Live Meta Beads admit (`BdMetaBeads` + claim) (code + ops)  
5. **G9/G10** — Live Sandbox Agent host wiring (ops + code glue)

---

## Related

- [`morning-parallel-sprint.md`](./morning-parallel-sprint.md) · [`funnel-remount-status.md`](./funnel-remount-status.md) · [`factory-gateway-public-url.md`](./factory-gateway-public-url.md) · [`open-issues-morning-triage.md`](./open-issues-morning-triage.md)
