import { MemoryActorTransport } from "./memory-transport";
import type { SessionEvent } from "./session-events";

/**
 * Process-local demo Actor store for Vercel preview / CI when Rivet Serve
 * is unreachable. Not a second control plane — display-only fixture.
 */
const globalStore = globalThis as typeof globalThis & {
  __factoryMemoryActors?: Map<string, MemoryActorTransport>;
};

function actors(): Map<string, MemoryActorTransport> {
  if (!globalStore.__factoryMemoryActors) {
    globalStore.__factoryMemoryActors = new Map();
  }
  return globalStore.__factoryMemoryActors;
}

export function getOrCreateDemoTransport(sessionId: string): MemoryActorTransport {
  const map = actors();
  let t = map.get(sessionId);
  if (!t) {
    t = new MemoryActorTransport();
    const seed: SessionEvent[] = [
      {
        sequence: 0,
        sessionId,
        sender: "system",
        type: "session.created",
        at: new Date().toISOString(),
        payload: { source: "demo-memory" },
      },
      {
        sequence: 1,
        sessionId,
        sender: "agent",
        type: "message",
        at: new Date().toISOString(),
        payload: { text: "Factory AgentSession stream (Memory fixture)" },
      },
    ];
    t.seed(sessionId, seed);
    map.set(sessionId, t);
  }
  return t;
}

export function appendDemoEvent(sessionId: string, event: SessionEvent): void {
  getOrCreateDemoTransport(sessionId).append(event);
}
