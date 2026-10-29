# PBI-011 / STL-172 — GitHub checks → accept on exact SHA

Mirror of Linear [STL-172](https://linear.app/johnny-cage/issue/STL-172).

## Delivered

| Artifact | Path |
|----------|------|
| Accept logic | `apps/factory-gateway/src/accept-sha.ts` |
| Gateway routes | `/accept/evaluate`, `/accept/record`, `/accept/status` |
| Tests | `apps/factory-gateway/test/accept-sha.test.ts` (rewrite invalidates) |
| CLI | `scripts/accept-on-sha.ts` |
| Workflow | `.github/workflows/meta-accept-gate.yml` |
| Ops doc | `docs/ci/port-accept-on-sha.md` |
| Spec | `specs/visibility-accept/spec.md` |

## Hard rules

- Accept binds exact SHA; rewrite invalidates
- Agent/self never Port-accepts
- No Linear→Cursor issue delegate for this authoring path
- No Product Beads

## Verify

```bash
cd apps/factory-gateway && npm ci && npm test
```
