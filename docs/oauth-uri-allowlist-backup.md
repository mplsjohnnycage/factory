# OAuth URI allowlist backup — Factory EI

**When:** 2026-10-29T15:30:07Z (pre-prune snapshot)  
**Source:** Port MCP `list_external_interface_apps`  
**Scope:** Factory External Interface only — **no Observatory**

## App identity

| Field | Value |
|-------|-------|
| `appId` | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` |
| `clientId` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| `name` | `Factory` |
| `orgId` | `org_rNq4tjSc8DXL1ceL` |
| `createdAt` | `2026-10-29T00:14:07.481Z` |
| `updatedAt` | `2026-10-29T14:59:30.566Z` |
| `lastLoginAt` | `2026-10-29T14:59:30.566Z` |

## Live `redirectUris` (exact order as returned)

1. `http://localhost:3000/api/auth/callback`
2. `http://127.0.0.1:3000/api/auth/callback`
3. `https://factory-developer-os.vercel.app/api/auth/callback`
4. `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback`

## Rollback payload

Restore the pre-prune set with Port MCP `upsert_external_interface_app`:

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

`redirectUris` **replaces** the entire set (not merge). Do not omit localhost or the stable alias when rolling back.
