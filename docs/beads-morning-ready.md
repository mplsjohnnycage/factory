# Meta Beads morning ready — 2026-10-29

**Verdict: ready beads exist; live coding admit without human bypass = NO**  
**Checked:** 2026-10-29T08:21:32Z · `/workspace` @ `fd4a774` (`main`)  
**Worker:** bc-399dadb1-09a3-53f2-824a-501c685bb8ea  
**Lane:** Meta Beads only (`factory-`)

---

## Headline

| Metric | Value |
|--------|-------|
| **Ready bead count** | **3** |
| Open | 3 |
| In progress | 0 |
| Blocked (Beads graph) | 0 |
| Closed | 1 (`factory-yem`) |
| Coding admit without Port bypass today? | **No** |

---

## `bd where`

```
/workspace/.beads
  prefix: factory
  database: /workspace/.beads/embeddeddolt
```

- `bd` **v1.3.2** installed this run to `~/.local/bin` (was missing from PATH).
- Fresh clone had config only; **`bd bootstrap --yes`** hydrated from `git+https://github.com/mplsjohnnycage/factory.git` (`refs/dolt/data` present).
- Warnings: `.beads` mode `0755` (want `0700`); `beads.role` unset.

---

## `bd ready` (3)

| Bead | P | Title |
|------|---|--------|
| `factory-r9f` | P2 | Map remaining Meta PBIs to factory-* beads (equivalence ids) |
| `factory-w3n` | P2 | Install bd CLI on agent/dev PATH (~/.local/bin) |
| `factory-cvl` | P2 | Wire live BdMetaBeads adapter in ProjectSupervisor (replace Memory for prod) |

These are **Meta ops** tasks, not coding-loop PBI work items. Claiming any of them does not by itself start a Sandbox coding admit for a Meta PBI.

---

## Admit path (`apps/project-supervisor`)

Gate in `ProjectSupervisorActor.admit`:

1. Requires `portAuthorized`.
2. Requires `ReadyTaskEvent.beadId` **or** audited `portBypassId` — refuse `claim_id_required` if neither.
3. With `beadId` and no bypass: `isReady` → claim → admit + Port projections.

**Live wiring gap:** only `MemoryMetaBeads` is exported / used (`createMemorySupervisor`). Comment names `BdMetaBeads`; **class not implemented**. CI Memory path can admit without Port bypass when beads are seeded in-process — that is not the live Dolt SoT path.

Operator CLI path (`bd ready` → `bd update --claim` → feed `ReadyTaskEvent`) is documented but **not connected** to a production Rivet host today.

---

## Can coding admit run today without human bypass?

**No** for live Meta coding admit:

| Need | Today |
|------|--------|
| Ready Meta Beads SoT after bootstrap | Yes (3 ready) |
| Gate accepts bead claim without `portBypassId` | Yes (code + tests) |
| Live `BdMetaBeads` / prod supervisor ↔ Dolt | **No** (`factory-cvl` open) |
| Coding PBI beads ready to claim for Sandbox start | **No** (ready set is ops only) |

Without bypass you would need a claimed ready `beadId` fed into admit **and** a supervisor wired to real Meta Beads. Only Memory dry-run / CI can do bead-id admit today; production path still needs Port bypass **or** completing `factory-cvl` plus coding beads.

---

## Blockers

1. **`BdMetaBeads` missing** — supervisor prod still Memory-only (`factory-cvl`).
2. **No coding-work ready beads** — ready queue is Meta scaffolding ops, not PBI coding admit candidates (`factory-r9f` still open).
3. **`bd` not on default agent PATH** — must install + export `~/.local/bin` each env (`factory-w3n`; done this session only).
4. **Clone hydrate required** — no `embeddeddolt` in git; `bd bootstrap --yes` mandatory before `bd ready`.
5. **Env hygiene** — `chmod 700 .beads`; `git config beads.role maintainer|contributor`.
6. **Deploy host** — Rivet ProjectSupervisor + live catalog writer not wired for morning coding loop from this check alone.

Non-blockers for this check: Dolt remote live; bootstrap works; Beads graph has zero dependency blockers; Product Beads absent (correct).

---

## Commands used

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
cd /workspace && bd bootstrap --yes
bd where
bd ready
bd status
```

---

## Prior context

- [`beads-setup-status.md`](./beads-setup-status.md) — earlier partial (pre–Dolt seed)
- [`meta-beads-dolt-setup.md`](./meta-beads-dolt-setup.md) — FE-102 / PR #24 hybrid path
