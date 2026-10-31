# Remount armed runbook — public Funnel `/health` → Port

**Lane:** Meta only  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**)  
**Armed:** 2026-10-29  
**Kit on `main`:** remount dry-run [#40](https://github.com/mplsjohnnycage/factory/pull/40) (`f38b3d1`) + gateway Dockerfile [#41](https://github.com/mplsjohnnycage/factory/pull/41) (`41f49c8`)  
**In-repo kit:** `scripts/gateway-remount-dry-run.mjs` · `docs/gateway-remount-dry-run.md` · `docs/port-workflow-webhooks.md`  
**Related store:** [`funnel-remount-status.md`](./funnel-remount-status.md) · [`factory-gateway-public-url.md`](./factory-gateway-public-url.md)

## Verdict

**Armed and waiting.** Cloud agents execute this runbook **only after** Johnny pastes a public Funnel base URL whose `GET /health` returns `200` + `{"ok":true,"service":"factory-gateway"}` from a **non-tailnet** path. Until then: dry-run against dead URLs is allowed (must exit 1); **do not** upsert Port secrets or WEBHOOKs.

**Docs-only this pass** — no code PR. Merged kit covers preflight; remount steps below are operator/MCP recipes.

---

## Hard stop rules (every agent)

| Rule | Do |
|------|----|
| Dead URL | **Never** set Port secret `FACTORY_GATEWAY_BASE_URL` until dry-run exit **0** |
| Live remount | **Never** `upsert_workflow` until health green **and** secrets set |
| Fencing GETs | **Never** retarget `api.port.io` WEBHOOK nodes (`fetch_*`, `find_*`, `recheck_*`) |
| OAuth | **Never** create/delete/revoke External Interface apps; **never** prune redirect URIs |
| PBI-015 | **Out of scope** — leave deferred |
| Observatory | **No** Observatory OAuth / remount / references |
| Base URL sources | **Never** use `factory-developer-os.vercel.app` or `factory-meta-ci` as gateway base |

---

## 0 — Trigger (Johnny paste)

Johnny (or Muse desktop after Funnel) pastes into Project chat / Linear FE-129:

```text
FACTORY_GATEWAY_BASE_URL=https://<hostname>.<tailnet>.ts.net
# proof: curl -fsS "$FACTORY_GATEWAY_BASE_URL/health"
# → {"ok":true,"service":"factory-gateway"}
```

Strip trailing slash. Prefer HTTPS Funnel (Port SaaS is not on the tailnet).

Desktop bring-up (Johnny only; cloud cannot Funnel) remains in [`funnel-remount-status.md`](./funnel-remount-status.md) §A–C and gateway README Docker/`--profile gateway`.

---

## 1 — Optional dry-run (cloud agent, first action)

From a fresh clone of `main` (≥ `41f49c8`):

```bash
git fetch origin main && git checkout main && git pull --ff-only

# Paste URL only — no Port secrets required for dry-run
node scripts/gateway-remount-dry-run.mjs \
  --base-url 'https://<hostname>.<tailnet>.ts.net'
```

| Exit | Meaning | Next |
|------|---------|------|
| `0` | Health OK; paths printed; Port untouched | Continue §2 |
| `1` | Unreachable / wrong body | **STOP** — tell Johnny Funnel still down; do not touch Port |
| `2` | Missing/bad args | Fix URL and retry |

Dry-run **refuses** Port mutate APIs by design (prints refuse; ignores `PORT_*` env).

Equivalent one-liner if script unavailable:

```bash
curl -fsS --max-time 15 "$FACTORY_GATEWAY_BASE_URL/health"
# must be HTTP 200 and JSON ok+service=factory-gateway
```

---

## 2 — Exact Port secret upserts

**Channel:** Port UI → Settings → Secrets (Port MCP has **no** secret upsert tool). Match gateway process env on the Funnel host. Never commit values; never paste secrets into git/PR/Beads.

| Port secret name | Value | Gateway env | Consumers |
|------------------|-------|-------------|-----------|
| `FACTORY_GATEWAY_BASE_URL` | Funnel origin, **no** trailing slash (e.g. `https://desktop.<tailnet>.ts.net`) | *(public URL only — not a gateway env)* | SS WEBHOOK templates; additive `factory_*` notify URLs |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | Same random bearer as gateway | `FACTORY_GATEWAY_HANDLER_TOKEN` | `Authorization: Bearer` on `/handlers/self-service` |
| *(classic webhook / EI client secret — Port signing secret)* | Same as gateway HMAC secret | `PORT_CLIENT_SECRET` | Port classic HMAC on `/webhooks/port*` (+ optional SS HMAC) |
| `CONVEX_TEAM_TOKEN` | Convex Management team token (optional duplicate in Port) | `CONVEX_TEAM_TOKEN` | `ss_convex_*` only |

### Upsert order

1. Confirm dry-run exit **0** (§1).
2. Upsert `FACTORY_GATEWAY_HANDLER_TOKEN` (and ensure gateway already has the same value).
3. Upsert / confirm classic webhook signing secret ↔ `PORT_CLIENT_SECRET`.
4. Upsert `FACTORY_GATEWAY_BASE_URL` **last** (this arms SS templates that already interpolate the secret).
5. Optional: `CONVEX_TEAM_TOKEN` if Meta Convex SS will be smoked.

### Verify secrets are live (no mutate)

- Read Meta SS workflows: URL must still be  
  `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/handlers/self-service`  
  (`ss_convex_create_preview`, `ss_convex_set_env` — already on Port).
- Do **not** change OAuth redirect URI lists.

---

## 3 — Additive `factory_*` notify WEBHOOK recipe

Canonical IDs (do **not** invent):

```
factory_create_execution_contract
factory_start_delivery_run
factory_claim_next_job
factory_heartbeat
factory_submit_evidence
factory_record_review_verdict
factory_request_release
```

### 3.1 Rule

**ADD** a synchronized notify/admit WEBHOOK after the lease/write step.  
**KEEP** every existing `https://api.port.io/v1/...` fencing GET/search node unchanged.

### 3.2 Worked example — `factory_claim_next_job` (live inventory 2026-10-29)

Existing chain (leave intact):

```
trigger → fetch_runner → find_job → fetch_attempt → gate
       → (ok) write_attempt → advance_run
```

Fencing WEBHOOKs (hosts stay `api.port.io`): `fetch_runner`, `find_job`, `fetch_attempt`.

**Add** after `advance_run`:

| Field | Value |
|-------|--------|
| Node `identifier` | `gateway_admit` (stable; do not collide with fencing ids) |
| `title` | `factory-gateway admit` |
| `config.type` | `WEBHOOK` |
| `config.url` | `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/factory_claim_next_job` |
| `config.method` | `POST` |
| `config.synchronized` | `true` |
| `config.agent` | `false` |
| `config.onFailure` | `terminate` (first smoke) or `continue` if admit is best-effort |
| `config.onTimeout` | `fail` |
| HMAC | **Enable** Port classic webhook signing (uses EI / classic secret ↔ `PORT_CLIENT_SECRET`) |
| Body (minimal) | See below |

```json
{
  "action": "factory_claim_next_job",
  "runId": "{{ .workflowRun.id }}",
  "role": "{{ .outputs.trigger.role }}",
  "runner": "{{ .outputs.trigger.runner }}",
  "deliveryRun": "{{ .outputs.find_job.job.identifier }}",
  "idempotencyKey": "{{ .outputs.trigger.idempotencyKey }}"
}
```

**Connection:** `advance_run` → `gateway_admit` (append; do not remove `write_attempt` → `advance_run`).

### 3.3 Other six workflows

Same pattern: append `gateway_admit` after the **last successful write** node (typically last `UPSERT_ENTITY` on the happy path), URL:

```text
{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<factory_*>
```

Path form supplies allowlisted `actionIdentifier` when body omits `action` — prefer including `"action": "<factory_*>"` anyway.

### 3.4 MCP apply shape (after health + secrets)

1. `get_workflow` for the target id → copy full definition.
2. Confirm **zero** existing nodes already point at the Funnel host (idempotent remount).
3. Append `gateway_admit` node + one connection from the terminal write node.
4. `upsert_workflow` with the **full** updated workflow (nodes + connections).
5. Re-`get_workflow` and assert fencing URLs still `api.port.io` and exactly one new gateway notify URL.

Pilot order: remount **`factory_claim_next_job` first**, smoke (§4), then remaining six.

---

## 4 — Smoke probes

Run only after §1 exit 0 + §2 secrets + at least one additive node (§3).

| # | Probe | Expect |
|---|-------|--------|
| 1 | `GET {BASE}/health` (non-tailnet / this cloud VM) | **200** `{"ok":true,"service":"factory-gateway"}` |
| 2 | Re-run dry-run script | Exit **0** |
| 3 | Port MCP `get_workflow` on remounted ids | Fencing GETs → `api.port.io`; notify → Funnel `/webhooks/port/factory_*` |
| 4 | `trigger_run` / self-service **one** Meta SS (`ss_convex_*`) with valid bearer | Gateway handler **2xx** JSON; bad bearer → **401** |
| 5 | `trigger_run` remounted `factory_claim_next_job` (safe fixture / Johnny-approved) | Notify node → gateway **202** `{ ok, admitId, actionIdentifier }` |
| 6 | Signed request with wrong HMAC (gateway logs / deliberate bad secret test on non-prod only) | **401**, no enqueue |
| 7 | `POST {BASE}/webhooks/port/not_a_factory_tool` | **404** |

Auth reminder (R-15): Funnel ≠ auth. HMAC + bearer still required.

---

## 5 — Rollback

| Failure | Action |
|---------|--------|
| Funnel dies / `/health` fails | **Unset or blank** Port secret `FACTORY_GATEWAY_BASE_URL` immediately so SS templates stop calling a dead host; leave fencing GETs alone |
| Admit node errors break `factory_*` runs | `upsert_workflow`: remove `gateway_admit` node + its connection only; restore prior connections; keep `api.port.io` nodes |
| Bad HMAC / 401 storms | Disable HMAC temporarily only on the **new** notify node while fixing `PORT_CLIENT_SECRET` match — or remove the node (§ above) |
| Wrong base URL set | Overwrite secret with corrected Funnel URL **after** dry-run 0; or clear secret until fixed |
| Full abort | No OAuth prune; no workflow delete; additive-only reverse = delete notify nodes |

Do **not** “rollback” by pointing fencing GETs at the gateway. Do **not** flip repo private.

---

## 6 — Cloud agent checklist (copy when URL arrives)

```text
[ ] Paste URL → normalize (no trailing slash)
[ ] node scripts/gateway-remount-dry-run.mjs --base-url "$URL"  → exit 0
[ ] Johnny/operator: Port secrets upsert (§2) — confirm in UI
[ ] get_workflow factory_claim_next_job — snapshot fencing hosts
[ ] upsert additive gateway_admit only (§3) — claim_next_job first
[ ] get_workflow assert: api.port.io fencing intact + one Funnel notify
[ ] Smoke §4 probes 1–5
[ ] Optionally remount remaining six factory_* the same way
[ ] Update funnel-remount-status.md with Funnel host + smoke evidence
```

**Blocked until paste:** steps after dry-run must not run.

---

## 7 — Explicit non-goals

- Live remount / secret upsert **before** public `/health`
- Port OAuth External Interface create/delete/revoke or redirect URI prune
- PBI-015 / CE compound writeback
- Observatory
- Product Beads / product Linear boards
- Treating Dev OS or meta-ci as gateway
- Sandbox Agent from browser

---

## Waiting on

**Johnny:** paste public Funnel `FACTORY_GATEWAY_BASE_URL` with non-tailnet `/health` 200 — remount stays armed, not live.
