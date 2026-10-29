# Ask Factory → Rivet wiring (FE-198)

**Spec:** `rivet-execution` · **Bead:** `factory-s9q` · **Issue:** [#106](https://github.com/mplsjohnnycage/factory/issues/106)

## What this slice owns

The Cockpit **Ask Factory** drawer (⌘J) routes through the Developer OS BFF into the
Rivet AgentSession Actor stream — the ask-surface half of PBI-009's native session path.

| Route | Behavior |
|-------|----------|
| `POST /api/rivet/sessions/:id/messages` | Appends the client message to the AgentSession Actor |
| `GET  /api/rivet/sessions/:id/events?after=N` | Gap replay (PBI-009 convention) |
| `GET  /api/rivet/sessions/:id/stream` (SSE) | Live channel: `rivet-live-proxy` (poll→SSE) in live mode, `rivet-native` (Memory sub) in fixture mode |

## Live vs fixture — explicit, never fake

| Condition | Ask survives as |
|-----------|-----------------|
| `RIVET_SERVE_URL` set | **Live**: POST `${SERVE}/actors/agent-session/:id/events` (+ `Bearer ${RIVET_ADMIN_TOKEN}` if set). Replies flow back over the gap replay / live-proxy stream. |
| `RIVET_SERVE_URL` unset | **Fixture**: process-local Memory Actor + `system: ask.ack` event marked `source: memory-fixture`. |
| Serve set but unreachable / HTTP error | **502** on messages, events, and stream — the client sees the failure instead of silently faked live data. |

Session id used by the drawer: `factory-ask-cockpit`.

## Env (developer-os)

```bash
# .env.local — never commit values
RIVET_SERVE_URL=https://<hostname>.<tailnet>.ts.net   # Tailscale Serve (docs/rivet-tailscale-serve.md)
RIVET_ADMIN_TOKEN=                                    # optional bearer, env-only
```

## Sandbox smoke (Docker, no Vercel spend)

```bash
cd apps/developer-os
docker build -t factory-developer-os:fe198 .

# Fixture path
docker run --rm -d --name fe198-smoke -p 3001:3000 factory-developer-os:fe198
curl -fsS http://localhost:3001/ | grep -q "Code Atlas"
curl -fsS "http://localhost:3001/api/rivet/sessions/factory-ask-cockpit/events?after=-1"
curl -fsS -X POST -H "Content-Type: application/json" \
  -d '{"text":"what is the assembly status?"}' \
  "http://localhost:3001/api/rivet/sessions/factory-ask-cockpit/messages"

# Explicit live-failure path (Serve configured, unreachable)
docker run --rm -d --name fe198-livefail -p 3002:3000 \
  -e RIVET_SERVE_URL=http://127.0.0.1:9 factory-developer-os:fe198
# → events/messages/stream each respond 502
```

2026-10-29 evidence: smoke container PASS (home 200 · ask → client+ack · headers
`x-factory-stream: rivet-native`) and live-fail container PASS (all routes 502).

PowerShell note: the `curl` smoke lines above are bash-shaped (backslash
continuations, `grep -q`). On Windows, run each curl on a single line or use
Git Bash — same commands as the down-shifted ops docs.

## Boundaries

| Rule | Why |
|------|-----|
| Browser → BFF only | Never call Rivet Serve / Sandbox Agent from the browser |
| No Port mutation | Ask path never writes the catalog or triggers workflows |
| No CopilotKit | Kernel wire stays Rivet-Actor native (ADR-011) |
| Secrets env-only | `RIVET_ADMIN_TOKEN` never printed or committed |
| Fixture is display-only | The Memory store is not a second control plane |
