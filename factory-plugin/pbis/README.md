# pbis/ — the seed PBI pack (the actual unit bodies)

These are the fifteen seed units of work themselves — PBI-001…015 — copied verbatim from the
factory repo so an installing agent holds the real unit bodies, not just an index.

**Provenance:** repo `docs/linear-pbi-seed/` @ `origin/main` **247842e** (PR #111 merge,
2026-10-30, "docs: import factory build-spec library from JohnnyBox store-docs"), extracted
2026-10-30 ~22:25 CDT. Filenames preserved. `_seed-data.json` is the machine-readable seed
data the pack ships with; `SEED-README.md` is the pack's own README from the repo (renamed so
this provenance note can own `README.md`); `DEFERRED-012-015.md` is the pack's deferral note
for PBI-012…015.

**Refresh route:** re-pull `docs/linear-pbi-seed/` from `mplsjohnnycage/factory` (git) — the
repo pack, derived from master spec §6, is the living source. This folder is a snapshot.

**Facet rule (master spec §0.3, OQ-1 locked hybrid):** each PBI here is one facet of a unit
whose other facets live in Linear, Beads, GitHub, and Port. **Linear is the admit/claim
source of truth until PBI-007** wires Meta Beads into kernel admit; **Beads is the
ready/claim facet** (scaffolding-only until then); GitHub carries the source/PR/CI facet;
Port carries accept. The cross-facet map and live facet snapshots are in `../units/`
(`units/UNITS.md`, `units/linear-issues.json`, `units/github-issues.json`, `units/beads.json`).
The index of these fifteen units — directives, pointers, dependencies, and per-PBI facet
state — is `../skills/factory/references/pbis.md`.

**DoR:** a unit in this folder is not startable until its full 19-field body (master spec
§0.1: C1–C3 + 1–16) plus Spec / Verification / Refinement pointers are filled. The blank
template is `../contracts/typed-contract-template.md`.
