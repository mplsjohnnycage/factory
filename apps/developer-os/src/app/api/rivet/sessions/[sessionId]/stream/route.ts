import { NextRequest } from "next/server";
import { getOrCreateDemoTransport } from "@/lib/rivet/demo-store";
import { liveRivetBase } from "@/lib/rivet/ask-session";
import type { SessionEvent } from "@/lib/rivet/session-events";

/**
 * SSE live channel for Rivet native session stream (PBI-009 / FE-198).
 * Browser → Dev OS BFF only. Never Sandbox Agent. No CopilotKit.
 *
 * Live mode (RIVET_SERVE_URL set): gap-polls the Rivet Serve AgentSession events
 * endpoint every 2s and forwards durable events — same convention as the
 * gap-replay route. Fixture mode: process-local Memory Actor stream.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const after = Number(req.nextUrl.searchParams.get("after") ?? "-1");
  const liveBase = liveRivetBase();

  if (liveBase) {
    const live = await openLiveStream(req, sessionId, after, liveBase);
    if (live) return live;
    // Live configured but unreachable → explicit failure, never fake live.
    return Response.json(
      { ok: false, error: "live_rivet_serve_unreachable" },
      { status: 502 },
    );
  }

  const transport = getOrCreateDemoTransport(sessionId);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      const send = (event: SessionEvent) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const ping = setInterval(() => {
        controller.enqueue(enc.encode(`: ping\n\n`));
      }, 15000);

      const demoTimer = setTimeout(() => {
        void transport.fetchSince(sessionId, after).then((existing) => {
          const last = existing.at(-1)?.sequence ?? after;
          transport.append({
            sequence: last + 1,
            sessionId,
            sender: "system",
            type: "stream.live",
            at: new Date().toISOString(),
            payload: { note: "live Memory tick" },
          });
        });
      }, 50);

      const unsub = transport.subscribe(sessionId, after, {
        onEvent: send,
        onError: () => {
          clearInterval(ping);
          clearTimeout(demoTimer);
          controller.close();
        },
        onClose: () => {
          clearInterval(ping);
          clearTimeout(demoTimer);
          controller.close();
        },
      });

      req.signal.addEventListener("abort", () => {
        clearInterval(ping);
        clearTimeout(demoTimer);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return sseResponse(stream, "rivet-native");
}

function sseResponse(stream: ReadableStream<Uint8Array>, mode: string): Response {
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-factory-stream": mode,
      "x-factory-no-copilotkit": "1",
    },
  });
}

async function openLiveStream(
  req: NextRequest,
  sessionId: string,
  after: number,
  base: string,
): Promise<Response | null> {
  const headers: Record<string, string> = { accept: "application/json" };
  const token = process.env.RIVET_ADMIN_TOKEN?.trim();
  if (token) headers.authorization = `Bearer ${token}`;

  // Initial reachability probe — fail fast instead of a dead SSE channel.
  try {
    const probe = await fetch(liveEventsUrl(base, sessionId, after).toString(), { headers });
    if (!probe.ok) return null;
    await probe.body?.cancel();
  } catch {
    return null;
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      const send = (event: SessionEvent) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      let cursor = after;
      let stopped = false;

      const poll = setInterval(() => {
        if (stopped) return;
        void (async () => {
          try {
            const res = await fetch(liveEventsUrl(base, sessionId, cursor).toString(), {
              headers,
            });
            if (!res.ok) return;
            const body = (await res.json()) as { events?: SessionEvent[] };
            for (const event of body.events ?? []) {
              if (event.sequence > cursor) {
                cursor = event.sequence;
                send(event);
              }
            }
          } catch {
            /* transient upstream error — next tick retries */
          }
        })();
      }, 2000);

      const ping = setInterval(() => {
        try {
          controller.enqueue(enc.encode(`: ping\n\n`));
        } catch {
          /* stream closed */
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        stopped = true;
        clearInterval(poll);
        clearInterval(ping);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return sseResponse(stream, "rivet-live-proxy");
}

function liveEventsUrl(base: string, sessionId: string, after: number): URL {
  const url = new URL(
    `${base}/actors/agent-session/${encodeURIComponent(sessionId)}/events`,
  );
  url.searchParams.set("after", String(after));
  return url;
}
