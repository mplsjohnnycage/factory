# bd bootstrap / upgrade — plan + run

**Verdict: dry-run PASS; reversible local execute DONE; no remote Dolt rewrite**  
**Date:** 2026-10-29T15:31Z  
**Repo:** https://github.com/mplsjohnnycage/factory  
**Branch / PR:** `cursor/bd-bootstrap-upgrade-112b` (docs + script)  
**Worker:** bc-50b74ed0-ad60-529d-940b-c56dc49f112b  
**Lane:** Meta Beads only (`factory-`)  
**Out of scope:** Port schema · Observatory · Product Beads · `bd dolt push`

---

## Inputs

| Doc | Takeaway |
|-----|----------|
| [`beads-morning-ready.md`](./beads-morning-ready.md) | Fresh clone needs `bd bootstrap --yes`; 3 ready Meta ops beads; live coding admit still blocked on adapter/coding beads |
| [`meta-beads-dolt-setup.md`](./meta-beads-dolt-setup.md) | Hybrid live; `refs/dolt/data` published via PR #24; hydrate = bootstrap, not commit DB blobs |

---

## Plan (prefer docs+scripts+PR)

| Step | Action | Cost / risk |
|------|--------|-------------|
| 0 | Install `bd` to `~/.local/bin` | Local only |
| 1 | Record `git ls-remote origin 'refs/dolt/*'` tip | Read-only |
| 2 | Snapshot `.beads` config (+ tar `embeddeddolt` if present) under `.beads/backup/pre-bootstrap-<UTC>/` | Local gitignored |
| 3 | `bd bootstrap --dry-run --json` | No mutate |
| 4 | Gate: allow execute only for clone/validate (reversible local); refuse force-init / remote push | Safety |
| 5 | `bd bootstrap --yes` when gate PASS | Local `embeddeddolt` only |
| 6 | `bd upgrade status|review|ack` | Local metadata (`last_bd_version`) |
| 7 | Ship helper + docs via PR — **not** a live remote Dolt rewrite | Preferred deliverable |

**Explicit non-execute:** `bd init --force`, `bd dolt push`, DoltHub backup init, Port mutations, Observatory.

---

## Dry-run (this run)

```json
{
  "action": "sync",
  "beads_dir": "/workspace/.beads",
  "database": "factory",
  "has_existing": false,
  "reason": "sync.remote git repo has Dolt data (refs/dolt/data) — will clone from git+https://github.com/mplsjohnnycage/factory.git",
  "schema_version": 1,
  "sync_remote": "git+https://github.com/mplsjohnnycage/factory.git"
}
```

Helper gate: **PASS** (`./scripts/bd-bootstrap-safe.sh --dry-run`).

Remote tip before/after (unchanged):

```
8f41e4a88217b87b8e9154fecfbc209a864b325e  refs/dolt/data
```

---

## Execute (reversible, no-cost)

Ran `./scripts/bd-bootstrap-safe.sh --execute` because:

1. Plan was sync/clone from existing `refs/dolt/data`.
2. `has_existing: false` — no local DB to destroy.
3. Reverse = `rm -rf .beads/embeddeddolt` (remote untouched).
4. No `bd dolt push`.

| Check | Result |
|-------|--------|
| `bd where` | `/workspace/.beads` · prefix `factory` · DB `embeddeddolt` |
| `bd status` | 4 issues · 3 open · 1 closed · 3 ready |
| `bd ready` | `factory-r9f`, `factory-w3n`, `factory-cvl` |
| `bd upgrade ack` | v1.3.2 acknowledged |
| Remote `refs/dolt/data` | **Unchanged** |

Backup dirs (gitignored): `.beads/backup/pre-bootstrap-20261029T153144Z` (dry-run), `…153145Z` (execute + `EXECUTED.txt`).

---

## Repo deliverables (PR)

| Path | Role |
|------|------|
| `scripts/bd-bootstrap-safe.sh` | Backup → dry-run → gated execute; never force-init / dolt push |
| `docs/meta-beads.md` | § Safe bootstrap / upgrade + reverse |
| `AGENTS.md` | Point agents at safe helper |
| `.beads/README.md` | Fresh-clone safe path |
| `.beads/metadata.json` | `last_bd_version: 1.3.2` from upgrade ack |

---

## Operator commands (copy/paste)

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
cd factory
./scripts/bd-bootstrap-safe.sh --dry-run
./scripts/bd-bootstrap-safe.sh --execute   # only if PASS
bd status && bd ready
```

Reverse local hydrate:

```bash
rm -rf .beads/embeddeddolt
./scripts/bd-bootstrap-safe.sh --execute
```

---

## Bottom line

**Plan shipped as docs+script.** Dry-run confirmed clone-from-remote. Local execute hydrated Meta Beads (4 issues / 3 ready) with backup + reverse path; **no** destructive live Dolt rewrite and **no** Port/Observatory work.
