# Ocean / MCP write fencing (§4.2.1 Meta fences)

**Status:** Design + minimal gateway enforcement (Meta)  
**Spec:** [`specs/port-governance/spec.md`](../specs/port-governance/spec.md) · master §4.2.1  
**Code:** `apps/factory-gateway/src/meta-fences.ts`, `sync-ingress.ts`  
**Inventory gap:** store `port-prep-inventory.md` — Sync **partial** (Ocean healthy; §4.2.1 not on sync path)

## Problem

Port product upsert has no CAS. Factory’s §4.2.1 fence lives in **factory-gateway**. Port Ocean and Port MCP can still upsert entities **directly** into Port, which would bypass the Meta single-writer + `catalogVersion` reject-stale path for Factory-governed blueprints.

## Rule (locked)

| Blueprint class | Who may write | Path |
|-----------------|---------------|------|
| **Meta-fenced** (Factory-governed) | Workflows / Rivet projections / gateway clients | **Only** `POST /catalog/write` or `POST /catalog/sync-write` → `CatalogWriter` |
| **Ocean mirror** (Context Lake mirrors) | Port Ocean native sync | Port Ocean apply (not Meta-fenced) |

**No bypass:** Ocean sync, MCP entity upserts, or callers passing `bypassFence: true` **must not** dual-write Meta-fenced blueprints around the gateway writer.

## Meta-fenced blueprints

Exact live names (do not invent parallels):

`product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`

Unknown blueprints **fail closed** → Meta-fenced.

## Ocean mirror blueprints

Identifier prefix (case-insensitive): `github*`, `linear*`, `vercel*`, `convex*`.

Observed installs (ops mapping only): `github-ocean`, `factory-pilot-github`, `linear`, `vercel-ocean`, `convex-ocean`.

## Ops requirements (Port SaaS)

1. **Do not map** Ocean integrations onto Meta-fenced blueprints. Skills / MCP / plugins that Port GitHub Ocean would land on `skill` / `_mcp_server` / `agentPlugin` must either:
   - stay unmapped in Ocean, or
   - use a custom Ocean / webhook that **POSTs** `/catalog/sync-write` with `source: "ocean"` and a real `expectedCatalogVersion`.
2. Port MCP agents that mutate Meta-fenced entities must invoke **Factory workflows** (`factory_*`) or the gateway writer — not raw `upsert_entity` on those blueprints.
3. Add `catalogVersion` (integer, create = 0) on every Meta-fenced blueprint before production dual-path cutover.
4. Dual GitHub Ocean installs: keep org/repo mapping disjoint (data-model §5).

## Gateway API

### `POST /catalog/sync-write`

Body:

```json
{
  "source": "ocean",
  "blueprint": "executionContract",
  "entityIdentifier": "ec-1",
  "expectedCatalogVersion": 0,
  "patch": { "status": "ready" },
  "bypassFence": false
}
```

| Outcome | HTTP | `reason` |
|---------|------|----------|
| Applied | 200 | (success entity) |
| Stale version | 409 | `stale_catalog_version` |
| Meta bypass attempted | 403 | `meta_fence_bypass_forbidden` |
| Ocean/MCP mirror via gateway | 409 | `ocean_mirror_not_via_gateway` |

`source` ∈ `ocean` \| `mcp` \| `workflow` \| `rivet` \| `gateway`.

### Existing `POST /catalog/write`

Unchanged single-writer apply for trusted gateway/workflow callers (still §4.2.1). Prefer `/catalog/sync-write` when the producer is Ocean or MCP so bypass attempts are explicit and rejected.

## What this PR does **not** do

- Mutate live Port Ocean mappings or External Interface / OAuth apps.
- Replace Port Ocean for GitHub/Linear/Vercel/Convex mirrors.
- Touch Vercel CI or OAuth beads.
- Deploy production Port dual-write adapters (follow-up once `catalogVersion` is on live BPs).

## Verify

```bash
cd apps/factory-gateway && npm test -- --test-name-pattern="Meta fence|sync-ingress"
```
