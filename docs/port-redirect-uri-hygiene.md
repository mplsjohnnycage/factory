# Port Factory redirect URI hygiene

**Audience:** Johnny / Meta ops only  
**When:** 2026-10-29  
**Lane:** Meta · ADR-005 (live Factory External Interface)  
**Agents:** **recommend-only** — do **not** call Port `upsert_external_interface_app` (or create/delete/revoke External Interface apps). ADR no create/delete from agents is strict.

## Callback path (canonical)

Developer OS `CALLBACK_PATH` is:

```text
/api/auth/callback
```

Not `/port/callback`, not `/api/auth/port/callback`. Every Port `redirect_uri` must end with `/api/auth/callback` (exact match to `apps/developer-os` + `specs/auth-port-oauth`).

## Current allowlist (observed)

Factory External Interface currently includes (among others):

| URI | Role |
|-----|------|
| `https://factory-developer-os.vercel.app/api/auth/callback` | **Stable** production / project domain — **keep** |
| `http://localhost:3000/api/auth/callback` | Local — **keep** |
| `http://127.0.0.1:3000/api/auth/callback` | Local — **keep** (if present) |
| `https://factory-developer-m0ys38nak-johnnyc.vercel.app/api/auth/callback` | Ephemeral Vercel preview — **drop when convenient** |
| `https://factory-developer-4vf3fb75w-johnnyc.vercel.app/api/auth/callback` | Ephemeral Vercel preview — **drop when convenient** |

## Recommendation

1. **Keep** stable `https://factory-developer-os.vercel.app/api/auth/callback` plus localhost (`localhost` / `127.0.0.1` on port 3000).
2. **Drop** ephemeral `factory-developer-*-johnnyc.vercel.app` preview callbacks when ops next edits the app — they rot as previews recycle and burn the 1–5 URI budget.
3. Prefer pinning `NEXT_PUBLIC_DEVOS_URL=https://factory-developer-os.vercel.app` so builds emit the stable origin instead of registering every preview host (see [`devos-stable-oauth-url.md`](./devos-stable-oauth-url.md); that note’s older `/api/auth/port/callback` path is superseded — use `/api/auth/callback`).
4. Full replace-set on Port update: list only the URIs you intend to keep; Port does not merge casually.

## Who may change Port

| Actor | Action |
|-------|--------|
| Johnny / authorized Meta ops | May update Factory External Interface `redirect_uris` via Port UI or MCP |
| Coding agents / Project workers | Document + recommend only — **no** `upsert_external_interface_app` |

## Related

- Live app record: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)
- Stable origin env: [`devos-stable-oauth-url.md`](./devos-stable-oauth-url.md)
- Spec: `specs/auth-port-oauth/spec.md` · code: `apps/developer-os/src/lib/port-oauth.ts` (`CALLBACK_PATH`)
