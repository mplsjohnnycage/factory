/**
 * Code Atlas four-overlay types (STL-154 / Developer OS M4).
 *
 * Overlays are separate graphs. Cross-overlay edges are either
 * source-proven (full provenance) or unknown — never invented authority.
 * Langfuse is historical observability only, never live session owner.
 */

export const ATLAS_OVERLAYS = [
  "beads",
  "polygraph",
  "graft",
  "langfuse",
] as const;

export type AtlasOverlay = (typeof ATLAS_OVERLAYS)[number];

export type AtlasAccessRole = "anonymous" | "operator";

/** Provenance required for a source-proven join edge. */
export type JoinProvenance = {
  sourceSystem: string;
  sourceId: string;
  target: string;
  evidence: string;
  observedAt: string;
};

export type AtlasNodeSensitivity = "public" | "operator" | "restricted";

export type AtlasNode = {
  id: string;
  overlay: AtlasOverlay;
  kind: string;
  label: string;
  sourceSystem: string;
  sourceId: string;
  sensitivity: AtlasNodeSensitivity;
  /** Layout hint for hero SVG (optional). */
  x?: number;
  y?: number;
  attrs?: Record<string, unknown>;
};

export type JoinStatus = "proven" | "unknown";

export type AtlasEdge = {
  id: string;
  from: string;
  to: string;
  kind: string;
  /** Cross-overlay vs intra-overlay. */
  scope: "intra" | "cross";
  status: JoinStatus;
  /**
   * Proven joins MUST carry full provenance.
   * Unknown joins keep provenance null and must not be treated as authority.
   */
  provenance: JoinProvenance | null;
};

export type AtlasGraph = {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
};

export type AtlasSubgraph = AtlasGraph & {
  levels: AtlasOverlay[];
  focus: string | null;
  depth: number;
  maxNodes: number;
  truncated: boolean;
  /** Explicit unknown join ids kept visible as non-authority. */
  unknownJoinIds: string[];
};

export const ATLAS_MCP_TOOLS = [
  "atlas.find_node",
  "atlas.expand_dependencies",
  "atlas.get_task_impact",
  "atlas.get_related_sessions",
  "atlas.get_agent_traces",
] as const;

export type AtlasMcpTool = (typeof ATLAS_MCP_TOOLS)[number];

export type AtlasToolRequest = {
  tool: AtlasMcpTool;
  args?: Record<string, unknown>;
  role?: AtlasAccessRole;
};

export type AtlasToolResult = {
  tool: AtlasMcpTool;
  ok: true;
  data: unknown;
  redactions: string[];
};

export type AtlasToolError = {
  tool: AtlasMcpTool;
  ok: false;
  error: string;
  code:
    | "unknown_tool"
    | "not_found"
    | "forbidden"
    | "invalid_args"
    | "langfuse_not_live_owner";
};

export function isAtlasOverlay(value: string): value is AtlasOverlay {
  return (ATLAS_OVERLAYS as readonly string[]).includes(value);
}

export function assertNever(x: never): never {
  throw new Error(`unexpected atlas variant: ${String(x)}`);
}
