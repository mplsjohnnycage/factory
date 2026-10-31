# LogicSRC

- **Kind**: monorepo
- **Web**: https://logicsrc.com
- **Repo**: https://github.com/profullstack/logicsrc
- **Operator**: https://logicsrc.com/.well-known/openprofile.md
- **License**: MIT
- **Updated**: 2026-09-21

Open coordination standards for humans and AI agents, with the reference implementation of each standard beside its text.

## Languages

- TypeScript 5.9: everything, as ES modules with `.js` specifiers in source
- SQL: Postgres migrations under `supabase/`

## Runtimes

- Node 24: the CLI, the MCP server, the TUI, the API and the web app's server
- Browser: the web app and the two PWAs

## Interfaces

### Web

- Next.js 16 (App Router): logicsrc.com, the specs and the blog
- React 19
- marked 18: renders the specs from `docs/*.md`, sanitised with sanitize-html

### CLI

- @logicsrc/cli: `logicsrc`, every standard and tool as one command

### TUI

- @logicsrc/tui: plain Node, no terminal framework

### MCP

- @profullstack/logicsrc-mcp: the standards, schemas and validators as tools, on @modelcontextprotocol/sdk 1 with zod 4

### API

- @logicsrc/commandboard-api: the CommandBoard.run REST reference service, plugins loaded through @logicsrc/plugin-core

### Credentials app

- Express 4: team credential sharing on libSQL, passkeys with SimpleWebAuthn 13, CoinPay OAuth, `lsk_` keys for the CLI

## Data

- Postgres (Supabase): the blog and CommandBoard
- libSQL (Turso): the credentials app, a local file in development

## Services

- CoinPay: payments and OAuth sign-in
- x402 (@profullstack/x402-gateway): paid crawling of the site, settled by CoinPay in USDC
- crawlproof.com: stats and audits

## Modules

- @profullstack/stack 0.1: feedback widget, CoinPay client, Supabase glue
- @logicsrc/schemas, @logicsrc/validators: the JSON schemas and their validation, shared by every interface

## Tooling

- npm 11 workspaces: `apps/*`, `packages/*`, `plugins/*`
- vitest 4: unit and contract tests
- Playwright 1.57: end to end
- GitHub Actions: build, schema fixtures and contract tests on Node 24

## Hosting

- Railway: one service per app; the apex proxies `/cli`, `/auth` and `/api` to the credentials app and CommandBoard

## Auth

- Passkeys and email with password in the credentials app; sessions; `lsk_` API keys for the CLI

## Conventions

- A spec is one entry in `apps/logicsrc-web/src/lib/specs.ts` plus `docs/<slug>.md`; the sidebar, `/docs`, the sitemap and `llms.txt` read that registry
- Specs are Markdown first; any JSON is derived from the Markdown and never the reverse
- No em dashes in published text

## Not

- No ORM: SQL is written by hand
- No CSS framework: one stylesheet
- No `.env` in production: secrets are Railway variables, pulled from the team vault
