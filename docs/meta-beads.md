# Meta Beads (hybrid Dolt)

**Lane:** Meta only — never Product Beads.  
**Prefix:** `factory-` (ids like `factory-yem`)  
**Instance:** `.beads/` in this repo  
**Sync:** Dolt remote = git origin → `refs/dolt/data` (not source branches)

## Hybrid layout

| Tracked in git | Gitignored (runtime) |
|----------------|----------------------|
| `.beads/config.yaml` | `.beads/embeddeddolt/` |
| `.beads/metadata.json` | locks, daemon, backup, `.env` |
| `.beads/README.md`, `.beads/.gitignore` | |

Do **not** commit Dolt DB blobs. Do **not** `bd init` per worktree — one shared `.beads`.

## Install `bd` (not on default agent PATH)

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
bd version   # expect v1.3.2+
```

Optional (quiet claim warnings):

```bash
git config beads.role maintainer   # or contributor
chmod 700 .beads
```

## Fresh clone → `bd status`

A normal `git clone` does **not** fetch `refs/dolt/data`. Hydrate once:

```bash
cd factory
export PATH="$HOME/.local/bin:$PATH"
bd bootstrap --yes
bd status
bd ready
```

`bd bootstrap` clones the published Meta Beads Dolt database from
`sync.remote` (`git+https://github.com/mplsjohnnycage/factory.git`) when
`refs/dolt/data` is present.

## Safe bootstrap / upgrade (backup + dry-run)

Prefer the helper over ad-hoc force paths. Default is **dry-run**; `--execute`
only runs when the plan is a reversible local hydrate (clone/validate). It
**never** runs `bd init --force` or `bd dolt push`.

```bash
export PATH="$HOME/.local/bin:$PATH"
chmod 700 .beads   # recommended once

# 1) Backup tip + tracked config (+ embeddeddolt tar if present)
./scripts/bd-bootstrap-safe.sh --backup-only

# 2) Dry-run plan (also takes a backup)
./scripts/bd-bootstrap-safe.sh --dry-run
# expect JSON action sync/clone from refs/dolt/data when DB missing

# 3) Execute only if gate PASS (local embeddeddolt only; remote untouched)
./scripts/bd-bootstrap-safe.sh --execute
```

Manual equivalents:

```bash
# Dry-run
bd bootstrap --dry-run
bd bootstrap --dry-run --json

# Execute (non-destructive; never deletes existing issues)
bd bootstrap --yes

# CLI upgrade awareness (local metadata only — not a Dolt rewrite)
bd upgrade status
bd upgrade review
bd upgrade ack
```

### Backup locations

| Artifact | Path | Notes |
|----------|------|--------|
| Helper snapshots | `.beads/backup/pre-bootstrap-<UTC>/` | gitignored; config copy + `preflight.txt` (`refs/dolt/data` tip) + optional `embeddeddolt.tar.gz` / `issues.jsonl` |
| Last backup pointer | `.beads/backup/LAST_BACKUP_DIR.txt` | local only |

### Reverse (local only)

```bash
# Undo a hydrate without touching origin refs/dolt/data
rm -rf .beads/embeddeddolt
# Optional: restore prior local DB
# tar -C .beads -xzf .beads/backup/pre-bootstrap-<ts>/embeddeddolt.tar.gz
bd bootstrap --yes   # re-clone from refs/dolt/data
```

### Explicit non-actions

- No live `bd dolt push` / remote Dolt rewrite from this helper.
- No `bd init --force`.
- No Port schema / Observatory work.
- No Product Beads.

## Day-to-day (Meta admit)

```bash
bd where
bd ready
bd update <bead-id> --claim
# … coding …
bd dolt push    # when authorized — publishes issue graph
bd dolt pull    # before claiming on another machine
```

Linear remains human visibility. Meta Beads is ready/claim/parallel SoT for
meta coding admit (PBI-007). ProjectSupervisor CI uses `MemoryMetaBeads`.
Live / local dry-run uses `BdMetaBeads` (`apps/project-supervisor/src/bd-meta-beads.ts`)
via `createBdSupervisor({ cwd })` — shells out to `bd`. Offline admit entry:
`admitFromPayload` / `POST /admit` (no Funnel / Rivet engine required for dry-run).
Production admit→sandbox still needs Rivet Actor host + §4.2.1 catalog writer + Docker SA.

**Ops kit (BdMetaBeads readiness):** [`docs/ops/bdmetabeads-readiness.md`](./ops/bdmetabeads-readiness.md) →
`npm run dry-run:bdmetabeads` (markers) · `--memory` (injectable `BdRunner` unit tests).
Does not duplicate gateway unsigned/signed or supervisor-admit kits.

**Ops kit (Dolt health / docs):** [`docs/ops/beads-dolt-health.md`](./ops/beads-dolt-health.md) →
`npm run dry-run:beads-dolt-health` (markers) · `--ls-remote` (read-only tip check).
Owns `refs/dolt/data` + bootstrap-safe docs — does **not** duplicate BdMetaBeads (#80)
or gateway Dockerfile health (#82). Kit default: never bd dolt push.

**Ops kit (queue mirror):** [`docs/ops/factory-queue-mirror.md`](./ops/factory-queue-mirror.md) →
`npm run dry-run:factory-queue-mirror`. Mirrors `bd ready` (else Linear Todo) into Project
`notes.md` `### Queued` on the coordinator tick only; kit dry-run parses fixtures and never
mutates Beads or writes notes.

## Verify remote Dolt exists

```bash
git ls-remote origin 'refs/dolt/*'
# expect: <hash>  refs/dolt/data
```

Empty or missing `refs/dolt/data` means the clone path cannot bootstrap from
origin — fix by pushing from an authoritative local DB (`bd dolt push`), not by
adding a placeholder remote URL. Morning check: `npm run dry-run:beads-dolt-health`
(and `--ls-remote` when network to origin is available).
