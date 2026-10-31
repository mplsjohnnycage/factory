# ProjectSupervisor morning audit — M1 admit fire?

**Verdict: No**  
**Checked:** 2026-10-29 · `apps/project-supervisor` on workspace `main`  
**Lane:** Meta · PBI-007 library green · live admit→sandbox not wired  
**Question:** Can M1 admit fire after Beads ready + Rivet up?

---

## Answer

**No.** Beads `bd ready` + Rivet Compose up is not enough. In-process `ProjectSupervisorActor.admit` (CI / Memory) works; the live path from Port webhook → claim evidence → Rivet queue → Sandbox Agent does not exist yet.

---

## Path audit

### 1. `ReadyTaskEvent.beadId`

| Piece | Status | Evidence |
|-------|--------|----------|
| Type + gate | **Yes** | `apps/project-supervisor/src/types.ts` — `{ beadId, projectId, claimedBy, claimedAt, executionContractId? }` |
| Admit refuse without claim | **Yes** | `project-supervisor.ts` → `claim_id_required` / `bead_not_ready` / `bead_claim_mismatch` |
| Duplicate `workKey` fence | **Yes** | Same file + 7/7 unit tests after `npm ci` |
| Live Meta Beads adapter | **No** | Only `MemoryMetaBeads`; comments name `BdMetaBeads` — not implemented (`docs/meta-beads.md`, `meta-beads.ts`) |
| Auto feed from `bd claim` | **No** | README: operator feeds `ReadyTaskEvent` into `admit` manually |

### 2. Port `executionContract` bypass

| Piece | Status | Evidence |
|-------|--------|----------|
| `portBypassId` admit path | **Yes (library)** | Admit without `ready` when `portBypassId` set → `beadId: bypass:<id>` |
| Projects onto `executionContract` | **Yes (Memory catalog)** | `PortProjectionMapper` via `CatalogWriterPort` |
| Validates bypass against live Port EC | **No** | Any non-empty string accepted; no Port read / audit check |
| Live §4.2.1 writer into supervisor | **No** | README: “Wire live gateway CatalogWriter … follow-on” |

### 3. Queue → sandbox

| Piece | Status | Evidence |
|-------|--------|----------|
| Gateway HMAC → enqueue | **Yes** | `factory-gateway` `ProjectSupervisorQueue.enqueue` → 202 |
| Queue calls `ProjectSupervisorActor.admit` | **No** | Queue stores `SupervisorAdmit` payload only; no `beadId` / `ReadyTaskEvent` mapping |
| Optional `RIVET_SUPERVISOR_URL` forward | **Stub** | HTTP POST of gateway admit blob; no Rivet Actor host consuming it as admit |
| Post-claim Rivet message → Sandbox Agent | **No** | Supervisor has zero import/call of `sandbox-harness` / `AgentSessionActor` |
| Compose hosts supervisor + harness actors | **No** | `compose/docker-compose.yml` = Rivet engine only |

Contract (AGENTS.md / PRD-0002 R3): claim **before** Rivet queue message that starts Sandbox Agent. That queue edge is unimplemented.

---

## Gaps (block M1 fire)

1. **`BdMetaBeads` missing** — admit cannot see live `bd ready` / claim; CI Memory only.  
2. **Gateway queue ≠ supervisor admit** — webhook enqueue does not build `AdmitRequest` with `ReadyTaskEvent.beadId` or audited `portBypassId`.  
3. **No Rivet Actor host** for `ProjectSupervisorActor` (library + Memory dry-run only).  
4. **No admit→sandbox enqueue** — nothing starts `AgentSessionActor` / Docker Sandbox Agent after admit.  
5. **Live Port catalog writer not wired** into supervisor projections (Memory stand-in).  
6. **Bypass not Port-audited** — `portBypassId` is a free string, not bound to live `executionContract`.  
7. **Ops (related):** Meta Beads may still have 0 ready issues / no Dolt hydrate on fresh clones — even with code wired, nothing to admit.

---

## What *is* ready (library)

- Duplicate fence, claim-id gate, Port bypass shape, recover, three-blueprint projection — unit tests pass (`npm ci && npm test` in `apps/project-supervisor`).  
- Spec alignment: `specs/factory-kernel/spec.md` § ReadyTaskEvent + claim scenarios.

---

## Minimal unblock (not done here)

1. Implement `BdMetaBeads` + seed ≥1 ready Meta bead.  
2. Map Port webhook / operator start → `AdmitRequest` (`ready` or audited bypass) then `ProjectSupervisorActor.admit`.  
3. Host supervisor on Rivet; after successful claim+admit, enqueue Sandbox Agent via `AgentSessionActor` + Docker lease.  
4. Point projections at live gateway §4.2.1 writer; verify bypass against Port EC when used.

---

## Related

- [`morning-parallel-sprint.md`](./morning-parallel-sprint.md)  
- [`beads-setup-status.md`](./beads-setup-status.md)  
- [`pbi-007-independent-review.md`](./pbi-007-independent-review.md)  
- Repo: `apps/project-supervisor/`, `apps/factory-gateway/src/supervisor.ts`, `apps/sandbox-harness/`
