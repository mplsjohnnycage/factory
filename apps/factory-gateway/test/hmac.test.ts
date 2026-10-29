import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { portJsonBody, verifyPortWebhookHmac } from "../src/hmac.ts";

function sign(secret: string, timestamp: string, rawBody: string): string {
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64");
  return `v1,${digest}`;
}

describe("verifyPortWebhookHmac", () => {
  const secret = "test-client-secret";
  const body = { action: "factory_start_delivery_run", runId: "run-1" };
  const rawBody = portJsonBody(body);
  const timestamp = "1710000000";

  it("accepts a valid Port v1 signature", () => {
    const signature = sign(secret, timestamp, rawBody);
    assert.equal(
      verifyPortWebhookHmac({
        secret,
        rawBody,
        headers: { signature, timestamp },
      }),
      true,
    );
  });

  it("rejects tampered payload", () => {
    const signature = sign(secret, timestamp, rawBody);
    assert.equal(
      verifyPortWebhookHmac({
        secret,
        rawBody: portJsonBody({ ...body, runId: "evil" }),
        headers: { signature, timestamp },
      }),
      false,
    );
  });

  it("rejects wrong secret", () => {
    const signature = sign(secret, timestamp, rawBody);
    assert.equal(
      verifyPortWebhookHmac({
        secret: "other-secret",
        rawBody,
        headers: { signature, timestamp },
      }),
      false,
    );
  });

  it("rejects missing or malformed signature header", () => {
    assert.equal(
      verifyPortWebhookHmac({
        secret,
        rawBody,
        headers: { signature: "", timestamp },
      }),
      false,
    );
    assert.equal(
      verifyPortWebhookHmac({
        secret,
        rawBody,
        headers: { signature: "v2,abc", timestamp },
      }),
      false,
    );
  });

  it("rejects empty secret", () => {
    const signature = sign(secret, timestamp, rawBody);
    assert.equal(
      verifyPortWebhookHmac({
        secret: "",
        rawBody,
        headers: { signature, timestamp },
      }),
      false,
    );
  });
});
