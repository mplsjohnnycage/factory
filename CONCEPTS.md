# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Meta Beads

The Beads instance in this Factory meta-repo used for ready/claim and parallel coding admit. Prefix and instance live with the Meta lane only; Product Beads is a different instance and must not be created or claimed from this repo. Linear stays human visibility; Meta Beads (or an audited Port execution-contract bypass) is the admit SoT once ProjectSupervisor cutover applies.

## Project worker

A coding agent run that implements a Meta PBI from the Factory meta-repo. It creates a fresh git branch from current `main` at implement time, owns the PR, and does not rely on Linear→Cursor issue-delegate or a pre-seeded remote branch name.

## Linear gitBranchName

A Linear UI / API field that suggests a branch string for an issue. In this Meta lane it is display metadata only — not a git object that must exist on origin, and not authority to create empty placeholder remotes or to start work via issue-delegate.
