# factory (Factory Meta repo)

**Proposed GitHub name:** `factory` (or org-qualified equivalent).  
**Lane:** Meta — building the Factory kernel. Not a product project.

## Status

Local scaffold / staging only. GitHub remote push blocked until `gh` auth (or PAT) is available.

## Mandated layout (master §2)

```
AGENTS.md
OpenStack.md                 # PBI-003
specs/{domain}/spec.md       # ten domains — stubs now; PBI-001 authors
docs/adrs/                   # placeholders; PBI-002 authors
docs/
tasks/                       # optional PBI mirrors
prd/ agents/ workflows/
apps/developer-os/
apps/factory-gateway/
bin/install.sh
.well-known/
.github/workflows/
```

## Push commands (Johnny)

```bash
cd artifacts/factory   # or copy this tree elsewhere
git init
git add .
git commit -m "chore: Factory Meta scaffold (init only)"
gh repo create factory --private --source=. --remote=origin --push
# or: git remote add origin git@github.com:<org>/factory.git && git push -u origin main
```

## Sources mirrored

- Master layout: Project `docs/factory-master-spec.md` §2
- ASDLC skill zip: Project `internal/asdlc-skill.zip` → `skills/asdlc/`
- OpenAI Agents SDK / AGENTS.md convention: index-only AGENTS.md (not design dump); SDK is **not** the Factory control plane — Rivet SA + Claude Code is M1 harness
