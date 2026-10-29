# PBI-014 / STL-175 — OpenPRD 0001–0005 (DEFERRED / not M1 exit)

Mirror of Linear [STL-175](https://linear.app/johnny-cage/issue/STL-175).

## Delivered

| Artifact | Path |
|----------|------|
| OpenPRD template | `prd/0000-template.md` |
| OpenPRD 0001–0005 Accepted | `prd/0001-*.md` … `prd/0005-*.md` |
| Index | `prd/README.md` |
| OpenPRD validator dep | `package.json` (`@logicsrc/openprd@0.2.0`) |
| Local gate OpenPRD refuse | `scripts/local-gate.mjs` + refuse tests |
| Spec | `specs/asdlc-lifecycle/spec.md` (+ `logicsrc-interop` pointer) |

## Product-intent map (Meta → Spec)

| ID | Title (slug) | Spec tags |
|----|--------------|-----------|
| 0001 | Govern Factory delivery through Port as system of record | port-governance, factory-kernel |
| 0002 | Execute coding admits on Rivet with ProjectSupervisor fencing | rivet-execution, factory-kernel |
| 0003 | Run coding work inside Sandbox Agent Docker sessions | sandbox-harness |
| 0004 | Operate Factory through Developer OS on Next.js and Vercel | developer-os |
| 0005 | Accept delivery only on exact green GitHub CI SHA | visibility-accept, asdlc-lifecycle |

## Hard rules

- Meta only — no Product Beads
- Author ≠ reviewer (Codex + Linear); no self-merge; Johnny out of review
- No Linear→Cursor issue delegate
- Fresh branch from current `main` (ignore Linear `gitBranchName`)
- Living Spec updated in this PR
- Not an M1 exit criterion (§13.6 post-M1)

## Verify

```bash
npm ci
npm test
npm run local-gate
# or: ./bin/local-gate
```
