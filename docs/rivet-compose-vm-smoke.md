# Rivet Compose — agent VM smoke (2026-10-29)

## Verdict

**Compose can start on this agent VM** (Engine reachable + image pull + `/health` 200), but this is **not** the pilot host: no `docker` on PATH, no Tailscale → **Serve/Funnel evidence stays operator desktop**.

| Check | Result |
|-------|--------|
| Docker Engine | **Y** — TCP `127.0.0.1:2375` (API 1.52 / Engine 29.1.4) |
| `docker` CLI on PATH | **N** |
| Compose plugin on PATH | **N** (temp CLI+plugin used for smoke) |
| `compose/.env` | Absent (only `.env.example`; correct) |
| Port `6420` | Free before/after; publish works |
| `docker compose config` | OK with `--env-file` + temp token |
| Smoke `up` → `/health` | **200** `{"runtime":"engine","status":"ok","version":"2.3.3"}` then `down -v` |
| Tailscale | **Absent** |

## What blocks pilot Rivet on this agent VM

1. **No Tailscale** — cannot run Serve or Funnel; live HTTPS evidence is desktop-only (`docs/rivet-tailscale-serve.md`).
2. **No Docker CLI/Compose on PATH** — daemon exists on `:2375` only; `bin/install.sh` exits until CLI is installed.
3. **Pilot topology** — Compose README targets operator desktop + Tailscale Serve, not cloud agents.

Non-blockers for local engine only: disk (~246G free), port 6420 free, image pull OK, health recovers quickly.

## Operator desktop — Funnel path (exact)

Prefer **Serve** (tailnet-only). Funnel = public internet (elevated; no Tailscale identity headers; R-15).

```bash
cd compose
cp .env.example .env
# edit: RIVET_ADMIN_TOKEN=$(openssl rand -hex 32)

docker compose config >/dev/null
docker compose up -d
../bin/rivet-healthcheck.sh
../bin/rivet-healthcheck.sh --restart-proof

# Funnel (public) — after local /health is green:
tailscale funnel --bg 6420
tailscale funnel status
curl -fsS "https://<hostname>.<tailnet>.ts.net/health"

# Tear down Funnel when done:
tailscale funnel reset
# or: tailscale funnel off
```

Serve alternative (preferred for pilot):

```bash
tailscale serve --bg 6420
tailscale serve status
# record FACTORY_RIVET_SERVE_URL=https://<hostname>.<tailnet>.ts.net
```

## Agent VM commands used (smoke only; containers removed)

```bash
export DOCKER_HOST=tcp://127.0.0.1:2375
# temp static docker CLI + compose plugin v5.6.1 under /tmp/docker-cli-smoke
docker compose --env-file /tmp/rivet-compose-smoke.env config
docker compose --env-file /tmp/rivet-compose-smoke.env up -d
curl -fsS http://127.0.0.1:6420/health
docker compose --env-file /tmp/rivet-compose-smoke.env down -v
```

No long-running Rivet containers left; `compose/.env` was never written in-repo.
