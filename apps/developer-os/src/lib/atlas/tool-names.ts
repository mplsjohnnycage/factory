import { ATLAS_MCP_TOOLS, type AtlasMcpTool } from "./types";

/**
 * OpenMCP / BFF logical names are dotted (`atlas.find_node`).
 * Port workflow identifiers disallow `.` and use underscores (`atlas_find_node`).
 * BFF accepts both; responses always echo the canonical dotted name.
 */
export const ATLAS_PORT_WORKFLOW_IDS = [
  "atlas_find_node",
  "atlas_expand_dependencies",
  "atlas_get_task_impact",
  "atlas_get_related_sessions",
  "atlas_get_agent_traces",
] as const;

export type AtlasPortWorkflowId = (typeof ATLAS_PORT_WORKFLOW_IDS)[number];

const DOTTED_TO_PORT: Readonly<Record<AtlasMcpTool, AtlasPortWorkflowId>> = {
  "atlas.find_node": "atlas_find_node",
  "atlas.expand_dependencies": "atlas_expand_dependencies",
  "atlas.get_task_impact": "atlas_get_task_impact",
  "atlas.get_related_sessions": "atlas_get_related_sessions",
  "atlas.get_agent_traces": "atlas_get_agent_traces",
};

const PORT_TO_DOTTED: Readonly<Record<AtlasPortWorkflowId, AtlasMcpTool>> = {
  atlas_find_node: "atlas.find_node",
  atlas_expand_dependencies: "atlas.expand_dependencies",
  atlas_get_task_impact: "atlas.get_task_impact",
  atlas_get_related_sessions: "atlas.get_related_sessions",
  atlas_get_agent_traces: "atlas.get_agent_traces",
};

/** Max POST body bytes for /api/atlas/tools (read-only invoke). */
export const ATLAS_TOOLS_MAX_BODY_BYTES = 64 * 1024;

export function atlasPortWorkflowId(tool: AtlasMcpTool): AtlasPortWorkflowId {
  return DOTTED_TO_PORT[tool];
}

export function atlasToolNamingMap(): ReadonlyArray<{
  openmcp: AtlasMcpTool;
  portWorkflowId: AtlasPortWorkflowId;
}> {
  return ATLAS_MCP_TOOLS.map((openmcp) => ({
    openmcp,
    portWorkflowId: DOTTED_TO_PORT[openmcp],
  }));
}

/**
 * Normalize client/Port tool id to canonical OpenMCP dotted name.
 * Accepts `atlas.find_node` or `atlas_find_node` (and case-insensitive).
 */
export function normalizeAtlasToolName(raw: string): AtlasMcpTool | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if ((ATLAS_MCP_TOOLS as readonly string[]).includes(trimmed)) {
    return trimmed as AtlasMcpTool;
  }

  if ((ATLAS_PORT_WORKFLOW_IDS as readonly string[]).includes(trimmed)) {
    return PORT_TO_DOTTED[trimmed as AtlasPortWorkflowId];
  }

  const lower = trimmed.toLowerCase();
  const dottedHit = ATLAS_MCP_TOOLS.find((t) => t.toLowerCase() === lower);
  if (dottedHit) return dottedHit;

  const underscored = lower.replace(/\./g, "_");
  if ((ATLAS_PORT_WORKFLOW_IDS as readonly string[]).includes(underscored)) {
    return PORT_TO_DOTTED[underscored as AtlasPortWorkflowId];
  }

  return null;
}

export function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const media = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  return media === "application/json" || media.endsWith("+json");
}
