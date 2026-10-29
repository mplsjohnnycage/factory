import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AgentSessionActor } from "../../sandbox-harness/src/agent-session.js";
import { MemorySandboxLease } from "../../sandbox-harness/src/memory-lease.js";
import {
  admitFromPayload,
  mapToAdmitRequest,
  unwrapAdmitBody,
} from "../src/admit-entry.js";
import { listenAdmitServer } from "../src/admit-http.js";
import type { BdExecResult, BdIssue, BdRunner } from "../src/bd-meta-beads.js";
import {
  createBdSupervisor,
  createMemorySupervisor,
} from "../src/index.js";
import {
  admitAndSpawn,
  SessionSpawnRegistry,
} from "../src/session-spawn.js";
import type { WorkAttempt } from "../src/types.js";

function jsonOut(issues: BdIssue[]): BdExecResult {
  return { exitCode: 0, stdout: JSON.stringify(issues), stderr: "" };
}

describe("mapToAdmitRequest (G6 offline)", () => {
  it("refuses opaque gateway {action,runId} without bead or bypass", () => {
    const mapped = mapToAdmitRequest({
      id: "admit-1",
      receivedAt: "2026-10-29T00:00:00Z",
      actionIdentifier: "factory_start_delivery_run",
      runId: "run-9",
      payload: { action: "factory_start_delivery_run", runId: "run-9" },
    });
    assert.equal(mapped.ok, false);
    if (mapped.ok) return;
    assert.equal(mapped.reason, "claim_or_bypass_required");
  });

  it("maps gateway SupervisorAdmit with bead fields in payload", () => {
    const mapped = mapToAdmitRequest({
      id: "admit-2",
      receivedAt: "2026-10-29T00:00:00Z",
      actionIdentifier: "factory_start_delivery_run",
      runId: "run-42",
      payload: {
        projectId: "meta",
        beadId: "factory-cvl",
        claimedBy: "supervisor",
        claimedAt: "2026-10-29T12:00:00Z",
      },
    });
    assert.equal(mapped.ok, true);
    if (!mapped.ok) return;
    assert.equal(mapped.request.workKey, "run-42");
    assert.equal(mapped.request.taskId, "factory-cvl");
    assert.equal(mapped.request.ready?.beadId, "factory-cvl");
    assert.equal(mapped.request.portAuthorized, true);
  });

  it("maps audited portBypassId without ready", () => {
    const mapped = mapToAdmitRequest({
      projectId: "meta",
      taskId: "bypass-task",
      workKey: "wk-bypass",
      portBypassId: "ec-audit-1",
    });
    assert.equal(mapped.ok, true);
    if (!mapped.ok) return;
    assert.equal(mapped.request.portBypassId, "ec-audit-1");
    assert.equal(mapped.request.ready, undefined);
  });

  it("unwraps gateway admit payload for nested fields", () => {
    const fields = unwrapAdmitBody({
      id: "a1",
      receivedAt: "t",
      runId: "r1",
      payload: { beadId: "factory-x", projectId: "meta" },
    });
    assert.ok(fields);
    assert.equal(fields.beadId, "factory-x");
    assert.equal(fields.runId, "r1");
    assert.equal(fields.admitId, "a1");
  });
});

describe("admitFromPayload + createMemorySupervisor", () => {
  it("admits bead path through Memory Meta Beads", async () => {
    const { supervisor, beads } = createMemorySupervisor();
    beads.seed({
      beadId: "factory-offline",
      projectId: "meta",
      ready: true,
    });

    const result = await admitFromPayload(supervisor, {
      projectId: "meta",
      beadId: "factory-offline",
      workKey: "wk-mem-1",
      claimedBy: "ops",
      claimedAt: "2026-10-29T14:00:00Z",
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.duplicate, false);
    assert.equal(result.attempt.beadId, "factory-offline");
  });

  it("admits bypass path without beads", async () => {
    const { supervisor } = createMemorySupervisor();
    const result = await admitFromPayload(supervisor, {
      projectId: "meta",
      taskId: "t-bypass",
      workKey: "wk-bypass-2",
      portBypassId: "human-audit-9",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.attempt.beadId, "bypass:human-audit-9");
  });
});

describe("admitFromPayload + createBdSupervisor mock runner", () => {
  it("admits ReadyTaskEvent through BdMetaBeads without Port bypass", async () => {
    const store = new Map<string, BdIssue>([
      ["factory-cvl", { id: "factory-cvl", status: "open", assignee: null }],
    ]);
    const runner: BdRunner = {
      async run(args, opts) {
        if (args[0] === "show") {
          const id = args[1]!;
          const issue = store.get(id);
          return issue
            ? jsonOut([issue])
            : { exitCode: 1, stdout: "", stderr: "not found" };
        }
        if (args[0] === "ready") {
          return jsonOut(
            [...store.values()].filter((i) => i.status === "open"),
          );
        }
        if (args[0] === "update" && args.includes("--claim")) {
          const id = args[1]!;
          const issue = store.get(id);
          if (!issue || issue.status !== "open") {
            return { exitCode: 1, stdout: "", stderr: "not claimable" };
          }
          const claimed: BdIssue = {
            ...issue,
            status: "in_progress",
            assignee: opts?.actor ?? "unknown",
            started_at: "2026-10-29T13:00:00Z",
          };
          store.set(id, claimed);
          return jsonOut([claimed]);
        }
        return {
          exitCode: 1,
          stdout: "",
          stderr: `unscripted ${args.join(" ")}`,
        };
      },
    };

    const { supervisor } = createBdSupervisor({ cwd: "/tmp", runner });
    const result = await admitFromPayload(supervisor, {
      id: "gw-admit",
      receivedAt: "2026-10-29T13:00:00Z",
      runId: "bd-entry-run",
      payload: {
        projectId: "meta",
        beadId: "factory-cvl",
        claimedBy: "supervisor",
        claimedAt: "2026-10-29T13:00:00Z",
      },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.attempt.beadId, "factory-cvl");
    assert.equal(store.get("factory-cvl")?.assignee, "supervisor");
  });
});

describe("POST /admit HTTP entry (G6)", () => {
  it("health + admit via ephemeral listen (gateway-forward shape)", async () => {
    const { supervisor, beads } = createMemorySupervisor();
    beads.seed({
      beadId: "factory-http",
      projectId: "meta",
      ready: true,
    });

    const { baseUrl, close } = await listenAdmitServer({ supervisor });
    try {
      const health = await fetch(`${baseUrl}/health`);
      assert.equal(health.status, 200);
      const healthJson = (await health.json()) as {
        ok: boolean;
        service: string;
      };
      assert.equal(healthJson.ok, true);
      assert.equal(healthJson.service, "project-supervisor-admit");

      const res = await fetch(`${baseUrl}/admit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: "forward-1",
          receivedAt: "2026-10-29T15:00:00Z",
          actionIdentifier: "factory_start_delivery_run",
          runId: "http-run-1",
          payload: {
            projectId: "meta",
            beadId: "factory-http",
            claimedBy: "http-ops",
            claimedAt: "2026-10-29T15:00:00Z",
          },
        }),
      });
      assert.equal(res.status, 200);
      const json = (await res.json()) as {
        ok: boolean;
        duplicate: boolean;
        attempt: { beadId: string; workKey: string };
      };
      assert.equal(json.ok, true);
      assert.equal(json.duplicate, false);
      assert.equal(json.attempt.beadId, "factory-http");
      assert.equal(json.attempt.workKey, "http-run-1");

      const bad = await fetch(`${baseUrl}/admit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: "forward-bad",
          receivedAt: "2026-10-29T15:00:00Z",
          runId: "only-run",
          payload: { action: "factory_claim_next_job", runId: "only-run" },
        }),
      });
      assert.equal(bad.status, 400);
      const badJson = (await bad.json()) as { ok: boolean; reason: string };
      assert.equal(badJson.ok, false);
      assert.equal(badJson.reason, "claim_or_bypass_required");
    } finally {
      await close();
    }
  });
});

describe("admitAndSpawn Memory AgentSessionActor (G10 stub)", () => {
  it("admits then creates Memory sandbox session; duplicate does not re-spawn", async () => {
    const { supervisor, beads } = createMemorySupervisor();
    beads.seed({
      beadId: "factory-spawn",
      projectId: "meta",
      ready: true,
    });

    const actors = new Map<string, AgentSessionActor>();
    const spawner = new SessionSpawnRegistry(async (attempt: WorkAttempt) => {
      const lease = new MemorySandboxLease(`memory/${attempt.workAttemptId}`);
      const actor = new AgentSessionActor(lease);
      const identity = await actor.create({
        sessionId: attempt.workAttemptId,
        agent: "mock",
      });
      actors.set(attempt.workAttemptId, actor);
      return {
        workAttemptId: attempt.workAttemptId,
        sessionId: identity.sessionId,
        sandboxId: identity.sandboxId,
        agent: identity.agent,
      };
    });

    const first = await admitAndSpawn(
      supervisor,
      {
        projectId: "meta",
        taskId: "factory-spawn",
        workKey: "wk-spawn-1",
        portAuthorized: true,
        ready: {
          beadId: "factory-spawn",
          projectId: "meta",
          claimedBy: "supervisor",
          claimedAt: "2026-10-29T16:00:00Z",
        },
        claimedBy: "supervisor",
      },
      spawner,
    );

    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.equal(first.spawned, true);
    assert.ok(first.session);
    assert.equal(first.session.sessionId, first.admit.attempt.workAttemptId);
    assert.equal(actors.size, 1);

    const dup = await admitAndSpawn(
      supervisor,
      {
        projectId: "meta",
        taskId: "factory-spawn",
        workKey: "wk-spawn-1",
        portAuthorized: true,
        ready: {
          beadId: "factory-spawn",
          projectId: "meta",
          claimedBy: "supervisor",
          claimedAt: "2026-10-29T16:00:00Z",
        },
        claimedBy: "supervisor",
      },
      spawner,
    );

    assert.equal(dup.ok, true);
    if (!dup.ok) return;
    assert.equal(dup.admit.duplicate, true);
    assert.equal(dup.spawned, false);
    assert.equal(dup.session?.sessionId, first.session?.sessionId);
    assert.equal(actors.size, 1);

    const actor = actors.get(first.admit.attempt.workAttemptId)!;
    const beforeKill = actor.identity();
    await actor.killSandbox();
    const afterKill = actor.identity();
    assert.equal(afterKill.sessionId, beforeKill.sessionId);
    assert.equal(afterKill.sandboxAlive, false);
  });
});
