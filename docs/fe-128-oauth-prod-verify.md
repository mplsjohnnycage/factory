# FE-128 — Live prod OAuth verify (stable alias)

**When:** 2026-10-29 ~03:27 America/Chicago · **tick** offline-desktop ops (post-#42 merge)  
**Alias:** `https://factory-developer-os.vercel.app`  
**Pin:** [`port-oauth-redirect-pin.md`](./port-oauth-redirect-pin.md) · [#42](https://github.com/mplsjohnnycage/factory/pull/42) **MERGED** → `main` @ `b489d2c`  
**Path:** `/api/auth/callback` (login `/api/auth/port/login`)  
**FE-128 status:** **OPEN** — curl-only bar met; human login + prune blocked on Johnny (desktops offline)

## Tick status

| Check | Result |
|-------|--------|
| `GET /api/auth/port/login` on stable alias | **302** → Auth0 |
| `redirect_uri` query | **`https://factory-developer-os.vercel.app/api/auth/callback`** ✅ (curl-only recheck this tick) |
| `client_id` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` (Factory) |
| Hard-pin PR | **[#42](https://github.com/mplsjohnnycage/factory/pull/42) MERGED** 2026-10-29T08:40:08Z → merge commit `b489d2c` |
| Hard-pin code on `main` / prod alias | **Landed** — stable alias emits pinned `redirect_uri` (curl) |
| Human Sign in with Port on stable | **Blocked on Johnny** — Johhny-NET + DESKTOP-3APDBKG offline |
| Prune `n5tdoht4l` URI | **HARD BAN this run** — wait for Johnny after human login |

## Curl-only recheck (this tick — no human login)

```text
curl -sSI https://factory-developer-os.vercel.app/api/auth/port/login
→ Location: https://auth.getport.io/authorize?client_id=tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0
  &redirect_uri=https%3A%2F%2Ffactory-developer-os.vercel.app%2Fapi%2Fauth%2Fcallback
  &response_type=code&…
PASS — redirect_uri matches stable alias callback
```

No browser session, no Port mutate, no EI upsert.

## Factory EI allowlist (live now — do not prune)

1. `http://localhost:3000/api/auth/callback`  
2. `http://127.0.0.1:3000/api/auth/callback`  
3. `https://factory-developer-os.vercel.app/api/auth/callback`  
4. `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback` *(temp — prune only after Johnny confirms post human login)*  

## Next (blocked on Johnny)

1. ~~Merge #42~~ **done** (`b489d2c`)  
2. Curl recheck stable login — **done this tick (PASS)**  
3. Human Sign in with Port from production domain (needs desktop online)  
4. Johnny confirms → then prune URI #4 via Port `upsert_external_interface_app` (stable + localhost only) — **not this run**

## Related

- [`morning-parallel-sprint.md`](./morning-parallel-sprint.md)  
- [`offline-desktop-ops-tick.md`](./offline-desktop-ops-tick.md)  
- [`claude-code-handoff.md`](./claude-code-handoff.md)  
