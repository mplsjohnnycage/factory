# LogicSRC artifact inventory (Factory-required)

**Status:** Definitive inventory for Factory master-spec production  
**Date:** 2026-10-28  
**Sources:** [logicsrc.com/llms.txt](https://logicsrc.com/llms.txt), [logicsrc.com/specs](https://logicsrc.com/specs), official `/docs/*` pages, live `/.well-known/*`, `@logicsrc/schemas@0.6.0` package exports, Project notes [`logic-src-overview.md`](./logic-src-overview.md) and [`logicsrc-monorepo.md`](./logicsrc-monorepo.md)  
**Convention:** Markdown is source of truth; JSON is derived and never the reverse ([OpenStack.md](https://logicsrc.com/docs/openstack); monorepo Conventions). Specs are CC BY 4.0; schemas MIT.

**Factory primacy:** Agents build against ASDLC **The Spec** at `/specs/{domain}/spec.md` (Blueprint + Contract) per [`skills/asdlc/patterns/the-spec.md`](../skills/asdlc/patterns/the-spec.md). This inventory is the LogicSRC emission catalog those Specs map to — **not** the primary IR. See [`factory-master-spec.md`](./factory-master-spec.md).

This inventory lists **every LogicSRC artifact type** with path/format/required fields from official specs or `@logicsrc/schemas`. Factory must produce the **Factory-mandatory** subset; other specs are listed for completeness and marked **out of Factory v1 scope** (do not invent partial conformance).

---

## 0. Directory / publication layout (authoritative patterns)

| Location | Artifact | Source |
|----------|----------|--------|
| Repo root `OpenStack.md` | Stack declaration | [OpenStack.md](https://logicsrc.com/docs/openstack) |
| Repo `prd/README.md`, `prd/0000-template.md`, `prd/NNNN-slug.md` | OpenPRD collection | [OpenPRD](https://logicsrc.com/docs/openprd) |
| Repo `bin/install.sh`, optional `bin/install.conf` | OpenInstall | [OpenInstall](https://logicsrc.com/docs/openinstall) |
| Repo `agents/*.json` or site `/agents/<id>.json` | OpenAgent profiles | [OpenAgent](https://logicsrc.com/docs/openagent) |
| Site `/.well-known/openstack.md` (+ optional `.json` derived) | Published stack | OpenStack discovery |
| Site `/.well-known/openprofile.md` | Operator / org profile | [OpenProfile.md](https://logicsrc.com/docs/openprofile) |
| Site `/.well-known/openagent.json` | Single-agent well-known | OpenAgent |
| Site `/.well-known/openmcp.json` | MCP relay descriptor | [OpenMCP](https://logicsrc.com/docs/openmcp) |
| Site `/.well-known/openaccess.json` | App OAuth/grant descriptor | [OpenAccess](https://logicsrc.com/docs/openaccess) |
| Site `/.well-known/openworkflow.json` | Workflow index | [OpenWorkflow](https://logicsrc.com/docs/openworkflow) |
| `$OPENFLEET_HOME/fleets/<fleet>/members/<member>.json` | OpenFleet member records | [OpenFleet](https://logicsrc.com/docs/openfleet) |
| `$OPENFLEET_HOME/fleets/<fleet>/ledger.jsonl` | OpenFleet ledger | OpenFleet |
| Encrypted `.opencreds` export / vault | OpenCreds | [OpenCreds](https://logicsrc.com/docs/opencreds) |
| Schema `$id` base | `https://schemas.logicsrc.com/` | `@logicsrc/schemas` README |
| Validate | `npx @logicsrc/validators …` / `logicsrc prd validate` | Docs + npm |

**Monorepo reference layout (LogicSRC itself):** `apps/*`, `packages/*`, `plugins/*`; specs as `docs/<slug>.md` + registry entry ([OpenStack.md live](https://logicsrc.com/.well-known/openstack.md)).

---

## 1. People and agents family

### 1.1 OpenProfile.md — **Factory-mandatory (operator + agents)**

| | |
|--|--|
| **File** | `/.well-known/openprofile.md` (site); optional linked from stack `Operator` |
| **Format** | Markdown; `text/markdown` |
| **Required shape** | Exactly one `#` name; identity bullets `- **Key**: value`; one prose line; sections as needed |
| **Identity keys** | `Kind` (`person` \| `agent` \| `organization`), `Handle`, `Emoji`, `Pronouns`, `Web`, `Email`, `Avatar`, `Pay`, `Resume`, `Parent` (org) — all optional per degrade rules; absent = unstated |
| **Agent-only section** | `## Operator` with Name / Profile URL / Email |
| **Discovery** | `/.well-known/openprofile.md`; `rel="me"` / HTML link conventions |
| **Source** | [docs/openprofile](https://logicsrc.com/docs/openprofile) (status 0.4); live [logicsrc.com/.well-known/openprofile.md](https://logicsrc.com/.well-known/openprofile.md) |

### 1.2 OpenSkill — **Factory-optional (catalog links only)**

| | |
|--|--|
| **File** | Concept Markdown at stable URL; profile `## Skills` links |
| **Format** | `#` name + optional Id/Kind/Domain bullets + description |
| **Note** | Descriptive only — not executable agent instructions ([docs/openskill](https://logicsrc.com/docs/openskill)) |
| **Factory** | Link skills from OpenAgent `skills[]` labels; do not invent a parallel taxonomy |

### 1.3 OpenAgent (`logicsrc.agent`) — **Factory-mandatory (every Factory agent)**

| | |
|--|--|
| **File** | HTTPS JSON; prefer `/agents/<slug>.json`; single-agent sites may use `/.well-known/openagent.json` |
| **Schema** | `@logicsrc/schemas/agent` → `logicsrc-agent.schema.json` |
| **Required fields** | `type` = `logicsrc.agent`; `version` (semver string); `name` (1–120 chars); `did`; `owner_did`; `skills` (min 1); `permissions_requested` (array, may be empty) |
| **DID pattern** | `^[a-z0-9][a-z0-9._-]*\.[a-z0-9][a-z0-9._-]*$` (e.g. `factory.mplsjohnnycage`) — LogicSRC names, not W3C `did:key` |
| **Optional** | `description`, `supported_task_types`, `pricing`, `webhook_url`, `polling_mode`, `public`, `logicsrc_compatibility_version` |
| **Rules** | `additionalProperties: false`; requested permissions ≠ granted access; no secrets in public files |
| **Source** | [docs/openagent](https://logicsrc.com/docs/openagent) |

### 1.4 OpenWall / OpenResume / OpenJob / OpenBroadcast / OpenGuest / AgentByte

**Out of Factory v1 scope** unless a PRD explicitly requires them. Listed in [llms.txt](https://logicsrc.com/llms.txt) People family.

---

## 2. Access and credentials family

### 2.1 OpenAccess app descriptor — **Factory-mandatory (Factory client as OpenAccess-shaped app claim)**

| | |
|--|--|
| **File** | `/.well-known/openaccess.json` on Factory client origin |
| **Required keys (spec)** | Document version `openaccess: "0.1"`; `name`; `url`; `operator` (OpenProfile URL); `redirect_uris` (exact https or localhost); `scopes` map `resource:action` → human line; `hubs` (accepted issuers) |
| **Optional** | `jwks`, `offers`, `honours`, `webhooks` |
| **Reserved scopes** | `openid`, `profile`, `email`, `entitlements` need no listing |
| **Factory binding** | Port External Interface OAuth is the **human/agent IdP** for Factory ([port-capabilities](./port-capabilities.md)). OpenAccess descriptor **documents** the Factory client’s scopes and redirects for LogicSRC interoperability; token issuance remains Port until an OpenAccess hub is separately adopted. **ASSUMPTION:** Factory v1 does not run a LogicSRC OpenAccess hub; Port is the token issuer. |
| **Source** | [docs/openaccess](https://logicsrc.com/docs/openaccess) |

### 2.2 OpenConnection — **Out of Factory v1 scope** (setup-token bridge).

### 2.3 OpenCreds — **Factory-mandatory (agent/machine secrets vault shape)**

| | |
|--|--|
| **Artifact** | Encrypted vault / `.opencreds` export; item JSON inside AES-256-GCM envelope |
| **Schemas** | `opencreds-item`, `opencreds-envelope`, `opencreds-database`, `opencreds-manifest`, `opencreds-vault-meta`, `opencreds-audit-event` |
| **Item types** | `login`, `card`, `identity`, `note`, `key`, `account` |
| **Rules** | No raw secrets in git; fingerprints in audit; master password → PBKDF2 → HKDF labels |
| **Source** | [docs/opencreds](https://logicsrc.com/docs/opencreds) |

### 2.4 Credential Sharing — **Factory-mandatory (sync plans for env → GitHub/deploy)**

| | |
|--|--|
| **Objects** | `credential_provider`, sync `plan` / `run`, `credential_audit_event` (schemas: `credential-*`) |
| **CLI** | `logicsrc credentials providers|inspect|plan|diff|approve|sync|rotate|rollback|audit` |
| **Providers** | `env`, `doppler`, `railway`, `github-secrets`, `sh1pt`, `ssh`, `team` |
| **Rules** | Dry-run default; no raw values in logs; destructive writes need explicit approval |
| **Source** | [docs/credential-sharing](https://logicsrc.com/docs/credential-sharing) |

---

## 3. Catalogs a site serves about itself

### 3.1 OpenStack.md — **Factory-mandatory (root + each app)**

| | |
|--|--|
| **File** | Repo root `OpenStack.md`; site `/.well-known/openstack.md`; derived optional `openstack.json` |
| **Identity keys** | `Kind`, `Web`, `Repo`, `Operator`, `License`, `Extends`, `Updated` |
| **Layers (`##`)** | Languages, Runtimes, Interfaces, Data, Services, Modules, Tooling, Hosting, Auth, Conventions, Not |
| **Interfaces** | `###` per way-in (web, api, cli, mcp, …) |
| **Item grammar** | `- Name version (status): role` |
| **Agent rule** | Prefer listed items; never add `Not`; ask before new layer/service |
| **Source** | [docs/openstack](https://logicsrc.com/docs/openstack) |

### 3.2 OpenMCP descriptor — **Factory-mandatory (Factory MCP gateway surface)**

| | |
|--|--|
| **File** | `/.well-known/openmcp.json` |
| **Required** | `mcp` (absolute or relative MCP HTTP endpoint) |
| **Recommended** | `openmcp`, `name`, `description`, `url`, `auth`, `tags`, `operator`, `tools`, `catalogs`, `webhooks` |
| **Source** | [docs/openmcp](https://logicsrc.com/docs/openmcp) |

### 3.3 OpenSite / OpenServer / OpenSaaS / OpenModel / OpenCoupon / OpenListing / OpenThreat / OpenWebring / OpenWiki / OpenEmoji / OpenIcon / OpenRecipe / OpenSong / OpenFile / OpenObject / OpenSlice / OpenRental / OpenI18n / OpenTLD / OpenAffiliate

**Out of Factory v1 scope** except where a PRD explicitly mandates a listing. Catalog family indexed in [llms.txt](https://logicsrc.com/llms.txt).

---

## 4. Agents and process family (core Factory IR)

### 4.1 ASDLC — **Factory-mandatory (lifecycle + gates)**

| | |
|--|--|
| **Artifact** | Process conformance claim + implemented gates (not a single file schema) |
| **Nine phases** | Frame → Fan out → Gate locally → Merge → Release → Verify live → Correct → Ratchet → Promote |
| **Invariants** | Isolation before parallelism; gate is a program; tooling refuses; prod honest; verified live = done; every escape ratchets |
| **Levels** | 0 serial → 1 isolated → 2 continuous → 3 ratcheted (evidence required) |
| **Factory claim** | Target **Level 2** for kernel launch; ratchet discipline from first prod escape (Level 3 habit). Local gate = one command; GitHub CI = independent accept (maps to Gate locally + Verify live). |
| **Source** | [docs/asdlc](https://logicsrc.com/docs/asdlc); overview [asdlc page](https://logicsrc.com/asdlc) |

### 4.2 OpenPRD — **Factory-mandatory (every product decision)**

| | |
|--|--|
| **Directory** | `prd/README.md`, `prd/0000-template.md`, `prd/NNNN-<slug>.md` |
| **Numbering** | Four-digit, monotonic, no gaps; `0000` = template |
| **Front-matter schema** | `@logicsrc/schemas/openprd-prd` — required: `openprd` (e.g. `"0.3"`), `id` (`^\d{4}$`), `title`, `status` ∈ Draft\|Review\|Accepted\|Final\|Rejected\|Withdrawn\|Superseded |
| **Recommended** | `authors` (array), `repo`, `created`, `updated`, `discussion`, `implementation`, `tags`, `supersedes`, `superseded-by` |
| **Body (0.3) — ten sections in order** | Problem, Goals, Non-Goals, Users, Requirements (`R#` with `[P0]`/`[P1]`/`[P2]`), UX Notes, Tech Stack, Monetization, Success Metrics, Risks & Open Questions |
| **Conformance** | Path + front-matter + id matches filename + ten sections in order |
| **CLI** | `logicsrc prd init|new|list|show|validate|index|status|tasks` |
| **Source** | [docs/openprd](https://logicsrc.com/docs/openprd) |

### 4.3 LogicSRC Task (`logicsrc.task`) — **Factory-mandatory (board work from PRD R#)**

| | |
|--|--|
| **Schema** | `@logicsrc/schemas/task` |
| **Required** | `type`=`logicsrc.task`; `version`; `title`; `description`; `board` (`^/[a-z0-9]…`); `creator_did`; `status` (enum: draft, open, funded, claimed, in_progress, submitted, approved, paid, rejected, disputed, cancelled, expired, refunded) |
| **Bridge** | `logicsrc prd tasks NNNN` → one task per requirement |
| **Factory** | Port catalog / Beads may mirror; LogicSRC task JSON is the portable IR |

### 4.4 LogicSRC Agent Run (`logicsrc.agent_run`) — **Factory-mandatory (run evidence)**

| | |
|--|--|
| **Schema** | `@logicsrc/schemas/run` |
| **Required** | `type`=`logicsrc.agent_run`; `version`; `run_id`; `task_id`; `agent_did`; `status`; `started_at` |
| **Optional** | `completed_at`, `logs`, `files_accessed`, `tools_used`, `deliverables`, `cost`, `payment_status` |

### 4.5 LogicSRC Event (`logicsrc.event`) — **Factory-mandatory (audit envelope)**

| | |
|--|--|
| **Schema** | `@logicsrc/schemas/event` |
| **Required** | `type`=`logicsrc.event`; `version`; `event` (`resource.action`); `id`; `created_at`; `actor_did`; `resource_type`; `resource_id`; `data` |

### 4.6 OpenFleet — **Factory-mandatory (session tree under human sysop)**

| | |
|--|--|
| **Record file** | `$OPENFLEET_HOME/fleets/<fleet>/members/<member>.json` |
| **Required keys** | `openfleet`=`0.1`; `fleet`; `sysop`; `member` |
| **Ledger** | `…/ledger.jsonl` append-only; events `fleet.open`, `fleet.cap`, `swarm.spawn`, `member.start`, `member.spend`, `member.end`, `swarm.end`, `ceiling.refuse` |
| **Env** | `OPENFLEET_HOME`, `OPENFLEET_RECORD`, `OPENFLEET_FLEET`, `OPENFLEET_MEMBER`, `OPENFLEET_SWARM` |
| **Rules** | Human-only sysop; agents never open/cap fleet; no credentials in record/ledger; ceiling narrows only |
| **Source** | [docs/openfleet](https://logicsrc.com/docs/openfleet) |

### 4.7 OpenTask — **Factory-mandatory for desktop/UI automation tracks; optional for pure coding harness**

| | |
|--|--|
| **Schema** | `@logicsrc/schemas/opentask` |
| **Required** | `type`=`logicsrc.opentask`; `version`=`0.1`; `id`; `title`; `goal`; `apps`; `steps`; `stop_conditions` (min 1); `approvals`; `success`; `source`; `status` ∈ untested\|passed\|failed |
| **Rules** | No coordinates; parameters by sensitivity; runners observe before act |
| **Source** | [docs/opentask](https://logicsrc.com/docs/opentask) |

### 4.8 OpenWorkflow (+ index) — **Factory-mandatory (named multi-task Factory jobs)**

| | |
|--|--|
| **Schema** | `@logicsrc/schemas/openworkflow`, `openworkflow-index` |
| **Required** | `type`=`logicsrc.openworkflow`; `version`=`0.1`; `id`; `title`; `order` ∈ sequence\|any; `tasks` (min 1) |
| **Entries** | Inline `task` **or** `{url, sha256, id, title}` (+ optional `after`, `optional`) |
| **Index** | `/.well-known/openworkflow.json` with `type`=`logicsrc.openworkflow-index` |
| **Source** | [docs/openworkflow](https://logicsrc.com/docs/openworkflow) |

### 4.9 OpenInstall — **Factory-mandatory (control-plane / gateway boxes)**

| | |
|--|--|
| **Files** | `bin/install.sh` (executable); optional `bin/install.conf` (no secrets) |
| **Phases** | `setup` \| `build` \| `activate` \| `status` \| `all` |
| **Exit codes** | 0 ok; 1 error; 3 health-check fail after restart |
| **State** | `STATE_DIR/app.env` (secrets), `db.env`, `run.sh` |
| **Source** | [docs/openinstall](https://logicsrc.com/docs/openinstall) |

### 4.10 OpenOntology / OpenContext — **Factory-mandatory for Context Lake projection schemas**

| | |
|--|--|
| **Schemas** | `openontology-*` (entity, claim, evidence, manifest, …); `opencontext-*` (bundle, role, decision, …) |
| **Factory** | Port Context Lake remains SoT for GitHub/Linear/metadata; OpenOntology packages name entities Factory agents share; OpenContext governs what agents may read |
| **Source** | Schema package + [docs/openontology](https://logicsrc.com/docs/openontology) (governance/interop guides in llms.txt) |

### 4.11 OpenErrand / OpenSwarm / OpenStream / OpenPkg / OpenABTest

**Out of Factory v1 scope** (browser errands, BitTorrent swarm, stream relay, package TUF, experiments) unless a PRD accepts them.

### 4.12 LogicSRC Repo / Pull Request / Plugin

| Artifact | Schema export | Required (summary) | Factory use |
|----------|---------------|--------------------|-------------|
| Repo | `repo` | `type`,`version`,`name`,`slug`,`owner_did`,`backend`,`visibility` | Catalog projection of Factory repos |
| Pull request | `pull-request` | `type`,`version`,`repo`,`title`,`author_did`,`source_branch`,`target_branch`,`status` | Evidence objects beside GitHub |
| Plugin | `plugin` | `id`,`name`,`version`,`type[]`,`default`,`capabilities`,`commands`,`env` | Factory MCP App / CommandBoard-style plugins |

---

## 5. `@logicsrc/schemas@0.6.0` complete export list

Canonical package: [`@logicsrc/schemas`](https://www.npmjs.com/package/@logicsrc/schemas) (homepage monorepo `packages/schemas`).

**Core:** `task`, `agent`, `run`, `event`, `plugin`, `repo`, `pull-request`, `connected-account`, `account-*`, `email-message`, `social-post`  
**OpenPRD:** `openprd-prd`  
**OpenTask/Workflow:** `opentask`, `openworkflow`, `openworkflow-index`  
**OpenCreds:** `opencreds-item`, `opencreds-envelope`, `opencreds-database`, `opencreds-manifest`, `opencreds-vault-meta`, `opencreds-audit-event`  
**Credential sharing:** `credential-provider`, `credential-sync-plan`, `credential-sync-run`, `credential-audit-event`  
**OpenContext:** `opencontext-*` (+ conformance fixture)  
**OpenOntology:** `openontology-*` (+ conformance fixture)  
**OpenErrand / OpenRental / OpenWall / OpenABTest / AgentAd:** as exported in package.json  

Validate Factory artifacts with `@logicsrc/validators` against these schemas before merge (ASDLC local gate).

---

## 6. Reference data model (CommandBoard) — awareness only

Tables listed in [docs/data-model](https://logicsrc.com/docs/data-model): users, dids, boards, tasks, agents, agent_runs, payments, audit_logs, webhooks, schemas, …  
**Factory:** Port + Rivet + GitHub own runtime SoT; do **not** reimplement CommandBoard DB. Map concepts (agent, task, run, audit) onto Port blueprints + LogicSRC JSON IR.

---

## 7. Factory-mandatory production checklist (rollup)

| # | Artifact | Path / form |
|---|----------|-------------|
| 1 | OpenStack.md | repo root + `/.well-known/openstack.md` |
| 2 | OpenProfile.md | operator org + per-agent profiles |
| 3 | OpenPRD collection | `prd/` OpenPRD 0.3 |
| 4 | ASDLC gates | one local gate cmd + CI refuse + ratchet tests |
| 5 | OpenAgent JSON | one per Factory agent, schema-valid |
| 6 | logicsrc.task / agent_run / event | emitted for work + audit |
| 7 | OpenFleet records + ledger | per host under `~/.openfleet` |
| 8 | OpenWorkflow (+ index) | Factory release/delivery workflows |
| 9 | OpenMCP descriptor | Factory MCP entry |
| 10 | OpenAccess descriptor | Factory client scopes/redirects (Port issues tokens) |
| 11 | OpenCreds + Credential Sharing | vault + sync plans |
| 12 | OpenInstall | `bin/install.sh` on control-plane repos |
| 13 | OpenOntology/OpenContext packages | Context Lake entity/role IR |
| 14 | Repo/PR/plugin JSON | as needed for projections |

**Not required for Factory v1:** OpenServer hardware catalogs, OpenListing, OpenRecipe, OpenSong, OpenEmoji, OpenWiki, OpenWebring, OpenCoupon, OpenAffiliate, OpenTLD, OpenRental marketplace, OpenSwarm (BitTorrent), OpenStream, OpenPkg, OpenABTest, OpenErrand, OpenJob/Resume/Broadcast/Guest/Wall, AgentByte screening — unless a later Accepted OpenPRD adds them.

---

## 8. Sources

- https://logicsrc.com/llms.txt  
- https://logicsrc.com/specs  
- https://logicsrc.com/docs/{asdlc,openprd,openagent,openstack,opentask,openworkflow,openfleet,openinstall,opencreds,openaccess,openmcp,openprofile,openskill,credential-sharing,data-model}  
- https://logicsrc.com/.well-known/{openstack.md,openprofile.md}  
- https://cdn.jsdelivr.net/npm/@logicsrc/schemas@0.6.0/package.json and schema files  
- Project: [`logic-src-overview.md`](./logic-src-overview.md), [`logicsrc-monorepo.md`](./logicsrc-monorepo.md)
