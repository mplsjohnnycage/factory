# Install — factory-builder

## Quick path (local)

Johnny said go — plugin is written to:

```bash
ls ~/.cursor/plugins/local/factory-builder/.cursor-plugin/plugin.json
```

1. Confirm that file exists.
2. Reload Cursor / reopen the agent session.
3. Smoke: `/factory-dor-check` or ask the agent to apply factory-hard-rules.

## From meta-repo

```bash
cd /path/to/factory   # or Project artifacts/factory
bash plugins/factory-builder/bin/install-local.sh
```

The installer:

1. Copies the plugin tree to `~/.cursor/plugins/local/factory-builder/`.
2. Writes `.cursor-plugin/plugin.json` from `.cursor-plugin/` (if present), else `cursor-plugin/plugin.json`, else root `plugin.json`.

## Why `cursor-plugin/` exists in the mirror

Agent-store / some sync mounts refuse paths starting with `.cursor`. The git tree therefore keeps:

- `plugins/factory-builder/.cursor-plugin/plugin.json` (in git index; may be absent from working tree on restricted mounts)
- `plugins/factory-builder/cursor-plugin/plugin.json` (store-safe fallback)
- `plugins/factory-builder/plugin.json` (root fallback)

Local Cursor install **must** end with `.cursor-plugin/plugin.json` — use `bin/install-local.sh`.

## Uninstall

```bash
rm -rf ~/.cursor/plugins/local/factory-builder
```
