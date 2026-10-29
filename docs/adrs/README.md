# Factory Meta ADRs

Nygard Architecture Decision Records for the Factory kernel (Meta lane).

**Rule:** Bodies are immutable after merge. Supersede with a new ADR. Do not rewrite an Accepted body.

| ADR | File | Status |
|-----|------|--------|
| ADR-001 | [ADR-001-port-system-of-record.md](./ADR-001-port-system-of-record.md) | Accepted |
| ADR-002 | [ADR-002-rivet-execution-kernel.md](./ADR-002-rivet-execution-kernel.md) | Accepted |
| ADR-003 | [ADR-003-port-to-rivet-path.md](./ADR-003-port-to-rivet-path.md) | Accepted |
| ADR-004 | [ADR-004-asdlc-spec-canonical.md](./ADR-004-asdlc-spec-canonical.md) | Accepted |
| ADR-005 | [ADR-005-factory-oauth-deferred.md](./ADR-005-factory-oauth-deferred.md) | Accepted — live |
| ADR-006 | [ADR-006-sandbox-agent-harness.md](./ADR-006-sandbox-agent-harness.md) | Accepted |
| ADR-007 | [ADR-007-developer-os-superseded-by-011.md](./ADR-007-developer-os-superseded-by-011.md) | Superseded by ADR-011 |
| ADR-008 | [ADR-008-visibility-accept-ci-sha.md](./ADR-008-visibility-accept-ci-sha.md) | Accepted |
| ADR-009 | [ADR-009-iso-12207-lifecycle-map.md](./ADR-009-iso-12207-lifecycle-map.md) | Accepted |
| ADR-010 | [ADR-010-chatgpt-plugins-mcp-apps.md](./ADR-010-chatgpt-plugins-mcp-apps.md) | Accepted |
| ADR-011 | [ADR-011-developer-os-next-rivet-native.md](./ADR-011-developer-os-next-rivet-native.md) | Accepted |

Anatomy (required): Title, Status, Context, Decision, Consequences, Alternatives Considered.

Authored under **PBI-002 / STL-163**. OAuth client identifiers stay in the Project-store live record, not in these files.
