import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OBSERVATORY_FORBIDDEN_ENV,
  buildAuthorizeRedirect,
  resolvePortOAuthConfig,
} from "../src/lib/port-oauth.js";

describe("Port OAuth stub config", () => {
  it("resolves Factory client id and callback URI", () => {
    const config = resolvePortOAuthConfig({
      PORT_FACTORY_CLIENT_ID: "factory-client-abc",
      NEXT_PUBLIC_DEVOS_URL: "https://devos.example",
    });
    assert.equal(config.clientId, "factory-client-abc");
    assert.equal(config.redirectUri, "https://devos.example/api/auth/port/callback");
    const loc = buildAuthorizeRedirect(config, "state-1");
    assert.match(loc, /client_id=factory-client-abc/);
    assert.match(loc, /state=state-1/);
    assert.match(loc, /redirect_uri=/);
  });

  it("refuses Observatory client env", () => {
    assert.throws(
      () =>
        resolvePortOAuthConfig({
          PORT_FACTORY_CLIENT_ID: "factory-ok",
          [OBSERVATORY_FORBIDDEN_ENV]: "observatory-bad",
        }),
      /Observatory/,
    );
  });

  it("requires Factory client id", () => {
    assert.throws(() => resolvePortOAuthConfig({}), /PORT_FACTORY_CLIENT_ID/);
  });
});
