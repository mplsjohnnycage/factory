import type { ActorStreamTransport, SessionEvent } from "./session-events";

type Sub = {
  sessionId: string;
  afterSequence: number;
  onEvent: (event: SessionEvent) => void;
  onError: (error: Error) => void;
  onClose?: () => void;
  closed: boolean;
};

/**
 * In-process Rivet-shaped AgentSession transport for CI / local dry-runs.
 * Never talks to Sandbox Agent. Never requires CopilotKit.
 */
export class MemoryActorTransport implements ActorStreamTransport {
  readonly #events = new Map<string, SessionEvent[]>();
  readonly #subs = new Set<Sub>();

  seed(sessionId: string, events: SessionEvent[]): void {
    this.#events.set(
      sessionId,
      [...events].sort((a, b) => a.sequence - b.sequence),
    );
  }

  append(event: SessionEvent): void {
    const list = this.#events.get(event.sessionId) ?? [];
    list.push(event);
    list.sort((a, b) => a.sequence - b.sequence);
    this.#events.set(event.sessionId, list);
    for (const sub of this.#subs) {
      if (sub.closed || sub.sessionId !== event.sessionId) continue;
      if (event.sequence > sub.afterSequence) {
        sub.afterSequence = event.sequence;
        sub.onEvent(event);
      }
    }
  }

  /** Simulate transport blip — closes live subs without clearing durable events. */
  dropLive(): void {
    for (const sub of [...this.#subs]) {
      sub.closed = true;
      this.#subs.delete(sub);
      sub.onClose?.();
    }
  }

  async fetchSince(sessionId: string, afterSequence: number): Promise<SessionEvent[]> {
    const list = this.#events.get(sessionId) ?? [];
    return list.filter((e) => e.sequence > afterSequence);
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
    const sub: Sub = {
      sessionId,
      afterSequence,
      onEvent: handlers.onEvent,
      onError: handlers.onError,
      closed: false,
    };
    if (handlers.onClose) sub.onClose = handlers.onClose;
    this.#subs.add(sub);
    return () => {
      sub.closed = true;
      this.#subs.delete(sub);
    };
  }
}
