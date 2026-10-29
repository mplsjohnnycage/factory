import { NextResponse } from "next/server";
import { invokeAtlasTool, listAtlasMcpTools } from "@/lib/atlas/tools";
import type { AtlasAccessRole, AtlasMcpTool } from "@/lib/atlas/types";
import { ATLAS_MCP_TOOLS } from "@/lib/atlas/types";

export const runtime = "nodejs";

/**
 * GET /api/atlas/tools — list bounded Code Atlas MCP tool names
 * (Port MCP read projection advertise; no live Port schema apply).
 */
export async function GET(): Promise<Response> {
  return NextResponse.json({
    tools: listAtlasMcpTools(),
    binding: "port-mcp-read-projection",
    langfuseLiveOwner: false,
    note: "Tools are Dev OS read projection. Port workflow/blueprint apply is Johnny-gated.",
  });
}

/**
 * POST /api/atlas/tools — invoke one atlas.* tool.
 * Body: { tool, args?, role? }
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "body required" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const tool = record.tool;
  if (typeof tool !== "string" || !(ATLAS_MCP_TOOLS as readonly string[]).includes(tool)) {
    return NextResponse.json(
      { error: "unknown tool", tools: listAtlasMcpTools() },
      { status: 400 },
    );
  }

  const role: AtlasAccessRole =
    record.role === "operator" ? "operator" : "anonymous";
  const args =
    record.args && typeof record.args === "object"
      ? (record.args as Record<string, unknown>)
      : undefined;

  const result = invokeAtlasTool({
    tool: tool as AtlasMcpTool,
    args,
    role,
  });

  if (!result.ok) {
    const status =
      result.code === "not_found"
        ? 404
        : result.code === "forbidden"
          ? 403
          : result.code === "langfuse_not_live_owner"
            ? 422
            : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
