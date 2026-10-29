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
via `createBdSupervisor({ cwd })` — shells out to `bd`; still needs a Rivet host
and §4.2.1 catalog writer for production admit→sandbox (no Funnel required for the adapter itself).

## Verify remote Dolt exists

```bash
git ls-remote origin 'refs/dolt/*'
# expect: <hash>  refs/dolt/data
```

Empty or missing `refs/dolt/data` means the clone path cannot bootstrap from
origin — fix by pushing from an authoritative local DB (`bd dolt push`), not by
adding a placeholder remote URL.
