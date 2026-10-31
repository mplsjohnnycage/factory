# OpenAccess + OpenMCP linkage smoke (main)

**Checked:** 2026-10-29  
**Repo:** https://github.com/mplsjohnnycage/factory  
**Ref:** `origin/main` @ `2546716`  
**Scope:** App-side / repo linkage only (read-only). Port External Interface live audit is a separate worker.  
**Related:** [`port-factory-oauth-live.md`](./port-factory-oauth-live.md), [`port-oauth-delete-status.md`](./port-oauth-delete-status.md), [`port-auth-linkage-status.md`](./port-auth-linkage-status.md)

## Verdict

**partial**

| Surface | Status | Note |
|---------|--------|------|
| `/.well-known/openaccess.json` on main | **linked** | Publishes live Factory PKCE client id + Port redirect set; Observatory forbidden |
| `/.well-known/openmcp.json` on main | **linked** | Port remote MCP entry; `no_port_oauth_mutation`; not scaffold |
| Specs / ADR-005 / OpenStack index | **linked** | Agree Factory live, no Observatory, PBI-010 items 9–10 |
| Developer OS OAuth stubs | **partial** | Env-gated Factory client + Observatory refuse; **callback path ≠ OpenAccess/Port** |
| Runtime env / end-to-end sign-in | **missing** | `.env.example` blank; callback is stub (no token exchange) |

Well-known descriptors on main are coherent with the documented live Factory OAuth app. Developer OS is intentionally stubbed and still path-drifted from those descriptors, so overall app-side linkage is **partial**, not end-to-end.

## Smoke evidence (main)

### Raw GitHub well-knowns

| URL | HTTP | Shape |
|-----|------|-------|
| `https://raw.githubusercontent.com/mplsjohnnycage/factory/main/.well-known/openaccess.json` | **200** | `openaccess: "0.1"`; required keys present |
| `https://raw.githubusercontent.com/mplsjohnnycage/factory/main/.well-known/openmcp.json` | **200** | `openmcp: "0.1"`; `mcp: https://mcp.port.io/v1` |

### Local validator (`scripts/validate-well-known.mjs` on `origin/main` trees)

Exit **0** — inventory §7 items 9–10 shape OK; Observatory forbid + no Port OAuth mutation flags pass; not scaffold.

### OpenAccess ↔ live Factory record

| Field | OpenAccess (main) | `port-factory-oauth-live.md` | Match |
|-------|-------------------|------------------------------|-------|
| App name | `Factory` (`external_interface_app`) | `Factory` | yes |
| Client id | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` | same | yes |
| Env key | `PORT_FACTORY_CLIENT_ID` | wire this client only | yes |
| Redirects | `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback` | exact same set | yes |
| Observatory | `observatory_forbidden: true` | Observatory revoked; never reuse | yes |
| Token issuer | `token_issuer: "port"`; `hubs: []` | Port PKCE person surface | yes |
| No create/delete | `no_port_oauth_create_delete: true` | ADR-005 live; ops elsewhere | yes |

Canonical live record path is referenced from the descriptor (`factory.canonical_live_record`).

### OpenMCP coherence

| Check | Result |
|-------|--------|
| Points at Port MCP EU | `https://mcp.port.io/v1` (+ US alternate under `factory`) |
| Auth kind | `oauth` → Port MCP URL (not a second Factory IdP) |
| Mutation ban | `factory.no_port_oauth_mutation: true` |
| Operator | same OpenProfile well-known as OpenAccess |
| Tools | 7 `factory_*` workflow-as-tool names listed |
| Scaffold | absent |

OpenMCP documents the one Port MCP entry; it does not invent a separate OAuth app or Observatory client.

## Developer OS (app-side wiring)

| Path | Role | Linkage |
|------|------|---------|
| `apps/developer-os/src/lib/port-oauth.ts` | Resolve `PORT_FACTORY_CLIENT_ID`; throw if `PORT_OBSERVATORY_CLIENT_ID` set | Correct refuse; builds redirect **`/api/auth/port/callback`** |
| `.../api/auth/port/login/route.ts` | Begin authorize redirect | Env-gated; 503 until client id set |
| `.../api/auth/port/callback/route.ts` | Callback stub | Accepts shape → `/?port=signed-in-stub`; **no token exchange** |
| `.env.example` | Documents Factory-only env | `PORT_FACTORY_CLIENT_ID=` **blank** |
| README | Factory never Observatory | Matches Contract |
| Tests | Refuse Observatory; require Factory id | Pass intent |

Dev OS does **not** host or rewrite `/.well-known/openaccess.json` / `openmcp.json` (those live at repo root for GitHub/raw + CI). That is expected for PBI-010 emit scope.

## Gaps (why not “linked”)

1. **Redirect path drift** — Port + OpenAccess register `/api/auth/callback`. Dev OS login/callback use `/api/auth/port/callback`. A live OAuth round-trip would fail `redirect_uri` match until one side is aligned (also noted in PBI-010 independent review).
2. **Runtime client id unset in-repo** — example env is empty; wiring is “set this” not “prefilled.” Without `PORT_FACTORY_CLIENT_ID`, login returns 503.
3. **Stub callback** — no code→token exchange, no session cookie; sign-in loop incomplete by design (PBI-008 follow-on).
4. **No HTTPS preview/prod redirects** in OpenAccess or the documented live Port set — correct for localhost-only ops; blocks non-localhost deploy until Port replace-set + OpenAccess update.
5. **ADR-005 wording tension** — ADR still says identifiers are “not copied into this repository,” while OpenAccess (per refined auth Spec / PBI-010) publishes the public PKCE client id. Specs + OpenAccess agree; ADR is immutable and slightly stale (supersede later if needed).

## What is already correct

- PBI-010 well-knowns present on **main**, CI step validates them, raw GitHub 200.
- OpenAccess client id + redirects match the Project-store live Factory OAuth record (Observatory deleted context assumed from that record / sibling Port audit).
- OpenMCP is a Port MCP descriptor with explicit no-OAuth-mutation; coherent with `port-governance` / logicsrc-interop Specs.
- Developer OS Contract refuse path for Observatory env is real (code + tests).
- No Observatory client id string, no Clerk IdP wiring, in well-knowns or Dev OS OAuth paths.

## Classification summary

```
Port Factory (live, audited elsewhere)
        │
        ├── OpenAccess well-known  ── LINKED ── client id + redirects + forbid Observatory
        ├── OpenMCP well-known     ── LINKED ── Port MCP entry; no OAuth mutation
        └── Developer OS stubs     ── PARTIAL ── Factory env key + refuse Observatory;
                                                 wrong callback path; no token exchange; env blank
```

**Return value for coordinator:** **partial** — well-knowns on main are present and coherent with Port Factory OAuth; Dev OS linkage incomplete (path drift + stub + unset env).
