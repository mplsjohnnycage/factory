#!/usr/bin/env bash
# Factory Meta — Rivet Compose health (PBI-004 / STL-165)
# Contract: health recovers after Compose restart.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_DIR="${COMPOSE_DIR:-$ROOT/compose}"
BASE_URL="${RIVET_HEALTH_URL:-http://127.0.0.1:6420}"
HEALTH_PATH="${RIVET_HEALTH_PATH:-/health}"
TIMEOUT_SEC="${RIVET_HEALTH_TIMEOUT_SEC:-90}"
INTERVAL_SEC="${RIVET_HEALTH_INTERVAL_SEC:-2}"
MODE="wait"

usage() {
  cat <<'EOF'
Usage: rivet-healthcheck.sh [--lint-only | --wait | --restart-proof] [--url URL]

  --lint-only      Validate compose/docker-compose.yml (no running engine required)
  --wait           Wait until GET /health succeeds (default)
  --restart-proof  docker compose restart, then wait for /health again
  --url URL        Health base URL (default http://127.0.0.1:6420)

Env: COMPOSE_DIR, RIVET_HEALTH_URL, RIVET_HEALTH_PATH, RIVET_HEALTH_TIMEOUT_SEC
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lint-only) MODE="lint"; shift ;;
    --wait) MODE="wait"; shift ;;
    --restart-proof) MODE="restart"; shift ;;
    --url) BASE_URL="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown arg: $1" >&2; usage >&2; exit 2 ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "missing required command: $1" >&2
    exit 127
  }
}

lint_compose() {
  need_cmd python3
  python3 - <<'PY' "$COMPOSE_DIR/docker-compose.yml"
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
try:
    import yaml  # type: ignore
except ImportError:
    # Minimal structural checks when PyYAML is unavailable
    required = ("services:", "rivet-engine:", "volumes:", "rivet-data:")
    missing = [r for r in required if r not in text]
    if missing:
        raise SystemExit(f"compose lint failed (no PyYAML); missing markers: {missing}")
    print(f"OK compose structural lint (no PyYAML): {path}")
    raise SystemExit(0)

doc = yaml.safe_load(text)
if not isinstance(doc, dict):
    raise SystemExit("compose root must be a mapping")
services = doc.get("services") or {}
if "rivet-engine" not in services:
    raise SystemExit("compose missing services.rivet-engine")
svc = services["rivet-engine"]
image = str(svc.get("image") or "")
if "rivetdev/engine" not in image:
    raise SystemExit(f"unexpected image: {image!r}")
if ":next" in image:
    raise SystemExit("refuse rivetdev/engine:next — Factory Meta pins Rivet 2.x")
vols = doc.get("volumes") or {}
if "rivet-data" not in vols:
    raise SystemExit("compose missing volumes.rivet-data")
print(f"OK compose lint: {path}")
PY

  if command -v docker >/dev/null 2>&1; then
    if [[ -f "$COMPOSE_DIR/.env" ]]; then
      (cd "$COMPOSE_DIR" && docker compose config >/dev/null)
    else
      # Satisfies required env interpolation for `docker compose config`
      (cd "$COMPOSE_DIR" && RIVET_ADMIN_TOKEN=ci-lint-placeholder docker compose config >/dev/null)
    fi
    echo "OK docker compose config"
  else
    echo "SKIP docker compose config (docker not installed)"
  fi
}

wait_health() {
  need_cmd curl
  local deadline=$((SECONDS + TIMEOUT_SEC))
  local url="${BASE_URL}${HEALTH_PATH}"
  echo "waiting for ${url} (timeout ${TIMEOUT_SEC}s)…"
  while (( SECONDS < deadline )); do
    if curl -fsS -o /tmp/factory-rivet-health.json -w "%{http_code}" "$url" | grep -q '^200$'; then
      echo "OK health 200 ${url}"
      head -c 400 /tmp/factory-rivet-health.json 2>/dev/null || true
      echo
      return 0
    fi
    sleep "$INTERVAL_SEC"
  done
  echo "FAIL health did not recover within ${TIMEOUT_SEC}s: ${url}" >&2
  return 1
}

restart_proof() {
  need_cmd docker
  lint_compose
  (cd "$COMPOSE_DIR" && docker compose restart rivet-engine)
  wait_health
}

case "$MODE" in
  lint) lint_compose ;;
  wait) lint_compose; wait_health ;;
  restart) restart_proof ;;
  *) usage >&2; exit 2 ;;
esac
