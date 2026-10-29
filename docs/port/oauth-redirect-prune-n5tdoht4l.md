# OAuth redirect prune — temp `n5tdoht4l` (executed)

**When:** 2026-10-29  
**App:** Factory External Interface · `appId=iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` · `clientId=tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`  
**Lane:** Meta · reversible Port upsert

## Dry-run (pre)

Listed redirects:

1. `http://localhost:3000/api/auth/callback` — keep
2. `http://127.0.0.1:3000/api/auth/callback` — keep
3. `https://factory-developer-os.vercel.app/api/auth/callback` — keep
4. `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback` — **prune**

## Backup allowlist (rollback payload)

```json
[
  "http://localhost:3000/api/auth/callback",
  "http://127.0.0.1:3000/api/auth/callback",
  "https://factory-developer-os.vercel.app/api/auth/callback",
  "https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback"
]
```

## Execute

`upsert_external_interface_app` with keepers only (replace-set). Verified post-list = 3 URIs, temp host gone. `updatedAt=2026-10-29T15:30:23.901Z`.

## Rollback

```text
upsert_external_interface_app(
  appId=iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug,
  name=Factory,
  redirectUris=<backup allowlist above>
)
```

Free · reversible · no Observatory.
