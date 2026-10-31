# Meta Beads Dolt setup — FE-102

**Verdict: done (hybrid path live) — MERGED**  
**Date:** 2026-10-29  
**Repo:** https://github.com/mplsjohnnycage/factory  
**Branch:** `cursor/meta-beads-dolt-setup-2b9c`  
**PR:** [#24](https://github.com/mplsjohnnycage/factory/pull/24) merged `8568858` (squash)  
**Worker:** bc-1ea09e7a-66d3-5a3f-87e6-8afe431e2b9c  
**Prior gap report:** [`beads-setup-status.md`](./beads-setup-status.md)

---

## Outcome

| Check | Result |
|-------|--------|
| Hybrid tracked/gitignore | **Yes** — config/metadata tracked; `embeddeddolt/` gitignored |
| `issue-prefix: factory` in `config.yaml` | **Yes** |
| Embedded Dolt initialized | **Yes** — prefix `factory`, project_id `8097551d-…` |
| `refs/dolt/data` on origin | **Yes** — real push (not empty placeholder) |
| Seeded beads | **Yes** — 4 Meta beads (1 closed after setup) |
| Fresh-clone `bd bootstrap` → `bd status` | **Yes** (verified in `/tmp/factory-beads-fresh`) |
| `bd status` on branch workspace | **Yes** |
| Docs / AGENTS | **Yes** — `docs/meta-beads.md`, `.beads/README.md`, `AGENTS.md` install+bootstrap |
| Scope collision (PBI-014 / Vercel CI) | **Avoided** — only `.beads/`, docs, AGENTS |

---

## What was done

1. Branched from current `main` (`2546716`).
2. Hydrated local embedded Dolt from Project store staged instance (same `project_id`).
3. Seeded Meta beads: `factory-yem` (closed), `factory-w3n`, `factory-r9f`, `factory-cvl`.
4. `bd dolt push` → `refs/dolt/data` live on origin (hash advances on each push; verified present via `git ls-remote`).
5. Set tracked `issue-prefix: "factory"`; rewrote Meta `.beads/README.md`; added `docs/meta-beads.md`; extended `AGENTS.md` with install + `bd bootstrap`.
6. Verified: remove `embeddeddolt` → `bd bootstrap --yes` → `bd status` shows 4 issues.

---

## Operator path (fresh clone)

```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
git clone https://github.com/mplsjohnnycage/factory.git && cd factory
bd bootstrap --yes
bd status
```

Notes:

- `bd` is **not** on default cloud/agent PATH — install to `~/.local/bin`.
- Plain `git clone` does **not** fetch Dolt; bootstrap is required once.
- Optional: `git config beads.role maintainer` and `chmod 700 .beads`.

---

## Still out of scope (intentional)

- Live `BdMetaBeads` adapter in ProjectSupervisor (still Memory in CI) — tracked as `factory-cvl`.
- Full Meta PBI ↔ bead equivalence map — tracked as `factory-r9f`.
- No Linear→Cursor; no Product Beads; no Port OAuth mutations.

---

## Merge follow-up (behind main → green)

1. Rebased `cursor/meta-beads-dolt-setup-2b9c` onto `origin/main` @ `5a6fdc2` (PBI-014) → head `7202729`.
2. Force-pushed; CI on new head: `meta-ci-presence`, `local-gate-refuse`, `supervisor-typecheck-test`, Vercel — all **SUCCESS**.
3. Prior write APPROVE (`skysthelimitpainting1779-collab`) was **not** dismissed; still `APPROVED` on `7202729`. No self-approve as author; no fresh Composio APPROVE needed.
4. Squash-merged #24 → `8568858` @ 2026-10-29T06:38:23Z.

## Return

- **PR:** https://github.com/mplsjohnnycage/factory/pull/24 — **MERGED**
- **`bd status` on branch:** **works** (local embedded Dolt present)
- **Fresh clone:** `bd status` works **after** `bd bootstrap --yes` (hybrid: DB not in git)
