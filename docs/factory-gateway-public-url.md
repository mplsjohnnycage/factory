# factory-gateway public HTTPS URL — options + next click

**Checked:** 2026-10-29  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC** — do not flip private)  
**Need:** Reachable `FACTORY_GATEWAY_BASE_URL` so Port can remount `factory_*` WEBHOOK admits + Meta SS secrets without breaking live tools  
**PR:** **None** — no deploy config is ready to merge (no Dockerfile, no gateway Vercel project, no Funnel/Serve operator evidence in-repo)

## Verdict

There is **no** live public HTTPS URL for `apps/factory-gateway` today. Vercel already hosts **Developer OS** (`https://factory-developer-os.vercel.app`); that project is Next.js, not the gateway. The gateway is a long-lived Node `http.createServer` on `:8787` with in-process memory (catalog store, admit queue, rate limiter, accept ledger). Port SaaS must POST over the **public internet**, so Tailscale **Serve alone is insufficient** — Port is not on the operator tailnet.

**Recommended next click (operator desktop, no repo privacy change):** Tailscale **Funnel** in front of a running local/Compose gateway on `8787`. That is the M1 Spec path (Serve/Funnel only; no `factory-edge`). After `GET /health` returns 200 from a non-tailnet client, set Port secret `FACTORY_GATEWAY_BASE_URL` and remount.

---

## What exists today (evidence)

| Surface | Status | Notes |
|---------|--------|-------|
| `apps/factory-gateway` on `main` (`a023780`) | Code + tests green | `/webhooks/port`, `/webhooks/port/<factory_*>`, `/handlers/self-service`, `/catalog/*`, `/health` |
| Live Port `factory_*` (7) | Tools live | WEBHOOK nodes still → `api.port.io` (self-API), **not** gateway ([`port-workflow-webhooks.md`](./port-workflow-webhooks.md)) |
| Live Meta SS (`ss_convex_*`) | Workflows upserted | URLs use `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/handlers/self-service` — secret **unset / unused** until deploy |
| Vercel `factory-developer-os` | Public HTTPS | Domains: `factory-developer-os.vercel.app` (+ team aliases). **Shell only** — not gateway |
| Vercel `factory-meta-ci` | Scaffold / ignore-build | SSO-protected; canceled prod deploy; **not** a webhook host |
| Vercel project named `factory-gateway` | **Absent** | Listed team projects for this repo: Dev OS + meta-ci only |
| Dockerfile / Fly / Railway / Render | **Absent** | No container or PaaS config in repo |
| Tailscale Serve doc | Rivet `:6420` | [`docs/rivet-tailscale-serve.md`](https://github.com/mplsjohnnycage/factory/blob/main/docs/rivet-tailscale-serve.md) — Funnel called out as elevated public option (R-15) |

Hard constraint from FE-106: **do not remount** live WEBHOOK URLs onto a dead base URL.

---

## Options (ranked)

### A — Tailscale Funnel → local gateway `:8787` (**recommended for first public URL**)

| | |
|--|--|
| **Fit** | Matches master §13.4 / R-15 (M1: Serve/Funnel only). Keeps process model as-is (node:http + memory). Repo stays public. |
| **URL shape** | `https://<hostname>.<tailnet>.ts.net` (Funnel publishes to public internet; Serve is tailnet-only) |
| **Auth** | Keep Port HMAC (`PORT_CLIENT_SECRET`) + SS bearer (`FACTORY_GATEWAY_HANDLER_TOKEN`). Never rely on Funnel URL obscurity. |
| **Limits** | Operator machine must stay up; Funnel ACL/checklist before enable; rotate Funnel hostname on leak/operator change. In-memory state resets on process restart (fine for first remount smoke; durable store is later). |
| **Next click** | See [Recommended next click](#recommended-next-click) below. |

### B — Durable PaaS (Fly.io / Railway / Render / Cloud Run)

| | |
|--|--|
| **Fit** | Always-on public HTTPS without desktop uptime. Better once Port remount is daily-driver. |
| **Needs first** | Dockerfile (or Nixpacks start cmd), secrets wiring, healthcheck on `/health`, optional persistent volume if catalog/accept ledgers leave memory. Then a small Meta PR. |
| **When** | After Funnel proves Port→gateway HMAC path, or if Johnny wants always-on before remount. |
| **PR readiness** | **Not ready** — no deploy files on `main`. |

### C — Vercel project for gateway (**not recommended as-is**)

| | |
|--|--|
| **Why tempting** | Team already deploys from this public repo; Dev OS URL pattern is familiar. |
| **Why wrong now** | Gateway is not Next.js / not serverless-shaped. In-process queues, rate limiter, AcceptLedger, MemoryCatalogStore break across cold starts unless rewritten to external store + request handlers. `factory-meta-ci` is ignore-build + SSO — unusable as Port callback. |
| **If ever** | Explicit PBI: adapt gateway to Vercel Functions/Fluid + durable store; new project `factory-gateway` under team `johnnyc`; **do not** hitchhike Dev OS. Separate from Vercel CI Hive (still blocked for public repos — unrelated to hosting). |

### D — Cloudflare Tunnel / ngrok / similar

| | |
|--|--|
| **Fit** | Fast public HTTPS to localhost; similar to Funnel operationally. |
| **Vs Funnel** | Spec/ADR path prefers Tailscale Serve/Funnel for M1. Prefer Funnel unless Tailscale is unavailable on the pilot host. |
| **ngrok** | Dev-only; rotating URLs pain Port secrets; avoid for remount. |

### E — Flip repo private so “something Vercel” works

| | |
|--|--|
| **Status** | **Rejected** for this need. Public-repo Hive CI block does not unlock a gateway URL. Hosting Dev OS already works while public. **Do not flip private.** |

---

## Recommended next click

**Operator (desktop with Tailscale + Node 20+), Meta lane only:**

1. On the Rivet/operator host (or any always-on Meta box on the tailnet):
   ```bash
   cd apps/factory-gateway
   export PORT_CLIENT_SECRET='…'          # Port classic webhook / EI client secret
   export FACTORY_GATEWAY_HANDLER_TOKEN='…'  # shared with Port secret of same name
   # optional: CONVEX_TEAM_TOKEN, RIVET_SUPERVISOR_URL (Serve URL for Rivet)
   npm ci && npm start   # listens 0.0.0.0:8787
   ```
2. Confirm local health: `curl -fsS http://127.0.0.1:8787/health` → `{"ok":true,"service":"factory-gateway"}`.
3. Publish **Funnel** (public), not Serve-only:
   ```bash
   tailscale funnel 8787
   # or: tailscale funnel --bg 8787
   tailscale funnel status
   ```
4. From a **non-tailnet** network (phone LTE / Port can’t be assumed on tailnet):  
   `curl -fsS "https://<funnel-host>/health"` → 200.
5. Record base URL **without** trailing slash as `FACTORY_GATEWAY_BASE_URL` (e.g. `https://desktop.<tailnet>.ts.net`).
6. In Port (human / MCP secrets — not OAuth app create):
   - Set secrets: `FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN` (match gateway env).
   - Remount **only** after health is green:
     - Meta SS: already templated → `{BASE}/handlers/self-service`
     - `factory_*` admits: add/retarget a **notify/admit** WEBHOOK → `{BASE}/webhooks/port/<factory_*>` (HMAC on). Prefer a new node after lease write — **do not** replace Port self-API GET fencing nodes ([`docs/port-workflow-webhooks.md`](https://github.com/mplsjohnnycage/factory/blob/main/docs/port-workflow-webhooks.md)).
7. Smoke: Port `trigger_run` / self-service → gateway logs 202 / handler response; invalid HMAC → 401.

**Auth checklist (R-15):** Funnel ≠ auth. HMAC + bearer still required; rotate Funnel URL if leaked; prefer Serve for Rivet BFF when Vercel can reach the tailnet without Funnel.

---

## Port secret / path cheat sheet

| Port secret | Gateway env | Used by |
|-------------|-------------|---------|
| `FACTORY_GATEWAY_BASE_URL` | (public URL only; not an env on gateway) | SS WEBHOOK URL templates; future `factory_*` admit nodes |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | `FACTORY_GATEWAY_HANDLER_TOKEN` | `Authorization: Bearer` on `/handlers/self-service` |
| (classic webhook / client secret) | `PORT_CLIENT_SECRET` | HMAC on `/webhooks/port*` and optional SS HMAC |
| `CONVEX_TEAM_TOKEN` | `CONVEX_TEAM_TOKEN` | `ss_convex_*` Management API |

Paths once base URL exists:

- `GET  {BASE}/health`
- `POST {BASE}/webhooks/port/<factory_*>`
- `POST {BASE}/handlers/self-service`

---

## Why no PR from this pass

Deploy/config is **not** clearly ready:

- No `Dockerfile` / `fly.toml` / gateway `vercel.json`
- No Vercel project for gateway
- Funnel/Serve live evidence is **operator desktop**, not mergeable scaffolding

A later Meta PR is appropriate when choosing durable PaaS (option B) or a deliberate Vercel rewrite (option C) — not for flipping visibility or bolting gateway onto Dev OS.

---

## Explicit non-goals

- Do not make the GitHub repo private  
- Do not create/delete/revoke Port External Interface OAuth apps  
- Do not remount live WEBHOOKs before public `/health` succeeds  
- Do not call Sandbox Agent from the browser / Dev OS  
- Do not treat `factory-meta-ci` or `factory-developer-os` as the gateway base URL  
