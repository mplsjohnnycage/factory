# Factory Builder plugin (FE-51)

Installable Cursor plugin that encodes Factory Meta norms from:

| Source | Role in plugin |
|--------|----------------|
| `docs/factory-master-spec.md` | Canonical SoT — hard rules, §0.1–0.7, gates |
| `docs/factory-workflow.md` | Phase A setup skill + collision / sync |
| `docs/factory-meta-vs-product.md` | Meta XOR Product skill + classify command |
| `docs/factory-coding-loop.md` | Five-step loop skill + `/factory-loop` |

Lane: **Meta**.

## Install

Primary local path (already installed on this VM):

```text
~/.cursor/plugins/local/factory-builder/
```

From the meta-repo mirror:

```bash
bash artifacts/factory/plugins/factory-builder/bin/install-local.sh
```

Reload Cursor after install. See [install.md](./install.md) and [quality-gates.md](./quality-gates.md).

## Paths

| Path | Role |
|------|------|
| `~/.cursor/plugins/local/factory-builder/` | Live Cursor local plugin (canonical `.cursor-plugin/plugin.json`) |
| `artifacts/factory/plugins/factory-builder/` | Meta-repo mirror (PR) |
| `docs/factory-builder-plugin/` | This Project-store documentation |

## Components (summary)

- **Rules:** `factory-hard-rules`, `factory-quality-gates` (`alwaysApply`)
- **Skills:** coding-loop, workflow-setup, meta-vs-product, typed-contract
- **Commands:** `/factory-loop`, `/factory-standardize`, `/factory-classify-lane`, `/factory-dor-check`, `/factory-setup`
- **Agent:** `factory-builder`

## Authority

Master Spec wins on conflict. This plugin is a derived Cursor surface — update master first, then propagate.
