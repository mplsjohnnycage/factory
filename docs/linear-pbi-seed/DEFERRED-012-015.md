# Deferred PBIs (012–015)

Not started in this seed wave. Create later.

- PBI-012: OpenFleet ceilings + gateway rate limit (DEFERRED) — Implement-gated §13.5 — author stub OK; implement only after M1 accept green. Depends PBI-007, PBI-011 + M1 accept.
- PBI-013: Local gate + CI refuse + validators (DEFERRED for seed wave) — Depends PBI-003. Can author early but not part of PBI-001–011 seed start set for this wave.
- PBI-014: OpenPRD 0001–0005 (DEFERRED / not M1 exit) — Author OK later; not M1 exit — §13.6 post-M1. Depends PBI-001.
- PBI-015: CE compound writeback after first coding PBI (DEFERRED) — HITL `/ce-compound`; depends PBI-007. Flag human for writeback.

## Branch policy (correct path)

Do **not** hard-code working branch names in Linear or seed docs. When a deferred PBI starts, a **Project worker** creates a **fresh branch from current `main`** (same as PBI-001…011). Never Linear→Cursor issue-delegate. Never pre-create empty remotes to satisfy a name. See [`../pbi-012-015-branch-fix.md`](../pbi-012-015-branch-fix.md).
