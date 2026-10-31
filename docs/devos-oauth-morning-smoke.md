# Dev OS OAuth morning smoke (post FE-120)

**When:** 2026-10-29  
**Verdict:** **PASS**  
**Scope:** Confirm Port OAuth wiring on `factory-developer-os` after stable-origin env (`NEXT_PUBLIC_DEVOS_URL`).

## 1. Code — `apps/developer-os/src/lib/port-oauth.ts`

| Check | Result |
|-------|--------|
| `CALLBACK_PATH` | `/api/auth/callback` |
| Origin preference | `NEXT_PUBLIC_DEVOS_URL` → else `https://${VERCEL_URL}` → else `http://localhost:3000` |
| `redirectUri` | `` `${origin}${CALLBACK_PATH}` `` |

Login route discovered from code / UI: **`/api/auth/port/login`** (`AtlasHero` CTA + `src/app/api/auth/port/login`).

## 2. Vercel (team `johnnyc` · project `factory-developer-os`)

| Check | Result |
|-------|--------|
| `NEXT_PUBLIC_DEVOS_URL` | Present — `https://factory-developer-os.vercel.app` |
| Targets | `production`, `preview`, `development` |
| Env id | `ySZHzGmEbWZPoL5J` |
| Also present | `PORT_FACTORY_CLIENT_ID` = Factory client (not Observatory) |
| Production hostname | `factory-developer-os.vercel.app` → `dpl_EzdHTjfhR6WEoX5gx3fYY6nvE3pb` |
| Deployment state | **READY** (`readyState: READY`, target `production`) |
| Git | `main` @ `fd4a77464cd5d7d94461edbd99c989d021669be3` |
| Aliases | `factory-developer-os.vercel.app`, `factory-developer-os-johnnyc.vercel.app`, `factory-developer-os-git-main-johnnyc.vercel.app` |

## 3. Live login redirect (`curl`)

```text
GET https://factory-developer-os.vercel.app/api/auth/port/login
→ HTTP/2 302
Location: https://auth.getport.io/authorize?...&redirect_uri=https%3A%2F%2Ffactory-developer-os.vercel.app%2Fapi%2Fauth%2Fcallback&...
```

| Check | Result |
|-------|--------|
| Status | 302 |
| Decoded `redirect_uri` | `https://factory-developer-os.vercel.app/api/auth/callback` |
| Encoded form match | `redirect_uri=https%3A%2F%2Ffactory-developer-os.vercel.app%2Fapi%2Fauth%2Fcallback` |
| Authorize host | `auth.getport.io` |
| Client id | Factory live id (`tnPUmUX5…`) |
| PKCE | `code_challenge_method=S256` + state/verifier cookies set |

## Verdict

**PASS** — code prefers stable `NEXT_PUBLIC_DEVOS_URL`, env is set on johnnyc/`factory-developer-os`, production deployment is READY, and live login emits the allowlisted callback URI (not an ephemeral `VERCEL_URL` host).

## Related

- [`devos-stable-oauth-url.md`](./devos-stable-oauth-url.md) — FE-120 env record  
- Spec: `specs/auth-port-oauth/spec.md` · ADR-005 / ADR-011
