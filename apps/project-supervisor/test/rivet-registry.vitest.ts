import { expect, test as base } from "vitest";

// Needs a bootable local Rivet engine (npm run test:rivet with RIVET_TEST_ENGINE=1).
const test = base.skipIf(!process.env.RIVET_TEST_ENGINE);
import { setupTest } from "rivetkit/test";
import { registry } from "../src/rivet-registry.js";

test("projectSupervisor fences duplicate workKey via the queue", async (t) => {
  const { client } = await setupTest(t, registry);
  const h = client.projectSupervisor.getOrCreate(["proj-1"]);
  const req = {
    projectId: "proj-1",
    taskId: "t1",
    workKey: "wk-1",
    portAuthorized: true,
    portBypassId: "bypass-1",
  };
  const [a, b] = await Promise.all([
    h.send("admit", req, { wait: true, timeout: 5_000 }),
    h.send("admit", req, { wait: true, timeout: 5_000 }),
  ]);
  expect(a.status).toBe("completed");
  expect(b.status).toBe("completed");
  const results = [a, b].map((r) => (r as any).response);
  expect(results.every((r: any) => r.ok)).toBe(true);
  expect(results.filter((r: any) => r.duplicate).length).toBe(1);
  expect(results[0].attempt.workAttemptId).toBe(results[1].attempt.workAttemptId);
  expect((await h.listAttempts()).length).toBe(1);
});

test("admit refuses without Port authorization", async (t) => {
  const { client } = await setupTest(t, registry);
  const h = client.projectSupervisor.getOrCreate(["proj-2"]);
  const r: any = await h.send(
    "admit",
    { projectId: "proj-2", taskId: "t", workKey: "wk", portAuthorized: false },
    { wait: true, timeout: 5_000 },
  );
  expect(r.response).toEqual({ ok: false, reason: "not_port_authorized" });
});

test("agentSession assigns monotonic sequence and replays since", async (t) => {
  const { client } = await setupTest(t, registry);
  const h = client.agentSession.getOrCreate(["s1"]);
  await h.append({ sender: "client", type: "msg", payload: 1 });
  await h.append({ sender: "agent", type: "msg", payload: 2 });
  const since = await h.since(0);
  expect(since.map((e: any) => e.sequence)).toEqual([1]);
  expect((await h.since(-1)).length).toBe(2);
});
