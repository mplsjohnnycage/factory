# Developer OS — Port OAuth Vercel env

**Lane:** Meta  
**Project:** Vercel `factory-developer-os` (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`)  
**Team:** `johnnyc` / `team_JSyn0ONxl6qIWJc9dtcGKxEc`  
**App:** Factory External Interface (ADR-005 live)

## Required

| Key | Value | Targets | Type |
|-----|-------|---------|------|
| `PORT_FACTORY_CLIENT_ID` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` | production, preview, development | plain |

Public PKCE client id — same as OpenAccess `factory.port_client_id`. **Never** set `PORT_OBSERVATORY_CLIENT_ID`.

## Recommended

| Key | When | Notes |
|-----|------|-------|
| `NEXT_PUBLIC_DEVOS_URL` | Stable production / custom domain | Origin used for `redirect_uri`; must match a registered Port URI |

## Defaults (code; override only for US / non-prod Auth0)

| Key | Default |
|-----|---------|
| `PORT_AUTH0_DOMAIN` | `auth.getport.io` |
| `PORT_API_BASE` | `https://api.getport.io` |
| `PORT_OAUTH_SCOPES` | `openid profile email offline_access` |

## Callback path

Dev OS callback = **`/api/auth/callback`** (aligned with Port + `.well-known/openaccess.json`).

Live Port redirects today (localhost only):

1. `http://localhost:3000/api/auth/callback`
2. `http://127.0.0.1:3000/api/auth/callback`

HTTPS preview/production callbacks must be added explicitly on the Port app (max 5; full replace-set) before non-localhost sign-in succeeds. Do not invent URIs; use the exact deployed origin + `/api/auth/callback`.

## Ops

- Set env via Vercel dashboard or MCP `create_project_env` (upsert).
- Redeploy after env change.
- Confirm sign-in locally first; Port `lastLoginAt` updates after a successful person login.
