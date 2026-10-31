# FE-142 — HMAC + gateway secrets smoke (Projects Manager)

**Lane:** Meta  
**Audience:** Projects Manager (not Johnny)  
**Funnel live:** `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Repo kit (main):** `docs/gateway-hmac-smoke.md` · `scripts/gateway-tailnet-health.mjs` · `scripts/windows/gateway.env.example`  
**Related store:** [`port-webhook-remount-live.md`](./port-webhook-remount-live.md) · [`remount-armed-runbook.md`](./remount-armed-runbook.md) · [`gateway-logon-autostart.md`](./gateway-logon-autostart.md) · [`beads-tailnet-gateway-tick.md`](./beads-tailnet-gateway-tick.md)

**Never print secret values** in chat, docs, logs, or PRs. Confirm presence / match only.

## Verdict (this cloud VM)

| Check | Result |
|-------|--------|
| Funnel `GET /health` | **PASS** `200` `{"ok":true,"service":"factory-gateway"}` |
| Unsigned HMAC / allowlist / SS probes (`gateway-tailnet-health.mjs`) | **PASS** exit 0 → 401 / 404 / 401 |
| Signed claim smoke (`GATEWAY_HMAC_SMOKE=1`) | **BLOCKED** — secrets **ABSENT** on this cloud VM |
| Port schema / workflow upsert / EI create | **Not done** (refused) |

`PORT_CLIENT_SECRET`, `FACTORY_GATEWAY_HANDLER_TOKEN`, `FACTORY_GATEWAY_BASE_URL`, `CONVEX_TEAM_TOKEN` — all **ABSENT** in process env; no `apps/factory-gateway/.env`, no `compose/.env`, no `%USERPROFILE%\.factory\gateway.env` here; Vercel CLI absent. Signed **202** cannot run from this agent until PM fills the slots below on desktop + Port.

---

## Exact secret names + where they must match

| Name | Port (org Secrets UI) | Desktop gateway (`%USERPROFILE%\.factory\gateway.env` on DESKTOP-3APDBKG) | Vercel (Dev OS) | Must equal |
|------|----------------------|---------------------------------------------------------------------------|-----------------|------------|
| **Port Client Secret** (classic webhook / EI signing secret) | *(Port credential used for outbound WEBHOOK HMAC — not a named org secret slot; Port signs with it automatically)* | Env key **`PORT_CLIENT_SECRET`** | **Not used** for Funnel HMAC | Port Client Secret ↔ gateway `PORT_CLIENT_SECRET` **byte-identical** |
| **`FACTORY_GATEWAY_HANDLER_TOKEN`** | Port org secret **`FACTORY_GATEWAY_HANDLER_TOKEN`** | Env key **`FACTORY_GATEWAY_HANDLER_TOKEN`** | **Not required** for admit HMAC (SS only) | Same random bearer both sides |
| **`FACTORY_GATEWAY_BASE_URL`** | Port org secret **`FACTORY_GATEWAY_BASE_URL`** = `https://desktop-3apdbkg.taildf3a4b.ts.net` (no trailing slash) | *(public URL — optional local note; not an HMAC secret)* | **Do not** point gateway at Vercel | Templates → Funnel origin |
| **`CONVEX_TEAM_TOKEN`** (optional, Meta `ss_convex_*` only) | Port org secret **`CONVEX_TEAM_TOKEN`** (if SS Convex used) | Env key **`CONVEX_TEAM_TOKEN`** | Unrelated to HMAC admit | Same token both sides when SS Convex is smoked |

### Match map (auth paths)

```
Port WEBHOOK → POST {BASE}/webhooks/port/<factory_*>
  Port signs:  x-port-timestamp + x-port-signature: v1,<base64>
               over `${timestamp}.${rawBody}` HMAC-SHA-256 with Client Secret
  Gateway verifies with process env PORT_CLIENT_SECRET
  → match + allowlisted action → 202 { ok, admitId, actionIdentifier }
  → mismatch / unsigned → 401 invalid_port_signature (no enqueue)

Port Meta SS → POST {BASE}/handlers/self-service
  Auth: Port classic HMAC (PORT_CLIENT_SECRET) OR
        Authorization: Bearer {{ .secrets["FACTORY_GATEWAY_HANDLER_TOKEN"] }}
  Gateway accepts either; bad both → 401 unauthorized_handler
```

**Do not create** new Port External Interface / OAuth apps. Reuse the live Factory app Client Secret for `PORT_CLIENT_SECRET`. Port MCP has **no** secrets upsert — UI / operator vault only.

---

## Dry-run checklist (staged + executed here)

```text
[x] Funnel BASE = https://desktop-3apdbkg.taildf3a4b.ts.net (no trailing slash)
[x] GET /health → 200 factory-gateway (non-tailnet / this cloud VM)
[x] Unsigned claim POST → 401 invalid_port_signature
[x] Unknown path POST → 404 not_found
[x] SS Bearer bad → 401 unauthorized_handler
[ ] PM: set PORT_CLIENT_SECRET on desktop gateway.env (= Port Client Secret)
[ ] PM: set FACTORY_GATEWAY_HANDLER_TOKEN on Port Secrets + same value in gateway.env
[ ] PM: confirm/set FACTORY_GATEWAY_BASE_URL Port secret to Funnel origin above
[ ] Restart gateway on DESKTOP-3APDBKG (logon task / npm start) so env loads
[ ] Re-run unsigned probes (still 401/404/401 for bad auth)
[ ] Signed smoke: GATEWAY_HMAC_SMOKE=1 + PORT_CLIENT_SECRET from env → expect 202
[ ] Optional: SS good Bearer → 2xx (no catalog mutate unless approved fixture)
```

Official unsigned command (safe, zero spend, no Port mutate):

```bash
node scripts/gateway-tailnet-health.mjs \
  --base-url 'https://desktop-3apdbkg.taildf3a4b.ts.net'
# expect exit 0
```

---

## Where to set (operator slots)

### 1) Desktop — `%USERPROFILE%\.factory\gateway.env`

Copy from repo `scripts/windows/gateway.env.example` (empty values only). Fill:

- `PORT_CLIENT_SECRET=` *(Port Client Secret — never commit)*
- `FACTORY_GATEWAY_HANDLER_TOKEN=` *(same as Port secret)*
- Optional: `CONVEX_TEAM_TOKEN=`, `RIVET_SUPERVISOR_URL=`, `GATEWAY_HOST` / `GATEWAY_PORT`

Loaded by Windows logon kit (`scripts/windows/factory-gateway-logon-start.ps1`). Restart gateway after edits.

### 2) Port UI → Credentials / Secrets

- `FACTORY_GATEWAY_BASE_URL` = `https://desktop-3apdbkg.taildf3a4b.ts.net`
- `FACTORY_GATEWAY_HANDLER_TOKEN` = mirror of desktop env
- Confirm classic / EI **Client Secret** is the source of truth for gateway `PORT_CLIENT_SECRET` (HMAC)
- Optional: `CONVEX_TEAM_TOKEN` for Meta Convex SS

### 3) Vercel

**Out of path for Funnel HMAC.** Dev OS / Vercel env may hold Port OAuth client bits for browser login — **do not** treat those as gateway admit secrets and **do not** set `FACTORY_GATEWAY_BASE_URL` to a Vercel host. No Vercel secret change required for FE-142 signed admit smoke.

---

## Verification curls (no secret bodies)

```bash
BASE=https://desktop-3apdbkg.taildf3a4b.ts.net

# Health
curl -fsS --max-time 15 "$BASE/health"
# → {"ok":true,"service":"factory-gateway"}

# Unsigned admit (must stay 401 until secrets match AND you send a valid signature)
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  "$BASE/webhooks/port/factory_claim_next_job" \
  -H 'content-type: application/json' \
  -d '{"action":"factory_claim_next_job"}'
# → 401

# Allowlist
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  "$BASE/webhooks/port/not_a_factory_tool" \
  -H 'content-type: application/json' -d '{}'
# → 404

# SS bad bearer
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  "$BASE/handlers/self-service" \
  -H 'content-type: application/json' \
  -H 'Authorization: Bearer bad' \
  -d '{"action":"ss_convex_create_preview"}'
# → 401
```

Signed claim (after slots filled — secret from env only; **never echo**):

```bash
# On a host that can read the secret from a vault/env file — not this cloud VM today
GATEWAY_HMAC_SMOKE=1 \
FACTORY_GATEWAY_BASE_URL="$BASE" \
PORT_CLIENT_SECRET="$(vault-read …)" \
  node scripts/gateway-tailnet-health.mjs
# → probe 5: HTTP 202 + admitId; mismatch still 401
```

Do **not** paste `x-port-signature` digests or bearer tokens into chat. Status codes + `ok`/`error`/`admitId` keys only.

---

## Explicit non-goals (held)

- No new Port OAuth / External Interface apps  
- No Port schema / blueprint upserts  
- No `trigger_run` of `factory_*` (catalog mutate) without approved fixture  
- No spend  
- No printing secret values  

---

## 3-line PM ask

1. Fill **desktop** `%USERPROFILE%\.factory\gateway.env` on DESKTOP-3APDBKG: `PORT_CLIENT_SECRET` (= live Factory Port Client Secret) + `FACTORY_GATEWAY_HANDLER_TOKEN` (new random bearer); restart gateway.  
2. Fill **Port Secrets**: `FACTORY_GATEWAY_HANDLER_TOKEN` (same bearer) + confirm `FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net` (no Vercel).  
3. Re-run `GATEWAY_HMAC_SMOKE=1` via `scripts/gateway-tailnet-health.mjs` → expect signed claim **202**; reply here with status codes only (never secret values).
