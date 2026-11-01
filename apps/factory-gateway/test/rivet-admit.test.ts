import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRivetAdmitForwarder, parseRivetEndpoint } from "../src/rivet-admit.js";
import { ProjectSupervisorQueue } from "../src/supervisor.js";

const ENDPOINT = "https://ns-test:sk_fake@api.example.dev/";

describe("rivet admit forwarder", () => {
  it("parses namespace and token out of the endpoint URL", () => {
    assert.deepEqual(parseRivetEndpoint(ENDPOINT), {
      base: "https://api.example.dev",
      namespace: "ns-test",
      token: "sk_fake",
    });
    assert.throws(() => parseRivetEndpoint("https://api.example.dev/"));
  });

  it("posts to the documented queue API with the token header, never in the URL", async () => {
    let seen: { url: string; headers: Record<string, string>; body: unknown } | null = null;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      seen = {
        url,
        headers: init.headers as Record<string, string>,
        body: JSON.parse(String(init.body)),
      };
      return new Response(JSON.stringify({ status: "completed", response: { ok: true } }), { status: 200 });
    }) as unknown as typeof fetch;
    const q = new ProjectSupervisorQueue({
      forwarder: createRivetAdmitForwarder({ endpoint: ENDPOINT, fetchImpl }),
    });
    await q.enqueue({ action: "factory_claim_next_job", runId: "r1" } as never);
    assert.ok(seen);
    const s = seen as { url: string; headers: Record<string, string>; body: any };
    assert.match(s.url, /^https:\/\/api\.example\.dev\/gateway\/projectSupervisor\/queue\/admitFromPayload\?/);
    assert.match(s.url, /rvt-namespace=ns-test/);
    assert.match(s.url, /rvt-key=meta/);
    assert.ok(!s.url.includes("sk_fake"));
    assert.equal(s.headers["x-rivet-token"], "sk_fake");
    assert.equal(s.body.wait, true);
  });

  it("throws on timeout or refusal so the webhook is not silently acked", async () => {
    const mk = (payload: unknown) =>
      createRivetAdmitForwarder({
        endpoint: ENDPOINT,
        fetchImpl: (async () => new Response(JSON.stringify(payload), { status: 200 })) as unknown as typeof fetch,
      });
    const admit = { id: "a", receivedAt: "t", actionIdentifier: "x", payload: {} } as never;
    await assert.rejects(mk({ status: "timedOut" })(admit), /timedOut/);
    await assert.rejects(
      mk({ status: "completed", response: { ok: false, reason: "claim_id_required" } })(admit),
      /claim_id_required/,
    );
  });
});
