# Meta Beads setup status — mplsjohnnycage/factory

**Verdict: partial**  
**Checked:** 2026-10-29 against `origin/main` @ `2546716` (fetched) · PR #15 merge `b6b5079`  
**Repo:** https://github.com/mplsjohnnycage/factory  
**Lane:** Meta only

---

## Scorecard

| Check | Result | Evidence |
|-------|--------|----------|
| `.beads/` on `main` | **Yes** | Tracked: `config.yaml`, `metadata.json`, `README.md`, `.gitignore` (landed in #15) |
| `AGENTS.md` Meta Beads cutover | **Yes** | Toolchain table + “Meta Beads (PBI-007 cutover)” with `bd where` / `bd ready` / `bd update --claim`; prefix `factory-`; no Product Beads |
| PBI-007 merge | **Yes** | [#15](https://github.com/mplsjohnnycage/factory/pull/15) **MERGED** 2026-10-29T04:36:08Z → `b6b5079` (“ProjectSupervisor + Meta Beads ready gate”) |
| Supervisor Meta Beads gate | **Yes (CI Memory)** | `apps/project-supervisor/src/meta-beads.ts` `MemoryMetaBeads`; admit refuses without ready `beadId` / audited bypass; tests + workflow on main |
| `bd` tooling | **Partial** | CLI installs (verified **v1.3.2**); not on default agent PATH; fresh `main` clone has **no** embedded Dolt DB |
| Live `BdMetaBeads` adapter | **No** | Comment names `BdMetaBeads`; only `MemoryMetaBeads` exported / wired (`index.ts` dry-run) |
| Seeded Meta beads | **No** | Staged instance: `bd status` → **0 issues**; `bd ready` empty |
| `docs/meta-beads-scaffold.md` (Project store) | **Yes (scaffold doc)** | FE-58 OQ-1 hybrid lock; cutover section still worded as “future” though PBI-007 has merged |
| Project store reports | **Yes** | Scaffold + handoff + PBI-007 independent review + FE-49 meta setup (see links) |

---

## Evidence detail

### 1. `.beads/` on main

Present on `origin/main` (same tree as merge #15):

- `metadata.json` — `backend: dolt`, `dolt_mode: embedded`, `dolt_database: factory`, `project_id: 8097551d-…`
- `config.yaml` — `sync.remote: git+https://github.com/mplsjohnnycage/factory.git`
- `.gitignore` — ignores `dolt/`, `embeddeddolt/`, locks (correct — DB blobs not in git)
- Root `.gitignore` documents tracked config vs runtime ignore

**Gap:** `issue-prefix` remains commented in tracked `config.yaml`. Prefix `factory` is recovered from the **local embedded Dolt** DB (see staged checkout), not from the git-tracked config alone.

### 2. AGENTS.md

Matches post–PBI-007 policy: Meta Beads = ready/claim/parallel SoT; Linear = human visibility; one `.beads` shared across worktrees; `bd dolt push/pull` when authorized.

### 3. PBI-007

- Independent review: [`docs/pbi-007-independent-review.md`](./pbi-007-independent-review.md) — content APPROVE; Memory Meta Beads gate PASS.
- Loop notes FE-76 merge #15 → start PBI-008.
- Seed mirror in-repo: `docs/linear-pbi-seed/PBI-007-supervisor-beads.md`, `tasks/PBI-007-supervisor-beads.md`.

### 4. `bd` tooling

| Location | `bd where` / status |
|----------|---------------------|
| Project store `artifacts/factory/` | Works — `prefix: factory`, DB under `.beads/embeddeddolt`, **0 issues** |
| GitHub `main` checkout (`/workspace`) | Resolves `.beads` path but **`bd status` → “no beads database found”** (no `embeddeddolt/`) |

Installer works (`curl …/install.sh` → `~/.local/bin/bd` v1.3.2). Default cloud/agent images do not ship `bd` on PATH. No `refs/dolt/*` evidence that a Dolt remote was pushed for clone hydrate.

### 5. Project store docs

| Doc | Role |
|-----|------|
| [`docs/meta-beads-scaffold.md`](./meta-beads-scaffold.md) | FE-58 OQ-1 hybrid lock; init evidence; cutover checklist |
| [`internal/meta-beads-scaffold-handoff.md`](../internal/meta-beads-scaffold-handoff.md) | Scaffold branch push was blocked at time; `.beads` later arrived via #15 |
| [`docs/pbi-007-independent-review.md`](./pbi-007-independent-review.md) | Gate AC reviewed |
| [`docs/factory-meta-setup-status.md`](./factory-meta-setup-status.md) | FE-49 repo/Linear seed (pre-Beads cutover) |

---

## Gaps (why not “yes”)

1. **No portable Dolt DB on clones** — git tracks config only; operators cannot `bd ready` on a fresh factory clone without `bd init` / `bd dolt pull` from a pushed remote that does not appear live.
2. **No bead graph** — zero issues; Meta PBI ↔ bead mapping from scaffold cutover step 1 not done.
3. **No live Beads adapter** — supervisor CI uses Memory only; `BdMetaBeads` not implemented.
4. **Agent env** — `bd` not preinstalled / not on PATH; `beads.role` unset; `.beads` mode often not `0700`.
5. **Scaffold doc drift** — Project `meta-beads-scaffold.md` still frames PBI-007 cutover as future; repo `AGENTS.md` already describes cutover as current.

What is **not** a gap for this check: Product Beads absent (correct); Memory stand-in for CI (intentional per PBI-007 review).

---

## Bottom line

**Partial.** Meta Beads is **scaffolded and documented on `main`**, and **PBI-007’s ProjectSupervisor ready/claim gate is merged** with CI Memory beads. It is **not yet an operational Meta Beads SoT** for live admit: no synced Dolt database on the GitHub clone path, no seeded beads, no live `bd` adapter in the supervisor binary.
