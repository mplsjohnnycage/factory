/**
 * AgentSession event shapes shared with PBI-006 sandbox-harness.
 * Kernel wire = Rivet Actor native realtime (ADR-011) — not CopilotKit / AG-UI.
 */

export type SessionEventSender = "client" | "agent" | "system";

export type SessionEvent = {
  /** Monotonic per-session sequence (Rivet Actor persist offset). */
  sequence: number;
  sessionId: string;
  sender: SessionEventSender;
  type: string;
  at: string;
  payload: unknown;
};

export type StreamConnectionState =
  | "idle"
  | "connecting"
  | "live"
  | "reconnecting"
  | "closed"
  | "error";

export type ActorStreamTransport = {
  /**
   * Subscribe to live events with `sequence > afterSequence`.
   * Returns an unsubscribe that closes the live channel.
   */
  subscribe(
    sessionId: string,
    afterSequence: number,
    handlers: {
      onEvent: (event: SessionEvent) => void;
      onError: (error: Error) => void;
      onClose?: () => void;
    },
  ): () => void;

  /** Gap replay: durable events with `sequence > afterSequence`. */
  fetchSince(sessionId: string, afterSequence: number): Promise<SessionEvent[]>;
};
