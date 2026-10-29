# Factory Builder

Cursor plugin for **Factory Meta** engineering. Encodes the locked norms from:

- `factory-master-spec` (canonical SoT)
- `factory-workflow` (Phase A / sync / collisions)
- `factory-meta-vs-product` (Meta XOR Product)
- `factory-coding-loop` (task → standardize → PR → build → loop)

Lane: **Meta** — building the Factory itself. Product-lane assembly is out of scope unless a unit explicitly says Product.

## Installation

### Local (immediate)

This plugin is intended to live at:

```text
~/.cursor/plugins/local/factory-builder/
```

Cursor discovers local plugins from that directory. After copy/sync:

1. Reload Cursor / reopen the agent session.
2. Confirm rules `factory-hard-rules` and `factory-quality-gates` apply.
3. Try `/factory-dor-check` or `/factory-loop`.

### From the Factory meta-repo mirror

Preferred (creates a proper `.cursor-plugin/` on the local install path):

```bash
# From repo root (checkout includes plugins/factory-builder/)
bash plugins/factory-builder/bin/install-local.sh
# or: bash plugins/factory-builder/bin/install-local.sh ~/.cursor/plugins/local/factory-builder
```

Manual copy also works if the tree already has `.cursor-plugin/plugin.json`:

```bash
mkdir -p ~/.cursor/plugins/local
cp -R plugins/factory-builder ~/.cursor/plugins/local/factory-builder
```

Note: some sync surfaces cannot materialize paths named `.cursor*`. The repo mirror keeps `cursor-plugin/plugin.json` and root `plugin.json` as fallbacks; `install-local.sh` writes the canonical `.cursor-plugin/plugin.json` under `~/.cursor/plugins/local/`.

Then reload Cursor.

### Marketplace (future)

Not published yet. Until then, use the local path above.

## Components

### Rules

| Rule | Description |
|------|-------------|
| `factory-hard-rules` | Equivalence chain, Meta XOR Product, loop order, accept path, hard bans (`alwaysApply`) |
| `factory-quality-gates` | Master-first, DoR, Spec gates, living specs, plugin path validity (`alwaysApply`) |

### Skills

| Skill | Description |
|-------|-------------|
| `factory-coding-loop` | Five-step coding sequence for coding-agent units |
| `factory-workflow-setup` | Phase A upfront checklist (A1–A12) |
| `factory-meta-vs-product` | Lane classification + contamination defects |
| `factory-typed-contract` | 19-field DoR validation/authoring |

### Commands

| Command | Description |
|---------|-------------|
| `/factory-loop` | Run the full coding loop for a unit |
| `/factory-standardize` | Spec+Contract / assemble-first / gates before code |
| `/factory-classify-lane` | Meta XOR Product classification |
| `/factory-dor-check` | Typed-contract Definition-of-Ready |
| `/factory-setup` | Phase A setup audit |

### Agents

| Agent | Description |
|-------|-------------|
| `factory-builder` | Meta builder that enforces the above skills/rules |

## Typical flow

1. `/factory-setup` — confirm Phase A for the active Spec.
2. `/factory-dor-check PBI-00N` — refuse start if incomplete.
3. `/factory-classify-lane …` — Meta or Product only.
4. `/factory-standardize specs/{domain}` — gates green.
5. `/factory-loop PBI-00N` — task → standardize → PR → build → loop.

## Authority

| Surface | Role |
|---------|------|
| `factory-master-spec` | Single canonical SoT |
| This plugin | Executable Cursor surface derived from master + three companions |
| Project `notes.md` | Coordination scratch only — never Spec/accept/claim SoT |

When master and this plugin disagree, **master wins** — update the plugin next.

## License

MIT
