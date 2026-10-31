# Meta Beads scaffold (OQ-1 hybrid locked)

**Date:** 2026-10-29  
**Lane:** **Meta only** — no Product Beads  
**Decision:** Johnny locked **OQ-1 = hybrid**  
**Canonical:** [`factory-master-spec.md`](./factory-master-spec.md) §0.3 / §0.6 · derived [`factory-workflow.md`](./factory-workflow.md) A5

---

## Lock

| Rule | Value |
|------|--------|
| **Scaffold Meta Beads** | **Now** — in Factory meta-repo |
| **Admit / claim SoT until PBI-007** | **Linear** (+ PBI/typed-contract facet) |
| **Beads role until PBI-007** | Scaffolding only — deps graph / `bd ready` practice |
| **Beads as day-one human board** | **No** |
| **Product Beads** | Out of scope — never this instance |

From **PBI-007** onward: `ProjectSupervisor` admits coding work only when **Meta Beads** reports ready (or Port `executionContract` carries an audited human bypass). That wiring is **not** this scaffold.

---

## Where

| Location | Role |
|----------|------|
| Staging / Project store | `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/factory/` |
| GitHub meta-repo | [`mplsjohnnycage/factory`](https://github.com/mplsjohnnycage/factory) |
| Beads home | `.beads/` (embedded Dolt) |
| Issue prefix | `factory` → ids like `factory-a3f2dd` |
| Sync remote | `git+https://github.com/mplsjohnnycage/factory.git` (`refs/dolt/data`) |

**Not created:** any Product Beads instance, product Linear board, or second `.beads` under a product repo.

---

## Init evidence (this run)

1. Installed `bd` **v1.3.2** (`~/.local/bin/bd`).  
2. `bd init --non-interactive --role maintainer --prefix factory --agents-profile minimal` against a real-FS checkout (Project store FUSE initially blocked Dolt `chmod`/create; copy of initialized `.beads/` onto the store works for `bd status`).  
3. Verified: `bd where` → `.beads` with prefix `factory`; `bd status` → 0 issues; `bd ready` → empty.  
4. Tracked scaffold files: `.beads/config.yaml`, `.beads/metadata.json`, `.beads/README.md`, `.beads/.gitignore`. Runtime DB under `.beads/embeddeddolt/` stays gitignored.  
5. Root `.gitignore`: removed blanket `.beads/` ignore so config can be committed; runtime patterns remain.  
6. `AGENTS.md` documents hybrid rules (Linear admit SoT until PBI-007).

---

## Agent rules (Meta lane)

```bash
export PATH="$PATH:$HOME/.local/bin"   # if needed
cd <factory-meta-repo>
bd where
bd status
bd ready                 # practice only until PBI-007
# bd create / bd update --claim — OK for deps rehearsal;
# do NOT treat claim as Rivet admit authority before PBI-007
```

| Do | Don’t |
|----|--------|
| Share one `.beads` across git worktrees (no per-worktree `bd init`) | Create Product Beads or a second Meta instance |
| Keep Linear assignee / PBI owner as admit SoT until PBI-007 | Replace Linear human board with Beads |
| Sync with `bd dolt push` / `bd dolt pull` when authorized | Commit Dolt DB blobs into feature branches |
| Name write targets **Meta Beads** explicitly | Vague “Beads” that blurs Meta vs Product |

Equivalence chain unchanged: Linear ticket ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue — Meta Beads is the Beads *instance* for this lane only.

---

## Cutover (PBI-007 — future)

When PBI-007 lands:

1. Map Meta units ↔ beads (same equivalence ids where practical).  
2. Require `bd ready` → `bd update --claim` before Rivet admit.  
3. Linear remains human visibility; Beads becomes ready/claim/parallel SoT for meta coding admit.  
4. Still no Product Beads from this work.

---

## Explicit non-actions

- No Product Beads init or seed.  
- No Rivet/gateway/supervisor code (PBI-004…007).  
- No Port OAuth mutations from this task.  
- No Feature Assembly / FE-24 coding beyond scaffold docs + meta-repo Beads init.
