import { NextRequest, NextResponse } from "next/server";
import { appendAsk } from "@/lib/rivet/ask-session";

/**
 * Ask Factory → Rivet AgentSession append (FE-198).
 *
 * BFF-only: the browser never reaches Rivet Serve / Sandbox Agent directly.
 * Live mode proxies to Tailscale Serve when RIVET_SERVE_URL is set; otherwise
 * a clearly-marked Memory fixture ack is appended. Never mutates Port.
 */
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;

  let body: unknown;
  try {
    body = await _req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string") {
    return NextResponse.json({ ok: false, error: "missing_text" }, { status: 400 });
  }

  const result = await appendAsk(sessionId, text);
  if (!result.ok) {
    const status = result.error.startsWith("live_") ? 502 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 202 });
}
