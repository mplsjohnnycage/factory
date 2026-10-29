# OmniRoute / OmniRouter desktop install (staged)

**Lane:** Meta  
**Pilot host:** `DESKTOP-3APDBKG` (optional; any operator desktop works)  
**Default local endpoint:** `http://127.0.0.1:20128` · OpenAI-compatible base `http://127.0.0.1:20128/v1`  
**Kit dry-run (any OS):** `node scripts/omniroute-desktop-dry-run.mjs` → `npm run dry-run:omniroute-desktop`  
**Upstream:** [omniroute.online](https://omniroute.online/) · [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) (MIT) · npm `omniroute`

## Verdict

Stack audit: OmniRoute ↔ Port/Rivet/Factory wiring is **design-only** (UNVERIFIABLE as a vendor product path). This kit **stages desktop install + local verify** so PM can stand up the LLM gateway on localhost **without** committing API keys, calling live paid providers, or mutating Port.

**Naming:** Public package/site = **OmniRoute**. Prior Factory text said “OmniRouter” — treat OmniRouter as the Factory widget/label alias; install the **OmniRoute** binary/image.

**Hard bans:** no Port schema upsert · no Port/EI OAuth create · no API keys in git/chat/PRs · no spend from this kit · no Factory control-plane traffic through OmniRoute yet.

Cloud agents **cannot** complete live desktop Electron install on Johnny’s machine. They stage docs/scripts, run the Node dry-run, and open a PR. PM (or desktop operator) runs install + `/healthz` on the host.

---

## Files

| Path | Role |
|------|------|
| `docs/ops/omniroute-desktop-install.md` | This runbook |
| `scripts/omniroute-desktop-dry-run.mjs` | Repo kit presence check (no install, no network spend) |
| `scripts/windows/omniroute.env.example` | Local env template (empty values only) |
| `scripts/windows/omniroute-desktop-verify.ps1` | `DryRun` kit check / optional `Health` against localhost:20128 |

---

## Prerequisites (desktop)

- **Node.js ≥ 22** (npm global path) **or** Docker Engine 24+ / Docker Desktop (compose self-host)
- ~2 GB free RAM when the gateway is up
- Loopback only by default (`127.0.0.1`) — do **not** Funnel/expose OmniRoute without a separate hardening ticket

Provider API keys are **optional for install verify**. Health (`/healthz`) must work with **zero** providers configured. Connecting providers is a later PM step and may incur third-party spend — **out of scope** for this dry-run kit.

---

## Path A — npm (recommended for desktop)

```powershell
# On DESKTOP-3APDBKG (or any operator desktop)
npm install -g omniroute
omniroute --version

# First start (dashboard + /v1 on :20128)
omniroute
```

Default data dir (Windows): `%APPDATA%\omniroute` when `%USERPROFILE%\.omniroute` is absent. Override with `DATA_DIR` if needed.

Optional local env (never commit the real file):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.factory" | Out-Null
Copy-Item C:\src\factory\scripts\windows\omniroute.env.example `
  "$env:USERPROFILE\.factory\omniroute.env"
# Edit empty slots only when you intentionally harden/bind — no provider keys in this file for the staged path.
notepad "$env:USERPROFILE\.factory\omniroute.env"
```

Load vars in the same shell before `omniroute` if you use the file (example):

```powershell
Get-Content "$env:USERPROFILE\.factory\omniroute.env" |
  Where-Object { $_ -match '^\s*[^#][^=]+=' } |
  ForEach-Object {
    $k,$v = $_.Split('=',2)
    [Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim(), 'Process')
  }
omniroute
```

---

## Path B — Docker self-host (optional)

Pinned self-host compose is documented upstream (v3.8.51+). Do **not** commit a downloaded `.env` with secrets into Factory.

```bash
mkdir omniroute && cd omniroute
BASE=https://raw.githubusercontent.com/diegosouzapw/OmniRoute/v3.8.51
curl -fsSLO "$BASE/docker-compose.selfhost.yml"
curl -fsSLO "$BASE/.env.selfhost.example"
cp .env.selfhost.example .env
# Edit ONLY non-secret hardening lines for staged verify, e.g.:
#   REQUIRE_API_KEY=true
#   APP_BIND_HOST=127.0.0.1
# Leave provider keys empty for install+health dry-run.
docker compose -f docker-compose.selfhost.yml up -d
```

---

## Path C — Electron desktop build (optional)

Upstream ships Electron installers on GitHub Releases (`electron:build:win` / mac / linux in the OmniRoute repo). Prefer a **published Release** asset over building from source on the pilot host. Building from source is out of band for this Meta kit (no Factory submodule of OmniRoute).

---

## Verify (no providers required)

```bash
# Process readiness — expect JSON status ok (shape may include "status":"ok")
curl -fsS --max-time 10 http://127.0.0.1:20128/healthz

# Dashboard root should answer (HTML or redirect) — presence only
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 http://127.0.0.1:20128/

# OpenAI-compatible base (may 401 without a local OmniRoute API key — that is OK for staged install)
curl -sS -o /dev/null -w '%{http_code}\n' --max-time 10 http://127.0.0.1:20128/v1/models
```

Windows helper (after merge/pull):

```powershell
cd C:\src\factory
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\omniroute-desktop-verify.ps1 -Action DryRun
# When OmniRoute is running locally:
powershell -NoProfile -ExecutionPolicy Bypass -File `
  .\scripts\windows\omniroute-desktop-verify.ps1 -Action Health
```

Cloud / any OS kit check (no OmniRoute install required):

```bash
npm run dry-run:omniroute-desktop
# expect exit 0
```

### PASS criteria (staged)

| Check | Expect |
|-------|--------|
| Kit dry-run | exit 0; all files + markers present; no committed secret assignments |
| `/healthz` (desktop, after start) | HTTP 200 + ok status |
| Provider chat / paid models | **Not required** this tick |
| Port / Rivet / Funnel | **Untouched** |

---

## Explicit non-goals (held)

- No Port blueprint/workflow upsert  
- No Factory gateway HMAC / FE-142 secret fill (separate PM track)  
- No committing `OPENAI_API_KEY` / Anthropic / Groq / OmniRoute dashboard keys  
- No Tailscale Funnel of `:20128` without a dedicated security ticket  
- No spend; do not run provider smokes that bill  
- No claiming OmniRoute is a live Factory kernel dependency — design-only until a Spec/ADR says otherwise  

---

## Related

- Project stack audit §13 (OmniRoute / “OmniRouter”) — design-only edge  
- Factory Dev OS MCP App widget prompt inventory (OmniRouter label) — UI design, not install  
- Gateway Funnel / HMAC: `docs/gateway-hmac-smoke.md` (separate lane)
