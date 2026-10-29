#!/usr/bin/env bash
# Safe Meta Beads bootstrap / upgrade helper (Factory Meta lane only).
#
# Default: dry-run only. Execute is gated to reversible, no-cost local hydrate:
#   - clones local .beads/embeddeddolt from origin refs/dolt/data when missing
#   - never bd init --force
#   - never bd dolt push / remote rewrite
#   - never Product Beads
#
# Usage:
#   ./scripts/bd-bootstrap-safe.sh              # dry-run (default)
#   ./scripts/bd-bootstrap-safe.sh --dry-run
#   ./scripts/bd-bootstrap-safe.sh --execute    # only if gates pass
#   ./scripts/bd-bootstrap-safe.sh --backup-only
#
# Env:
#   BD_BIN          path to bd (default: bd on PATH)
#   BEADS_BACKUP_ROOT  override backup root (default: .beads/backup)

set -euo pipefail

MODE="dry-run"
BD_BIN="${BD_BIN:-bd}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BEADS_DIR="${ROOT}/.beads"
BACKUP_ROOT="${BEADS_BACKUP_ROOT:-${BEADS_DIR}/backup}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_ROOT}/pre-bootstrap-${STAMP}"

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) MODE="dry-run"; shift ;;
    --execute) MODE="execute"; shift ;;
    --backup-only) MODE="backup-only"; shift ;;
    -h|--help) usage 0 ;;
    *) echo "unknown arg: $1" >&2; usage 1 ;;
  esac
done

export PATH="${HOME}/.local/bin:${PATH}"

die() { echo "error: $*" >&2; exit 1; }
info() { echo "==> $*"; }

need_bd() {
  command -v "${BD_BIN}" >/dev/null 2>&1 || die "'${BD_BIN}' not found; install: curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash"
}

record_dolt_tip() {
  local out="${1}"
  {
    echo "# Meta Beads preflight — ${STAMP}"
    echo "repo: ${ROOT}"
    echo "git_head: $(git -C "${ROOT}" rev-parse HEAD 2>/dev/null || echo unknown)"
    echo "bd_version: $(${BD_BIN} version 2>/dev/null | head -1 || echo unknown)"
    echo "refs_dolt_data:"
    git -C "${ROOT}" ls-remote origin 'refs/dolt/*' 2>/dev/null || echo "(ls-remote failed)"
    echo "has_embeddeddolt: $([[ -d "${BEADS_DIR}/embeddeddolt" ]] && echo yes || echo no)"
  } >"${out}"
}

do_backup() {
  mkdir -p "${BACKUP_DIR}"
  info "Backup dir: ${BACKUP_DIR}"
  record_dolt_tip "${BACKUP_DIR}/preflight.txt"

  # Tracked config snapshot (always safe / local)
  for f in config.yaml metadata.json README.md .gitignore; do
    if [[ -f "${BEADS_DIR}/${f}" ]]; then
      cp -a "${BEADS_DIR}/${f}" "${BACKUP_DIR}/${f}"
    fi
  done

  # Local DB snapshot when present (gitignored; never push)
  if [[ -d "${BEADS_DIR}/embeddeddolt" ]]; then
    info "Archiving existing embeddeddolt (local only)"
    tar -C "${BEADS_DIR}" -czf "${BACKUP_DIR}/embeddeddolt.tar.gz" embeddeddolt
  else
    echo "no embeddeddolt yet — remote tip recorded only" >"${BACKUP_DIR}/embeddeddolt.MISSING.txt"
  fi

  # JSONL export when DB already exists (issue-level rollback aid)
  if [[ -d "${BEADS_DIR}/embeddeddolt" ]]; then
    if ${BD_BIN} -C "${ROOT}" export -o "${BACKUP_DIR}/issues.jsonl" 2>/dev/null; then
      info "Exported issues.jsonl"
    else
      echo "export skipped/failed (non-fatal)" >"${BACKUP_DIR}/export.SKIPPED.txt"
    fi
  fi

  echo "${BACKUP_DIR}" >"${BACKUP_ROOT}/LAST_BACKUP_DIR.txt"
  info "Backup complete"
  echo "${BACKUP_DIR}"
}

dry_run_plan() {
  info "bd bootstrap --dry-run --json"
  ${BD_BIN} -C "${ROOT}" bootstrap --dry-run --json
}

plan_is_reversible() {
  # Accept clone-from-remote (fresh hydrate) or validate-existing.
  # Refuse anything that smells like force-init / destructive rewrite.
  local json="$1"
  if echo "${json}" | grep -qiE 'init --force|destroy|wipe|overwrite remote|dolt push'; then
    return 1
  fi
  # Prefer explicit sync/clone or existing-db validate shapes from bd JSON.
  if echo "${json}" | grep -qE '"action"[[:space:]]*:[[:space:]]*"(sync|clone|validate|noop|none|status)"'; then
    return 0
  fi
  # Fallback: reason mentions clone from git / refs/dolt/data and has_existing false
  if echo "${json}" | grep -q 'refs/dolt/data' && echo "${json}" | grep -q '"has_existing"[[:space:]]*:[[:space:]]*false'; then
    return 0
  fi
  # Existing DB: bootstrap reports status only
  if echo "${json}" | grep -q '"has_existing"[[:space:]]*:[[:space:]]*true'; then
    return 0
  fi
  return 1
}

do_execute() {
  local plan
  plan="$(dry_run_plan)"
  echo "${plan}"
  if ! plan_is_reversible "${plan}"; then
    die "dry-run plan not classified as reversible/no-cost — refusing execute. Prefer docs+scripts; do not rewrite live Dolt remote."
  fi

  do_backup >/dev/null

  info "Executing: bd bootstrap --yes (local hydrate only; no dolt push)"
  ${BD_BIN} -C "${ROOT}" bootstrap --yes

  info "Post-check"
  ${BD_BIN} -C "${ROOT}" where || true
  ${BD_BIN} -C "${ROOT}" status || true
  ${BD_BIN} -C "${ROOT}" ready || true

  info "CLI upgrade awareness (metadata only; no DB rewrite)"
  ${BD_BIN} -C "${ROOT}" upgrade status || true
  ${BD_BIN} -C "${ROOT}" upgrade review || true
  # ack is local metadata — no remote cost
  ${BD_BIN} -C "${ROOT}" upgrade ack || true

  cat >"${BACKUP_DIR}/EXECUTED.txt" <<EOF
executed_at: ${STAMP}
mode: local bd bootstrap --yes
remote_push: NO
reverse: rm -rf ${BEADS_DIR}/embeddeddolt  # then re-run bootstrap, or restore tar if present
backup: ${BACKUP_DIR}
EOF

  info "Done. Reverse local hydrate: rm -rf .beads/embeddeddolt (remote refs/dolt/data untouched)"
}

need_bd
[[ -d "${BEADS_DIR}" ]] || die "missing ${BEADS_DIR}"
[[ -f "${BEADS_DIR}/config.yaml" ]] || die "missing ${BEADS_DIR}/config.yaml"

case "${MODE}" in
  dry-run)
    info "Mode: dry-run (no mutate)"
    do_backup >/dev/null
    dry_run_plan
    info "Reversible gate preview:"
    plan_json="$(${BD_BIN} -C "${ROOT}" bootstrap --dry-run --json 2>/dev/null || true)"
    if plan_is_reversible "${plan_json}"; then
      echo "PASS — --execute would be allowed (local clone/validate only)"
    else
      echo "FAIL — --execute would refuse; inspect plan / prefer manual recovery"
      exit 2
    fi
    ;;
  backup-only)
    do_backup
    ;;
  execute)
    do_execute
    ;;
  *)
    die "unknown mode ${MODE}"
    ;;
esac
