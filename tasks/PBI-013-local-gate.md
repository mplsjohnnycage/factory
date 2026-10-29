# PBI-013 / STL-174 — Local gate + CI refuse + validators

Mirror of Linear [STL-174](https://linear.app/johnny-cage/issue/STL-174).

## Delivered

| Artifact | Path |
|----------|------|
| One local gate command | `bin/local-gate` → `npm run local-gate` → `scripts/local-gate.mjs` |
| Refuse ratchet tests | `scripts/local-gate-refuse.test.mjs` |
| LogicSRC fixtures | `fixtures/logicsrc/valid/`, `fixtures/logicsrc/invalid/` |
| Root validators dep | `package.json` (`@logicsrc/validators@0.6.0`) |
| CI refuse | `.github/workflows/local-gate.yml` |
| Spec | `specs/asdlc-lifecycle/spec.md` |

## Hard rules

- Meta only — no Product Beads
- One command refuses dirty/invalid; CI runs the same gate
- Author ≠ reviewer (Codex + Linear); no self-merge
- No Linear→Cursor issue delegate
- Living Spec updated in this PR

## Verify

```bash
npm ci
npm test
npm run local-gate
# or: ./bin/local-gate
```
