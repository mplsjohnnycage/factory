import type { ActorStreamTransport, SessionEvent } from "./session-events";

/**
 * HTTP/SSE transport to Factory BFF → Rivet Actor (Tailscale Serve).
 * Browser calls Developer OS BFF only — never Sandbox Agent, never CopilotKit.
 */
export class HttpActorTransport implements ActorStreamTransport {
  readonly #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl.replace(/\/$/, "");
  }

  async fetchSince(sessionId: string, afterSequence: number): Promise<SessionEvent[]> {
    const url = new URL(
      `${this.#baseUrl}/api/rivet/sessions/${encodeURIComponent(sessionId)}/events`,
    );
    url.searchParams.set("after", String(afterSequence));
    const res = await fetch(url.toString(), { headers: { accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`Rivet fetchSince failed: HTTP ${res.status}`);
    }
    const body = (await res.json()) as { events?: SessionEvent[] };
    return body.events ?? [];
  }

  subscribe(
    sessionId: string,
    afterSequence: number,
    handlers: {
      onEvent: (event: SessionEvent) => void;
      onError: (error: Error) => void;
      onClose?: () => void;
    },
  ): () => void {
    const url = new URL(
      `${this.#baseUrl}/api/rivet/sessions/${encodeURIComponent(sessionId)}/stream`,
    );
    url.searchParams.set("after", String(afterSequence));
    const es = new EventSource(url.toString());

    es.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data) as SessionEvent;
        handlers.onEvent(event);
      } catch (err) {
        handlers.onError(err instanceof Error ? err : new Error(String(err)));
      }
    };
    es.onerror = () => {
      handlers.onError(new Error("EventSource error"));
      es.close();
      handlers.onClose?.();
    };

    return () => {
      es.close();
    };
  }
}
