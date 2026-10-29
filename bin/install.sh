#!/usr/bin/env bash
# Factory Meta — operator desktop bootstrap stub (PBI-004+)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Factory Meta install — Rivet Compose desktop pilot"
echo "Repo: $ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found. Install Docker Desktop/Engine, then re-run." >&2
  echo "Compose files are ready under compose/ (see compose/README.md)." >&2
  exit 1
fi

if [[ ! -f "$ROOT/compose/.env" ]]; then
  cp "$ROOT/compose/.env.example" "$ROOT/compose/.env"
  if command -v openssl >/dev/null 2>&1; then
    token="$(openssl rand -hex 32)"
    # portable-ish in-place replace for RIVET_ADMIN_TOKEN=
    if command -v sed >/dev/null 2>&1; then
      sed -i.bak "s|^RIVET_ADMIN_TOKEN=.*|RIVET_ADMIN_TOKEN=${token}|" "$ROOT/compose/.env"
      rm -f "$ROOT/compose/.env.bak"
    fi
    echo "Wrote compose/.env with generated RIVET_ADMIN_TOKEN"
  else
    echo "Wrote compose/.env from example — set RIVET_ADMIN_TOKEN manually" >&2
  fi
fi

(cd "$ROOT/compose" && docker compose up -d)
"$ROOT/bin/rivet-healthcheck.sh" --wait

echo
echo "Next: Tailscale Serve — see docs/rivet-tailscale-serve.md"
echo "  tailscale serve 6420"
