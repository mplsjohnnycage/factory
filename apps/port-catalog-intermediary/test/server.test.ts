import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { intermediaryFromEnv } from "../src/config.ts";
import { createIntermediaryServer } from "../src/server.ts";
import { CatalogTranslator } from "../src/translator.ts";
import type { PortApiClient } from "../src/port-client.ts";
import type { PortEntity, PortRun } from "../src/types.ts";
// The REAL gateway transport + writer — the whole point of option (a) is
// that the unmodified gateway code works against this intermediary.
import {
  WorkflowCatalogStore,
  fetchCatalogWorkflowTransport,
} from "../../factory-gateway/src/workflow-store.ts";
import { CatalogWriter } from "../../factory-gateway/src/catalog-writer.ts";

/** Minimal in-memory Port (entity mode) behind the intermediary server. */
class FakePortEntities implements PortApiClient {
  readonly entities = new Map<string, PortEntity>();
  async startRun(): Promise<string> {
    throw new Error("entity mode must not start runs");
  }
  async getRun(): Promise<PortRun> {
    throw new Error("entity mode must not poll runs");
  }
  async getEntity(blueprint: string, identifier: string): Promise<PortEntity | null> {
    return this.entities.get(`${blueprint}:${identifier}`) ?? null;
  }
  async upsertEntity(blueprint: string, entity: PortEntity): Promise<PortEntity> {
    const stored = { ...entity, blueprint };
    this.entities.set(`${blueprint}:${entity.identifier}`, stored);
    return stored;
  }
}

describe("end-to-end: unmodified gateway WorkflowCatalogStore → intermediary → fake Port", () => {
  let server: Server;
  let baseUrl: string;
  const fakePort = new FakePortEntities();

  before(async () => {
    const translator = new CatalogTranslator({ client: fakePort, mode: "entity" });
    server = createIntermediaryServer(translator);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}/catalog`;
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("health answers", async () => {
    const res = await fetch(baseUrl.replace(/\/catalog$/, "/health"));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { service?: string };
    assert.equal(body.service, "port-catalog-intermediary");
  });

  it("§4.2.1 writer create → +1 version → stale reject never reaches Port", async () => {
    const store = new WorkflowCatalogStore(
      fetchCatalogWorkflowTransport({ url: baseUrl }),
    );
    const writer = new CatalogWriter(store);

    const created = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "smoke-1",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });
    assert.equal(created.ok, true);
    const inPort = fakePort.entities.get("executionContract:smoke-1");
    assert.equal(inPort?.properties.catalogVersion, 1);
    assert.equal(inPort?.properties.status, "ready");

    const stale = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "smoke-1",
      expectedCatalogVersion: 0,
      patch: { status: "claimed" },
    });
    assert.equal(stale.ok, false);
    // Still version 1 in Port — the stale write never landed.
    assert.equal(
      fakePort.entities.get("executionContract:smoke-1")?.properties.catalogVersion,
      1,
    );

    const second = await writer.apply({
      blueprint: "executionContract",
      entityIdentifier: "smoke-1",
      expectedCatalogVersion: 1,
      patch: { status: "claimed" },
    });
    assert.equal(second.ok, true);
    assert.equal(
      fakePort.entities.get("executionContract:smoke-1")?.properties.catalogVersion,
      2,
    );
  });

  it("malformed envelope → 400; unknown route → 404", async () => {
    const bad = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "catalog_delete" }),
    });
    assert.equal(bad.status, 400);
    const missing = await fetch(baseUrl.replace(/\/catalog$/, "/nope"));
    assert.equal(missing.status, 404);
  });
});

describe("config fail-closed (intermediaryFromEnv)", () => {
  it("requires the Port credential names", () => {
    assert.throws(() => intermediaryFromEnv({}), /PORT_CLIENT_ID is required/);
    assert.throws(
      () => intermediaryFromEnv({ PORT_CLIENT_ID: "x" }),
      /PORT_CLIENT_SECRET is required/,
    );
  });

  it("workflow mode (default) requires both workflow ids", () => {
    assert.throws(
      () =>
        intermediaryFromEnv({ PORT_CLIENT_ID: "x", PORT_CLIENT_SECRET: "y" }),
      /PORT_CATALOG_READ_WORKFLOW_ID is required/,
    );
  });

  it("entity mode needs no workflow ids", () => {
    const cfg = intermediaryFromEnv({
      PORT_CLIENT_ID: "x",
      PORT_CLIENT_SECRET: "y",
      PORT_CATALOG_MODE: "entity",
    });
    assert.equal(cfg.port, 8788);
    assert.equal(cfg.host, "127.0.0.1");
  });
});
