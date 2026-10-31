import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogWriter, claimNextJob } from "../src/catalog-writer.ts";
import { catalogStoreFromEnv } from "../src/catalog-store.ts";
import { MemoryCatalogStore } from "../src/memory-store.ts";
import { buildDefaultDeps } from "../src/server.ts";
import type { CatalogEntity } from "../src/types.ts";
import {
  WorkflowCatalogStore,
  fetchCatalogWorkflowTransport,
  type CatalogWorkflowEnvelope,
} from "../src/workflow-store.ts";

const ROUND_TRIP_URL = "https://port-workflow.invalid/catalog-round-trip";

function key(blueprint: string, entityIdentifier: string): string {
  return `${blueprint}:${entityIdentifier}`;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Fake Port side of the workflow round-trip: stands in for the `factory_*`
 * workflow's fencing read + UPSERT_ENTITY node. Backed by a Map so tests can
 * assert exactly what would have landed in Port. No live Port calls.
 */
class FakePortWorkflow {
  readonly entities = new Map<string, CatalogEntity>();
  readonly envelopes: CatalogWorkflowEnvelope[] = [];
  upsertDelayMs = 0;

  readonly fetch = async (
    _url: string,
    init?: RequestInit,
  ): Promise<Response> => {
    const envelope = JSON.parse(
      String(init?.body ?? ""),
    ) as CatalogWorkflowEnvelope;
    this.envelopes.push(envelope);

    if (envelope.kind === "catalog_read") {
      const found =
        this.entities.get(
          key(envelope.blueprint, envelope.entityIdentifier),
        ) ?? null;
      return jsonResponse({
        entity: found ? structuredClone(found) : null,
      });
    }

    if (this.upsertDelayMs > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.upsertDelayMs),
      );
    }
    const entity = envelope.entity;
    this.entities.set(
      key(entity.blueprint, entity.entityIdentifier),
      structuredClone(entity),
    );
    return jsonResponse({ ok: true });
  };

  upsertCount(): number {
    return this.envelopes.filter((e) => e.kind === "catalog_upsert").length;
  }

  lastUpsert(): CatalogEntity | undefined {
    const ups = this.envelopes.filter((e) => e.kind === "catalog_upsert");
    return ups[ups.length - 1]?.entity;
  }
}

function workflowStore(fake: FakePortWorkflow): WorkflowCatalogStore {
  return new WorkflowCatalogStore(
    fetchCatalogWorkflowTransport({
      url: ROUND_TRIP_URL,
      fetchImpl: fake.fetch as typeof fetch,
    }),
  );
}

describe("catalog store selection (FACTORY_CATALOG_STORE)", () => {
  it("defaults to the memory store when unset", () => {
    assert.ok(catalogStoreFromEnv({}) instanceof MemoryCatalogStore);
    assert.ok(
      catalogStoreFromEnv({ FACTORY_CATALOG_STORE: "memory" }) instanceof
        MemoryCatalogStore,
    );
  });

  it("selects the workflow store when configured with a round-trip URL", () => {
    const store = catalogStoreFromEnv({
      FACTORY_CATALOG_STORE: "workflow",
      PORT_CATALOG_WORKFLOW_URL: ROUND_TRIP_URL,
    });
    assert.ok(store instanceof WorkflowCatalogStore);
  });

  it("fails closed: workflow selected without a round-trip URL throws", () => {
    assert.throws(
      () => catalogStoreFromEnv({ FACTORY_CATALOG_STORE: "workflow" }),
      /PORT_CATALOG_WORKFLOW_URL/,
    );
    assert.throws(
      () => buildDefaultDeps({ FACTORY_CATALOG_STORE: "workflow" }),
      /PORT_CATALOG_WORKFLOW_URL/,
    );
  });

  it("fails closed: unknown store kind throws", () => {
    assert.throws(
      () => catalogStoreFromEnv({ FACTORY_CATALOG_STORE: "port-rest" }),
      /unknown FACTORY_CATALOG_STORE/,
    );
  });

  it("buildDefaultDeps still wires a writer on the default (memory) store", () => {
    const deps = buildDefaultDeps({});
    assert.ok(deps.writer instanceof CatalogWriter);
  });
});

describe("WorkflowCatalogStore round-trip", () => {
  it("put lands in Port (fake) and get reads it back", async () => {
    const fake = new FakePortWorkflow();
    const store = workflowStore(fake);

    assert.equal(await store.get("executionContract", "c-1"), null);

    await store.put({
      blueprint: "executionContract",
      entityIdentifier: "c-1",
      catalogVersion: 1,
      properties: { catalogVersion: 1, status: "ready" },
    });

    const got = await store.get("executionContract", "c-1");
    assert.equal(got?.catalogVersion, 1);
    assert.equal(got?.properties.status, "ready");
    assert.equal(fake.upsertCount(), 1);
  });

  it("fails closed when the workflow round-trip errors", async () => {
    const failing = new WorkflowCatalogStore(
      fetchCatalogWorkflowTransport({
        url: ROUND_TRIP_URL,
        fetchImpl: (async () =>
          jsonResponse({ error: "boom" }, 500)) as typeof fetch,
      }),
    );
    await assert.rejects(
      () => failing.get("executionContract", "c-1"),
      /HTTP 500/,
    );

    const noAck = new WorkflowCatalogStore(
      fetchCatalogWorkflowTransport({
        url: ROUND_TRIP_URL,
        fetchImpl: (async () =>
          jsonResponse({ ok: false })) as typeof fetch,
      }),
    );
    await assert.rejects(
      () =>
        noAck.put({
          blueprint: "executionContract",
          entityIdentifier: "c-1",
          catalogVersion: 1,
          properties: { catalogVersion: 1 },
        }),
      /did not ack/,
    );
  });
});

describe("CatalogWriter §4.2.1 over the workflow store", () => {
  it("creates with expectedCatalogVersion 0 → upsert carries catalogVersion 1", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    const result = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "c-2",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });

    assert.equal(result.ok, true);
    assert.equal(fake.upsertCount(), 1);
    const upserted = fake.lastUpsert();
    assert.equal(upserted?.catalogVersion, 1);
    assert.equal(upserted?.properties.status, "ready");
    assert.equal(upserted?.properties.catalogVersion, 1);
  });

  it("rejects stale expectedCatalogVersion and sends NO upsert for it", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    const first = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "c-3",
      expectedCatalogVersion: 0,
      patch: { status: "ready", owner: "a" },
    });
    assert.equal(first.ok, true);
    assert.equal(fake.upsertCount(), 1);

    const stale = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "c-3",
      expectedCatalogVersion: 0,
      patch: { status: "claimed", owner: "b" },
    });

    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "stale_catalog_version");
    assert.equal(stale.currentVersion, 1);

    // No partial apply reached Port: still exactly one upsert, bytes unchanged.
    assert.equal(fake.upsertCount(), 1);
    const stored = fake.entities.get(key("executionContract", "c-3"));
    assert.equal(stored?.catalogVersion, 1);
    assert.equal(stored?.properties.owner, "a");
  });

  it("serializes concurrent writers per record — one apply, in order", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-1",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });

    // Slow the Port-side upsert so an unfenced second writer would interleave.
    fake.upsertDelayMs = 25;

    const [a, b] = await Promise.all([
      writer.apply({
        blueprint: "executionAttempt",
        entityIdentifier: "att-1",
        expectedCatalogVersion: 1,
        patch: { status: "claimed", owner: "coder-a" },
      }),
      writer.apply({
        blueprint: "executionAttempt",
        entityIdentifier: "att-1",
        expectedCatalogVersion: 1,
        patch: { status: "claimed", owner: "coder-b" },
      }),
    ]);

    const wins = [a, b].filter((r) => r.ok);
    const losses = [a, b].filter((r) => !r.ok);
    assert.equal(wins.length, 1);
    assert.equal(losses.length, 1);

    // Create + exactly one winning apply reached Port.
    assert.equal(fake.upsertCount(), 2);
    const stored = fake.entities.get(key("executionAttempt", "att-1"));
    assert.equal(stored?.catalogVersion, 2);
    assert.ok(
      stored?.properties.owner === "coder-a" ||
        stored?.properties.owner === "coder-b",
    );
  });

  it("applies sequential writes in order, bumping catalogVersion by 1 each", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    await writer.apply({
      blueprint: "deliveryRun",
      entityIdentifier: "run-1",
      expectedCatalogVersion: 0,
      patch: { status: "queued", note: "first" },
    });
    const second = await writer.apply({
      blueprint: "deliveryRun",
      entityIdentifier: "run-1",
      expectedCatalogVersion: 1,
      patch: { status: "running", note: "second" },
    });
    assert.equal(second.ok, true);

    const stored = fake.entities.get(key("deliveryRun", "run-1"));
    assert.equal(stored?.catalogVersion, 2);
    assert.equal(stored?.properties.status, "running");
    assert.equal(stored?.properties.note, "second");
    assert.equal(fake.upsertCount(), 2);
  });

  it("claim-next mutates lease fields inside the same upsert that bumps catalogVersion", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-2",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });

    const claim = await claimNextJob(writer, {
      blueprint: "executionAttempt",
      entityIdentifier: "att-2",
      expectedCatalogVersion: 1,
      owner: "coder-a",
      leaseEpoch: 7,
    });
    assert.equal(claim.ok, true);

    const upserted = fake.lastUpsert();
    assert.equal(upserted?.catalogVersion, 2);
    assert.equal(upserted?.properties.catalogVersion, 2);
    assert.equal(upserted?.properties.status, "claimed");
    assert.equal(upserted?.properties.owner, "coder-a");
    assert.equal(upserted?.properties.leaseEpoch, 7);
  });

  it("claim race over the workflow store: exactly one claim wins", async () => {
    const fake = new FakePortWorkflow();
    const writer = new CatalogWriter(workflowStore(fake));

    await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-3",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });
    fake.upsertDelayMs = 25;

    const [a, b] = await Promise.all([
      claimNextJob(writer, {
        blueprint: "executionAttempt",
        entityIdentifier: "att-3",
        expectedCatalogVersion: 1,
        owner: "coder-a",
        leaseEpoch: 1,
      }),
      claimNextJob(writer, {
        blueprint: "executionAttempt",
        entityIdentifier: "att-3",
        expectedCatalogVersion: 1,
        owner: "coder-b",
        leaseEpoch: 1,
      }),
    ]);

    assert.equal([a, b].filter((r) => r.ok).length, 1);
    assert.equal([a, b].filter((r) => !r.ok).length, 1);
    const stored = fake.entities.get(key("executionAttempt", "att-3"));
    assert.equal(stored?.catalogVersion, 2);
    assert.equal(stored?.properties.status, "claimed");
  });
});

describe("WorkflowCatalogStore fail-closed hardening", () => {
  const entity: CatalogEntity = {
    blueprint: "executionContract",
    entityIdentifier: "c-9",
    catalogVersion: 1,
    properties: { catalogVersion: 1, owner: "a" },
  };

  it("rejects read responses that omit the entity field", async () => {
    for (const body of [{}, { error: "lookup failed" }]) {
      const store = new WorkflowCatalogStore(
        fetchCatalogWorkflowTransport({
          url: ROUND_TRIP_URL,
          fetchImpl: (async () => jsonResponse(body)) as typeof fetch,
        }),
      );
      await assert.rejects(
        () => store.get("executionContract", "c-9"),
        /missing entity/,
      );
    }
  });

  it("quarantines a record after an ambiguous upsert until the hold expires", async () => {
    let clock = 1_000;
    let failUpsert = true;
    const fake = new FakePortWorkflow();
    const store = new WorkflowCatalogStore(
      fetchCatalogWorkflowTransport({
        url: ROUND_TRIP_URL,
        fetchImpl: (async (url: string, init?: RequestInit) => {
          const env = JSON.parse(String(init?.body)) as CatalogWorkflowEnvelope;
          if (env.kind === "catalog_upsert" && failUpsert) {
            throw new Error("timeout");
          }
          return fake.fetch(url, init);
        }) as typeof fetch,
      }),
      { ambiguousHoldMs: 500, now: () => clock },
    );

    await assert.rejects(() => store.put(entity), /timeout/);

    // Within the hold: a second writer cannot read or write the record.
    await assert.rejects(
      () => store.put({ ...entity, properties: { owner: "b" } }),
      /quarantined/,
    );

    // Hold expires: record usable again.
    clock += 501;
    failUpsert = false;
    await store.put(entity);
    assert.equal((await store.get("executionContract", "c-9"))?.catalogVersion, 1);
  });

  it("reads inside the hold fail closed unless the upsert is visibly applied", async () => {
    const clock = 1_000;
    const fake = new FakePortWorkflow();
    let failUpsert = true;
    const store = new WorkflowCatalogStore(
      fetchCatalogWorkflowTransport({
        url: ROUND_TRIP_URL,
        fetchImpl: (async (url: string, init?: RequestInit) => {
          const env = JSON.parse(String(init?.body)) as CatalogWorkflowEnvelope;
          if (env.kind === "catalog_upsert" && failUpsert) {
            // Late-applying workflow: write lands but ack never arrives.
            await fake.fetch(url, init);
            throw new Error("timeout");
          }
          return fake.fetch(url, init);
        }) as typeof fetch,
      }),
      { ambiguousHoldMs: 500, now: () => clock },
    );
    await assert.rejects(() => store.put(entity), /timeout/);
    failUpsert = false;
    // Applied version visible → reconciled immediately, no waiting.
    assert.equal((await store.get("executionContract", "c-9"))?.catalogVersion, 1);
    await store.put({ ...entity, catalogVersion: 2, properties: { catalogVersion: 2 } });
  });
});
