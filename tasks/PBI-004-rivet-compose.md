# PBI-004 / STL-165 — Rivet Compose + Tailscale Serve health

Mirror of Linear [STL-165](https://linear.app/johnny-cage/issue/STL-165).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| Compose stack (Rivet 2.x) | `compose/docker-compose.yml`, `compose/.env.example`, `compose/README.md` |
| Health / restart proof | `bin/rivet-healthcheck.sh` |
| Desktop bootstrap | `bin/install.sh` |
| Tailscale Serve docs | `docs/rivet-tailscale-serve.md` |
| CI compose lint | `.github/workflows/compose-lint.yml` |
| Spec | `specs/rivet-execution/spec.md` PBI-004 scenario |

## Verification

- `bin/rivet-healthcheck.sh --lint-only` exit 0
- On desktop pilot with Docker: `bin/rivet-healthcheck.sh --restart-proof` exit 0
- Tailscale Serve operator checklist in `docs/rivet-tailscale-serve.md` (live URL evidence may be human-hosted)
- No Port OAuth create/delete; no Product Beads; no `factory-edge`
