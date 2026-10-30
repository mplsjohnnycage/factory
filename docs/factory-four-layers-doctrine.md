---
cursor:
  subagentId: "bc-cf31d08c-e215-50d9-900b-68cb0de65840"
---

# Factory — Four Layers Doctrine (standing guidance, 2026-10-29)

**Rule of thumb: Factory is the manufacturer, its toolchain is the manufacturing equipment, and the repos it produces are the products.** Do not conflate the layers; every task states which layer it belongs to.

## The four layers

1. **Development scaffolding** — the tools used to *build* Factory: Cursor / Claude / OpenCode / Codex / Orca, GitHub, agent stores, Trails. This layer must never appear inside Factory's runtime contracts or repos it produces.
2. **Factory — the manufacturer** — the kernel being built in `mplsjohnnycage/factory`: Port SoT → signed gateway → Rivet `ProjectSupervisor` → Sandbox Agent → GitHub CI accept on exact SHA, surfaced through Developer OS. Meta Beads / Factory Meta Linear live here.
3. **Factory's toolchain — the machinery** — what the finished Factory *operates* to manufacture things: agent runners, sandbox images, repo-creation, test suites, deploy pipelines. Owned and pinned by Factory contracts (`sandbox-harness`, `rivet-execution`), swapped/onboarded like equipment, not hand-drives.
4. **Products** — completely separate repos, apps, APIs, sites that Factory builds for customers. Owns own beads/boards/CI. Meta never dual-writes into them.

## Sequencing law (decided by Johnny, 2026-10-29)

- **Self-reproduction is NOT a prerequisite.** Factory must not depend on rebuilding itself before it may build other things.
- **First milestone: one independent product repo produced end-to-end** — Port admit → gateway HMAC → Supervisor → Sandbox → CI green on exact SHA → delivered. Secure that path; make it repeatable (same inputs → same verified repo).
- **Self-improvement (Factory updating Factory) is a separate capability added later**, with tighter authorization than product runs.
- **Before any product repo runs loose:** security boundaries (HMAC admit, least-privilege sandbox, blast radius per `security-blast-radius`) and **persistent execution** (durable queues, restart recovery, retry-safe attempts) must be hardened.

## What this means for route decisions

- Prefer units that close the **one-repo end-to-end** gap: admit path, sandbox lease, CI accept, HMAC hardening, persistence.
- Beads: `factory-*` (Meta lane) stay layer 2; when running product builds, product beads live in the **product** lane only.
- Scaffolding-layer conveniences (Trail, agent stores) may help agents but must not enter Factory contracts or product repos.
- "Factory rebuilt itself" / self-PR loops = deferred, authorization-gated. Never let a self-build checker block a product M1.
