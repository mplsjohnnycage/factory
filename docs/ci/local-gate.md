# Local gate (PBI-013 / STL-174)

One ASDLC command refuses dirty/invalid trees. CI runs the same command on every PR and `main` push.

## Command

```bash
npm ci
npm run local-gate
# equivalent:
./bin/local-gate
```

## What it refuses

| Check | Refuse when |
|-------|-------------|
| Spec inventory | Missing domain Spec or Blueprint/Contract anatomy |
| ADR inventory | Missing ADR-001…011 bodies |
| M1 emits | Missing OpenStack/OpenProfile/AGENTS/well-knowns |
| Placeholders | `0.0.0-scaffold` (or equivalent) in gated trees |
| Well-knowns | `scripts/validate-well-known.mjs` fails |
| `@logicsrc/validators` | Invalid LogicSRC fixtures / OpenPRD bodies |
| Invalid ratchet | Broken fixture unexpectedly validates |
| Apps | Typecheck or tests fail under `apps/*` |

Skip apps (debug only): `LOCAL_GATE_SKIP_APPS=factory-gateway,developer-os`.

## CI

Workflow: `.github/workflows/local-gate.yml` — job `local-gate-refuse`.

## Spec

`specs/asdlc-lifecycle/spec.md` — Contract scenarios for local gate + CI refuse.
