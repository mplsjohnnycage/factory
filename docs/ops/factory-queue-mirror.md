# Factory queue mirror (`bd ready` → notes Queued)

**Lane:** Meta · **Audience:** Projects Manager / factory-done loop coordinator  
**Purpose:** Each factory-done loop tick mirrors Meta Beads `bd ready` (or Linear Factory Meta Todo/Backlog when `bd` is unavailable) into Project store `notes.md` `### Queued` as FE-* rows — without mutating live Beads from CI, without Port schema upserts, and without secrets/spend.  
**Script:** `scripts/factory-queue-mirror-dry-run.mjs` → `npm run dry-run:factory-queue-mirror`  
**Related:** [`docs/meta-beads.md`](../meta-beads.md) · root `AGENTS.md` (Meta Beads) · Project store `docs/factory-queue-mirror-convention.md` (coordinator pre-merge copy)

## Single "what's next"

Until Meta Beads has a **live claim** path wired into admit, the Project store file:

`/cursor/stores/self/notes.md`

is the single operator-facing **"what's next"** board for the factory-done loop. Linear remains human visibility; Meta Beads remains ready/claim SoT when hydrated. Do not invent a second queue.

## Loop tick procedure (coordinator only)

On **each** factory-done loop tick:

1. Prefer Meta Beads ready list when `bd` is installed and `.beads/` is hydrated:
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   bd ready            # human
   bd ready --json     # machine
   ```
2. If `bd` is unavailable / Beads not hydrated: use Linear project **Factory Meta** issues in **Todo** or **Backlog**.
   - **Exclude** Done / Canceled / Duplicate.
   - **Exclude** HITL-held items (e.g. **PBI-015** until `/ce-compound`).
3. Mirror into `notes.md` under `### Queued` as FE-* checklist rows (create the heading if missing).
4. **Update** existing FE-* Queued rows when titles/links change; do **not** duplicate ids already listed under `### In Progress` or `### Done`.
5. Live mirror **writes** `notes.md` on the **coordinator tick only**. CI / kit dry-run must **not** write Project store notes.

## Queued row shape

```markdown
### Queued
- [ ] **FE-NNN** Short title [optional link]
```

Map bead ids (`factory-*`) or Linear identifiers to FE-* Project task ids when a Project mapping already exists; otherwise create/update a Queued FE-* row that cites the bead/Linear id in the title or link text. Never invent Done checkmarks from mirror alone.

## Author ≠ reviewer (author ≠ reviewer)

- Kit author / PR implementer **must not** self-APPROVE the PR.
- Independent write APPROVE required before merge (`main` protection + `meta-ci-presence`).
- Vercel rate-limit failures are **not** a merge gate.

## Kit dry-run (CI / offline — no live Beads mutate, no notes write)

Parses committed fixtures + ops doc markers. Does **not** shell out to live `bd`, does **not** touch Dolt, does **not** write `/cursor/stores/self/notes.md`.

```bash
npm run dry-run:factory-queue-mirror
# or: node scripts/factory-queue-mirror-dry-run.mjs
```

Exit **0** = structural PASS. Fixtures live under `fixtures/factory-queue-mirror/`.

## What this kit proves

| Gate | Expect |
|------|--------|
| Ops doc + package script + dry-run script | Present with required markers |
| Fixture `bd ready --json` parse | Ready ids extracted; HITL-held (PBI-015) skipped |
| Fixture notes sample | In Progress / Done ids excluded from proposed Queued |
| Live Beads DB / `bd` CLI | **Untouched** |
| Project `notes.md` write | **REFUSED in CI/dry-run** (coordinator tick only) |
| Port schema / WEBHOOK / OAuth | **Untouched** |
| Secrets / Johnny ping / spend | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Port schema

**Dry-run / read only.** Do **not** `upsert_blueprint` / `upsert_workflow` / `trigger_run` / EI create-delete-revoke.

## Explicit non-goals

- No live `bd update --claim` / `bd close` / `bd dolt push` from this kit  
- No CI mutation of Project store `notes.md`  
- No Port schema apply / WEBHOOK remount  
- No OAuth External Interface mutate  
- No PBI-015 compound until `/ce-compound` (HITL-held — skip in mirror)  
- No Product Beads  
- No Sandbox Agent from browser  
- No Johnny ping / Adapter auth / spend  
- No self-APPROVE  
