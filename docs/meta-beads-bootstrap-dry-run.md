# Meta Beads `bd bootstrap` — dry-run + execute note

**When:** 2026-10-29  
**Host:** cloud agent workspace `/workspace`  
**bd:** v1.3.2 (`~/.local/bin`)

## Plan

1. Confirm `refs/dolt/data` on origin (present: `8f41e4a…`).
2. Backup tracked `.beads/{config.yaml,metadata.json,README.md,.gitignore}` → `/tmp/bd-backup-20261029/`.
3. `chmod 700 .beads`.
4. `bd bootstrap --dry-run` / `--help` → plan = clone from `sync.remote`.
5. Execute `bd bootstrap --yes` only because reversible (delete gitignored `embeddeddolt`; re-bootstrap from remote).

## Result

- Synced Dolt DB `factory` into `.beads/embeddeddolt/` (gitignored).
- `bd status`: 4 issues · 3 ready (`factory-r9f`, `factory-w3n`, `factory-cvl`).
- No `bd init`. No Dolt blob commit. No `bd dolt push` (not authorized this tick).

## Rollback

```bash
rm -rf .beads/embeddeddolt
# optional: restore tracked files from /tmp/bd-backup-20261029
bd bootstrap --yes   # rehydrate from refs/dolt/data
```

## Cost

Install + bootstrap = free/local. No paid cloud. Reversible.
