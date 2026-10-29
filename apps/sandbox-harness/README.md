# sandbox-harness (PBI-006 / STL-167)

Factory Meta coding harness: **Rivet-shaped `AgentSessionActor`** owns session identity; **Sandbox Agent** runs inside a **Docker** sandbox; M1 coding agent = **Claude Code**.

Lane hard rules: Meta only · browser never calls Sandbox Agent · no Port OAuth create/delete · secrets via env only.

## Image pin

| Constant | Value |
|----------|-------|
| Docker image | `rivetdev/sandbox-agent:0.5.4-full` |
| SDK | `sandbox-agent@0.5.4` |
| M1 agent id | `claude` |

Do **not** float `:latest` / `:full`. Override only via `SANDBOX_AGENT_IMAGE` for operator experiments.

## Layout

| Path | Role |
|------|------|
| `src/agent-session.ts` | create → prompt → stream → checkpoint; kill preserves identity |
| `src/docker-lease.ts` | Live Docker provider (`sandbox-agent/docker`) |
| `src/memory-lease.ts` | CI / unit lease (no Docker, no Claude creds) |
| `src/image-pin.ts` | Deliberate image + SDK pin |
| `../../agents/coder.factory.json` | Optional OpenAgent `coder.factory` stub |

## Verify (CI)

```bash
cd apps/sandbox-harness
npm ci
npm run typecheck
npm test
```

## Live Docker (operator)

```bash
cp .env.example .env   # set ANTHROPIC_API_KEY
# Docker Engine required; dockerode/get-port peers install with npm i dockerode get-port
```

Wire `DockerSandboxLease` + `AgentSessionActor` from a Rivet Actor (PBI-007+) — never from the browser.

## Spec

`specs/sandbox-harness/spec.md` — updated in the same PR.
