# Independent review request — supervisor admit offline (G6/G10)

**When:** 2026-10-29  
**Author worker:** bc-fe41ecc7-2524-5059-9741-ce4813c8fa95  
**Rule:** Author ≠ reviewer for merge (main protection: PR+1 APPROVE)

## Target

- **Repo:** `mplsjohnnycage/factory` (public)
- **Branch:** `cursor/supervisor-admit-offline-fa95`
- **Base:** `main`
- **PR:** [#48](https://github.com/mplsjohnnycage/factory/pull/48)
- **Advance doc:** [`supervisor-admit-offline-advance.md`](./supervisor-admit-offline-advance.md)

## Reviewer checklist (suggested)

1. `cd apps/project-supervisor && npm ci && npm run typecheck && npm test` → expect **24/24**.
2. Confirm G6: `mapToAdmitRequest` / `admitFromPayload` / `POST /admit` map bead|bypass → `ProjectSupervisorActor.admit`; opaque `{action,runId}` refuses.
3. Confirm G10 stub: `admitAndSpawn` + Memory `AgentSessionActor` in tests only; no Docker/Rivet host assumed.
4. Confirm Specs updated same PR (`factory-kernel`, `rivet-execution`).
5. Confirm no Port WEBHOOK remount, OAuth mutate, Observatory, or PBI-015.
6. Approve only if green; do **not** ask author to self-merge.

## Out of scope for this PR

Live Funnel, Rivet Serve, Docker SA, Port remount — desktop/ops.
