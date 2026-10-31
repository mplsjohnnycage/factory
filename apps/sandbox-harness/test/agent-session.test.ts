import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AgentSessionActor } from "../src/agent-session.js";
import {
  M1_CODING_AGENT,
  resolveSandboxAgentImage,
  SANDBOX_AGENT_IMAGE_PIN,
  SANDBOX_AGENT_SDK_VERSION,
} from "../src/image-pin.js";
import { containerReachableUrl } from "../src/docker-lease.js";
import { MemorySandboxLease } from "../src/memory-lease.js";

describe("image pin", () => {
  it("pins exact 0.5.4-full (not floating latest/full)", () => {
    assert.equal(SANDBOX_AGENT_IMAGE_PIN, "rivetdev/sandbox-agent:0.5.4-full");
    assert.equal(SANDBOX_AGENT_SDK_VERSION, "0.5.4");
    assert.equal(M1_CODING_AGENT, "claude");
    assert.ok(!SANDBOX_AGENT_IMAGE_PIN.endsWith(":latest"));
    assert.ok(!SANDBOX_AGENT_IMAGE_PIN.endsWith(":full"));
  });

  it("allows SANDBOX_AGENT_IMAGE override without changing default pin", () => {
    assert.equal(resolveSandboxAgentImage({}), SANDBOX_AGENT_IMAGE_PIN);
    assert.equal(
      resolveSandboxAgentImage({ SANDBOX_AGENT_IMAGE: "rivetdev/sandbox-agent:0.5.3-full" }),
      "rivetdev/sandbox-agent:0.5.3-full",
    );
  });
});

describe("create → prompt → stream → checkpoint", () => {
  it("runs full lifecycle and records streamed events + SHA", async () => {
    const lease = new MemorySandboxLease("memory/test-lifecycle");
    const actor = new AgentSessionActor(lease);

    const created = await actor.create({ agent: "mock", sessionId: "sess-1" });
    assert.equal(created.sessionId, "sess-1");
    assert.equal(created.sandboxAlive, true);
    assert.equal(created.sandboxId, "memory/test-lifecycle");
    assert.equal(created.checkpointSha, null);

    const prompt = await actor.prompt("implement hello");
    assert.equal(prompt.stopReason, "end_turn");
    assert.ok(prompt.events.length >= 2);
    assert.ok(actor.events().some((e) => e.type === "prompt"));
    assert.ok(actor.events().some((e) => e.type === "message"));

    const cp = await actor.checkpoint("feat: hello");
    assert.match(cp.sha, /^[0-9a-f]{40}$/);
    assert.equal(actor.identity().checkpointSha, cp.sha);
    assert.ok(actor.events().some((e) => e.type === "checkpoint"));
  });
});

describe("kill preserves session identity", () => {
  it("keeps sessionId + events after kill; drops ephemeral FS", async () => {
    const lease = new MemorySandboxLease("memory/kill-test");
    const actor = new AgentSessionActor(lease);

    await actor.create({ agent: "mock", sessionId: "sess-kill" });
    await actor.prompt("write temp");
    assert.equal(lease.readEphemeral("/tmp/prompt-1.txt"), "write temp");

    const before = actor.identity();
    const eventCountBefore = actor.events().length;
    assert.equal(before.sandboxAlive, true);

    const after = await actor.killSandbox();
    assert.equal(after.sessionId, "sess-kill");
    assert.equal(after.sandboxAlive, false);
    assert.ok(actor.events().length > eventCountBefore);
    assert.ok(actor.events().some((e) => e.type === "sandbox_killed"));
    // Ephemeral FS gone
    assert.equal(lease.readEphemeral("/tmp/prompt-1.txt"), undefined);
    // Identity recoverable
    assert.equal(actor.identity().sessionId, before.sessionId);
    assert.equal(lease.alive, false);
  });

  it("rejects prompt after kill without losing identity", async () => {
    const lease = new MemorySandboxLease();
    const actor = new AgentSessionActor(lease);
    await actor.create({ agent: "mock", sessionId: "sess-dead" });
    await actor.killSandbox();
    await assert.rejects(() => actor.prompt("nope"), /sandbox is dead/);
    assert.equal(actor.identity().sessionId, "sess-dead");
    assert.equal(actor.identity().sandboxAlive, false);
  });
});

describe("gateway URL for container", () => {
  it("rewrites host loopback so the sandbox can reach OmniRoute", () => {
    assert.equal(containerReachableUrl("http://127.0.0.1:20128"), "http://host.docker.internal:20128");
    assert.equal(containerReachableUrl("http://localhost:20128/v1"), "http://host.docker.internal:20128/v1");
    assert.equal(containerReachableUrl("https://omni.example.com"), "https://omni.example.com");
  });
});
