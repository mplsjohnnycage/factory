# Meta ops dry-run kits — cloud exhaustion

**When:** 2026-10-29  
**Worker:** bc-564bf387-4759-56fe-a09f-fbf3eb3bb5f8  
**After:** [#94](https://github.com/mplsjohnnycage/factory/pull/94) on `main` @ `cc83964`  
**Lane:** Meta · zero spend · no secrets · Port REFUSED · Adapter skipped  
**Audience:** Projects Manager  

## Verdict

**STOP_CLOUD_KITS=yes** — No remaining **cloud-viable** Meta ops dry-run kit that is (a) not already on `main`, (b) free of Johnny / desktop Funnel / spend / HMAC fill / Port Sign-in, and (c) not a pad duplicate of existing CI/refuse surfaces.

**No PR opened** this hop.

## Already on main (do not duplicate)

| PR | Kit |
|----|-----|
| #94 | CI + main branch-protection verify |
| #92 | Assemble-first apply (§4.2.2 + Ocean/meta-fence markers) |
| #90 | Funnel remount checklist (offline) |
| #88 | Factory-done queue mirror |
| #85 | OpenAccess + OpenMCP linkage |
| #84 | Beads Dolt health |
| #82 | Gateway Dockerfile + `/health` |
| #80 | BdMetaBeads offline readiness |
| #78 | Sandbox harness readiness |
| #76 | Rivet Compose + Tailscale Serve smoke |
| #73 | Windows logon PM checklist |
| #71 | Signed HMAC admit smoke |
| #69 | Port human Sign-in verify |
| #68 / #66 | Supervisor admit + Beads→gateway unsigned |
| #64 | OmniRoute desktop install |
| #62 | Atlas BFF smoke |
| #40 / remount | Gateway remount dry-run (live Funnel `/health`) |

Also covered without a new ops wrapper: `docs/ci/local-gate.md` + `npm run test:local-gate` + `local-gate.yml` (explicitly out of scope of #94); accept-on-SHA / ADR-008 / visibility markers inside #94; Ocean fencing markers inside #92.

## Candidates reviewed → not shippable as cloud kit

| Candidate | Why stop |
|-----------|----------|
| Local-gate refuse “ops” wrapper | Already instrumented (`docs/ci/local-gate.md`, `test:local-gate`, workflow). Prior hops deferred; new `docs/ops/` wrapper = pad duplicate. |
| Port accept-on-SHA / meta-accept-matrix | Markers + path owned by #94. Live Cockpit accept = human. |
| Ocean MCP write fencing | Markers owned by #92 assemble-first. |
| Live Funnel / remount-armed / gateway remount | Needs desktop Tailscale Funnel URL (Johnny/desktop). Offline remount = #90; live = #40. |
| HMAC / handler-token / signed claim | FE-142 **CLOSED**; kit #71 on main. Do not re-ask. |
| Port human Sign-in / OAuth URI prune | FE-172 **CLOSED**; kit #69 on main. Do not re-ask. |
| Port SS `trigger_run` / WEBHOOK upsert | Port mutate **REFUSED** this lane. |
| Rivet Serve / Docker Sandbox live | Desktop host + secrets; offline kits #76/#78 already on main. |
| OmniRoute / Windows logon live | Desktop; kits #64/#73 on main. |
| Vercel CI Hive | Product 409 on public repos — keep GHA; no Meta kit value. |
| PBI-015 `/ce-compound` writeback | HITL hold — not an ops dry-run kit. |
| Linear FE-61 / painter-os / Autolink | HITL config (FE-181…183 Queued) — not Meta kernel dry-run. |

## Guards (this hop)

- Zero spend · Adapter mcp_auth skipped  
- FE-142 / FE-172 **CLOSED** — no secret or Sign-in asks  
- Port schema upserts / EI create-delete-revoke **REFUSED**  
- No self-APPROVE · no GitHub protection PUT  
- Fresh `origin/main` inspected; **no** feature branch / PR

## Next (outside cloud kit hop)

1. Independent write APPROVE + merge any still-open Meta ops PRs (author≠reviewer).  
2. Desktop / Funnel / Rivet Serve live bring-up when Muse host ready (not cloud).  
3. Queued Linear FE-181…183 (HITL) when PM schedules.  
4. PBI-015 only after human `/ce-compound`.
