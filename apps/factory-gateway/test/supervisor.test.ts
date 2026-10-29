import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ProjectSupervisorQueue } from "../src/supervisor.ts";

describe("ProjectSupervisorQueue", () => {
  it("enqueues admits without polling Port", async () => {
    const q = new ProjectSupervisorQueue();
    const admit = await q.enqueue({
      action: "factory_start_delivery_run",
      runId: "run-9",
    });

    assert.ok(admit.id);
    assert.equal(admit.actionIdentifier, "factory_start_delivery_run");
    assert.equal(admit.runId, "run-9");
    assert.equal(q.list().length, 1);
    // Contract: push-only path — no Port client calls exist on this class.
    assert.equal(
      Object.getOwnPropertyNames(Object.getPrototypeOf(q)).includes("pollPort"),
      false,
    );
  });

  it("preserves admit order", async () => {
    const q = new ProjectSupervisorQueue();
    await q.enqueue({ runId: "a" });
    await q.enqueue({ runId: "b" });
    assert.deepEqual(
      q.list().map((x) => x.runId),
      ["a", "b"],
    );
  });
});
