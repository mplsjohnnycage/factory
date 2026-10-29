# PBI-005 / STL-166 — Thin factory-gateway HMAC + catalog writer

Mirror of Linear [STL-166](https://linear.app/johnny-cage/issue/STL-166).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| Gateway package | `apps/factory-gateway/` |
| HMAC verify | `apps/factory-gateway/src/hmac.ts` |
| §4.2.1 catalog writer | `apps/factory-gateway/src/catalog-writer.ts` |
| ProjectSupervisor enqueue | `apps/factory-gateway/src/supervisor.ts` |
| HTTP surface | `apps/factory-gateway/src/server.ts` |
| Unit tests | `apps/factory-gateway/test/` |
| CI | `.github/workflows/factory-gateway.yml` |
| Specs | `specs/port-governance/spec.md`, `specs/rivet-execution/spec.md` |

## Verification

- `cd apps/factory-gateway && npm ci && npm run typecheck && npm test`
- No Port OAuth create/delete; no Product Beads; no dual-write bypass
