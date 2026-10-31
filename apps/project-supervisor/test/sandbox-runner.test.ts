import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AgentSessionActor } from "../../sandbox-harness/src/agent-session.js";
import { MemorySandboxLease } from "../../sandbox-harness/src/memory-lease.js";
import { createMemorySupervisor } from "../src/index.js";
import { SandboxSessionSpawner, type SandboxSession } from "../src/sandbox-runner.js";
import { admitAndSpawn } from "../src/session-spawn.js";

const request = {
  projectId: "meta",
  taskId: "factory-run",
  workKey: "wk-run-1",
  portAuthorized: true,
  ready: {
    beadId: "factory-run",
    projectId: "meta",
    claimedBy: "supervisor",
    claimedAt: "2026-10-31T00:00:00Z",
  },
  claimedBy: "supervisor",
};

function setup(newSession?: () => SandboxSession) {
  const { supervisor, beads, catalog } = createMemorySupervisor();
  beads.seed({ beadId: "factory-run", projectId: "meta", ready: true });
  const actors: AgentSessionActor[] = [];
  const spawner = new SandboxSessionSpawner({
    supervisor,
    newSession:
      newSession ??
      (() => {
        const actor = new AgentSessionActor(new MemorySandboxLease());
        actors.push(actor);
        return actor;
      }),
  });
  return { supervisor, catalog, spawner, actors };
}

describe("SandboxSessionSpawner", () => {
  it("runs an admitted item to completion and records it in Port", async () => {
    const { supervisor, catalog, spawner, actors } = setup();
    const res = await admitAndSpawn(supervisor, request, spawner);
    assert.equal(res.ok && res.spawned, true);
    if (!res.ok) return;

    const outcome = await spawner.whenSettled(res.admit.attempt.workAttemptId);
    assert.ok(outcome?.ok);
    assert.match(outcome.ok ? outcome.checkpointSha : "", /^[0-9a-f]{40}$/);

    const id = res.admit.attempt.workAttemptId;
    assert.equal(supervisor.getAttempt(id)?.status, "completed");
    const att = catalog.get("executionAttempt", res.admit.attempt.executionAttemptId);
    assert.equal(att?.properties.status, "completed");

    const actor = actors[0]!;
    assert.equal(actor.identity().sandboxAlive, false);
    assert.ok(actor.events().some((e) => e.type === "prompt"));
    assert.ok(actor.events().some((e) => e.type === "checkpoint"));
  });

  it("duplicate admit does not start a second sandbox", async () => {
    const { supervisor, spawner, actors } = setup();
    await admitAndSpawn(supervisor, request, spawner);
    const dup = await admitAndSpawn(supervisor, request, spawner);
    assert.equal(dup.ok && dup.spawned, false);
    assert.equal(actors.length, 1);
  });

  it("marks the attempt failed and still kills the sandbox when the agent throws", async () => {
    let killed = false;
    const { supervisor, catalog, spawner } = setup(() => ({
      create: async () => ({ sessionId: "s", sandboxId: "sb", agent: "claude" }),
      prompt: async () => {
        throw new Error("agent crashed");
      },
      checkpoint: async () => ({ sha: "x" }),
      killSandbox: async () => {
        killed = true;
      },
    }));
    const res = await admitAndSpawn(supervisor, request, spawner);
    assert.ok(res.ok);
    if (!res.ok) return;
    const outcome = await spawner.whenSettled(res.admit.attempt.workAttemptId);
    assert.deepEqual(outcome, { ok: false, error: "agent crashed" });
    assert.equal(supervisor.getAttempt(res.admit.attempt.workAttemptId)?.status, "failed");
    assert.equal(
      catalog.get("executionAttempt", res.admit.attempt.executionAttemptId)?.properties.status,
      "failed",
    );
    assert.equal(killed, true);
  });
});
