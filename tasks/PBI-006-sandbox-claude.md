# PBI-006 / STL-167 — Sandbox Agent + Claude Code harness

Mirror of Linear [STL-167](https://linear.app/johnny-cage/issue/STL-167).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| Harness package | `apps/sandbox-harness/` |
| AgentSession actor | `apps/sandbox-harness/src/agent-session.ts` |
| Docker lease (live) | `apps/sandbox-harness/src/docker-lease.ts` |
| Memory lease (CI) | `apps/sandbox-harness/src/memory-lease.ts` |
| Image pin | `apps/sandbox-harness/src/image-pin.ts` → `rivetdev/sandbox-agent:0.5.4-full` |
| OpenAgent stub | `agents/coder.factory.json` |
| Unit tests | `apps/sandbox-harness/test/` |
| CI | `.github/workflows/sandbox-harness.yml` |
| Spec | `specs/sandbox-harness/spec.md` |

## Verification

- `cd apps/sandbox-harness && npm ci && npm run typecheck && npm test`
- No browser→SA path; no Port OAuth create/delete; no Product Beads; Claude tokens env-only
