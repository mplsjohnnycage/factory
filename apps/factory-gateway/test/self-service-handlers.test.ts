import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogWriter } from "../src/catalog-writer.ts";
import { MemoryCatalogStore } from "../src/memory-store.ts";
import type { ConvexManagementClient } from "../src/convex-management.ts";
import {
  dispatchSelfService,
  verifyHandlerBearer,
} from "../src/self-service-handlers.ts";

function fakeConvex(calls: unknown[]): ConvexManagementClient {
  return {
    async createDeployment(input) {
      calls.push({ op: "createDeployment", input });
      return {
        id: "dep_1",
        name: "happy-otter-123",
        deploymentType: input.type,
        projectId: input.projectId,
        deploymentUrl: "https://happy-otter-123.convex.cloud",
        reference: input.reference ?? null,
        region: "us-east-1",
      };
    },
    async setDefaultEnv(input) {
      calls.push({ op: "setDefaultEnv", input });
    },
  };
}

describe("verifyHandlerBearer", () => {
  it("accepts matching bearer token", () => {
    assert.equal(
      verifyHandlerBearer({
        expectedToken: "tok-abc",
        authorizationHeader: "Bearer tok-abc",
      }),
      true,
    );
  });

  it("rejects wrong or missing token", () => {
    assert.equal(
      verifyHandlerBearer({
        expectedToken: "tok-abc",
        authorizationHeader: "Bearer other",
      }),
      false,
    );
    assert.equal(
      verifyHandlerBearer({
        expectedToken: "tok-abc",
        authorizationHeader: "",
      }),
      false,
    );
    assert.equal(
      verifyHandlerBearer({
        expectedToken: "",
        authorizationHeader: "Bearer tok-abc",
      }),
      false,
    );
  });
});

describe("dispatchSelfService", () => {
  it("rejects Product-lane Prospect / Painter stubs with 501 semantics", async () => {
    const r = await dispatchSelfService({
      action: "ss_prospect_run_discovery",
    });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.error, "product_lane_stub");
      assert.equal(r.lane, "product");
    }
  });

  it("creates Convex preview and projects catalog entity", async () => {
    const calls: unknown[] = [];
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);
    const r = await dispatchSelfService(
      {
        action: "ss_convex_create_preview",
        product: "factory-meta",
        kind: "preview",
        branch: "feat/x",
        convexProjectId: "42",
        runId: "run_1",
      },
      { convex: fakeConvex(calls), writer },
    );
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.result.deploymentName, "happy-otter-123");
    }
    assert.deepEqual(calls[0], {
      op: "createDeployment",
      input: { projectId: "42", type: "preview", reference: "feat/x" },
    });
    const entity = await store.get("convexDeployment", "happy-otter-123");
    assert.ok(entity);
    assert.equal(entity?.properties.deploymentId, "dep_1");
  });

  it("sets Convex default env via Management API", async () => {
    const calls: unknown[] = [];
    const r = await dispatchSelfService(
      {
        action: "ss_convex_set_env",
        product: "factory-meta",
        deployment: "preview",
        key: "SITE_URL",
        value: "https://example.test",
        convexProjectId: 99,
      },
      { convex: fakeConvex(calls) },
    );
    assert.equal(r.ok, true);
    assert.deepEqual(calls[0], {
      op: "setDefaultEnv",
      input: {
        projectId: "99",
        name: "SITE_URL",
        deploymentType: "preview",
        value: "https://example.test",
      },
    });
  });

  it("returns missing_credentials when Convex client absent", async () => {
    const r = await dispatchSelfService(
      {
        action: "ss_convex_create_preview",
        kind: "preview",
        convexProjectId: "1",
      },
      { convex: null, allowMissingCredentials: true },
    );
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, "missing_credentials");
  });
});
