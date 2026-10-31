import { actor } from "rivetkit";

/** Mirrors developer-os `SessionEvent` (ADR-011 / PBI-009). Keep in sync. */
export type AgentSessionEvent = {
  sequence: number;
  sessionId: string;
  sender: "client" | "agent" | "system";
  type: string;
  at: string;
  payload: unknown;
};

export type AppendInput = Pick<AgentSessionEvent, "sender" | "type" | "payload">;

/**
 * Rivet-native AgentSession (ADR-011): one actor per session, key = [sessionId].
 * Append-only event log with a monotonic `sequence`; live fan-out via the
 * "event" broadcast, gap replay via `since(afterSequence)`. Browser never talks
 * to Sandbox Agent; the harness/gateway appends, Developer OS subscribes.
 */
export const agentSession = actor({
  state: { events: [] as AgentSessionEvent[], nextSequence: 0 },
  actions: {
    append: (c, input: AppendInput): AgentSessionEvent => {
      const event: AgentSessionEvent = {
        sequence: c.state.nextSequence,
        sessionId: String(c.key[0] ?? ""),
        sender: input.sender,
        type: input.type,
        at: new Date().toISOString(),
        payload: input.payload,
      };
      c.state.nextSequence += 1;
      c.state.events.push(event);
      c.broadcast("event", event);
      return event;
    },
    since: (c, afterSequence: number): AgentSessionEvent[] =>
      c.state.events.filter((e) => e.sequence > afterSequence),
  },
});
