import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import { after, before, describe, it } from "node:test";
import { AcceptLedger } from "../src/accept-sha.js";
import { CatalogWriter } from "../src/catalog-writer.js";
import { FACTORY_WORKFLOW_IDS } from "../src/factory-workflows.js";
import { portJsonBody } from "../src/hmac.js";
import { MemoryCatalogStore } from "../src/memory-store.js";
import { MemoryOpenFleetLedger } from "../src/openfleet-ledger.js";
import { SlidingWindowRateLimiter } from "../src/rate-limit.js";
import { createGatewayServer, type GatewayDeps } from "../src/server.js";
import { ProjectSupervisorQueue } from "../src/supervisor.js";

function sign(secret: string, timestamp: string, rawBody: string): string {
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64");
  return `v1,${digest}`;
}

function testDeps(secret: string): GatewayDeps {
  return {
    secret,
    writer: new CatalogWriter(new MemoryCatalogStore()),
    supervisor: new ProjectSupervisorQueue(),
    acceptLedger: new AcceptLedger(),
    openFleetLedger: new MemoryOpenFleetLedger(),
    rateLimiter: new SlidingWindowRateLimiter({
      limit: 10_000,
      windowMs: 60_000,
    }),
  };
}

async function listen(server: Server): Promise<{ base: string; close: () => Promise<void> }> {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === "object");
  const base = `http://127.0.0.1:${addr.port}`;
  return {
    base,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

describe("POST /webhooks/port (factory_* WEBHOOK→gateway proof)", () => {
  const secret = "port-webhook-proof-secret";
  let deps: GatewayDeps;
  let base: string;
  let close: () => Promise<void>;

  before(async () => {
    deps = testDeps(secret);
    const server = createGatewayServer(deps);
    ({ base, close } = await listen(server));
  });

  after(async () => {
    await close();
  });

  it("rejects unsigned / bad HMAC without enqueue (rivet-execution scenario)", async () => {
    const beforeCount = deps.supervisor.list().length;
    const rawBody = portJsonBody({ action: "factory_claim_next_job", runId: "r-bad" });
    const res = await fetch(`${base}/webhooks/port`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-port-timestamp": "1710000000",
        "x-port-signature": "v1,not-a-valid-sig",
      },
      body: rawBody,
    });
    assert.equal(res.status, 401);
    const json = (await res.json()) as { ok: boolean; error: string };
    assert.equal(json.ok, false);
    assert.equal(json.error, "invalid_port_signature");
    assert.equal(deps.supervisor.list().length, beforeCount);
  });

  it("accepts signed classic body for every factory_* workflow → 202 enqueue", async () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    for (const action of FACTORY_WORKFLOW_IDS) {
      const rawBody = portJsonBody({
        action,
        runId: `run-${action}`,
        trigger: { by: { orgId: "org_rNq4tjSc8DXL1ceL" } },
      });
      const signature = sign(secret, timestamp, rawBody);
      const res = await fetch(`${base}/webhooks/port`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-port-timestamp": timestamp,
          "x-port-signature": signature,
        },
        body: rawBody,
      });
      assert.equal(res.status, 202, action);
      const json = (await res.json()) as {
        ok: boolean;
        admitId: string;
        actionIdentifier?: string;
      };
      assert.equal(json.ok, true, action);
      assert.ok(json.admitId, action);
      assert.equal(json.actionIdentifier, action, action);
    }
    const actions = deps.supervisor.list().map((a) => a.actionIdentifier);
    for (const action of FACTORY_WORKFLOW_IDS) {
      assert.ok(actions.includes(action), `missing enqueue for ${action}`);
    }
  });

  it("accepts allowlisted path /webhooks/port/<factory_*> when body omits action", async () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const action = "factory_heartbeat";
    const rawBody = portJsonBody({
      runId: "path-run-1",
      payload: { attempt: "att-1", leaseEpoch: 2 },
    });
    const signature = sign(secret, timestamp, rawBody);
    const res = await fetch(`${base}/webhooks/port/${action}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-port-timestamp": timestamp,
        "x-port-signature": signature,
      },
      body: rawBody,
    });
    assert.equal(res.status, 202);
    const json = (await res.json()) as { actionIdentifier?: string };
    assert.equal(json.actionIdentifier, action);
    const last = deps.supervisor.list().at(-1);
    assert.equal(last?.actionIdentifier, action);
    assert.equal(last?.runId, "path-run-1");
  });

  it("404s unknown /webhooks/port/<not-factory_*> paths (no enqueue)", async () => {
    const beforeCount = deps.supervisor.list().length;
    const timestamp = String(Math.floor(Date.now() / 1000));
    const rawBody = portJsonBody({ hello: "world" });
    const signature = sign(secret, timestamp, rawBody);
    const res = await fetch(`${base}/webhooks/port/ss_linear_create_issue`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-port-timestamp": timestamp,
        "x-port-signature": signature,
      },
      body: rawBody,
    });
    assert.equal(res.status, 404);
    assert.equal(deps.supervisor.list().length, beforeCount);
  });
});
