# FE-168 / FE-172 — Port human-login verify (CLOSED)

**When:** 2026-10-29 (PM final)  
**Lane:** Meta · **Audience:** Projects Manager  
**Status:** **CLOSED** — do not ask Johnny  

## PM final checklist (2026-10-29)

| Check | Result |
|-------|--------|
| Curl pin | **PASS** — 302 to `auth.getport.io`; `redirect_uri` = stable `/api/auth/callback` |
| Allowlist | **PASS** — 3 keepers only: `localhost:3000`, `127.0.0.1:3000`, stable `vercel.app` callback; no `*-johnnyc.vercel.app`; nothing changed |
| Human Sign-in | **Satisfied** — Port app `lastLoginAt` **11:02 AM CT** today; treat as PASS unless contrary evidence |

## Curl pin (prior cloud tick)

```text
GET https://factory-developer-os.vercel.app/api/auth/port/login
→ HTTP/2 302
→ auth.getport.io authorize
→ redirect_uri=https://factory-developer-os.vercel.app/api/auth/callback
PASS
```

## Closed — no further asks

- Do **not** ask Johnny for Sign-in  
- Do **not** re-open FE-142 secret fill  
- Observatory untouched  
- Port schema upserts: none this lane  

## 3-line PM summary (closed)

1. Curl pin **PASS** (302 → auth.getport.io, stable callback).  
2. Allowlist **PASS** (3 keepers only; no ephemeral `*-johnnyc.vercel.app`).  
3. Human Sign-in **satisfied** via Port `lastLoginAt` 11:02 AM CT today — FE-172/FE-168 **CLOSED**.
