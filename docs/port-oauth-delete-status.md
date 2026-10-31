# Port OAuth delete status — Observatory vs Factory

**Lane:** Meta only  
**Checked:** 2026-10-29 (FE-85)  
**Org:** `mplsjohnnycage` / `org_rNq4tjSc8DXL1ceL` (account `makeithappenentllc.com`, FREEMIUM)  
**MCP:** Port + Port-eu (`list_external_interface_apps` / `revoke_external_interface_app`)  
**Connected user:** Johnny Cage (Admin)

## Verdict

| Question | Answer |
|----------|--------|
| **Deleted Y/N (this run)** | **N — already absent.** Nothing left to revoke. |
| **Deleted historically** | **Y — FE-59** (Johnny-authorized Meta ops). Observatory permanently removed via `revoke_external_interface_app`. |
| **Factory client intact** | **Y** — not touched. |
| **Remaining External Interface apps** | **Only `Factory`.** |

## Live apps (MCP, this run)

`list_external_interface_apps` (Port and Port-eu, identical):

| Name | App id | Client id | Status |
|------|--------|-----------|--------|
| **Factory** | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` | **KEEP — live** |
| Harness Observatory | `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP` | (former) | **Not in list** |

Factory redirects (unchanged):

1. `http://localhost:3000/api/auth/callback`
2. `http://127.0.0.1:3000/api/auth/callback`

## Delete attempt this run

Called `revoke_external_interface_app` with Observatory app id `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP`.

**Result:** `Oauthapp with id "stflVc7sZJXf6FelDkUFFhcKnoaxP6QP" was not found`

That is the expected response when the app was already permanently revoked. Re-list still shows **only Factory**. Factory was **not** revoked.

Port docs: revoke **permanently removes** the External Interface OAuth registration (Auth0 client included). There is no separate “delete” tool beyond `revoke_external_interface_app`.

## Root cause of the miss (why Johnny still thought Observatory was there)

1. **Ops already succeeded on FE-59** — cutover revoked Observatory then created Factory; live SoT is [`port-factory-oauth-live.md`](./port-factory-oauth-live.md). This FE-85 pass reconfirms the same org state.
2. **Wording mismatch** — agents reported “revoked.” Preference (`preferences.md`) says revoke alone is not enough if Johnny still sees the old app. In Port, **revoke = permanent delete**; there is no second delete step. That language gap likely looked like unfinished work.
3. **Earlier real aborts left a trust scar** — FE-14 listed Observatory and **did not** revoke (`internal/port-oauth-abort.md`). FE-11/redo hit FREEMIUM limit and left Observatory untouched. Those pre-authorization failures were correct at the time but read as “agents never delete it.”
4. **Stale docs still describe Observatory as present** — Project store pages that were not refreshed after FE-59 still say the live org has Harness Observatory only, e.g.:
   - `docs/port-full-capacity.md` (apps = Harness Observatory)
   - `docs/factory-stack-audit.md` (Observatory OAuth present)
   - `docs/rivet-engineering-spec.md` (§12 “not executed” / “still has Harness Observatory only”)
   - `docs/factory-verify.html` (Observatory = Leave / deferred)
   - `docs/factory-research-300-qa.md` Q34 (historical “exists today”)
5. **Wrong surface ruled out** — Integrations list has no Observatory OAuth app (github/linear/vercel/convex only). Port-us MCP is unauthenticated (auth-only stub); Port + Port-eu both see the same single Factory app on this org. Max orgs on account = 1 — not a wrong-org problem.

## Hard constraints honored

- Did **not** revoke/delete Factory (`iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` / client `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`).
- Meta Factory lane only — no product Port mutations.
- Developer OS must keep wiring to the Factory client id above only.

## If Johnny still “sees” Observatory

Check Port UI **Manage OAuth apps** / External Interfaces for org `mplsjohnnycage` and hard-refresh. API SoT is this file + `list_external_interface_apps`. Any remaining sighting is almost certainly **stale Project docs** or UI cache — not a second live External Interface app in this org.

## Related

- Live Factory record: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)
- FE-59 cutover notes: `internal/port-factory-oauth-cutover.md`
- FE-14 abort (never revoked): `internal/port-oauth-abort.md`
