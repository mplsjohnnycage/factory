# OpenAccess + OpenMCP linkage smoke kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Repeatable offline (and optional live-read) smoke that OpenAccess / OpenMCP well-knowns stay coherent with Developer OS Port OAuth wiring — **zero Port mutations**, zero spend, no secrets printed.  
**Script:** `scripts/openaccess-linkage-dry-run.mjs` → `npm run dry-run:openaccess-linkage`  
**Shape validator:** `scripts/validate-well-known.mjs` → `npm run validate:well-known` (also invoked by this kit)  
**Code:** `apps/developer-os/src/lib/port-oauth.ts` · `apps/developer-os/src/app/api/auth/callback`  
**Emit:** `/.well-known/openaccess.json` · `/.well-known/openmcp.json`  
**Related:** [`docs/devos-port-oauth-vercel-env.md`](../devos-port-oauth-vercel-env.md) · [`docs/ops/atlas-bff-smoke.md`](./atlas-bff-smoke.md) · [`docs/ops/port-human-login-verify.md`](./port-human-login-verify.md)

## Non-overlap (do not duplicate)

| Kit | Owns |
|-----|------|
| **This kit** | OpenAccess ↔ OpenMCP ↔ Dev OS OAuth **linkage** (redirect path, Factory client id env key, Observatory forbid, no-OAuth-mutation flags) + well-known shape via `validate-well-known` |
| [Atlas BFF smoke](./atlas-bff-smoke.md) | Live/prod `atlas.*` BFF tool invoke (naming map) — **out of scope here** |
| [Port human Sign-in verify](./port-human-login-verify.md) | Human browser Sign-in / URI prune (FE-172 **CLOSED**) |
| Gateway Dockerfile + `/health` ops (#82) | Image contract / `HEALTHCHECK` / remount health — **out of scope here** |
| Signed / unsigned Funnel admit | Gateway HMAC claim path (FE-142 **CLOSED**) |

No Port External Interface create/delete/revoke. No blueprint / workflow upsert. No Adapter `mcp_auth`.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + well-knowns + Dev OS OAuth + validator) | Present; no secret assignments |
| OpenAccess shape | `openaccess: "0.1"`; Factory `port_client_id` + `PORT_FACTORY_CLIENT_ID`; `observatory_forbidden`; `no_port_oauth_create_delete` |
| OpenMCP shape | `openmcp: "0.1"`; Port MCP URL; `no_port_oauth_mutation`; dotted `atlas.*` + map |
| Callback alignment | Dev OS `CALLBACK_PATH` = `/api/auth/callback` and every OpenAccess `redirect_uris` entry ends with that path |
| Observatory | Forbidden in OpenAccess + Dev OS (`PORT_OBSERVATORY_CLIENT_ID` refuse) |
| Port schema / WEBHOOK / EI mutate | **Untouched** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (no network required)

```bash
npm run dry-run:openaccess-linkage
# or: node scripts/openaccess-linkage-dry-run.mjs
```

Exit **0** = markers + `validate-well-known` green; Port mutate refused; no secrets printed.

## Dev OS OAuth unit probe (optional — local Node deps)

Runs `apps/developer-os` Port OAuth unit tests only (callback path, Observatory refuse, canonical origin pin). Installs package deps under that app when needed. No Port, no Vercel, no spend.

```bash
npm run dry-run:openaccess-linkage -- --memory
# or: node scripts/openaccess-linkage-dry-run.mjs --memory
```

## Live well-known read (optional — HTTP GET only)

Fetches raw GitHub `main` well-knowns (read-only). Expects **200** + same shape gates as the local validator. Never mutates Port.

```bash
npm run dry-run:openaccess-linkage -- --live
```

## Operator notes (linkage, not mutation)

| Surface | Contract |
|---------|----------|
| Public Factory client id | OpenAccess `factory.port_client_id` ≡ Dev OS `PORT_FACTORY_CLIENT_ID` (public PKCE — **not** a secret) |
| Callback path | `/api/auth/callback` on loopback + `https://factory-developer-os.vercel.app` |
| Env pin | `NEXT_PUBLIC_DEVOS_URL` / code pin — never ephemeral `VERCEL_URL` allowlist hosts |
| OpenMCP | Documents the one Port MCP entry; does **not** invent a second IdP |

Live person Sign-in remains FE-172 / Port human-login kit — **already CLOSED**. Do not re-run browser Sign-in from this kit.

## Chain (linkage hop)

```text
/.well-known/openaccess.json (Factory client id + redirect_uris)
  ↔ apps/developer-os CALLBACK_PATH=/api/auth/callback
  ↔ PORT_FACTORY_CLIENT_ID (public) · Observatory refuse
/.well-known/openmcp.json (Port MCP · no_port_oauth_mutation · atlas.* map)
  ↔ validate-well-known.mjs (CI + this kit)
```

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke / OAuth app mutate.

## Explicit non-goals

- No secret values in chat, docs, logs, or PRs  
- No Port schema apply / WEBHOOK remount / EI mutate  
- No Atlas BFF live invoke (that is `smoke:atlas-bff`)  
- No gateway Dockerfile / `/health` remount kit (#82)  
- No Johnny ping for HMAC / handler-token / Sign-in (FE-142 + FE-172 closed)  
- No Adapter auth / spend  
- No Product Beads / Observatory reuse  
