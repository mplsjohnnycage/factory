import { createClient } from "rivetkit/client";
import type { registry } from "@factory/project-supervisor/rivet";
import type { ActorStreamTransport, SessionEvent } from "./session-events";

/**
 * ActorStreamTransport backed by the real Rivet `agentSession` actor.
 * `endpoint` is the PUBLIC Rivet endpoint (RIVET_PUBLIC_ENDPOINT); never pass
 * the private RIVET_ENDPOINT here — this code can run in the browser.
 */
export function createRivetActorTransport(endpoint: string): ActorStreamTransport {
  const client = createClient<typeof registry>(endpoint);
  const handle = (sessionId: string) =>
    client.agentSession.getOrCreate([sessionId]);

  return {
    subscribe(sessionId, afterSequence, handlers) {
      const conn = handle(sessionId).connect();
      let closed = false;
      conn.on("event", (event: SessionEvent) => {
        if (event.sequence > afterSequence) handlers.onEvent(event);
      });
      conn.onError?.((err: unknown) =>
        handlers.onError(err instanceof Error ? err : new Error(String(err))),
      );
      conn.onClose?.(() => {
        if (!closed) handlers.onClose?.();
      });
      return () => {
        closed = true;
        void conn.dispose?.();
      };
    },
    async fetchSince(sessionId, afterSequence) {
      return (await handle(sessionId).since(afterSequence)) as SessionEvent[];
    },
  };
}
