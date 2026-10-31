# Factory runner + idea-to-issue

Closes two gaps on the idea → issue → PR → merged path.

```
Port workflow ─webhook→ factory-gateway ─repository_dispatch(factory_job)→ factory-runner.yml
                                                                        └→ evidence comment on linked issue (exact SHA)
idea issue (+label approved) ─→ idea-to-issue.yml ─→ linked "PBI:" draft issue (+ sub-issue link)
```

- **Runner** (`.github/workflows/factory-runner.yml`, `scripts/factory-runner.mjs`): push-only (Rivet/Port never polled). Job names an *allowlisted* check (`typecheck`, `test`, `gate`) — never a command. Concurrency group per `workKey`, so a duplicate dispatch is serialized, not parallel. Zero LLM spend. #109 owns the real sandbox/product-repo path; this is the Actions-side runner it can reuse.
- **Gateway dispatch** (`apps/factory-gateway/src/runner-dispatch.ts`): after an admit is enqueued, POSTs `repository_dispatch`. Off unless `FACTORY_RUNNER_REPO` and `FACTORY_RUNNER_DISPATCH_TOKEN` are both set (env only).
- **Idea → issue** (`.github/workflows/idea-to-issue.yml`, `scripts/idea-to-issue.mjs`): issue labeled `idea` + `approved` creates `PBI: <title>` (labels `pbi-draft`, `needs-contract`), comments the link on the idea, and is idempotent through a hidden marker. Not startable until the 19-field contract is filled. Port can push the same shape as `factory_idea_approved`.

## Manual smoke (after merge)

1. Actions → factory-runner → Run workflow: `work_key=smoke-1`, `check=typecheck`. Expect green + JSON evidence in the step summary.
2. Create labels `idea`, `approved`, `pbi-draft`, `needs-contract`; open an issue, label it `idea`, then `approved`. Expect a linked `PBI:` issue and a comment on the idea. Re-label: no duplicate.

## Muse task contracts (dashboard / secret work Claude cannot reach)

### MUSE-1 — Point the live gateway at the supervisor / runner

- **Goal:** live gateway dispatches admits to the GitHub runner.
- **Inputs:** GitHub repo `mplsjohnnycage/factory`; gateway host env file (desktop, Tailscale Funnel); a new fine-grained PAT scoped to this repo only, permission *Contents: read/write* (needed for `repository_dispatch`).
- **Steps:** (1) create the PAT in GitHub → Settings → Developer settings; (2) on the gateway host set `FACTORY_RUNNER_REPO=mplsjohnnycage/factory` and `FACTORY_RUNNER_DISPATCH_TOKEN=<PAT>` (env file only, never git/chat); (3) if the supervisor HTTP entry is live, also set `RIVET_SUPERVISOR_URL`; (4) restart the gateway; (5) `GET /health`; (6) send one signed `factory_claim_next_job` webhook with a test `workKey`.
- **Acceptance:** `/health` ok; a `factory-runner` run appears in Actions for that `workKey`; no token in logs.
- **Return:** run URL, the exact env var *names* set (not values), gateway restart timestamp.

### MUSE-2 — Port workflow → gateway wiring check

- **Goal:** confirm Port `factory_*` WEBHOOK nodes hit the live gateway.
- **Inputs:** Port dashboard; Port secrets `FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN`.
- **Steps:** (1) verify both secrets exist and the base URL matches the Funnel URL; (2) trigger `factory_start_delivery_run` against a test product; (3) read the run log.
- **Acceptance:** webhook 2xx from gateway; run listed with a `workKey`.
- **Return:** Port run id, HTTP status, any error text.

### MUSE-3 — Repo labels

- **Goal:** labels exist for idea-to-issue.
- **Steps:** create `idea`, `approved`, `pbi-draft`, `needs-contract` in GitHub → Issues → Labels.
- **Acceptance:** all four listed.
- **Return:** confirmation.
