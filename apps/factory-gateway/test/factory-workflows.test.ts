import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FACTORY_WORKFLOW_IDS,
  isFactoryWorkflowId,
  resolveFactoryActionIdentifier,
} from "../src/factory-workflows.js";

describe("factory-workflows allowlist", () => {
  it("lists the seven Software Factory workflow IDs", () => {
    assert.equal(FACTORY_WORKFLOW_IDS.length, 7);
    assert.ok(FACTORY_WORKFLOW_IDS.every((id) => id.startsWith("factory_")));
  });

  it("rejects non-factory path suffixes", () => {
    assert.equal(isFactoryWorkflowId("ss_linear_create_issue"), false);
    assert.equal(isFactoryWorkflowId("factory_claim_next_job"), true);
  });

  it("prefers allowlisted path action over body", () => {
    assert.equal(
      resolveFactoryActionIdentifier({
        pathAction: "factory_heartbeat",
        body: { action: "factory_claim_next_job" },
      }),
      "factory_heartbeat",
    );
  });

  it("reads action from classic body / context when path absent", () => {
    assert.equal(
      resolveFactoryActionIdentifier({
        body: { action: "factory_submit_evidence" },
      }),
      "factory_submit_evidence",
    );
    assert.equal(
      resolveFactoryActionIdentifier({
        body: { context: { action: "factory_start_delivery_run" } },
      }),
      "factory_start_delivery_run",
    );
  });
});
