# Factory queue mirror — coordinator convention (pre-merge)

**Audience:** Projects Manager / factory-done loop coordinator  
**Repo kit (PR):** `docs/ops/factory-queue-mirror.md` · `npm run dry-run:factory-queue-mirror`  
**Guards:** zero spend · no secrets · FE-142/FE-172 CLOSED · Port schema dry-run only · author≠reviewer · no self-APPROVE

## Single what's-next

`/cursor/stores/self/notes.md` is the single operator board until Meta Beads has a live claim path. Do not invent a second queue.

## Each loop tick

1. Prefer `bd ready` / `bd ready --json` when `bd` + hydrated `.beads/` are available.
2. Else Linear **Factory Meta** Todo/Backlog — exclude Done/Canceled; exclude HITL-held (**PBI-015** until `/ce-compound`).
3. Upsert FE-* rows under `### Queued` (create heading if missing).
4. Skip ids already in `### In Progress` or `### Done` — never duplicate.
5. Live `notes.md` write happens on the **coordinator tick only**. Kit dry-run / CI must not write notes or mutate Beads.

## Queued row

```markdown
### Queued
- [ ] **FE-NNN** Short title [optional link]
```

## Review

Author session never write-APPROVEs its own PR. Independent reviewer only. Vercel rate-limit is not a merge gate; `meta-ci-presence` is required.
