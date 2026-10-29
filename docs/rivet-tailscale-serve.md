# Tailscale Serve for Rivet (Factory Meta pilot)

**PBI:** PBI-004 / STL-165 · **Spec:** `rivet-execution` · **Topology:** master §13.4

## Purpose

Publish the desktop Rivet control plane (`127.0.0.1:6420`) as **HTTPS on the operator tailnet** so Developer OS (Vercel BFF) and `factory-gateway` can reach Actor HTTP/SSE without `factory-edge` (M1 Non-Goal).

Serve = tailnet-only. Funnel = public internet (elevated; optional; see R-15). Prefer Serve.

## Prerequisites

1. Tailscale installed and logged in on the Rivet Compose host.
2. HTTPS certificates enabled for the tailnet ([Serve docs](https://tailscale.com/docs/features/tailscale-serve)).
3. Rivet Compose healthy locally: `bin/rivet-healthcheck.sh` against `http://127.0.0.1:6420/health`.

## Serve the engine

With Compose up on port `6420`:

```bash
# Foreground (good for first bring-up)
tailscale serve 6420

# Or background / reset-friendly
tailscale serve --bg 6420
tailscale serve status
```

Expected shape:

```text
Available within your tailnet:
https://<hostname>.<tailnet>.ts.net
|-- / proxy http://127.0.0.1:6420
```

Record `FACTORY_RIVET_SERVE_URL=https://…` in local env (not git) for gateway / Dev OS later.

## Health via Serve

From another device on the same tailnet (or the host via the Serve URL):

```bash
curl -fsS "${FACTORY_RIVET_SERVE_URL}/health"
```

Expect HTTP 200. After `docker compose restart` on the pilot host, local `/health` must recover first; Serve then proxies the recovered listener.

## Identity headers (Serve only)

Serve injects Tailscale identity headers (`Tailscale-User-Login`, etc.) for tailnet clients. Funnel does **not**. Gateway HMAC + Port OAuth remain required — never rely on URL obscurity (R-14 / R-15).

## What not to do

| Banned | Why |
|--------|-----|
| `factory-edge` relay in M1 | Master Non-Goal; Serve/Funnel only |
| Browser → Sandbox Agent | Hard rule; browser talks Dev OS / Port only |
| Commit admin tokens or Serve ACL secrets | Env / vault only |
| Product Beads / Port OAuth create from this unit | Meta lane |

## Operator evidence checklist (desktop)

Paste into the PR or Linear when live evidence exists:

- [ ] `docker compose up -d` in `compose/`
- [ ] `bin/rivet-healthcheck.sh --restart-proof` exit 0
- [ ] `tailscale serve 6420` shows HTTPS URL
- [ ] `curl -fsS "$FACTORY_RIVET_SERVE_URL/health"` → 200 from a tailnet client
- [ ] Serve URL noted in PR comment (hostname OK; no tokens)

Cloud agents without Docker/Tailscale author the files and CI lint; **live Serve evidence stays desktop-pilot**.

## Ops kit (Projects Manager)

Offline markers + optional compose lint (no Port upserts, no secrets):

```bash
npm run dry-run:rivet-compose-serve
npm run dry-run:rivet-compose-serve -- --lint
```

Full checklist: [`docs/ops/rivet-compose-serve-smoke.md`](./ops/rivet-compose-serve-smoke.md).
