import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDemoTransport } from "@/lib/rivet/demo-store";

/**
 * Gap-replay endpoint for Rivet native session stream (PBI-009).
 * Serves durable events with sequence > `after`.
 * Live path may proxy Tailscale Serve; Memory fixture used when Rivet unreachable.
 * Never proxies Sandbox Agent. No CopilotKit.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const after = Number(req.nextUrl.searchParams.get("after") ?? "-1");
  if (!Number.isFinite(after)) {
    return NextResponse.json({ ok: false, error: "invalid_after" }, { status: 400 });
  }

  const rivetBase = process.env.RIVET_SERVE_URL?.trim();
  if (rivetBase) {
    const url = new URL(
      `${rivetBase.replace(/\/$/, "")}/actors/agent-session/${encodeURIComponent(sessionId)}/events`,
    );
    url.searchParams.set("after", String(after));
    try {
      const upstream = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          ...(process.env.RIVET_ADMIN_TOKEN
            ? { authorization: `Bearer ${process.env.RIVET_ADMIN_TOKEN}` }
            : {}),
        },
      });
      if (upstream.ok) {
        const body = await upstream.json();
        return NextResponse.json(body);
      }
    } catch {
      // Fall through to Memory fixture — Dev OS shows reconnectable stream.
    }
  }

  const transport = getOrCreateDemoTransport(sessionId);
  const events = await transport.fetchSince(sessionId, after);
  return NextResponse.json({
    ok: true,
    mode: "memory",
    sessionId,
    after,
    events,
  });
}
