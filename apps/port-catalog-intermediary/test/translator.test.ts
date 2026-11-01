import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PortApiClient } from "../src/port-client.ts";
import { HttpPortApiClient } from "../src/port-client.ts";
import { CatalogTranslator } from "../src/translator.ts";
import type { PortEntity, PortRun } from "../src/types.ts";

/**
 * Fake Port side. In workflow mode it simulates the two catalog workflows:
 * starting a run records the inputs; the run "executes" asynchronously —
 * the read workflow surfaces the current entity in its output, the upsert
 * workflow applies the entity to the fake Port store on completion.
 * Runs report IN_PROGRESS for `pollsBeforeComplete` polls first.
 */
class FakePort implements PortApiClient {
  readonly entities = new Map<string, PortEntity>();
  readonly startedRuns: Array<{ action: string; inputs: Record<string, unknown> }> = [];
  pollsBeforeComplete = 1;
  failUpsertRuns = false;
  neverComplete = false;
  #runs = new Map<string, { action: string; inputs: Record<string, unknown>; polls: number }>();
  #seq = 0;

  key(bp: string, id: string) {
    return `${bp}:${id}`;
  }

  async startRun(action: string, inputs: Record<string, unknown>): Promise<string> {
    const id = `run-${++this.#seq}`;
    this.startedRuns.push({ action, inputs });
    this.#runs.set(id, { action, inputs, polls: 0 });
    return id;
  }

  async getRun(runId: string): Promise<PortRun> {
    const run = this.#runs.get(runId);
    assert.ok(run, `unknown run ${runId}`);
    run.polls += 1;
    if (this.neverComplete) return { id: runId, status: "IN_PROGRESS" };
    if (run.polls <= this.pollsBeforeComplete) return { id: runId, status: "IN_PROGRESS" };

    if (run.action === "factory_catalog_upsert" && this.failUpsertRuns) {
      return { id: runId, status: "FAILURE" };
    }
    if (run.action === "factory_catalog_read") {
      const found =
        this.entities.get(
          this.key(String(run.inputs.blueprint), String(run.inputs.entityIdentifier)),
        ) ?? null;
      return {
        id: runId,
        status: "COMPLETED",
        output: { entity: found ? structuredClone(found) : null },
      };
    }
    if (run.action === "factory_catalog_upsert") {
      const entity: PortEntity = {
        identifier: String(run.inputs.entityIdentifier),
        blueprint: String(run.inputs.blueprint),
        properties: structuredClone(run.inputs.properties as Record<string, unknown>),
      };
      this.entities.set(this.key(entity.blueprint!, entity.identifier), entity);
      return { id: runId, status: "COMPLETED", output: {} };
    }
    throw new Error(`unexpected action ${run.action}`);
  }

  async getEntity(blueprint: string, identifier: string): Promise<PortEntity | null> {
    return this.entities.get(this.key(blueprint, identifier)) ?? null;
  }

  async upsertEntity(blueprint: string, entity: PortEntity): Promise<PortEntity> {
    const stored = { ...entity, blueprint };
    this.entities.set(this.key(blueprint, entity.identifier), stored);
    return stored;
  }
}

function workflowTranslator(fake: FakePort, extra: Partial<ConstructorParameters<typeof CatalogTranslator>[0]> = {}) {
  return new CatalogTranslator({
    client: fake,
    mode: "workflow",
    readWorkflowId: "factory_catalog_read",
    upsertWorkflowId: "factory_catalog_upsert",
    pollIntervalMs: 1,
    sleep: async () => {},
    ...extra,
  });
}

describe("CatalogTranslator — workflow mode (option (a) core)", () => {
  it("read: starts the read workflow, polls to completion, returns the entity", async () => {
    const fake = new FakePort();
    fake.entities.set("executionContract:c-1", {
      identifier: "c-1",
      blueprint: "executionContract",
      properties: { catalogVersion: 3, status: "ready" },
    });
    const t = workflowTranslator(fake);
    const result = await t.handle({
      kind: "catalog_read",
      blueprint: "executionContract",
      entityIdentifier: "c-1",
    });
    assert.deepEqual(result, {
      entity: {
        blueprint: "executionContract",
        entityIdentifier: "c-1",
        catalogVersion: 3,
        properties: { catalogVersion: 3, status: "ready" },
      },
    });
    assert.equal(fake.startedRuns[0]?.action, "factory_catalog_read");
  });

  it("read: missing entity round-trips as { entity: null }", async () => {
    const t = workflowTranslator(new FakePort());
    const result = await t.handle({
      kind: "catalog_read",
      blueprint: "executionContract",
      entityIdentifier: "nope",
    });
    assert.deepEqual(result, { entity: null });
  });

  it("upsert: starts the upsert workflow with the gateway-approved bytes and acks", async () => {
    const fake = new FakePort();
    const t = workflowTranslator(fake);
    const result = await t.handle({
      kind: "catalog_upsert",
      entity: {
        blueprint: "executionContract",
        entityIdentifier: "c-2",
        catalogVersion: 1,
        properties: { catalogVersion: 1, status: "ready" },
      },
    });
    assert.deepEqual(result, { ok: true });
    assert.equal(fake.startedRuns[0]?.action, "factory_catalog_upsert");
    assert.equal(fake.startedRuns[0]?.inputs.catalogVersion, 1);
    const stored = fake.entities.get("executionContract:c-2");
    assert.equal(stored?.properties.catalogVersion, 1);
    assert.equal(stored?.properties.status, "ready");
  });

  it("failed run throws (gateway will fail closed)", async () => {
    const fake = new FakePort();
    fake.failUpsertRuns = true;
    const t = workflowTranslator(fake);
    await assert.rejects(
      () =>
        t.handle({
          kind: "catalog_upsert",
          entity: {
            blueprint: "executionContract",
            entityIdentifier: "c-3",
            catalogVersion: 1,
            properties: { catalogVersion: 1 },
          },
        }),
      /ended in status "FAILURE"/,
    );
  });

  it("run that never completes times out at the deadline", async () => {
    const fake = new FakePort();
    fake.neverComplete = true;
    let clock = 0;
    const t = workflowTranslator(fake, {
      runDeadlineMs: 100,
      now: () => clock,
      sleep: async () => {
        clock += 60;
      },
    });
    await assert.rejects(
      () => t.handle({ kind: "catalog_read", blueprint: "b", entityIdentifier: "x" }),
      /did not complete within 100ms/,
    );
  });

  it("workflow mode without workflow ids refuses to construct", () => {
    assert.throws(
      () => new CatalogTranslator({ client: new FakePort(), mode: "workflow" }),
      /PORT_CATALOG_READ_WORKFLOW_ID/,
    );
  });
});

describe("CatalogTranslator — entity mode (fallback)", () => {
  it("read maps Port entity → CatalogEntity; 404 → null", async () => {
    const fake = new FakePort();
    fake.entities.set("deliveryRun:r-1", {
      identifier: "r-1",
      blueprint: "deliveryRun",
      properties: { catalogVersion: 2, status: "running" },
    });
    const t = new CatalogTranslator({ client: fake, mode: "entity" });
    const hit = await t.handle({
      kind: "catalog_read",
      blueprint: "deliveryRun",
      entityIdentifier: "r-1",
    });
    assert.deepEqual(hit, {
      entity: {
        blueprint: "deliveryRun",
        entityIdentifier: "r-1",
        catalogVersion: 2,
        properties: { catalogVersion: 2, status: "running" },
      },
    });
    const miss = await t.handle({
      kind: "catalog_read",
      blueprint: "deliveryRun",
      entityIdentifier: "nope",
    });
    assert.deepEqual(miss, { entity: null });
  });

  it("upsert writes catalogVersion into properties", async () => {
    const fake = new FakePort();
    const t = new CatalogTranslator({ client: fake, mode: "entity" });
    await t.handle({
      kind: "catalog_upsert",
      entity: {
        blueprint: "deliveryRun",
        entityIdentifier: "r-2",
        catalogVersion: 5,
        properties: { status: "done" },
      },
    });
    assert.equal(fake.entities.get("deliveryRun:r-2")?.properties.catalogVersion, 5);
  });
});

describe("HttpPortApiClient — auth + run endpoints (fake fetch)", () => {
  function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  it("exchanges client credentials once, caches the token, starts + polls a run", async () => {
    const calls: Array<{ url: string; auth?: string }> = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      calls.push({ url: String(url), auth: headers.authorization });
      if (String(url).endsWith("/v1/auth/access_token")) {
        const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
        assert.equal(body.clientId, "cid");
        assert.equal(body.clientSecret, "csecret");
        return jsonResponse({ accessToken: "tok-1", expiresIn: 3600 });
      }
      if (String(url).includes("/v1/actions/factory_catalog_read/runs")) {
        assert.equal(headers.authorization, "Bearer tok-1");
        return jsonResponse({ id: "run-9" }, 201);
      }
      if (String(url).includes("/v1/actions/runs/run-9")) {
        return jsonResponse({ id: "run-9", status: "COMPLETED", output: { entity: null } });
      }
      throw new Error(`unexpected URL ${url}`);
    }) as typeof fetch;

    const client = new HttpPortApiClient({
      baseUrl: "https://api.getport.io",
      clientId: "cid",
      clientSecret: "csecret",
      fetchImpl,
    });
    const runId = await client.startRun("factory_catalog_read", { blueprint: "b" });
    assert.equal(runId, "run-9");
    const run = await client.getRun(runId);
    assert.equal(run.status, "COMPLETED");
    // Exactly one auth exchange for both calls (token cached).
    assert.equal(calls.filter((c) => c.url.endsWith("/v1/auth/access_token")).length, 1);
  });

  it("auth rejection throws without leaking the secret", async () => {
    const fetchImpl = (async () =>
      jsonResponse({ error: "nope" }, 401)) as unknown as typeof fetch;
    const client = new HttpPortApiClient({
      baseUrl: "https://api.getport.io",
      clientId: "cid",
      clientSecret: "csecret",
      fetchImpl,
    });
    await assert.rejects(() => client.startRun("x", {}), /Port auth failed: HTTP 401/);
  });
});
