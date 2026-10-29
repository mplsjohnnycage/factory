import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CALLBACK_PATH,
  DEFAULT_AUTH0_DOMAIN,
  DEFAULT_PORT_API_BASE,
  OBSERVATORY_FORBIDDEN_ENV,
  buildAuthorizeRedirect,
  exchangePortToken,
  pkceChallengeS256,
  randomUrlSafeString,
  resolvePortOAuthConfig,
} from "../src/lib/port-oauth.js";

describe("Port OAuth config + PKCE", () => {
  it("resolves Factory client id and OpenAccess-aligned callback URI", () => {
    const config = resolvePortOAuthConfig({
      PORT_FACTORY_CLIENT_ID: "factory-client-abc",
      NEXT_PUBLIC_DEVOS_URL: "https://devos.example",
    });
    assert.equal(config.clientId, "factory-client-abc");
    assert.equal(config.redirectUri, `https://devos.example${CALLBACK_PATH}`);
    assert.equal(CALLBACK_PATH, "/api/auth/callback");
    assert.match(config.authorizeUrl, new RegExp(`https://${DEFAULT_AUTH0_DOMAIN}/authorize`));
    assert.match(config.tokenUrl, /\/oauth\/token$/);
    assert.equal(config.audience, DEFAULT_PORT_API_BASE);

    const challenge = pkceChallengeS256("test-verifier");
    const loc = buildAuthorizeRedirect(config, "state-1", challenge);
    assert.match(loc, /client_id=factory-client-abc/);
    assert.match(loc, /state=state-1/);
    assert.match(loc, /code_challenge=/);
    assert.match(loc, /code_challenge_method=S256/);
    assert.match(loc, /audience=/);
    assert.match(loc, /redirect_uri=/);
    assert.match(loc, /api%2Fauth%2Fcallback/);
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

  it("generates URL-safe PKCE verifier and S256 challenge", () => {
    const verifier = randomUrlSafeString();
    assert.ok(verifier.length >= 40);
    assert.match(verifier, /^[A-Za-z0-9_-]+$/);
    const challenge = pkceChallengeS256(verifier);
    assert.match(challenge, /^[A-Za-z0-9_-]+$/);
    assert.notEqual(challenge, verifier);
  });

  it("exchanges authorization code without client_secret", async () => {
    const config = resolvePortOAuthConfig({
      PORT_FACTORY_CLIENT_ID: "factory-client-abc",
      NEXT_PUBLIC_DEVOS_URL: "http://localhost:3000",
    });

    let capturedBody = "";
    const fakeFetch: typeof fetch = async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(
        JSON.stringify({
          access_token: "at-1",
          id_token: "id-1",
          refresh_token: "rt-1",
          expires_in: 3600,
          token_type: "Bearer",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const tokens = await exchangePortToken(
      config,
      {
        grant_type: "authorization_code",
        code: "auth-code",
        code_verifier: "verifier-1",
      },
      fakeFetch,
    );

    assert.equal(tokens.access_token, "at-1");
    assert.equal(tokens.refresh_token, "rt-1");
    assert.match(capturedBody, /grant_type=authorization_code/);
    assert.match(capturedBody, /code=auth-code/);
    assert.match(capturedBody, /code_verifier=verifier-1/);
    assert.match(capturedBody, /client_id=factory-client-abc/);
    assert.doesNotMatch(capturedBody, /client_secret/);
  });

  it("surfaces token endpoint errors", async () => {
    const config = resolvePortOAuthConfig({
      PORT_FACTORY_CLIENT_ID: "factory-client-abc",
      NEXT_PUBLIC_DEVOS_URL: "http://localhost:3000",
    });

    const fakeFetch: typeof fetch = async () =>
      new Response(JSON.stringify({ error: "invalid_grant", error_description: "bad code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    await assert.rejects(
      () =>
        exchangePortToken(
          config,
          { grant_type: "authorization_code", code: "x", code_verifier: "y" },
          fakeFetch,
        ),
      /port_token_exchange_failed/,
    );
  });
});
