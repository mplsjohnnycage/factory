# PBI-016 — External Port-cloud → Factory Gateway connectivity proof

**Lane:** Meta · **Audience:** Johnny (network-exposure decision) + independent reviewer
**PBI:** PBI-016 ≡ Linear [STL-230](https://linear.app/johnny-cage/issue/STL-230/pbi-016muse-prove-external-port-cloud-factory-gateway-connectivity) ≡ GitHub [mplsjohnnycage/factory#122](https://github.com/mplsjohnnycage/factory/issues/122)
**Probe date:** 2026-10-31, 11:55–11:57 CDT (America/Chicago)
**Vantage:** Muse VM (`htch-runtime`) — external, **non-tailnet** network path (public egress; this host is not a tailnet peer for the gateway host). All probes were read-only or invalid-auth. **No infrastructure configuration was changed** — no Port webhook, OAuth, ACL, DNS, Funnel, Docker, or secret mutation of any kind.
**Related:** [`docs/factory-gateway-public-url.md`](../factory-gateway-public-url.md) · [`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md) (STL-199 kit) · [`docs/port-workflow-webhooks.md`](../port-workflow-webhooks.md) · [`docs/ops/funnel-remount-checklist.md`](./funnel-remount-checklist.md)

## Verdict

| Acceptance criterion (contract field 1) | Result |
|---|---|
| From outside the tailnet, public/approved HTTPS ingress reaches the intended Factory Gateway route | **PASS** — `GET /health` → **200** `{"ok":true,"service":"factory-gateway"}` via the public Funnel route |
| Invalid authentication is rejected | **PASS** — unsigned POST and wrong-key HMAC POST both → **401** `invalid_port_signature`; repo unsigned kit green (exit 0) |
| Verified request reaches no privileged mutation | **PASS, webhook route only** — signature verification runs before any enqueue/mutation on that route (`apps/factory-gateway/src/server.ts`: 401 `invalid_port_signature` precedes dispatch); rejected probes produced no admit, no enqueue, no catalog write. Other gateway routes are **not** covered by this verdict — see the §6 correction |
| Results timestamped | **PASS** — every probe below carries a CDT timestamp |

**Authenticated (valid-HMAC) probe: NOT RUN** — see §5. Prior signed proof already exists on record (FE-142, §5).

## 1. Verified public route

```text
Port cloud ──HTTPS──▶ https://desktop-3apdbkg.taildf3a4b.ts.net   (Tailscale Funnel, host desktop-3apdbkg)
                        ├─ GET  /health                                  → gateway liveness (public, unauthenticated by design)
                        └─ POST /webhooks/port/<factory_*>               → HMAC-gated (Port classic signature)
                             gateway process: apps/factory-gateway (desktop host)
```

The seven `factory_*` workflows bind this base as `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<id>` ([`docs/port-workflow-webhooks.md`](../port-workflow-webhooks.md)); the base was remounted to this Funnel URL on **2026-10-30** (operator record). Workflow IDs (source of truth: `apps/factory-gateway/src/factory-workflows.ts`): `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release`.

> **Port-side read caveat:** the direct Port MCP credential is stale (401) as of this run, so no live Port configuration was re-read for this report. The webhook base above is cited from the 2026-10-30 remount record and the repo docs, dated as such — not presented as a fresh Port read.

## 2. Probe table

| # | Time (CDT) | Host / target | Probe | Result |
|---|---|---|---|---|
| 1 | 11:55:59 | `desktop-3apdbkg.taildf3a4b.ts.net` | DNS, public resolver view (`dig @8.8.8.8`) | **A 209.177.145.97, 209.177.145.192** (Tailscale Funnel edge) |
| 2 | 11:55:59 | same | DNS, this VM's resolver (`getent` / local `dig`) | A 198.18.109.74 (egress-synthesized answer; see §3 caveat). `dig @1.1.1.1` timed out from this VM (UDP/53 unreachable) |
| 3 | 11:56:24 | same | TLS + `GET /health` | **TLS 1.3** (through egress CONNECT tunnel, §3) · **HTTP 200** · body `{"ok":true,"service":"factory-gateway"}` |
| 4 | 11:56:35 | same | `POST /webhooks/port/factory_create_execution_contract`, **no signature headers** | **401** `{"ok":false,"error":"invalid_port_signature"}` |
| 5 | 11:56:37 | same | `POST /webhooks/port/factory_create_execution_contract`, **invalid HMAC** (correct scheme `x-port-signature: v1,<base64>` + `x-port-timestamp`, digest computed with a deliberately wrong key) | **401** `{"ok":false,"error":"invalid_port_signature"}` |
| 6 | 11:56:48 | same | Repo unsigned smoke kit (STL-199): `node scripts/gateway-tailnet-health.mjs --base-url https://desktop-3apdbkg.taildf3a4b.ts.net --unsigned-only` | **Exit 0** — health 200; unsigned claim 401; unknown tool path 404; bad self-service bearer 401 (full transcript §4) |
| 7 | 11:56:55 | `grok-bot.taildf3a4b.ts.net` (contrast only) | `GET /api/health` | **HTTP 000** (curl 52, empty reply) — a **different host and route** (grok-bot's own Funnel); its outage does not affect the gateway route above and is tracked separately. Do not conflate |

## 3. TLS observation caveat

This VM's egress transits a sandbox proxy (`CONNECT` tunnel). The TLS session observed here is **TLS 1.3 / TLS_AES_256_GCM_SHA384**, with a certificate for `CN=desktop-3apdbkg.taildf3a4b.ts.net` issued by the sandbox egress CA — i.e. TLS is re-signed at the egress proxy, so the **origin** Funnel certificate chain was not directly inspected from this vantage. The HTTP proof is unaffected (the 200 body is the gateway's own response, end-to-end through the tunnel), but a reviewer who needs the origin chain should re-run probe 3 from an unproxied network (e.g. the desktop browser vantage used for the 2026-10-30 verification).

## 4. Negative-auth evidence (transcripts, secrets redacted by construction — none were used)

Direct probes (this run):

```text
# (a) No signature headers — 2026-10-31 11:56:35 CDT
POST https://desktop-3apdbkg.taildf3a4b.ts.net/webhooks/port/factory_create_execution_contract
  content-type: application/json
  {"action":"factory_create_execution_contract","probe":"pbi-016-negative-auth-a"}
→ HTTP 401  {"ok":false,"error":"invalid_port_signature"}

# (b) Invalid HMAC, correct Port scheme — 2026-10-31 11:56:37 CDT
#     signature = base64(HMAC-SHA-256(key="pbi-016-deliberately-invalid-key", "<ts>.<rawBody>"))
POST https://desktop-3apdbkg.taildf3a4b.ts.net/webhooks/port/factory_create_execution_contract
  x-port-timestamp: <unix ts>
  x-port-signature: v1,<base64 digest — wrong key, never a real secret>
→ HTTP 401  {"ok":false,"error":"invalid_port_signature"}
```

Repo unsigned kit (STL-199), same base, exit 0:

```text
== 1. Health ==
GET https://desktop-3apdbkg.taildf3a4b.ts.net/health
HTTP 200
{"ok":true,"service":"factory-gateway"}
OK: gateway health

== 2. Unsigned claim (expect 401) ==
POST https://desktop-3apdbkg.taildf3a4b.ts.net/webhooks/port/factory_claim_next_job (no signature headers)
HTTP 401 error=invalid_port_signature
OK: HMAC gate rejects unsigned (no enqueue)

== 3. Unknown path (expect 404) ==
POST https://desktop-3apdbkg.taildf3a4b.ts.net/webhooks/port/not_a_factory_tool
HTTP 404 error=not_found
OK: allowlist rejects non-factory_* path

== 4. Self-service bad bearer (expect 401) ==
POST https://desktop-3apdbkg.taildf3a4b.ts.net/handlers/self-service Authorization: Bearer <redacted>
HTTP 401 error=unauthorized_handler
OK: SS bearer <redacted> rejects bad token

== Summary ==
OK: tailnet health + HMAC smoke green; Port left untouched; secrets not printed.
```

**Why this proves fail-closed — for the Port webhook route:** the gateway verifies the Port HMAC (`apps/factory-gateway/src/hmac.ts`: `x-port-signature: v1,<base64 HMAC-SHA-256 of "${timestamp}.${rawBody}">`, constant-time compare) **before** routing to any workflow handler (`server.ts` returns 401 `invalid_port_signature` ahead of dispatch). A request that fails verification therefore cannot enqueue work or reach the ProjectSupervisor **through this route**. Missing headers and a malformed-key signature fail identically — there is no unsigned or weakly-signed path into a privileged mutation **through the webhook route**. The 404 on a non-allowlisted tool name additionally proves the route allowlist is enforced ahead of auth. **Scope limit:** the HMAC check is local to the webhook branch (and the self-service handler branch), not global middleware — this verdict covers only the routes probed here. The gateway's other routes are assessed separately in §6, and they change the exposure picture.

## 5. Authenticated probe — NOT RUN (with reason)

A valid signed probe was **not** executed in this run:

- The STL-199 signed smoke requires `PORT_CLIENT_SECRET` in the environment (env-only rule; values never printed or passed via argv). The secret is **absent** from this VM's environment (presence check only: ABSENT), and no vault identifier for the gateway's Port client secret was confirmed reachable to this agent — so the sanctioned retrieval condition was not met.
- The kit's signed section is also **FE-142 CLOSED**: a signed claim was already executed live under operator sanction and returned **202** `{ ok, admitId, actionIdentifier }` ([`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md)), with the standing instruction not to re-ask or re-run secret fill. Its success path enqueues an admit, which this PBI's acceptance criteria exclude ("verified request reaches no privileged mutation").

The FE-142 receipt stands as the authenticated-path proof of record; this report adds the external-vantage negative-auth proof that was missing.

## 6. Ingress security recommendation

1. **For the Port webhook route, keep the current shape:** Funnel HTTPS + Port classic HMAC (fail-closed, verify-before-dispatch) + the `factory_*` allowlist is the right ingress for Port-cloud workflow calls, and §4 proves it behaves that way from outside the tailnet.
2. **CORRECTION — `/health` is not the only unauthenticated route today.** Reading `apps/factory-gateway/src/server.ts` on this branch shows the HMAC/bearer checks exist only on the webhook branch and `POST /handlers/self-service`. These routes carry **no authentication** (rate limit only) and are reachable at the same public Funnel base: `POST /catalog/write` (calls the §4.2.1 writer directly), `POST /catalog/sync-write`, `POST /catalog/claim-next`, `POST /fleet/spawn`, `GET /fleet/ledger`, `POST /accept/evaluate`, `POST /accept/record`, `GET /accept/status`. The §4.2.1 `catalogVersion` fence still gates catalog writes, and the live gateway currently runs the in-memory store — but neither fact is an authentication boundary. **This report therefore does not certify the current public exposure as safe to leave unchanged.** Hardening — an auth check or ingress filtering in front of the non-webhook routes, or scoping the Funnel to the routes Port needs — is a separate ticket and Johnny's network-exposure decision (contract field 12); this PBI changes nothing and recommends the decision be taken explicitly rather than inherited.
3. **`/health` itself is fine as designed** — it returns a constant body with no state; keep it that way (no version/env detail) so that route leaks nothing.
3. **Re-run the unsigned regression after any change** to the Funnel host, the `FACTORY_GATEWAY_BASE_URL` secret, or a workflow remount: `node scripts/gateway-tailnet-health.mjs --base-url <base> --unsigned-only` must stay exit 0 (health 200, unsigned 401, unknown 404, bad bearer 401).
4. **Treat grok-bot's Funnel separately:** its current 000/empty-reply state (probe 7) is a different host's problem; do not route gateway traffic through it, and do not diagnose it as part of gateway ingress.
5. **Any future change** to the webhook base, Funnel settings, or gateway exposure remains Johnny's network-exposure decision (contract field 12) — this PBI approves none.

## 7. Rollback

**This PBI changed nothing** — probes were read-only GETs and deliberately-invalid POSTs that the gateway rejected; no Port, Tailscale, DNS, or gateway configuration was touched. **Rollback for this PR = revert the documentation commit only.**

For completeness, a future remount rollback (operator-only, not performed here) is: restore the previous `FACTORY_GATEWAY_BASE_URL` value in the Port secret and the workflows' WEBHOOK nodes to the prior base, restart the gateway host process so it re-reads its env, then re-run the unsigned kit (§6.3) against the restored base. Checklist: [`docs/ops/funnel-remount-checklist.md`](./funnel-remount-checklist.md).

## Evidence index

| Artifact | Where |
|---|---|
| Probe table + transcripts | This doc, §2 + §4 (2026-10-31 11:55–11:57 CDT) |
| HMAC scheme / verification code | `apps/factory-gateway/src/hmac.ts`, `apps/factory-gateway/src/server.ts` |
| Unsigned kit | `scripts/gateway-tailnet-health.mjs` (STL-199) |
| Prior signed receipt | FE-142 verdict in [`docs/gateway-hmac-smoke.md`](../gateway-hmac-smoke.md) |
| Webhook binding record | [`docs/port-workflow-webhooks.md`](../port-workflow-webhooks.md) (remount 2026-10-30) |
