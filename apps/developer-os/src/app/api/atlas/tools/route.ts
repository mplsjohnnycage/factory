import { NextResponse } from "next/server";
import { invokeAtlasTool, listAtlasMcpTools } from "@/lib/atlas/tools";
import {
  ATLAS_TOOLS_MAX_BODY_BYTES,
  atlasToolNamingMap,
  isJsonContentType,
  normalizeAtlasToolName,
} from "@/lib/atlas/tool-names";
import { resolveAtlasRole } from "@/lib/atlas/session";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

function json(data: unknown, init?: { status?: number }): Response {
  return NextResponse.json(data, {
    status: init?.status,
    headers: NO_STORE_HEADERS,
  });
}

/**
 * GET /api/atlas/tools — list bounded Code Atlas MCP tool names
 * (Port MCP read projection advertise; no live Port schema apply).
 */
export async function GET(): Promise<Response> {
  return json({
    tools: listAtlasMcpTools(),
    naming: {
      openmcp: "dotted",
      portWorkflowId: "underscore",
      map: atlasToolNamingMap(),
    },
    binding: "port-mcp-read-projection",
    langfuseLiveOwner: false,
    note: "Canonical tool names are OpenMCP dotted (atlas.*). Port workflow IDs use underscores; BFF accepts both.",
  });
}

/**
 * POST /api/atlas/tools — invoke one atlas.* tool.
 * Body: { tool, args? } — role is derived from the Port session cookie.
 * Accepts OpenMCP dotted names or Port underscore workflow IDs.
 */
export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type");
  if (!isJsonContentType(contentType)) {
    return json(
      { error: "content-type must be application/json", code: "invalid_content_type" },
      { status: 415 },
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const len = Number(contentLength);
    if (Number.isFinite(len) && len > ATLAS_TOOLS_MAX_BODY_BYTES) {
      return json(
        {
          error: `body exceeds ${ATLAS_TOOLS_MAX_BODY_BYTES} bytes`,
          code: "body_too_large",
        },
        { status: 413 },
      );
    }
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return json({ error: "unable to read body", code: "invalid_body" }, { status: 400 });
  }

  if (rawText.length > ATLAS_TOOLS_MAX_BODY_BYTES) {
    return json(
      {
        error: `body exceeds ${ATLAS_TOOLS_MAX_BODY_BYTES} bytes`,
        code: "body_too_large",
      },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = rawText.length === 0 ? null : JSON.parse(rawText);
  } catch {
    return json({ error: "invalid json", code: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "body required", code: "invalid_body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (typeof record.tool !== "string") {
    return json(
      {
        error: "tool required",
        code: "invalid_args",
        tools: listAtlasMcpTools(),
        naming: atlasToolNamingMap(),
      },
      { status: 400 },
    );
  }

  const tool = normalizeAtlasToolName(record.tool);
  if (!tool) {
    return json(
      {
        error: "unknown tool",
        code: "unknown_tool",
        tools: listAtlasMcpTools(),
        naming: atlasToolNamingMap(),
      },
      { status: 400 },
    );
  }

  const role = await resolveAtlasRole(request);
  const args =
    record.args && typeof record.args === "object" && !Array.isArray(record.args)
      ? (record.args as Record<string, unknown>)
      : undefined;

  const result = invokeAtlasTool({
    tool,
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
    return json(result, { status });
  }

  return json(result);
}
