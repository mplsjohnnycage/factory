# OAuth URI prune run — Factory EI

**When:** 2026-10-29T15:30Z  
**Task:** FE-144  
**client_id:** `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`  
**appId:** `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug`  
**Backup:** [`oauth-uri-allowlist-backup.md`](./oauth-uri-allowlist-backup.md)  
**Result:** **EXECUTED** — temp URI removed; stable + localhost kept

## Preconditions

| Check | Result |
|-------|--------|
| #42 pin on prod (`curl -sSI …/api/auth/port/login`) | **PASS** — `redirect_uri=https://factory-developer-os.vercel.app/api/auth/callback` · `client_id=tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| Port MCP can upsert | **Yes** — `upsert_external_interface_app` |
| Reversible | **Yes** — restore exact set from backup via same upsert |
| Observatory | **Untouched** — only Factory app listed / updated |
| Port schema | **No change** |

### Prod pin curl evidence

```text
HTTP/2 302
location: https://auth.getport.io/authorize?client_id=tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0
  &redirect_uri=https%3A%2F%2Ffactory-developer-os.vercel.app%2Fapi%2Fauth%2Fcallback
  &response_type=code&…
```

## Dry-run payload (exact upsert)

Remove **only**:

`https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback`

Keep (replace-entire-set):

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

## Execute

| Step | Detail |
|------|--------|
| Tool | Port MCP `upsert_external_interface_app` |
| Time | `2026-10-29T15:30:23.901Z` (`updatedAt` on app) |
| Post-state `redirectUris` | localhost · 127.0.0.1 · stable only (3 URIs) |
| Removed | `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback` |

## Post-verify (`list_external_interface_apps`)

```text
Factory · clientId tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0
1. http://localhost:3000/api/auth/callback
2. http://127.0.0.1:3000/api/auth/callback
3. https://factory-developer-os.vercel.app/api/auth/callback
```

Temp host absent. No other apps mutated.

## Rollback

Re-apply backup payload (full replace):

```json
{
  "appId": "iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug",
  "redirectUris": [
    "http://localhost:3000/api/auth/callback",
    "http://127.0.0.1:3000/api/auth/callback",
    "https://factory-developer-os.vercel.app/api/auth/callback",
    "https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback"
  ]
}
```

Or copy from [`oauth-uri-allowlist-backup.md`](./oauth-uri-allowlist-backup.md). Then `list_external_interface_apps` to confirm four URIs restored.

## Related

- [`port-oauth-redirect-pin.md`](./port-oauth-redirect-pin.md) · [#42](https://github.com/mplsjohnnycage/factory/pull/42)
- [`fe-128-oauth-prod-verify.md`](./fe-128-oauth-prod-verify.md)
- [`port-redirect-uri-hygiene.md`](./port-redirect-uri-hygiene.md)
