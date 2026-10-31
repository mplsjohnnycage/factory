---
cursor:
  subagentId: "bc-2f67e149-b5d4-5f5a-b6d2-c0ac8b05bcbf"
---

# Sandbox morning-ready — can an operator start a coding session today?

**Verdict: No.** `apps/sandbox-harness` on `main` is a green CI library (Memory lease). Live create → prompt → stream → checkpoint through Docker + Claude is not operator-startable today.

**Scope audited:** `origin/main` @ current tip (harness commit `0a577ba` / PBI-006). Evidence collected on this Cloud Agent host 2026-10-29 against that tree (harness files match `main`; no local harness diff).

---

## Top 3 blockers (ranked)

| Rank | Blocker | Why it stops a session today |
|------|---------|------------------------------|
| **1** | **No live start path** | Package is library-only. `src/index.ts` re-exports; `npm start` does not create a session. `ProjectSupervisor` admits Beads work but never imports `DockerSandboxLease` / `AgentSessionActor`. README defers wiring to “Rivet Actor (PBI-007+)”. Compose runs only `rivet-engine` — no harness worker. |
| **2** | **Docker Engine / socket missing (no DooD/DinD path)** | Live lease needs Docker API via `sandbox-agent/docker` + peers `dockerode` / `get-port`. This host: no `docker` binary, no `/var/run/docker.sock`. `compose/docker-compose.yml` does not mount the socket or run a DinD/privileged sibling spawner. ADR-006 assumes Docker on the **operator desktop** — that path is not standing here, and Meta Compose does not provide it. |
| **3** | **`ANTHROPIC_API_KEY` unset** | M1 agent id = `claude`. `DockerSandboxLease` injects `ANTHROPIC_API_KEY` into the container only when present. No `apps/sandbox-harness/.env`, key unset in process env. Without it, Claude Code inside the sandbox cannot run a real coding prompt. |

---

## Full blocker list (ranked)

1. **No operator/Rivet entrypoint that starts `AgentSessionActor` + `DockerSandboxLease`** — structural; blocks even if Docker + key exist.
2. **No Docker Engine / `docker.sock` on audit host; Compose has no Docker-from-Docker (DinD) or Docker-outside-of-Docker (socket mount) for spawning `rivetdev/sandbox-agent`.**
3. **`ANTHROPIC_API_KEY` missing** (`.env.example` only; secrets env-only by design).
4. **Optional peers not installed** — `dockerode`, `get-port` are optional peerDeps; README requires `npm i dockerode get-port` for live path; neither present under `node_modules`.
5. **Harness deps not installed on host** — no `apps/sandbox-harness/node_modules` (incl. `sandbox-agent@0.5.4`).
6. **Pinned image not pulled** — `rivetdev/sandbox-agent:0.5.4-full` unreachable without Docker.
7. **Scoped `GITHUB_TOKEN` unset** — soft; checkpoint falls back to `no-git-worktree:…` without a mounted git worktree/token (session can still prompt if 1–3 fixed).
8. **No live Docker/Claude integration test in CI** — Memory lease only; operators get no automated proof the live path works.

---

## What *does* work today

| Path | Status |
|------|--------|
| Unit lifecycle (Memory lease) | Authored + CI (`npm test`) — create → prompt → stream → checkpoint; kill preserves identity |
| Image pin | `rivetdev/sandbox-agent:0.5.4-full`, SDK `0.5.4`, agent `claude` |
| Spec / ADR-006 / OpenAgent stub | Present; secrets declared as `env:ANTHROPIC_API_KEY` |
| Rivet Compose | Engine-only pilot (`rivetdev/engine:2.3.3`); not a sandbox runner |

---

## Docker-from-Docker note

The SDK path is **host Docker API → sibling container** (`dockerode` → Engine), not an in-repo DinD service. Neither is ready:

- **DoD (socket / sibling):** needs Engine + sock (and usually a worker with `/var/run/docker.sock` mounted). Absent.
- **DinD (privileged-in-privileged):** not defined in `compose/`. Absent.

Until one of those exists on the operator host (or a dedicated runner), `DockerSandboxLease.start()` cannot succeed.

---

## Minimal unblock (operator desktop)

1. Wire a Rivet Actor / one-shot operator script that constructs `new AgentSessionActor(new DockerSandboxLease())` and runs create → prompt (still never from the browser).
2. Install Docker Engine; ensure sock usable; `docker pull rivetdev/sandbox-agent:0.5.4-full`.
3. `cd apps/sandbox-harness && npm ci && npm i dockerode get-port`; copy `.env.example` → `.env` with a real `ANTHROPIC_API_KEY` (and scoped `GITHUB_TOKEN` if checkpointing a real repo).

Until (1)–(3), morning answer remains: **CI Memory harness yes; live Claude sandbox session no.**
