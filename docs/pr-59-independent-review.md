---
cursor:
  subagentId: "bc-9029d0ab-5fcf-5dd2-b339-49f5ddc646cb"
---

# Gateway Windows logon autostart — Independent review + merge (PR #59)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/59 (**MERGED**) |
| Branch | `cursor/gateway-windows-logon-autostart-308e` |
| Content head reviewed | `3cc00f497be81691ebc0cfc76f53850c1bf0173f` |
| Merge tip (post update-from-main ×2) | `aae99972fe14afeea205e3cdc7e7dd6ff453b0f8` |
| **Merge SHA** | `6a136805c50f36ebc48a4f45e2028ab3e0bf8e69` |
| Author session | `bc-471ce0ac-4154-5c91-9a5e-d3b58dcc308e` |
| Independent review session | `bc-9029d0ab-5fcf-5dd2-b339-49f5ddc646cb` (**≠ author**; Auto) |
| Author report | [`docs/gateway-logon-autostart.md`](./gateway-logon-autostart.md) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `3cc00f4` (retained through tip `aae9997`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/59#pullrequestreview-5701233623 |
| Squash-merge via Composio (`mplsjohnnycage`) on tip `aae9997` | **MERGED** | merge SHA `6a136805c50f36ebc48a4f45e2028ab3e0bf8e69` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-471ce0ac…` ≠ reviewer `bc-9029d0ab…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist

| # | Check | Result |
| --- | --- | --- |
| 1 | Scope = Windows Task Scheduler kit + dry-run + docs (+619/−0; 6 files) | **PASS** |
| 2 | No secrets in git — `gateway.env.example` empty for secrets; scripts log key counts only | **PASS** |
| 3 | Secrets path is local-only `%USERPROFILE%\.factory\gateway.env` (outside repo) | **PASS** |
| 4 | Register refuses if env file missing; never logs env values | **PASS** |
| 5 | Default Action = `DryRun` (no task create/remove unless explicit Register/Unregister) | **PASS** |
| 6 | Task principal Interactive + Limited (no elevation); AtLogOn for current user | **PASS** |
| 7 | Hard bans held: no Port schema/secret/WEBHOOK/OAuth mutate from kit | **PASS** |
| 8 | Cross-OS kit dry-run `node scripts/gateway-windows-logon-dry-run.mjs` exit 0 | **PASS** |
| 9 | Docs make dry-run default path + Johnny live reboot verify clear | **PASS** |
| 10 | Live Windows reboot+logon not claimed — post-merge Johnny ops OK; not a merge blocker | **PASS** |
| 11 | Formal write APPROVE + green `meta-ci-presence` before merge | **PASS** |
| 12 | Author ≠ formal reviewer | **PASS** |
| 13 | Branch current vs `main` at merge (0 behind after #57+#58 sync) | **PASS** |

## Diff scope

6 files · +619 / −0 vs `main` · content tip `3cc00f4` · merge tip `aae9997`.

| Path | Role |
| --- | --- |
| `scripts/windows/factory-gateway-logon-start.ps1` | **ADDED** — env load → `npm start` → `/health` → optional Funnel |
| `scripts/windows/factory-gateway-register-logon-task.ps1` | **ADDED** — `DryRun` / `Register` / `Unregister` / `Status` |
| `scripts/windows/gateway.env.example` | **ADDED** — empty-key template |
| `scripts/gateway-windows-logon-dry-run.mjs` | **ADDED** — kit presence + secret-assignment guard |
| `docs/ops/gateway-windows-logon-autostart.md` | **ADDED** — operator runbook |
| `apps/factory-gateway/README.md` | **MODIFIED** — Windows kit pointer |

## CI at merge tip `aae9997`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `gateway-typecheck-test` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** |
| Vercel Preview Comments | **SUCCESS** |

## Safety skim (logon autostart)

- **Dry-run default:** `Action = "DryRun"`; DryRun exits without Register/Unregister.
- **Secret hygiene:** Import-DotEnvFile sets process env only; logs key counts / path only; Register throws if env file absent.
- **Privilege:** `RunLevel Limited`, interactive current user, not SYSTEM/Highest.
- **Idempotent start:** skips spawn if local `/health` already OK; RestartCount 3 on task.
- **Port surface:** scripts/docs explicitly REFUSE Port mutate; funnel hostname is public pilot URL only.
- **Dry-run kit:** marker checks + forbids non-empty long secret assignments outside `.example`.

## Findings

### Blocking

None.

### Non-blocking

1. Live reboot+logon on `DESKTOP-3APDBKG` remains Johnny ops (correctly staged; not a merge gate).
2. `GATEWAY_HOST=0.0.0.0` in example is intentional for Funnel bind — operator must keep firewall/Funnel policy as intended.
3. Task uses `-ExecutionPolicy Bypass` for the start script (common for Scheduled Tasks; Limited principal mitigates).

## Explicit non-actions (this review session)

- No Port blueprint/workflow upsert / schema apply  
- No Port secret upsert / `trigger_run`  
- No OAuth External Interface create/delete/revoke  
- No Observatory  
- No Product Beads / `bd dolt push`  
- No protection dip / admin override  
- No live Windows Register/reboot from cloud  

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/59 |
| Merge SHA | `6a136805c50f36ebc48a4f45e2028ab3e0bf8e69` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/59#pullrequestreview-5701233623 |
| Protection | Write APPROVE kept; count not dipped |

## Johnny (3 lines)

1. **Merged** PR #59 — Windows logon Task Scheduler kit is on `main` (`6a13680`).  
2. Why: scripts/docs sound (DryRun default, no secrets in git, Limited AtLogOn); formal collab APPROVE + green `meta-ci-presence`.  
3. Your ops: on **DESKTOP-3APDBKG** copy `gateway.env.example` → `%USERPROFILE%\.factory\gateway.env`, DryRun → Register → reboot+logon `/health` (Funnel).
