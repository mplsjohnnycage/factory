# PBI-010 / STL-171 — OpenAccess + OpenMCP well-knowns

Mirror of Linear [STL-171](https://linear.app/johnny-cage/issue/STL-171).

## Delivered

| Artifact | Path |
|----------|------|
| OpenMCP | `/.well-known/openmcp.json` |
| OpenAccess | `/.well-known/openaccess.json` |
| Validator | `scripts/validate-well-known.mjs` |
| CI | `.github/workflows/meta-ci.yml` step |
| Specs | `auth-port-oauth`, `port-governance`, `logicsrc-interop` |

## Hard rules honored

- **No** Port External Interface create/delete/revoke
- **No** Observatory reuse
- Descriptors only — no client secrets in git
- Inventory §7 items 9–10

## Verify

```bash
node scripts/validate-well-known.mjs
```
