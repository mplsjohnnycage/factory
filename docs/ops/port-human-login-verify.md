# Port human Sign-in verify + temp OAuth URI prune (Projects Manager)

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Confirm production human Sign in with Port on the stable Dev OS alias, then confirm (or finish) prune of ephemeral Vercel callback URIs on the Factory External Interface only.  
**Preconditions:** FE-142 **CLOSED** (HMAC / handler-token — do **not** re-ask secrets). Hard-pin [#42](https://github.com/mplsjohnnycage/factory/pull/42) on `main`. Temp deploy host prune already executed once ([`docs/port/oauth-redirect-prune-n5tdoht4l.md`](../port/oauth-redirect-prune-n5tdoht4l.md)).  
**Hard bans:** no secret values in chat/docs/PRs · no Port schema / blueprint upsert · no OAuth create/delete/revoke of apps · no Observatory · zero spend

## Identity (public PKCE — not secrets)

| Field | Value |
|-------|-------|
| App | Factory External Interface (ADR-005 live) |
| `client_id` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| Stable origin | `https://factory-developer-os.vercel.app` |
| Login | `GET /api/auth/port/login` |
| Callback path | `/api/auth/callback` (exact) |

Never print client secrets, cookies, `code`, `code_verifier`, or bearer tokens. Status codes + public query keys only.

## Tick checklist

```text
[ ] 1. Curl pin — stable login emits pinned redirect_uri
[ ] 2. Human Sign in with Port on stable alias (browser)
[ ] 3. Confirm signed-in landing (?port=signed-in / session cookie present — do not paste cookie)
[ ] 4. List Factory EI redirectUris (Port UI or list_external_interface_apps)
[ ] 5. Expect keepers only (3 URIs). If any ephemeral *.vercel.app remains → prune (step 6)
[ ] 6. Conditional prune — replace-set keepers only; re-list; temp host gone
[ ] 7. Reply with PASS/FAIL lines only (no secrets)
```

### 1) Curl pin (cloud-safe)

```bash
curl -sSI --max-time 15 \
  'https://factory-developer-os.vercel.app/api/auth/port/login'
```

| Expect | Detail |
|--------|--------|
| Status | **302** |
| Authorize host | `auth.getport.io` |
| `client_id` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| `redirect_uri` (decoded) | `https://factory-developer-os.vercel.app/api/auth/callback` |
| Must not | ephemeral `factory-developer-*-johnnyc.vercel.app` as `redirect_uri` |

Do not paste full `Location` (contains one-shot `state` / `code_challenge`). Record **PASS/FAIL** for the four rows above.

### 2–3) Human Sign-in (PM browser)

1. Open `https://factory-developer-os.vercel.app` (stable alias only — not a preview deployment URL).
2. Use **Sign in with Port** (hits `/api/auth/port/login`).
3. Complete Port person login.
4. Confirm return to Dev OS with signed-in signal (`?port=signed-in` and/or session cookie set). **Do not** paste cookie values.
5. Optional: Port External Interface `lastLoginAt` advances after a successful person login (UI observation only).

### 4–5) Allowlist verify (read-only first)

Expected **keepers** (exact set after FE-144 prune):

1. `http://localhost:3000/api/auth/callback`
2. `http://127.0.0.1:3000/api/auth/callback`
3. `https://factory-developer-os.vercel.app/api/auth/callback`

| URI class | Action |
|-----------|--------|
| Keepers above | **Keep** |
| `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback` | **Must be absent** (already pruned 2026-10-29) |
| Any other `https://factory-developer-*-johnnyc.vercel.app/api/auth/callback` | **Prune** |
| Observatory / non-Factory apps | **Do not touch** |

If list already equals the three keepers → mark step 5 **PASS**, skip step 6.

### 6) Conditional temp URI prune (only if ephemeral present)

Full **replace-set** (Port does not merge casually). Factory app only:

```json
{
  "appId": "iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug",
  "redirectUris": [
    "http://localhost:3000/api/auth/callback",
    "http://127.0.0.1:3000/api/auth/callback",
    "https://factory-developer-os.vercel.app/api/auth/callback"
  ]
}
```

- Tool: Port UI edit **or** MCP `upsert_external_interface_app` with the payload above.
- Post-check: re-list → exactly three keepers; no `*-johnnyc.vercel.app` callbacks.
- Rollback: restore prior allowlist from [`docs/port/oauth-redirect-prune-n5tdoht4l.md`](../port/oauth-redirect-prune-n5tdoht4l.md) backup section (includes the temp host). Prefer not to roll back unless login breaks.

### 7) PM reply shape (no secrets)

```text
curl pin: PASS|FAIL
human Sign-in: PASS|FAIL
allowlist keepers-only (3): PASS|FAIL
prune executed this tick: YES|NO|N/A
```

## Explicit non-goals

- No Port blueprint / schema upsert  
- No new External Interface / OAuth apps; no Observatory  
- No FE-142 secret re-fill ask  
- No Funnel / gateway remount  
- No printing secrets or OAuth one-shot params  

## Related

- Spec: `specs/auth-port-oauth/spec.md` · ADR-005 live  
- Pin: [`docs/devos-port-oauth-vercel-env.md`](../devos-port-oauth-vercel-env.md) · [#42](https://github.com/mplsjohnnycage/factory/pull/42)  
- Prior prune record: [`docs/port/oauth-redirect-prune-n5tdoht4l.md`](../port/oauth-redirect-prune-n5tdoht4l.md)  
- HMAC closed kit: [`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md)  
