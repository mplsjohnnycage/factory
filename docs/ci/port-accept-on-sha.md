# Port accept on exact SHA (PBI-011 / ADR-008)

Meta lane only. **Cockpit / human** performs Port governance accept. Coding agents evaluate CI and may record evidence — they never accept.

## Preconditions

1. Candidate delivery tip = exact SHA `S` (not branch name).
2. `meta-ci-presence` green on `S` (always-on).
3. For vertical-slice accept: `meta-accept-matrix` green on `S` (`gh workflow run meta-accept-matrix.yml -f ref=S`).
4. Branch protection on `main` requires at least `meta-ci-presence` — see `docs/ci/branch-protection.md` (Johnny admin if token 403).

## Evaluate (any agent / CI)

```bash
# Fixture / unit path
cd apps/factory-gateway && npm ci && npm test

# Live GitHub check-runs for SHA S
npx --prefix apps/factory-gateway tsx scripts/accept-on-sha.ts \
  --sha S \
  --repo mplsjohnnycage/factory \
  --required meta-ci-presence

# Or dispatch
gh workflow run meta-accept-gate.yml -f sha=S -f delivery_key=STL-172
```

Exit `0` = eligible. Exit `2` = denied (missing/failed checks, SHA mismatch, or rewrite stale prior).

## Record evidence (Cockpit / human only)

Gateway:

- `POST /accept/evaluate` — eligibility only
- `POST /accept/record` with header `X-Factory-Accept-Actor: cockpit|human` — after green eval
- `GET /accept/status?deliveryKey=&tipSha=` — `validForTip` is false after rewrite

Agent / canvas / cursor / self actors → `403 agent_self_accept_forbidden`.

## Port catalog accept

Human Cockpit applies Port accept for the delivery entity **only** when evaluate is ok for tip `S`. Meta Beads close after Port accept (not before).

## Rewrite

Force-push / new tip `S'` invalidates accept for `S`. Re-run evaluate + matrix on `S'`; prior record must not be treated as valid (`isValidForTip` / `prior_accept_stale_after_rewrite`).
