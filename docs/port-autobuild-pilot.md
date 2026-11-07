# Port → Codex/Sprite → GitHub preview build (pilot)

Status: **staged only; not live**. This is a one-task bounded build/repair/PR **pilot**, not yet the autonomous project-wide dependency-DAG loop. No production merge, promotion, Vercel project creation, or Port tenant changes are performed by these repository files.

## Artifacts

- `port/workflows/ss_factory_autobuild.json`: native Port self-service trigger + GitHub Ocean `dispatch_workflow` integration node, **published=false**.
- `.github/workflows/factory-autobuild.yml`: GitHub `workflow_dispatch` runner; requires `vars.FACTORY_AUTOBUILD_ENABLED == 'true'`.
- `scripts/factory-autobuild.sh`: task-scoped Codex invocation, up to three attempts, `npm test`, `npm run typecheck`, `npm run build`, protected-file diff guard, commit to unique branch. GitHub step pushes and opens a **draft PR** only after local gates pass.

## Prerequisites / activation gates

1. Restore valid Port CLI credentials. On `developer-base-authenticated` the CLI is installed (`port version 0.4.0`), but both `production` and `staging` currently fail with `invalid_credentials`. Refresh CLI credentials using Port's authorized login/credential process. Do not store credentials in Git.
2. List the live Port workflows, GitHub Ocean integrations and blueprint fields. **Do not overwrite existing blueprints, integrations, or workflows**; prefer native Port resources. Replace `REPLACE_WITH_LIVE_GITHUB_OCEAN_INSTALLATION_ID` with a real existing integration ID. This JSON must be reconciled against tenant schema and updated installation values before applying.
3. Ensure every selected target repository includes the two files `.github/workflows/factory-autobuild.yml` and `scripts/factory-autobuild.sh`, plus checked-in spec/task IDs and `npm` scripts for test, typecheck, build. The current pilot is scoped to the Factory Meta repo; other repos are not provisioned automatically.
4. Register an **isolated, trusted** Linux GitHub Actions runner on an authorized Sprite with labels `self-hosted`, `linux`, `factory-sprite`. Runner must have Git, gh, Node/npm and a subscription-authenticated `codex` CLI available. The inspected developer Sprite reports **Codex not logged in** and no runner installation at expected paths. Protect Codex credentials from untrusted PRs, dependency scripts and external processes. Run only approved repository code.
5. Ensure repository Actions may open pull requests with their scoped `GITHUB_TOKEN`. Configure required CI checks and Vercel Git preview integration in each target repository. This workflow does **not** verify Vercel previews or assert spec-level acceptance.
6. After real staging smoke verification, set repository variable `FACTORY_AUTOBUILD_ENABLED=true` for that verified repo; Port self-service trigger must remain unpublished until separate permission/release approval.

## CLI apply (ONLY after authenticated tenant read, reconciliation and installation ID resolution)

```bash
port api call /workflows --org staging
# Inspect the live identifier first; POST for a genuinely new workflow,
# PUT /workflows/ss_factory_autobuild if it already exists.
port api call /workflows --org staging -X POST \
  --data "$(cat port/workflows/ss_factory_autobuild.json)"
```

The staged JSON intentionally includes a **nonfunctional installation ID placeholder**. Do not run POST with the placeholder. Verify responses and inspect workflow as unpublished after applying. Never overwrite production without a reviewed diff and approval.

## Expected pilot path

Port user trigger with `repository=factory`, `spec_path=specs/factory-kernel/spec.md`, and a concrete `task_id` → GitHub Ocean dispatch → private Sprite Actions runner → Codex creates task changes → bounded independent local test/typecheck/build → draft GitHub PR → GitHub CI + Vercel preview + human acceptance. **No automated merge.**

## Not implemented yet

- Automated conversion of an idea/spec into a dependency DAG, plus Port entity provenance and acceptance contracts
- Auto-selection and dispatch of the *next* ready task upon verified PR merge
- External independent spec-based tests, Playwright visual QA, and Vercel preview health reconciliation
- General automatic installation into newly created GitHub/Vercel projects
- Durable retry queues, budget controls, agent worker fleet management and failure escalation

Those require working Port tenant read/write access and confirmed existing factory capabilities. Do not create a parallel orchestration database.
