# PBI-012 / STL-173 — OpenFleet ceilings + gateway rate limit

Mirror of Linear [STL-173](https://linear.app/johnny-cage/issue/STL-173).

## Delivered

| Artifact | Path |
|----------|------|
| Ceiling evaluate + narrow merge | `apps/factory-gateway/src/openfleet-ceilings.ts` |
| Append-only ledger (`ceiling.refuse`) | `apps/factory-gateway/src/openfleet-ledger.ts` |
| Spawn gate | `apps/factory-gateway/src/fleet-spawn.ts` |
| Sliding-window rate limiter | `apps/factory-gateway/src/rate-limit.ts` |
| Routes | `POST /fleet/spawn`, `GET /fleet/ledger` (+ rate limits on mutating routes) |
| Tests | `apps/factory-gateway/test/openfleet-ceilings.test.ts` |
| Spec | `specs/security-blast-radius/spec.md` |

## Hard rules

- Meta only — no Product Beads
- Over-ceiling → ledger `ceiling.refuse`
- Ceiling narrows only
- Author ≠ reviewer (Codex + Linear)
- No Linear→Cursor issue delegate

## Verify

```bash
cd apps/factory-gateway && npm ci && npm test
```
