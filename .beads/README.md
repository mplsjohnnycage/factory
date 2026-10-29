# Meta Beads (Factory)

This repository’s **Meta Beads** instance — ready/claim SoT for the Factory Meta
lane (PBI-007). Prefix **`factory-`**. Never create Product Beads here.

## Hybrid

- **Tracked:** `config.yaml`, `metadata.json`, this README, `.gitignore`
- **Gitignored:** `embeddeddolt/` (and other runtime files listed in `.gitignore`)
- **Sync:** Dolt → `git+https://github.com/mplsjohnnycage/factory.git` (`refs/dolt/data`)

## Fresh clone

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
# Prefer safe helper from repo root (backup + dry-run; execute only if reversible)
./scripts/bd-bootstrap-safe.sh --dry-run
./scripts/bd-bootstrap-safe.sh --execute
# Or: bd bootstrap --yes
bd status
```

See [`docs/meta-beads.md`](../docs/meta-beads.md),
[`docs/ops/beads-dolt-health.md`](../docs/ops/beads-dolt-health.md)
(`npm run dry-run:beads-dolt-health`), and root `AGENTS.md`.

## Essential commands

```bash
bd where
bd ready
bd create "…" -t task -p 2
bd update <id> --claim
bd dolt pull
bd dolt push
```

**Upstream:** [github.com/steveyegge/beads](https://github.com/steveyegge/beads)
