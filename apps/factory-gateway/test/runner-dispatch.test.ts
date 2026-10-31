import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RunnerDispatcher, runnerDispatchFromEnv } from "../src/runner-dispatch.ts";
import { ProjectSupervisorQueue } from "../src/supervisor.ts";

function fakeFetch(status: number) {
  const calls: { url: string; init: RequestInit }[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(null, { status });
  }) as unknown as typeof fetch;
  return { calls, impl };
}

describe("runner dispatch", () => {
  it("is disabled when env is unset, throws on half config", () => {
    assert.equal(runnerDispatchFromEnv({}), undefined);
    assert.throws(() => runnerDispatchFromEnv({ FACTORY_RUNNER_REPO: "o/r" }));
  });

  it("dispatches factory_job on enqueue with workKey + no token in body", async () => {
    const f = fakeFetch(204);
    const q = new ProjectSupervisorQueue({
      runnerDispatch: new RunnerDispatcher({ repo: "o/r", token: "tok", fetchImpl: f.impl }),
    });
    await q.enqueue({ action: "factory_claim_next_job", runId: "run-1", workKey: "wk-1" });
    assert.equal(f.calls.length, 1);
    assert.equal(f.calls[0].url, "https://api.github.com/repos/o/r/dispatches");
    const body = JSON.parse(String(f.calls[0].init.body));
    assert.equal(body.event_type, "factory_job");
    assert.equal(body.client_payload.workKey, "wk-1");
    assert.equal(body.client_payload.action, "factory_claim_next_job");
    assert.ok(!JSON.stringify(body).includes("tok"));
  });

  it("fails loudly on non-204", async () => {
    const f = fakeFetch(404);
    const q = new ProjectSupervisorQueue({
      runnerDispatch: new RunnerDispatcher({ repo: "o/r", token: "t", fetchImpl: f.impl }),
    });
    await assert.rejects(q.enqueue({ runId: "x" }), /HTTP 404/);
  });

  it("rejects malformed repo", () => {
    assert.throws(() => new RunnerDispatcher({ repo: "bad", token: "t" }));
  });
});
