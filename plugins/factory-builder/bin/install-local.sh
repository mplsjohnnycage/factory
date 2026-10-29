#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-$HOME/.cursor/plugins/local/factory-builder}"
mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
mkdir -p "$DEST"
(cd "$ROOT" && tar cf - --exclude='.git' --exclude='bin' --exclude='cursor-plugin' .) | (cd "$DEST" && tar xf -)
mkdir -p "$DEST/.cursor-plugin"
if [[ -f "$ROOT/.cursor-plugin/plugin.json" ]]; then
  cp "$ROOT/.cursor-plugin/plugin.json" "$DEST/.cursor-plugin/plugin.json"
elif [[ -f "$ROOT/cursor-plugin/plugin.json" ]]; then
  cp "$ROOT/cursor-plugin/plugin.json" "$DEST/.cursor-plugin/plugin.json"
elif [[ -f "$ROOT/plugin.json" ]]; then
  cp "$ROOT/plugin.json" "$DEST/.cursor-plugin/plugin.json"
else
  echo "error: no plugin.json found" >&2
  exit 1
fi
echo "Installed factory-builder → $DEST"
echo "Reload Cursor / reopen the agent session."
