# Sandbox harness morning / readiness dry-run kit

**Lane:** Meta · **Audience:** Projects Manager  
**Purpose:** Morning readiness check for `apps/sandbox-harness` (PBI-006 / ADR-006) without Docker spend, Claude credentials, Port schema upserts, or Rivet Compose/Serve live smoke.  
**Script:** `scripts/sandbox-harness-dry-run.mjs` → `npm run dry-run:sandbox-harness`  
**Code:** `apps/sandbox-harness` (`AgentSessionActor` · `MemorySandboxLease` · image pin `rivetdev/sandbox-agent:0.5.4-full`)  
**Spec:** `specs/sandbox-harness/spec.md`

## Non-overlap (do not duplicate Rivet #76)

| Kit | Owns |
|-----|------|
| **This kit** | Sandbox harness package readiness: image pin, Memory lease CI path, browser→SA ban, optional Memory unit tests |
| [Rivet Compose + Tailscale Serve smoke (#76)](https://github.com/mplsjohnnycage/factory/pull/76) | `compose/` + Tailscale Serve `/health` pilot — **out of scope here** |
| [Supervisor admit dry-run](./supervisor-admit-dry-run.md) | Offline `POST /admit` / `admitFromPayload` (G6) |
| Signed / unsigned Funnel admit kits | Gateway HMAC claim path (FE-142 **CLOSED**) |

Live Docker Sandbox Agent + Claude Code remains **ops/desktop** (Engine + `ANTHROPIC_API_KEY` env) — **out of scope** for this kit’s default path.

## What this kit proves

| Gate | Expect |
|------|--------|
| Kit markers (ops doc + harness sources + Spec pin) | Present; no secret assignments |
| Image pin | `rivetdev/sandbox-agent:0.5.4-full` · SDK `0.5.4` · M1 agent `claude` |
| CI path | `MemorySandboxLease` lifecycle tests (no Docker, no Claude) |
| Browser → Sandbox Agent control | **Banned** (README / Spec / ADR-006) |
| Port schema / WEBHOOK / OAuth | **Untouched** |
| Secrets print / re-ask | **REFUSED** (FE-142 CLOSED · FE-172 CLOSED) |

## FE-142 / FE-172 (do not re-ask)

- **FE-142 CLOSED** — signed Funnel claim + handler-token path done. Do not ask Johnny/PM for HMAC / handler-token again.
- **FE-172 CLOSED** — human Port Sign-in satisfied. Do not ask Johnny for Sign-in.

## Kit dry-run (no network, no npm install)

```bash
npm run dry-run:sandbox-harness
# or: node scripts/sandbox-harness-dry-run.mjs
```

Exit **0** = docs/scripts/source markers present; Port mutate refused; no secrets printed.

## Memory lifecycle probe (optional — local Node deps)

Runs `apps/sandbox-harness` unit tests (`MemorySandboxLease` only). Installs package deps under that app when needed (no Port, no Docker required, no Anthropic spend).

```bash
npm run dry-run:sandbox-harness -- --memory
```

## Live Docker (operator — out of kit default)

```bash
cd apps/sandbox-harness
cp .env.example .env   # set ANTHROPIC_API_KEY locally; never commit
# Docker Engine required; wire DockerSandboxLease from Rivet Actor — never from the browser
```

## Guards

- Port schema: dry-run / **REFUSED** (no upserts)
- Secrets: none printed / none asked
- Zero spend · author ≠ reviewer (independent write APPROVE before merge)
- Do not expand into Rivet Compose/Serve evidence (that is #76)
