import type { SessionEvent, SessionEventSender } from "./session-events";
import { appendDemoEvent, getOrCreateDemoTransport } from "./demo-store";

/**
 * Ask Factory → Rivet wiring (FE-198).
 *
 * Live path: RIVET_SERVE_URL set → the BFF appends the client message to the
 * Rivet AgentSession Actor via Tailscale Serve (`/actors/agent-session/:id/events`,
 * the same convention the PBI-009 gap-replay route reads). Agent replies flow back
 * over the existing session stream.
 *
 * Fixture path: Serve unset → Memory Actor demo store with a clearly marked
 * system ack. Display-only; not a second control plane.
 *
 * Hard rules honored: browser never calls Sandbox Agent / Rivet directly; no Port
 * schema writes; no CopilotKit.
 */

export const ASK_SESSION_ID = "factory-ask-cockpit";

export type AskPostResult =
  | { ok: true; mode: "live" | "memory"; events: SessionEvent[] }
  | { ok: false; error: string };

function liveHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  const token = process.env.RIVET_ADMIN_TOKEN?.trim();
  if (token) headers.authorization = `Bearer ${token}`;
  return headers;
}

export function liveRivetBase(): string | null {
  const base = process.env.RIVET_SERVE_URL?.trim();
  return base ? base.replace(/\/$/, "") : null;
}

function makeEvent(
  sessionId: string,
  sequence: number,
  sender: SessionEventSender,
  type: string,
  payload: unknown,
): SessionEvent {
  return {
    sequence,
    sessionId,
    sender,
    type,
    at: new Date().toISOString(),
    payload,
  };
}

async function nextMemorySequence(sessionId: string): Promise<number> {
  const transport = getOrCreateDemoTransport(sessionId);
  const events = await transport.fetchSince(sessionId, -1);
  return (events.at(-1)?.sequence ?? -1) + 1;
}

/** Live gap-replay read used to compute the next append sequence (PBI-009 convention). */
async function liveLastSequence(sessionId: string): Promise<number> {
  const base = liveRivetBase();
  if (!base) return -1;
  try {
    const url = new URL(
      `${base}/actors/agent-session/${encodeURIComponent(sessionId)}/events`,
    );
    url.searchParams.set("after", "-1");
    const res = await fetch(url.toString(), { headers: liveHeaders() });
    if (!res.ok) return -1;
    const body = (await res.json()) as { events?: SessionEvent[] };
    return body.events?.at(-1)?.sequence ?? -1;
  } catch {
    return -1;
  }
}

async function postLive(sessionId: string, text: string): Promise<AskPostResult> {
  const base = liveRivetBase();
  if (!base) return { ok: false, error: "no_live_base" };

  const last = await liveLastSequence(sessionId);
  const event = makeEvent(sessionId, last + 1, "client", "message", { text });
  try {
    const url = `${base}/actors/agent-session/${encodeURIComponent(sessionId)}/events`;
    const res = await fetch(url, {
      method: "POST",
      headers: liveHeaders(),
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      return { ok: false, error: `rivet_serve_http_${res.status}` };
    }
    return { ok: true, mode: "live", events: [event] };
  } catch {
    return { ok: false, error: "rivet_serve_unreachable" };
  }
}

async function appendAskMemory(sessionId: string, text: string): Promise<AskPostResult> {
  const next = await nextMemorySequence(sessionId);
  const clientEvent = makeEvent(sessionId, next, "client", "message", { text });
  const ackEvent = makeEvent(sessionId, next + 1, "system", "ask.ack", {
    text: "Ask received (Memory fixture). Live Rivet Serve is not configured — "
      + "set RIVET_SERVE_URL for real AgentSession routing.",
    source: "memory-fixture",
  });
  appendDemoEvent(sessionId, clientEvent);
  appendDemoEvent(sessionId, ackEvent);
  return { ok: true, mode: "memory", events: [clientEvent, ackEvent] };
}

export async function appendAsk(sessionId: string, text: string): Promise<AskPostResult> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "empty_message" };
  if (trimmed.length > 2000) return { ok: false, error: "message_too_long" };

  if (liveRivetBase()) {
    const live = await postLive(sessionId, trimmed);
    if (live.ok) return live;
    // Live configured but failed → explicit error to the client (never fake live).
    return { ok: false, error: `live_${live.error}` };
  }

  return appendAskMemory(sessionId, trimmed);
}
