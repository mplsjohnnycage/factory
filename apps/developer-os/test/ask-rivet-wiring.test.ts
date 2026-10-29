import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { appendAsk, ASK_SESSION_ID } from "../src/lib/rivet/ask-session.js";

function clearServeEnv(): void {
  delete process.env.RIVET_SERVE_URL;
  delete process.env.RIVET_ADMIN_TOKEN;
}

afterEach(() => {
  clearServeEnv();
});

describe("Ask Factory → Rivet wiring (FE-198)", () => {
  it("fixture mode appends client message plus marked system ack, sequence-safe", async () => {
    const sessionId = ASK_SESSION_ID;
    const first = await appendAsk(sessionId, "  what is the assembly status?  ");
    assert.equal(first.ok, true);
    if (!first.ok) return;

    assert.equal(first.mode, "memory");
    assert.equal(first.events.length, 2);

    const [clientEvent, ackEvent] = first.events;
    assert.equal(clientEvent.sender, "client");
    assert.equal(clientEvent.type, "message");
    assert.equal(clientEvent.payload && (clientEvent.payload as { text: string }).text,
      "what is the assembly status?");

    assert.equal(ackEvent.sender, "system");
    assert.equal(ackEvent.type, "ask.ack");
    const ackPayload = ackEvent.payload as { source: string };
    assert.equal(ackPayload.source, "memory-fixture");

    assert.equal(clientEvent.sequence + 1, ackEvent.sequence);

    // Second ask continues the sequence without collisions.
    const second = await appendAsk(sessionId, "and session health?");
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.events[0].sequence, ackEvent.sequence + 1);
  });

  it("rejects empty and oversized messages", async () => {
    const empty = await appendAsk(ASK_SESSION_ID, "   ");
    assert.deepEqual(empty, { ok: false, error: "empty_message" });

    const long = await appendAsk(ASK_SESSION_ID, "x".repeat(2001));
    assert.deepEqual(long, { ok: false, error: "message_too_long" });
  });

  it("live mode configured but unreachable returns explicit error, not fixture", async () => {
    const original = process.env.RIVET_SERVE_URL;
    process.env.RIVET_SERVE_URL = "http://127.0.0.1:9"; // deterministic closed port
    try {
      const result = await appendAsk(ASK_SESSION_ID, "hello live");
      if (result.ok && result.mode === "live") {
        assert.fail("should not succeed against a closed port");
      }
      if (result.ok) {
        // Extremely unlikely timing failure; treat as pass but flag mode.
        assert.equal(result.mode, "live");
        return;
      }
      assert.ok(result.error.startsWith("live_"));
    } finally {
      if (original === undefined) delete process.env.RIVET_SERVE_URL;
      else process.env.RIVET_SERVE_URL = original;
    }
  });
});
