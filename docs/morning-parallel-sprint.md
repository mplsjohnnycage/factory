# Morning parallel sprint — CLOSED (cloud-doable)

**Started:** 2026-10-29 ~03:18 America/Chicago  
**Closed:** 2026-10-29 ~16:31Z (completion-loop tick 1)  
**Status:** **CLOSED / COMPLETE** for cloud-doable Meta work  
**Remaining:** Johnny desktop/ops only → **FE-142**  
**Lane:** Meta · public repo · no Observatory · no Port OAuth create/delete  

## Verdict

Funnel remount is **LIVE**. Morning board PRs **#57 / #58 / #59 MERGED**. Cloud agents have no further FE-122 coding/docs queue; next vertical-slice fire waits on Johnny secrets + Windows Register/reboot + human Port login (tracked under FE-142).

## Live Port / Dev OS snapshot

| Check | Result |
|-------|--------|
| Factory EI | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` · stable callback allowlisted · temp deploy URI (`n5tdoht4l`) still present — **do not prune** until Johnny confirms after human login |
| FE-128 stable login curl | **PASS** — `redirect_uri=https://factory-developer-os.vercel.app/api/auth/callback` ([`fe-128-oauth-prod-verify.md`](./fe-128-oauth-prod-verify.md)) |
| OAuth hard-pin code | **[#42](https://github.com/mplsjohnnycage/factory/pull/42) MERGED** |
| Human Sign in with Port | **Blocked on Johnny** → FE-142 |
| `factory_*` WEBHOOKs | **7/7 additive `gateway_admit` remounted** → Funnel ([`port-webhook-remount-live.md`](./port-webhook-remount-live.md)) |
| Funnel remount | **LIVE** base `https://desktop-3apdbkg.taildf3a4b.ts.net` — HMAC match still Johnny ([`funnel-remount-status.md`](./funnel-remount-status.md)) |
| Sprint PRs | **#57 #58 #59 MERGED** (Beads/HMAC docs · Atlas BFF smoke · Windows logon autostart) |
| Atlas prod smoke | **PASSED** on alias @ `6a13680` (`npm run smoke:atlas-bff`) |

## Results landed (cloud)

| Track | Result | Evidence |
|-------|--------|----------|
| FE-122 Single-MCP A–D | Closed | [`mcp-port-single-fanout.md`](./mcp-port-single-fanout.md) |
| FE-24 assemble-first | Applied (store) | [`assemble-first-lead-applied.md`](./assemble-first-lead-applied.md) |
| Dev OS OAuth smoke | PASS | [`devos-oauth-morning-smoke.md`](./devos-oauth-morning-smoke.md) |
| FE-128 prod alias verify | PASS (curl); human login + prune **Johnny / FE-142** | [`fe-128-oauth-prod-verify.md`](./fe-128-oauth-prod-verify.md) |
| OAuth hard-pin | **Merged [#42](https://github.com/mplsjohnnycage/factory/pull/42)** | [`port-oauth-redirect-pin.md`](./port-oauth-redirect-pin.md) |
| OpenAccess / remount kit / Dockerfile | **Merged #39 #40 #41** | morning PRs |
| Funnel + WEBHOOK remount | **LIVE** additive 7/7; HMAC 401 until desktop secrets | [`port-webhook-remount-live.md`](./port-webhook-remount-live.md) · [`funnel-remount-status.md`](./funnel-remount-status.md) |
| Beads admit path docs + HMAC smoke | **Merged [#57](https://github.com/mplsjohnnycage/factory/pull/57)** | [`beads-tailnet-gateway-tick.md`](./beads-tailnet-gateway-tick.md) |
| Atlas BFF hardening + smoke script | **Merged [#58](https://github.com/mplsjohnnycage/factory/pull/58)** | [`code-atlas-followups-tick.md`](./code-atlas-followups-tick.md) |
| Gateway Windows logon autostart kit | **Merged [#59](https://github.com/mplsjohnnycage/factory/pull/59)** | [`gateway-logon-autostart.md`](./gateway-logon-autostart.md) |
| CI accept-on-SHA | Green | [`ci-morning-check.md`](./ci-morning-check.md) |

## Remaining blockers → FE-142 (Johnny only)

| # | Blocker | Owner | Pointer |
|---|---------|-------|---------|
| 1 | Mirror Port + desktop gateway HMAC secrets (`PORT_CLIENT_SECRET`, handler token, `FACTORY_GATEWAY_BASE_URL`) so signed WEBHOOK → **202** | **Johnny** | [`port-webhook-remount-live.md`](./port-webhook-remount-live.md) · [`funnel-remount-status.md`](./funnel-remount-status.md) · FE-142 |
| 2 | Windows Task Scheduler **Register** + reboot verify (`DESKTOP-3APDBKG`) for gateway logon autostart | **Johnny** | [`gateway-logon-autostart.md`](./gateway-logon-autostart.md) · repo `docs/ops/gateway-windows-logon-autostart.md` · FE-142 |
| 3 | Human prod Port login + prune temp OAuth URI `n5tdoht4l` after confirm | **Johnny** | [`fe-128-oauth-prod-verify.md`](./fe-128-oauth-prod-verify.md) · FE-142 |
| 4 | Live Rivet Serve + supervisor host wiring (after secrets) | Desktop + ops | [`m1-morning-gap-map.md`](./m1-morning-gap-map.md) |

## Open PRs (merge attention)

| PR | Purpose | Note |
|----|---------|------|
| — | — | Morning sprint queue empty (#57–#59 merged). See [`factory-done-loop-tick.md`](./factory-done-loop-tick.md) for live open-PR sweep. |

## Hard bans

No Observatory · no Port OAuth app create/delete · **no prune of `n5tdoht4l` URI** · no catalog dual-write outside §4.2.1 · repo stays public · no browser→Sandbox Agent · remount already done (do not replace fencing GETs)

## Related

- [`factory-done-loop-tick.md`](./factory-done-loop-tick.md)  
- [`port-webhook-remount-live.md`](./port-webhook-remount-live.md)  
- [`funnel-remount-status.md`](./funnel-remount-status.md)  
- [`offline-desktop-ops-tick.md`](./offline-desktop-ops-tick.md)  
- [`factory-gateway-public-url.md`](./factory-gateway-public-url.md)  
