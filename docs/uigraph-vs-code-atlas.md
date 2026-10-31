# UIGraph vs Factory Code Atlas

**Lane:** Meta side eval · zero spend · no Port schema mutation · no mergeable PR  
**Date:** 2026-10-29  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (PUBLIC)  
**UIGraph:** [uigraph-oss/uigraph](https://github.com/uigraph-oss/uigraph) · npm `uigraph@1.0.6` · Apache-2.0  
**Throwaway branch:** `cursor/uigraph-eval-throwaway-00b0` (**unpushed**; local `.uigraph*` uncommitted)  
**Evidence snapshot:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/internal/uigraph-eval/`

---

## 1. What each system is

| | **UIGraph** | **Factory Code Atlas (STL-154)** |
|--|-------------|----------------------------------|
| Kind | Local architecture **viewer + skill** that coding agents fill with plain files | **In-product read projection** over four live-ish overlays + Port MCP tools |
| SoT | Repo files: `.uigraph.yaml`, Mermaid, OpenAPI, SQL under `.uigraph/` | Spec Contract + Dev OS BFF; Port workflows bind tools; overlays are Beads / Polygraph / Graft / Langfuse |
| Runtime | CLI `uigraph` → `http://127.0.0.1:8447/` | Prod Dev OS `https://factory-developer-os.vercel.app/api/atlas/*` |
| Authority model | “Only what the agent found in files” (honor system + skill rules) | Proven joins require `sourceSystem`/`sourceId`/`target`/`evidence`/`observedAt`; unknown stays unknown |
| Governance | Optional; no Port / accept path | Spec `specs/developer-os/spec.md`, OpenMCP advertise, Port `atlas_*` WEBHOOK bind, redaction roles |

---

## 2. UIGraph local run (this eval)

### Install / CLI

- Global `npm i -g` failed (`EACCES` on `/usr/lib/node_modules`); local install worked: `/tmp/uigraph-cli` → `uigraph@1.0.6`.
- Commands exercised: `uigraph sync`, `uigraph start --port 8447`, `uigraph status`, `uigraph stop`, `uigraph lens --help` + dry branch compare.
- Skill path (upstream): `npx skills add uigraph-oss/skills` then `/uigraph` prompts — agent writes artifacts; CLI does **not** auto-generate from AST.

### Artifacts generated for Factory (agent-authored, evidence from repo)

Root `.uigraph.yaml` (service **Factory**) + four service configs under `.uigraph/services/`:

| Service id | Evidence |
|------------|----------|
| `factory` | OpenStack.md / AGENTS.md control-plane narrative |
| `factory-gateway` | `apps/factory-gateway` webhook → supervisor |
| `project-supervisor` | `apps/project-supervisor` Meta Beads admit |
| `sandbox-harness` | `apps/sandbox-harness` AgentSession |
| `developer-os` | `apps/developer-os` Atlas BFF + Port OAuth |

Diagrams (Mermaid + context.json):

1. **System Context** — Port → gateway → ProjectSupervisor → Beads / Sandbox → GitHub; Dev OS read path  
2. **Delivery Admit Flow** — sequence: webhook → ready/claim → spawn → CI accept  
3. **Code Atlas Overlays** — four overlays → `/api/atlas/tools` → Port; Rivet owns live  

### Sync / viewer evidence

```text
uigraph sync → 5 services · 0 endpoints · 15 dependencies · 3 diagrams
GET http://127.0.0.1:8447/ → 200
GET http://127.0.0.1:8447/api/projects →
  [{ root:"/workspace", services:[Factory, developer-os, factory-gateway,
     project-supervisor, sandbox-harness] }]
```

Lens dry-run (no agent spend):

```text
uigraph lens --base main --target HEAD --agent cursor --no-open
→ HEAD has no commits that are not already in main.
```

(Lens needs a real PR/branch delta **and** a coding agent (`claude`/`codex`/`opencode`/`pi`/`cursor`) — impact/test/rollout review is agent-driven, not a deterministic graph query.)

**Not done (by design):** paid cloud APIs; Port mutations; committing/pushing throwaway; OpenAPI generation (0 endpoints — routes exist but no checked-in OpenAPI for gateway/atlas was wired this pass).

---

## 3. Code Atlas context (read-only)

Sources: store docs + in-repo STL-154.

| Doc | Takeaway |
|-----|----------|
| `docs/atlas-bff-smoke.md` | Prod READY `#51`; five tools live; `find_node` OK; `get_agent_traces(asLiveOwner=true)` → `langfuse_not_live_owner` |
| `docs/atlas-schema-apply-run.md` | Port EU `atlas_*` WEBHOOK → Dev OS BFF; `_mcp_server` exposed=false; skill catalog pointer |
| `docs/pr-51-independent-review.md` | Squash-merged `5ea96a05…`; four overlays; provenance + redaction; OpenMCP advertise |
| `apps/developer-os/src/lib/atlas/*` | Fixture graph + projection + tool dispatcher |
| `.well-known/openmcp.json` | Advertises `atlas.find_node` … `atlas.get_agent_traces` |

Re-smoke this tick (read-only):

| Check | Result |
|-------|--------|
| `GET /api/atlas/tools` | 200 — five tools; `binding=port-mcp-read-projection`; `langfuseLiveOwner=false` |
| `POST atlas.find_node` `{query:"bead"}` | 200 — `beads:factory-stl154`, `beads:factory-stl151` |

Atlas answers **task/session/symbol/trace** questions with role redaction. It does **not** today ship a Mermaid C4 service map of `apps/*` deployables (that lives in Specs / OpenStack / this UIGraph eval).

---

## 4. Comparison

### Coverage

| Dimension | UIGraph | Code Atlas |
|-----------|---------|------------|
| Deployable service map (`apps/*`) | **Strong** (YAML + Mermaid, human/agent maintained) | Weak (fixture nodes are Beads/Polygraph/Graft/Langfuse, not gateway topology) |
| Cross-system execution graph (Port↔Rivet↔CI) | Diagrams only (static) | Partial via Polygraph/Beads joins when proven |
| Symbol / package graph | Optional agent diagrams | **Graft overlay** (designed) |
| Task impact / ready work | Lens (agent PR review) | **`atlas.get_task_impact`** + Beads overlay |
| Session / PR linkage | Lens GitHub PR fetch | **Polygraph** + `get_related_sessions` |
| Historical cost/traces | Out of scope (unless agent pastes) | **Langfuse overlay** + refusal of live ownership |
| AuthZ / redaction | Local viewer trust | Anonymous vs operator; restricted cost fields |
| Port / OpenMCP / accept path | None | **Bound** (workflows + OpenMCP names) |

### Agent workflow

| | UIGraph | Code Atlas |
|--|---------|------------|
| Fill path | Skill (`uigraph-oss/skills`) explores code → writes files → `uigraph sync` | Agents **call** Port/`/api/atlas/tools`; graph authority is projection code + provenance, not free-form YAML |
| Drift | `.uigraph/AGENTS.md` asks agents to update on API/schema change | Spec + CI + fixture/live joins; inventing edges demoted |
| Two-way edit | Viewer can write Mermaid back to disk | Hero is read projection; no Mermaid round-trip |

### PR lens vs Atlas BFF

| | **`uigraph lens`** | **Atlas BFF** |
|--|-------------------|---------------|
| Trigger | PR URL or `--base`/`--target` | `POST /api/atlas/tools` / Port self-service |
| Engine | Spawns coding agent review | Deterministic tool dispatch on graph |
| Output | Flows touched, impact, tests, rollout (agent narrative in viewer) | Structured nodes/edges + redactions |
| Cost | Agent tokens (your login) | BFF/Port compute; no third-party SaaS in this path |
| Fit | Human PR understanding | Kernel agents + Port tools + Spec scenarios |

### Fit for Factory Meta

- Factory Meta already invested in **STL-154**: Spec Contract, OpenMCP, Port bind, redaction, Langfuse-not-live-owner, Dev OS hero.
- UIGraph does **not** replace Port SoT, Meta Beads admit, Rivet live ownership, or CI accept-on-SHA.
- UIGraph **does** fill a gap Atlas deliberately left: **repo-local, reviewable architecture diagrams** of the control-plane apps — useful for onboarding and PR explanation, dangerous if treated as authority (skill can invent edges; Atlas provenance rules exist precisely to forbid that).
- Dual systems risk: agents may “sync” UIGraph YAML that contradicts Spec / Beads — without a Spec gate, UIGraph becomes a second truth.

---

## 5. Risks if adopted as-is

1. **Second SoT** competing with Specs + Port + Beads.  
2. Skill wants to patch root `AGENTS.md` — conflicts with Factory Meta index discipline.  
3. Lens depends on external coding-agent CLIs; not a kernel admit tool.  
4. Cloud/self-hosted gateway mentions in skill refs are optional and out of zero-spend Meta lane.  
5. Early package (v1.0.6, low weekly downloads) — fine as optional docs, not kernel dependency.

---

## 6. What to borrow (if anything)

Without adopting the product as a Factory dependency:

- Keep optional **Mermaid service-context** diagrams next to Specs (or under `docs/architecture/`) with the same evidence rules as UIGraph’s skill — but **not** as Port/Atlas authority.  
- Steal the **PR lens framing** (flows touched / impact / tests / rollout) as a *prompt checklist* for review agents — Atlas already supplies structured impact via `get_task_impact`.  
- Do **not** wire `uigraph` into ProjectSupervisor, Port workflows, or accept CI.

---

## Johnny verdict

**borrow ideas** — keep Code Atlas + Port as the kernel graph; do not adopt UIGraph as SoT or a mergeable dependency.  
**Why:** UIGraph is a strong local Mermaid/service-map + skill + PR-lens viewer; Factory already has Spec-governed four-overlay read projection with provenance, redaction, and live Port bind.  
**Action:** leave throwaway unpushed; optional later — Spec-adjacent static diagrams or a lens-style review checklist, never a second catalog.
