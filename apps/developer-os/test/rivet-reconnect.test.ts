import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryActorTransport } from "../src/lib/rivet/memory-transport.js";
import { RivetSessionClient } from "../src/lib/rivet/session-client.js";
import type { SessionEvent } from "../src/lib/rivet/session-events.js";

function evt(
  sessionId: string,
  sequence: number,
  type: string,
): SessionEvent {
  return {
    sequence,
    sessionId,
    sender: "agent",
    type,
    at: new Date().toISOString(),
    payload: { sequence },
  };
}

describe("Rivet native reconnect from last sequence", () => {
  it("resubscribes from last sequence without duplicating events", async () => {
    const sessionId = "sess-reconnect-1";
    const transport = new MemoryActorTransport();
    transport.seed(sessionId, [
      evt(sessionId, 0, "session.created"),
      evt(sessionId, 1, "message"),
      evt(sessionId, 2, "message"),
    ]);

    const seen: number[] = [];
    const states: string[] = [];
    const client = new RivetSessionClient({
      sessionId,
      transport,
      onEvent: (e) => seen.push(e.sequence),
      onState: (s) => states.push(s),
    });

    await client.connect();
    assert.equal(client.lastSequence, 2);
    assert.deepEqual(seen, [0, 1, 2]);
    assert.ok(states.includes("live"));

    // Live event while connected
    transport.append(evt(sessionId, 3, "tool"));
    assert.equal(client.lastSequence, 3);
    assert.deepEqual(seen, [0, 1, 2, 3]);

    // Blip: pause live channel; durable store keeps events that arrive offline
    client.pause();
    assert.equal(client.connectionState, "reconnecting");
    transport.append(evt(sessionId, 4, "message"));
    transport.append(evt(sessionId, 5, "checkpoint"));

    await client.reconnect();
    assert.equal(client.connectionState, "live");
    assert.equal(client.lastSequence, 5);
    // No duplicates — only gap 4..5 appended after reconnect
    assert.deepEqual(seen, [0, 1, 2, 3, 4, 5]);
    assert.equal(client.events.length, 6);

    client.close();
    assert.equal(client.connectionState, "closed");
  });

  it("ignores duplicate sequences on reconnect gap replay", async () => {
    const sessionId = "sess-dup";
    const transport = new MemoryActorTransport();
    transport.seed(sessionId, [evt(sessionId, 0, "a"), evt(sessionId, 1, "b")]);

    const client = new RivetSessionClient({ sessionId, transport });
    await client.connect();
    assert.equal(client.lastSequence, 1);

    // Replaying the same durable set must not duplicate
    await client.reconnect();
    assert.equal(client.events.length, 2);
    assert.equal(client.lastSequence, 1);
    client.close();
  });
});

