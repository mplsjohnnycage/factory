<!-- PROVENANCE: Contract section copied verbatim from repo specs/developer-os/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/developer-os/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — developer-os

Source: `specs/developer-os/spec.md` (repo, main @ 247842e)

### Definition of Done

- Next.js app builds; atlas hero is first viewport.
- Port OAuth login + callback Route Handlers compile; Factory client id via `PORT_FACTORY_CLIENT_ID` only.
- Callback path is `/api/auth/callback` (exact match to Port + OpenAccess redirect_uris).
- Callback performs Authorization Code + PKCE token exchange (no stub; no `client_secret`).
- Production `redirect_uri` origin is pinned to the stable Dev OS host (`NEXT_PUBLIC_DEVOS_URL` or canonical `factory-developer-os.vercel.app`) — never ephemeral `VERCEL_URL` deployment hosts.
- Rivet native stream reconnects from last `sequence` (gap replay + live; no duplicates).
- Port sign-in Route Handler targets the intended Factory client redirects and does not reuse Observatory or Clerk.
- Atlas subgraph + tool dispatcher typecheck/test: proven joins carry full provenance; unknown joins non-authority; access/redaction tests pass; Langfuse refused as live owner.

### Regression Guardrails

- Browser does not call Sandbox Agent control APIs.
- Clerk is absent.
- Observatory client id configured as Factory auth fails Contract review.
- No CopilotKit / AG-UI on the kernel streaming path.
- OAuth callback must not remain at `/api/auth/port/callback` (redirect_uri drift).
- Production Port OAuth must not emit `https://${VERCEL_URL}/api/auth/callback` as `redirect_uri`.
- Atlas must not invent cross-overlay authority without provenance.
- Langfuse must not be treated as live AgentSession owner.
- No live Port blueprint/workflow schema apply from this Spec without Johnny approval.

### Scenarios

```gherkin
Scenario: Preview deploy serves shell
  Given Developer OS is built for a Vercel preview
  When an operator opens the shell
  Then the Code Atlas hero is the first viewport composition
  And privileged mutations are not available without Port auth

Scenario: Port OAuth PKCE login and callback
  Given PORT_FACTORY_CLIENT_ID names the Factory External Interface app
  When GET /api/auth/port/login and GET /api/auth/callback are typechecked and built
  Then the handlers compile
  And authorize uses Auth0 PKCE (S256) with audience set to the Port API base
  And callback exchanges code + code_verifier at Auth0 /oauth/token without client_secret
  And configuring PORT_OBSERVATORY_CLIENT_ID is refused

Scenario: Session events survive browser disconnect
  Given an AgentSession streaming via Rivet native realtime
  When the browser disconnects and reconnects
  Then the client resubscribes from the last sequence
  And gap events are applied without duplicates
  And no CopilotKit runtime is required for kernel stream

Scenario: PBI-009 reconnect fixture
  Given MemoryActorTransport seeded with sequences 0..2
  When RivetSessionClient connects then drops live then receives 3..5 then reconnects
  Then lastSequence is 5
  And seen sequences are exactly 0..5

Scenario: Code Atlas four-overlay read projection
  Given the fixture atlas graph with Beads Polygraph Graft Langfuse overlays
  When GET /api/atlas/subgraph is called with role anonymous
  Then proven join edges include sourceSystem sourceId target evidence observedAt
  And unknown joins remain status unknown with null provenance
  And restricted Langfuse cost nodes are redacted
  And Langfuse is not live session owner

Scenario: Code Atlas MCP tools
  Given POST /api/atlas/tools with atlas.find_node / expand_dependencies / get_task_impact / get_related_sessions / get_agent_traces
  When an agent requests traces with asLiveOwner true
  Then the tool refuses with langfuse_not_live_owner
  And other tools return viewport-capped read-only projection data

Scenario: Code Atlas OpenMCP naming and BFF hardening
  Given OpenMCP tools[] lists dotted atlas.* names only
  And factory.atlas_tools.map records Port underscore workflow ids
  When POST /api/atlas/tools uses tool atlas_find_node
  Then the BFF normalizes to atlas.find_node
  And non-JSON content-type is rejected
  And oversized bodies are rejected
```
