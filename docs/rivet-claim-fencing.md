# Rivet claim fencing & Port → Rivet execution path

**Status:** Research note (evidence-backed)  
**Date:** 2026-10-28  
**Workspace:** No Rivet/Port application source in this Project checkout (`/agent` empty). Evidence from Context7 + official `llms.txt` indexes + fetched docs pages linked from those indexes.  
**Related:** [`port-capabilities.md`](./port-capabilities.md), [`rivet-engineering-spec.md`](./rivet-engineering-spec.md)

---

## Terminology (do not conflate)

| Term | System | What it actually is |
|------|--------|---------------------|
| **Port “claim” / `factory_claim_next_job`** | Port catalog + workflow upserts | Factory-modeled job claim via Port entity upserts. Live workflow copy (prior note) states Port upserts have **no CAS** — concurrent claimers can race. |
| **Port Ocean action claim** | Port Ocean integrations | Ocean polls Port, **claims** pending integration action runs with a **visibility timeout** so other instances do not execute the same run. Not Factory Beads/Port delivery claims. |
| **Beads claim** | Beads (`bd update --claim`) | Atomic task claim in Beads/Dolt — readiness authority, not Rivet. |
| **Rivet “lease”** | Rivet (docs) | No product primitive named “claim lease” / CAS lease token. Closest: **actor single-writer / serial queue processing**, plus internal runtime `leaseKey` for connection-local SQLite transactions (not app-level dispatch fencing). |
| **Factory `WorkAttempt` lease** | Factory-on-Rivet (spec) | Application actor state (`leaseExpiresAt`, `idempotencyKey`) — Factory design, not a Rivet built-in claim API. |

**Correction of prior conflation risk:** The note “claim leases lack CAS” in [`port-capabilities.md`](./port-capabilities.md) §3.5 / §7 is about **Port upserts**, not Rivet. Rivet was proposed as the place to *fence* that Port race — it was not asserted that Rivet itself exposes CAS claim leases.

---

## A) Rivet claim fencing / CAS / dispatch

### A1. Does Rivet handle claim fencing on its own?

**No product “claim lease + CAS” API.** Rivet does **not** document compare-and-swap claim leases for dispatch fencing.

What Rivet *does* provide for concurrency control:

1. **Per-actor durable ordered queues** — messages processed in order; intended to avoid races on state mutations.  
   - Official queues page (from Rivet `llms.txt` → `/actors/docs/queues/`): queues are “Durable”, “Local per actor”, “Helps avoid race conditions by handling work in order.”  
     Source: https://rivet.dev/actors/docs/queues/  
   - Changelog: “Durable and ordered: messages persist… processed one at a time.”  
     Source: https://rivet.dev/changelog/2026-02-25-queues-for-rivet-actors/  
2. **JS serial concurrency baseline** — “Rivet assumes the same serial concurrency inherent in JavaScript's single-threaded nature” but “allows you to run promises in parallel or manage concurrency control manually.”  
   - Architecture (Context7 + live page): https://rivet.dev/docs/general/architecture/  
3. **Actions are parallel by default** — “By default, actions run in parallel. If you need advanced control over concurrency, use queues.”  
   - https://rivet.dev/actors/docs/actions/  
4. **Actor single-writer invariant (engine)** — Pegboard: “at most one actor instance for a given actor id may be running or accessing that actor's storage at a time.” Explicitly: do not add separate same-actor concurrency fences / envoy lease keys for that invariant.  
   - Context7 from `/rivet-dev/actors` (CLAUDE.md layer constraints). Not duplicated as a first-class “CAS claim” user API in `llms.txt`-linked product docs.

**Answer (1):** Rivet does **not** auto-fence *Port/Beads-style job claims*. It fences **mutations on one actor** if you route them through that actor’s queue/run loop (and respect single-writer ownership). Cross-system claim races (Port upserts, multiple independent claimers) remain Factory’s problem unless all admission goes through one Rivet dispatcher actor.

### A2. Mechanism (if fencing via Rivet)

| Mechanism | Role for Factory dispatch | CAS? |
|-----------|---------------------------|------|
| Actor key = entity (`ProjectSupervisor`, `WorkAttempt:{attemptId}`) | Single writer for that attempt’s state | No — ownership, not CAS token |
| Durable actor queue + `run` loop | Serialize admit/start/complete mutations | No — ordered processing |
| `message.complete()` (completable queues) | Ack / request-response to callers | Ack, not CAS |
| Workflow steps + idempotent writes | Retries / roll-forward; docs say write steps idempotently | Optimistic app logic |
| Port Ocean visibility-timeout claims | Only for Ocean integration action runs | Soft lease, not Rivet |

### A3. Minimal fix for Factory

**Smallest correct approach:** one **dispatch owner actor** per project (spec’s `ProjectSupervisor`) that:

1. Receives all `factory.work.start` / claim-next admissions (via Port webhook → thin gateway → `queue.send` / action that enqueues).  
2. Holds `idempotencyKey → attemptId` and Beads/Port claim side effects **inside that serial queue loop**.  
3. Spawns/addresses exactly one `WorkAttempt` actor per attempt; Polygraph children still supervised under the same ownership rules.

Do **not** add Turso/Port idempotency cache as the primary fence. Do **not** rely on Port `UPSERT_ENTITY` for exclusive claims (upsert = create-or-update; no CAS in Port docs — https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity.md). Optional Port entity updates remain **projections**, not the lease authority.

Keep **handler idempotency** for external I/O (GitHub, sandbox create) regardless — Rivet durability ≠ exactly-once side effects (already in engineering spec §7.1).

### A4. Does Rivet make an external idempotency cache unnecessary for concurrent dispatchers?

**For dispatch admission: yes, if and only if** every concurrent dispatcher path funnels into the **same** Rivet actor queue (one supervisor key). Actor-local ordered processing + single-writer storage replace an external CAS cache for “who won this claim.”

**Still necessary outside that fence:**

- Idempotent **queue/workflow handlers** (docs disagree on completable retry — see Source agreement; design for at-least-once side effects anyway).  
- Idempotent **external** calls (PR create, sandbox provision).  
- If anyone still calls Port `factory_claim_next_job` outside the Rivet supervisor, Port’s no-CAS upsert race remains — external cache does not fix Port; serialize through Rivet instead.

---

## Source agreement — Rivet (Context7 vs `llms.txt`)

**Indexes used:** https://rivet.dev/llms.txt (same content as https://www.rivet.dev/llms.txt) — URL index; semantics taken from pages it lists (queues, production checklist, changelog, architecture, actions).

| Topic | Context7 | Official pages via `llms.txt` | Agreement |
|-------|----------|-------------------------------|-----------|
| Ordered / race-avoiding queues | Yes — queues serialize mutations | Yes — queues page + Feb 2026 changelog | **Agree** |
| No named CAS / claim-lease API | No hits for CAS claim leases | No `llms.txt` entry for claim/CAS leases | **Agree** (absence) |
| Actions parallel; queues for concurrency | Architecture + queues patterns | Actions doc: parallel by default → use queues | **Agree** |
| JS serial concurrency + optional parallel promises | Architecture snippet | Live architecture page same text | **Agree** |
| Pegboard single-writer | Context7 `/rivet-dev/actors` CLAUDE.md | Not surfaced in `llms.txt` product index pages fetched | **Agree on substance; Context7-only depth** |
| Completable failure semantics | Production checklist + some Context7 queue notes: fail before `complete()` → **retried**; handlers must be idempotent | **Queues page:** fail before `complete()` → message is **not redelivered**; sender times out. **Same production checklist page** still says: fail before `complete()` → **retried** | **DISAGREE** (internal docs conflict; Context7 mirrors the checklist “retry” wording) |

**Flagged disagreement (material):** Treat completable-queue failure as **ambiguous**. Factory must make admission/side-effect handlers **idempotent** either way, and prefer explicit app-level receipts (`idempotencyKey` in actor state) over depending on Rivet redelivery.

**Secondary nuance:** Architecture’s “no durable mailbox” note is about **request exhaustion / 503 drop** on the interactive path; the Queues feature docs describe an optional durable mailbox. Prefer queues for dispatch mutations; do not assume every Rivet call is durably queued.

---

## B) Port workflows → Rivet as execution backend

### B1. Does it make sense?

**Yes for v1.** Port is the governed trigger surface (MCP `trigger_run` / self-service / approvals). Port’s documented way to run external work is a **WEBHOOK** (or Ocean-backed) backend — not an embedded Rivet runtime inside Port.

Evidence:

- Workflows overview / expose-as-tool: agents discover workflows via MCP; workflow is the governed execution layer. https://docs.port.io/workflows/expose-as-tool.md (in Port `llms.txt`).  
- WEBHOOK node: POST to any HTTP API; sync (≤10s) or async with Port API callback. https://docs.port.io/workflows/build-workflows/nodes/action-nodes/webhook.md  
- Classic webhook backend: Port signs payload (HMAC-SHA-256), POSTs to customer URL; listener runs custom logic. https://docs.port.io/workflows/actions-and-automations/setup-backend/webhook.md  
- Upsert after webhook is the catalog projection pattern — not the execution engine. https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity.md  

Port does **not** host Rivet actors. “Call Rivet directly” in practice means **Port workflow WEBHOOK → Factory/Rivet HTTP entrypoint** (same pattern as “trigger CI”).

### B2. Recommended call path (end-to-end)

```text
Human UI / external MCP client
  → Port OAuth or machine token
    → Port MCP trigger_run / self-service workflow
      → [optional INPUT approval]
        → WEBHOOK node (sync ack or async start)
          → Factory thin gateway (verify Port signature / identity)
            → Rivet ProjectSupervisor queue (admit + idempotency)
              → WorkAttempt / AgentSession actors
                → Sandbox Agent → harness
                  → GitHub commits / checks
            ← Rivet realtime to UI (session events)
          → Port UPSERT / PATCH run status (projection + audit)
```

Private desktop Rivet: use Tailscale-reachable URL and/or Port execution agent (`agent: true`) so Port does not need a public sandbox edge — https://docs.port.io/workflows/actions-and-automations/setup-backend/webhook/port-execution-agent.md (listed in Port `llms.txt`).

### B3. Pros / cons vs alternatives

| Pattern | Pros | Cons |
|---------|------|------|
| **Port → WEBHOOK → Rivet** (recommended) | Authz/approvals before start; one MCP contract; matches Port docs; push start | Sync webhook 10s hard limit — long coding must be async + callback; gateway must verify signatures |
| **Rivet polls Port for jobs** | Rivet can pace capacity | Bypasses workflow approvals unless Port already created a leased run; duplicates Ocean-style claim races on Port; weaker “governed start” story |
| **Factory backend mediates both** | Extra policy/logging | Extra hop; only needed if gateway ≠ Rivet entry (thin gateway is enough for v1) |

### B4. Recommendation for Factory v1

1. **Port owns start:** every human/agent start goes through Port workflow/MCP.  
2. **Rivet owns run:** WEBHOOK into Rivet (via thin Factory gateway) as the execution backend.  
3. **Fence in Rivet:** single `ProjectSupervisor` queue — not Port CAS, not Turso.  
4. **Port catalog:** upsert run/attempt status as projection; Ocean-style Port action claims are irrelevant unless using Ocean executors for Rivet (not v1).  
5. **Long runs:** `synchronized: false` + Rivet/gateway PATCHes Port run/node status (Port webhook async pattern).

---

## Source agreement — Port (Context7 vs `llms.txt`)

**Index:** https://docs.port.io/llms.txt

| Topic | Context7 `/websites/port_io` | Official via `llms.txt` | Agreement |
|-------|------------------------------|-------------------------|-----------|
| Workflow WEBHOOK to external backend | Yes — WEBHOOK examples | Yes — webhook node + setup-backend webhook | **Agree** |
| Sync vs async + 10s sync limit | Yes | Yes — webhook node timeout docs | **Agree** |
| Expose workflows as MCP tools | Yes | Yes — expose-as-tool | **Agree** |
| UPSERT_ENTITY create-or-update | Yes | Yes — no CAS/version precondition documented | **Agree** (no CAS) |
| Ocean claim + visibility timeout | Not central to Factory claim note | Yes — actions-processing.md | **Agree**; distinct from Rivet/Factory claims |
| Port-as-auth + governance | Matches port-capabilities | External interfaces / MCP / permissions pages in index | **Agree** |

No Context7 vs Port `llms.txt` disagreement found on the Port→webhook→external-execution model.

---

## Engineering spec patch

**None.** [`rivet-engineering-spec.md`](./rivet-engineering-spec.md) does not claim Rivet “claim leases lack CAS.” It already places attempt leases on Factory `WorkAttempt` and Port → Rivet control path. [`port-capabilities.md`](./port-capabilities.md) correctly attributes the no-CAS race to **Port upserts**. No factual correction required beyond this research note’s terminology clarification.

---

## Open questions

1. Resolve Rivet completable-queue **retry vs no-redelivery** with Rivet (issue/docs); until then assume idempotent handlers.  
2. Confirm desktop pilot: Port execution agent vs Tailscale Serve URL for WEBHOOK target.  
3. Whether Beads `claimToken` is required in the Rivet admit payload, or Beads claim is performed only inside the supervisor loop.  
4. Machine-user / org token path for unattended Port→Rivet starts (already flagged in port-capabilities).  
5. Whether any live `factory_claim_next_job` handler still claims outside Rivet — if yes, retire that path for v1.
