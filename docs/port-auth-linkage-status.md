# Port auth linkage status — Factory Meta

**Checked:** 2026-10-29 (Dev OS OAuth e2e wiring)  
**Repo:** https://github.com/mplsjohnnycage/factory  
**Lane:** Meta  
**Sources:** Port MCP `list_external_interface_apps` (live); repo Developer OS + OpenAccess; prior `port-factory-oauth-live.md`; Vercel `factory-developer-os` env

## Short verdict

| Question | Answer |
|----------|--------|
| **Port app live?** | **Yes.** Only `Factory` External Interface app; Observatory gone. |
| **App code linked?** | **Yes (code path).** Callback `/api/auth/callback`; PKCE token exchange; `PORT_FACTORY_CLIENT_ID` on Vercel. |
| **End-to-end login proven?** | **Localhost-ready.** HTTPS preview/prod redirects still need Port app update before non-localhost sign-in. |

**Bottom line:** Port-side create + Observatory delete done. Dev OS wiring is no longer stub — real Auth0 PKCE exchange. Live person login still needs a successful localhost (or registered HTTPS) round-trip to set Port `lastLoginAt`.

## Port side (live MCP)

| Field | Value |
|-------|--------|
| Name | `Factory` |
| App id | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` |
| Client id | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| Org | `org_rNq4tjSc8DXL1ceL` |
| Other apps | **none** (Observatory absent) |
| Redirects | `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback` |
| Last login | **null** (until first successful person login) |

## App / repo wiring

| Surface | Linked to Factory client? | Notes |
|---------|---------------------------|--------|
| `/.well-known/openaccess.json` | **Yes** | `port_client_id` = `tnPUmUX5…`; redirects match Port set |
| Specs / ADR-005 | **Yes** | Accepted — live; callback path + PKCE Contract |
| Dev OS `port-oauth.ts` + login/callback | **Yes** | Authorize via `auth.getport.io`; callback `/api/auth/callback`; PKCE S256; Auth0 `/oauth/token` exchange; session cookies |
| Vercel `factory-developer-os` | **Yes** | `PORT_FACTORY_CLIENT_ID` set (production/preview/development) |
| Token exchange / session | **Yes (code)** | HttpOnly access (+ refresh/id) cookies; no stub redirect |

## Remaining gaps

1. **Deploy redirects** — No preview/prod HTTPS callbacks on the Port app yet (max 5; full replace-set). Documented in `docs/devos-port-oauth-vercel-env.md`.
2. **Live login proof** — Port `lastLoginAt` still null until an operator completes Sign in with Port against a registered redirect.

## What is already correct

- Observatory revoked; FREEMIUM slot held by Factory only.
- Canonical client id published in OpenAccess.
- Dev OS refuses Observatory env.
- Callback path aligned with Port + OpenAccess.
- Real token exchange (public PKCE; no client_secret).
- Vercel env wired for Factory client id.

## Linkage model

```
Port Factory app ──live──► OpenAccess descriptor ──yes──► published client id + Port redirects
         │
         └──wired──► Developer OS (PKCE authorize + /api/auth/callback exchange + Vercel env)
                     └──pending──► HTTPS redirects + first live lastLoginAt
```

**Classification:** Port-side live; Dev OS code + Vercel env linked; person E2E pending registered HTTPS (or localhost proof).
