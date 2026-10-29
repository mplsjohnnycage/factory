import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryMetaBeads } from "../src/meta-beads.js";
import { MemoryCatalogWriter } from "../src/memory-catalog.js";
import { ProjectSupervisorActor } from "../src/project-supervisor.js";
import type { ReadyTaskEvent } from "../src/types.js";

function harness() {
  const beads = new MemoryMetaBeads();
  const catalog = new MemoryCatalogWriter();
  const supervisor = new ProjectSupervisorActor({ beads, catalog });
  return { beads, catalog, supervisor };
}

function readyEvent(
  overrides: Partial<ReadyTaskEvent> & Pick<ReadyTaskEvent, "beadId" | "projectId">,
): ReadyTaskEvent {
  return {
    claimedBy: "tester",
    claimedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("duplicate admit → one attempt", () => {
  it("fences identical work.start to a single WorkAttempt", async () => {
    const { beads, supervisor } = harness();
    beads.seed({ beadId: "factory-a1", projectId: "p1", ready: true });

    const req = {
      projectId: "p1",
      taskId: "t1",
      workKey: "task-t1",
      portAuthorized: true,
      ready: readyEvent({ beadId: "factory-a1", projectId: "p1" }),
      claimedBy: "tester",
    };

    const first = await supervisor.admit(req);
    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.equal(first.duplicate, false);

    const second = await supervisor.admit(req);
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.duplicate, true);
    assert.equal(second.attempt.workAttemptId, first.attempt.workAttemptId);
    assert.equal(supervisor.listAttempts().length, 1);
  });
});

describe("claim id required", () => {
  it("refuses admit without beadId or Port bypass", async () => {
    const { supervisor } = harness();
    const result = await supervisor.admit({
      projectId: "p1",
      taskId: "t1",
      workKey: "no-claim",
      portAuthorized: true,
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "claim_id_required");
    assert.equal(supervisor.listAttempts().length, 0);
  });

  it("refuses when Meta Beads reports not ready", async () => {
    const { beads, supervisor } = harness();
    beads.seed({ beadId: "factory-blocked", projectId: "p1", ready: false });
    const result = await supervisor.admit({
      projectId: "p1",
      taskId: "t1",
      workKey: "blocked",
      portAuthorized: true,
      ready: readyEvent({ beadId: "factory-blocked", projectId: "p1" }),
      claimedBy: "tester",
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "bead_not_ready");
  });

  it("admits with audited Port bypass when bead claim absent", async () => {
    const { supervisor, catalog } = harness();
    const result = await supervisor.admit({
      projectId: "p1",
      taskId: "t-force",
      workKey: "forced",
      portAuthorized: true,
      portBypassId: "audit-bypass-99",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.attempt.portBypassId, "audit-bypass-99");
    assert.match(result.attempt.beadId, /^bypass:/);
    assert.ok(catalog.get("executionContract", result.attempt.executionContractId));
  });
});

describe("Port-authorized recover", () => {
  it("preserves attempt identity after recover", async () => {
    const { beads, supervisor, catalog } = harness();
    beads.seed({ beadId: "factory-r1", projectId: "p1", ready: true });
    const admitted = await supervisor.admit({
      projectId: "p1",
      taskId: "t-rec",
      workKey: "recover-me",
      portAuthorized: true,
      ready: readyEvent({ beadId: "factory-r1", projectId: "p1" }),
      claimedBy: "tester",
    });
    assert.equal(admitted.ok, true);
    if (!admitted.ok) return;

    const denied = await supervisor.recover({
      workAttemptId: admitted.attempt.workAttemptId,
      portAuthorized: false,
    });
    assert.equal(denied.ok, false);

    const recovered = await supervisor.recover({
      workAttemptId: admitted.attempt.workAttemptId,
      portAuthorized: true,
    });
    assert.equal(recovered.ok, true);
    if (!recovered.ok) return;
    assert.equal(recovered.attempt.workAttemptId, admitted.attempt.workAttemptId);
    assert.equal(recovered.attempt.status, "recovered");
    assert.equal(
      catalog.get("executionAttempt", recovered.attempt.executionAttemptId)?.properties
        .status,
      "recovered",
    );
  });

  it("refuses admit when Port unauthorized", async () => {
    const { beads, supervisor } = harness();
    beads.seed({ beadId: "factory-u1", projectId: "p1", ready: true });
    const result = await supervisor.admit({
      projectId: "p1",
      taskId: "t1",
      workKey: "unauth",
      portAuthorized: false,
      ready: readyEvent({ beadId: "factory-u1", projectId: "p1" }),
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "not_port_authorized");
  });
});

describe("Port projections", () => {
  it("maps attempt onto executionContract / deliveryRun / executionAttempt", async () => {
    const { beads, supervisor, catalog } = harness();
    beads.seed({
      beadId: "factory-p1",
      projectId: "p1",
      ready: true,
      executionContractId: "ec-custom",
    });
    const result = await supervisor.admit({
      projectId: "p1",
      taskId: "t-proj",
      workKey: "proj-1",
      portAuthorized: true,
      ready: readyEvent({
        beadId: "factory-p1",
        projectId: "p1",
        executionContractId: "ec-custom",
      }),
      claimedBy: "tester",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const snap = catalog.snapshot();
    const blueprints = new Set(snap.map((e) => e.blueprint));
    assert.ok(blueprints.has("executionContract"));
    assert.ok(blueprints.has("deliveryRun"));
    assert.ok(blueprints.has("executionAttempt"));

    const ec = catalog.get("executionContract", "ec-custom");
    assert.equal(ec?.properties.beadId, "factory-p1");
    assert.equal(ec?.properties.workKey, "proj-1");

    const att = catalog.get("executionAttempt", result.attempt.executionAttemptId);
    assert.equal(att?.properties.workAttemptId, result.attempt.workAttemptId);
    assert.equal(att?.properties.beadId, "factory-p1");
  });
});
