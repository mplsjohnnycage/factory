# Quality gates — factory-builder v0.1.0

Checklist from create-plugin / review-plugin-submission + Factory norms.

## Manifest

| Check | Result |
|-------|--------|
| `.cursor-plugin/plugin.json` exists (local install) | **PASS** |
| `name` = `factory-builder` (kebab-case) | **PASS** |
| Recommended fields: version, description, author, license, keywords | **PASS** |
| Declared paths relative, no `..` | **PASS** |
| Declared `skills/`, `rules/`, `agents/`, `commands/*` exist | **PASS** |

## Component metadata

| Component | Frontmatter | Result |
|-----------|-------------|--------|
| Rules (`*.mdc`) | `description`, `alwaysApply` | **PASS** |
| Skills (`skills/*/SKILL.md`) | `name`, `description` | **PASS** |
| Commands (`commands/*.md`) | `name`, `description` | **PASS** |
| Agent (`agents/factory-builder.md`) | `name`, `description` | **PASS** |

## Documentation

| Check | Result |
|-------|--------|
| README states purpose | **PASS** |
| README states installation | **PASS** |
| Scope focused (Factory Meta builder) | **PASS** |

## Content provenance

| Source doc | Encoded in |
|------------|------------|
| factory-master-spec §0 (authority, unit, Meta XOR, loop, roster) | rules + typed-contract + meta-vs-product skills |
| factory-workflow Phase A / collision / sync | factory-workflow-setup skill + `/factory-setup` |
| factory-meta-vs-product | factory-meta-vs-product skill + `/factory-classify-lane` |
| factory-coding-loop | factory-coding-loop skill + `/factory-loop` / `/factory-standardize` |

## Known mount caveat

Working trees on agent-store fuse may omit `.cursor-plugin/` on disk while git still carries it. Local install path is unaffected. See [install.md](./install.md).

## Verdict

**Ready for local use.** Marketplace submission not requested.
