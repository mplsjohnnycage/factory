---
cursor:
  subagentId: "bc-129df4a7-2734-5955-b77c-c35bb770412e"
---

# FE-134 — factory-gateway Dockerfile + compose — Independent review (PR #41)

**PR:** https://github.com/mplsjohnnycage/factory/pull/41 — **MERGED** (squash)  
**Content head reviewed:** `396b28f9a5d43a1ba05eeda91ac4adbf87a77e44` · branch `cursor/gateway-dockerfile-https-81e8` · base `main`  
**Merge tip (post-sync):** `728becad59469d9ce3881d3997fdb3499363fced` → squash merge `41f49c8e23aedc42502883ce4ea533f68d8824c0`  
**Author:** `mplsjohnnycage` (commit co-author Cursor Agent); author session notes in [`internal/gateway-dockerfile-pr41.md`](../internal/gateway-dockerfile-pr41.md) (`bc-00107faf…`)  
**Reviewer session:** `bc-129df4a7-2734-5955-b77c-c35bb770412e` — **≠** author  
**Lane:** Meta (gateway Docker / Funnel-PaaS remount path; FE-114)  
**Content + formal GitHub verdict:** **APPROVE** → **merged**  
**Model:** omitted (auto)

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **APPROVED** · `author_association: COLLABORATOR` | Initial: https://github.com/mplsjohnnycage/factory/pull/41#pullrequestreview-5694821856 · tip re-APPROVE: https://github.com/mplsjohnnycage/factory/pull/41#pullrequestreview-5694868096 |
| Squash merge (write collab) | **merged** · `41f49c8` | Assignment: merge only if write APPROVE + green CI |
| Cursor App `gh` APPROVE | Not used (App token lacks write; cannot count for protection) | Formal path is write collab |
| Author handoff | Prior art | [`internal/gateway-dockerfile-pr41.md`](../internal/gateway-dockerfile-pr41.md) |

Author ≠ reviewer. Protection `required_approving_review_count` unchanged. No Observatory. Repo remains **public**.

## Acceptance checklist

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Multi-stage Node 20 production image | `apps/factory-gateway/Dockerfile` | **PASS** | `deps` → `build` (`npm ci` + `tsc`) → `runtime` Alpine; `CMD ["node","dist/index.js"]` |
| Non-root + port + health | Dockerfile `USER factory`, `EXPOSE 8787`, `HEALTHCHECK` | **PASS** | Health hits `GET /health` on `GATEWAY_PORT` (default 8787); matches `server.ts` |
| Stdlib-only runtime (no prod npm deps) | `package.json` + runtime COPY | **PASS** | Only `devDependencies`; runtime copies `package.json` + `dist` only |
| `.dockerignore` excludes secrets/tests | `.dockerignore` | **PASS** | `node_modules`, `dist`, `test`, `.env*`, `*.md` |
| Compose profile opt-in | `compose/docker-compose.yml` `profiles: ["gateway"]` | **PASS** | Default path still Rivet-only; gateway env + healthcheck aligned |
| Docs: public HTTPS / Funnel / no private flip | `apps/factory-gateway/README.md`, `compose/README.md`, `.env.example` | **PASS** | Explicit “keep repo public”; Funnel/PaaS in front of `:8787` |
| No Observatory | Diff + name search under gateway/compose | **PASS** | Zero Observatory references |
| No Port OAuth create/delete/revoke | Diff scope | **PASS** | Dockerfile/compose/docs only; no EI mutations |
| Local reproduce | `npm ci && typecheck && test` on head | **PASS** | **49 pass / 0 fail**; typecheck clean |
| Docker image build (local) | Review VM | **N/A** | No `docker` binary; not blocking — CI compose config lint green |
| **CI green on content SHA `396b28f` + merge tip `728beca`** | Actions + Vercel | **PASS** | Both tips: `meta-ci-presence`, `compose-config-lint`, `gateway-typecheck-test`, `local-gate-refuse`, Vercel — all SUCCESS before merge |
| Repo visibility | `gh api … --jq private` | **PASS** | `private: false` / `visibility: public` |
| Author ≠ this reviewer | session ids + GitHub logins | **PASS** | Author agent `bc-00107faf…` ≠ reviewer `bc-129df4a7…`; formal reviewer `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` |
| Formal APPROVE counts for protection | write COLLABORATOR | **PASS** | Review `5694821856` |

## Diff scope

- `apps/factory-gateway/Dockerfile` — production multi-stage image
- `apps/factory-gateway/.dockerignore`
- `apps/factory-gateway/README.md` — Docker / Funnel remount section
- `compose/docker-compose.yml` — opt-in `factory-gateway` service
- `compose/README.md`, `compose/.env.example` — profile docs + env stubs

## Consistency skim

- Aligns with FE-114 public HTTPS remount path (Funnel/PaaS → `:8787` → Port `FACTORY_GATEWAY_BASE_URL`).
- Does not change Rivet default Compose admit path (profile-gated).
- Gateway already warns when `PORT_CLIENT_SECRET` unset; empty Compose defaults are intentional for opt-in.

## Findings

### Blocking

None.

### Non-blocking

1. `# syntax=docker/dockerfile:1` sits after comment lines; Docker only honors the syntax directive when it is the first line — cosmetic / BuildKit hint may be ignored.
2. Build-stage `npm prune --omit=dev` is unused because runtime does not copy `node_modules` — harmless dead work.
3. Compose healthcheck falls back to `wget` though the image installs `curl` only — curl path is sufficient.
4. No `depends_on: rivet-engine`; acceptable because profile still starts Rivet (unprofiled) alongside gateway, and supervisor URL is optional HTTP forward.

## Local verify

```text
cd apps/factory-gateway && npm ci && npm run typecheck && npm test
# tests 49 · pass 49 · fail 0  (tip 396b28f)
```

## Recommendation / outcome

Content **APPROVE**. Formal write-access **APPROVE** as `skysthelimitpainting1779-collab`. CI including `meta-ci-presence` green. Squash-merged to `main` per assignment gate (write APPROVE + green CI).

| Item | Value |
| --- | --- |
| Decision | **APPROVE** → **MERGED** |
| PR | https://github.com/mplsjohnnycage/factory/pull/41 |
| Content head | `396b28f9a5d43a1ba05eeda91ac4adbf87a77e44` |
| Merge tip | `728becad59469d9ce3881d3997fdb3499363fced` |
| Merge commit | `41f49c8e23aedc42502883ce4ea533f68d8824c0` |
| Formal review (tip) | https://github.com/mplsjohnnycage/factory/pull/41#pullrequestreview-5694868096 |
| Model | omitted (auto) |
