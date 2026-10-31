# Funnel remount status (FE-124 / FE-129)

**Checked:** 2026-10-29 (live remount after Funnel `/health` green)  
**Lane:** Meta only  
**Evidence:** [`port-webhook-remount-live.md`](./port-webhook-remount-live.md) · [`remount-armed-runbook.md`](./remount-armed-runbook.md)

> ## STATUS BANNER — LIVE remount (secrets pending match)
>
> Public Funnel base: **`https://desktop-3apdbkg.taildf3a4b.ts.net`**  
> Off-tailnet `GET /health` → **200** `{"ok":true,"service":"factory-gateway"}`.  
> **7 / 7** `factory_*` workflows have additive `gateway_admit` →  
> `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<id>`.  
> Fencing GETs remain on **`api.port.io`**.  
> **Johnny:** set Port + desktop gateway secrets (see one-liner in remount-live doc) — HMAC stays **401** until then.  
> **Hard bans held:** no OAuth prune (`n5tdoht4l`); no PBI-015; no Observatory.

## Verdict

| Check | Result |
|-------|--------|
| Pilot host | **DESKTOP-3APDBKG** Funnel live |
| Public `GET /health` | **200** factory-gateway |
| Port `FACTORY_GATEWAY_BASE_URL` secret | **Johnny UI** — Port MCP has no secrets tool; must set to Funnel URL |
| Gateway `PORT_CLIENT_SECRET` / `FACTORY_GATEWAY_HANDLER_TOKEN` | **Still missing on desktop process** — unsigned POST → `401 invalid_port_signature` |
| Live Port `factory_*` remount | **7/7 additive `gateway_admit`** ([`port-webhook-remount-live.md`](./port-webhook-remount-live.md)) |
| Fencing WEBHOOKs | Still **`api.port.io`** — never replaced |
| Meta SS (`ss_convex_*`) | Still templated → `…/handlers/self-service` — arms when base + bearer secrets set |
| Remount kit on `main` | Merged [#40](https://github.com/mplsjohnnycage/factory/pull/40) + Dockerfile [#41](https://github.com/mplsjohnnycage/factory/pull/41) |
| Port MCP | `Port-eu` · Johnny Admin · org `mplsjohnnycage` |

**Next owner:** Johnny — Port Secrets UI + mirror `PORT_CLIENT_SECRET` / `FACTORY_GATEWAY_HANDLER_TOKEN` into gateway env on DESKTOP-3APDBKG, restart gateway, then expect admit **202**.

---

## Smoke already taken (cloud VM, no valid HMAC)

| Probe | Expect / got |
|-------|----------------|
| `GET {BASE}/health` | **200** ok |
| `POST {BASE}/webhooks/port/factory_claim_next_job` unsigned | **401** `invalid_port_signature` |
| `POST {BASE}/webhooks/port/not_a_factory_tool` | **404** |
| `POST {BASE}/handlers/self-service` bad bearer | **401** |

---

## Exact Muse / Johnny steps remaining

### D — Set Port secrets (UI — MCP cannot upsert)

| Port secret | Value |
|-------------|-------|
| `FACTORY_GATEWAY_BASE_URL` | `https://desktop-3apdbkg.taildf3a4b.ts.net` |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | Same random bearer as gateway env |
| Classic / Client Secret | Match gateway `PORT_CLIENT_SECRET` |

### Desktop gateway env (same values)

```bash
export PORT_CLIENT_SECRET='…'            # Port Client Secret
export FACTORY_GATEWAY_HANDLER_TOKEN='…' # same as Port secret
# restart factory-gateway on :8787 / Funnel
```

### E — Remount — **DONE** (agents)

Additive `gateway_admit` on all 7 `factory_*` IDs. Details: [`port-webhook-remount-live.md`](./port-webhook-remount-live.md).

---

## Explicit non-goals (this pass)

- No OAuth External Interface create/delete/revoke  
- No prune of 5th callback URI (`n5tdoht4l`)  
- No PBI-015  
- No Observatory  
- No replace of `api.port.io` fencing nodes  

---

## Handoff

1. **Johnny:** Port Secrets + desktop gateway env match → restart → admit **202**.  
2. Optional: smoke one Meta SS + one `factory_claim_next_job` after secrets match.  
3. Cloud agents: remount **done**; do not re-upsert unless Funnel host rotates.  
