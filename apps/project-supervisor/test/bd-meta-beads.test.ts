import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BdMetaBeads,
  type BdExecResult,
  type BdIssue,
  type BdRunner,
} from "../src/bd-meta-beads.js";
import { createBdSupervisor } from "../src/index.js";
import type { ReadyTaskEvent } from "../src/types.js";

type Scripted = {
  match: (args: string[]) => boolean;
  result: BdExecResult | ((args: string[]) => BdExecResult);
};

function jsonOut(issues: BdIssue[]): BdExecResult {
  return { exitCode: 0, stdout: JSON.stringify(issues), stderr: "" };
}

function scriptedRunner(scripts: Scripted[]): BdRunner & { calls: string[][] } {
  const calls: string[][] = [];
  return {
    calls,
    async run(args) {
      calls.push([...args]);
      for (const script of scripts) {
        if (script.match(args)) {
          return typeof script.result === "function"
            ? script.result(args)
            : script.result;
        }
      }
      return {
        exitCode: 1,
        stdout: "",
        stderr: `unscripted bd ${args.join(" ")}`,
      };
    },
  };
}

describe("BdMetaBeads Meta-only prefix", () => {
  it("refuses Product / non-factory bead ids", async () => {
    const beads = new BdMetaBeads({
      cwd: "/tmp",
      runner: scriptedRunner([]),
    });
    await assert.rejects(
      () => beads.isReady("product-xyz"),
      /never Product Beads/,
    );
    await assert.rejects(
      () => beads.claim("other-1", { projectId: "p1", claimedBy: "a" }),
      /never Product Beads/,
    );
  });
});

describe("BdMetaBeads ready / claim / reclaim", () => {
  it("isReady true for open bead listed by bd ready", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "show" && a[1] === "factory-cvl",
        result: jsonOut([{ id: "factory-cvl", status: "open" }]),
      },
      {
        match: (a) => a[0] === "ready",
        result: jsonOut([
          { id: "factory-cvl", status: "open" },
          { id: "factory-r9f", status: "open" },
        ]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    assert.equal(await beads.isReady("factory-cvl"), true);
  });

  it("isReady false for open bead missing from bd ready (blocked)", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "show",
        result: jsonOut([{ id: "factory-blocked", status: "open" }]),
      },
      {
        match: (a) => a[0] === "ready",
        result: jsonOut([{ id: "factory-other", status: "open" }]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    assert.equal(await beads.isReady("factory-blocked"), false);
  });

  it("isReady true for in_progress (already claimed)", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "show",
        result: jsonOut([
          {
            id: "factory-cvl",
            status: "in_progress",
            assignee: "supervisor",
          },
        ]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    assert.equal(await beads.isReady("factory-cvl"), true);
    assert.equal(await beads.claimHolder("factory-cvl"), "supervisor");
  });

  it("claim runs bd update --claim and returns ReadyTaskEvent", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "show",
        result: jsonOut([{ id: "factory-cvl", status: "open" }]),
      },
      {
        match: (a) => a[0] === "ready",
        result: jsonOut([{ id: "factory-cvl", status: "open" }]),
      },
      {
        match: (a) => a[0] === "update" && a.includes("--claim"),
        result: jsonOut([
          {
            id: "factory-cvl",
            status: "in_progress",
            assignee: "supervisor",
            started_at: "2026-10-29T12:00:00Z",
            metadata: { executionContractId: "ec-from-bead" },
          },
        ]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    const event = await beads.claim("factory-cvl", {
      projectId: "meta",
      claimedBy: "supervisor",
    });
    const expected: ReadyTaskEvent = {
      beadId: "factory-cvl",
      projectId: "meta",
      claimedBy: "supervisor",
      claimedAt: "2026-10-29T12:00:00Z",
      executionContractId: "ec-from-bead",
    };
    assert.deepEqual(event, expected);
    assert.ok(
      runner.calls.some((c) => c[0] === "update" && c.includes("--claim")),
    );
  });

  it("claim throws when another holder owns the bead", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "show",
        result: jsonOut([
          {
            id: "factory-cvl",
            status: "in_progress",
            assignee: "other-agent",
          },
        ]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    await assert.rejects(
      () =>
        beads.claim("factory-cvl", {
          projectId: "meta",
          claimedBy: "supervisor",
        }),
      /already claimed by other-agent/,
    );
  });

  it("reclaim runs bd unclaim", async () => {
    const runner = scriptedRunner([
      {
        match: (a) => a[0] === "unclaim",
        result: jsonOut([{ id: "factory-cvl", status: "open" }]),
      },
    ]);
    const beads = new BdMetaBeads({ cwd: "/tmp", runner });
    await beads.reclaim("factory-cvl");
    assert.deepEqual(runner.calls[0], ["unclaim", "factory-cvl", "--json"]);
  });
});

describe("createBdSupervisor admit dry-run (mock bd)", () => {
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
        return { exitCode: 1, stdout: "", stderr: `unscripted ${args.join(" ")}` };
      },
    };

    const { supervisor, catalog } = createBdSupervisor({
      cwd: "/tmp",
      runner,
    });

    const result = await supervisor.admit({
      projectId: "meta",
      taskId: "factory-cvl-wiring",
      workKey: "bd-admit-dry-run",
      portAuthorized: true,
      ready: {
        beadId: "factory-cvl",
        projectId: "meta",
        claimedBy: "supervisor",
        claimedAt: "2026-10-29T13:00:00Z",
      },
      claimedBy: "supervisor",
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.duplicate, false);
    assert.equal(result.attempt.beadId, "factory-cvl");
    assert.equal(result.attempt.portBypassId, null);
    assert.ok(catalog.get("executionContract", result.attempt.executionContractId));
    assert.equal(store.get("factory-cvl")?.status, "in_progress");
    assert.equal(store.get("factory-cvl")?.assignee, "supervisor");
  });
});
