import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CALLBACK_PATH,
  CANONICAL_DEVOS_ORIGIN,
  DEFAULT_AUTH0_DOMAIN,
  DEFAULT_PORT_API_BASE,
  OBSERVATORY_FORBIDDEN_ENV,
  buildAuthorizeRedirect,
  exchangePortToken,
  pkceChallengeS256,
  randomUrlSafeString,
  resolveDevOsOrigin,
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

  it("prefers NEXT_PUBLIC_DEVOS_URL over VERCEL_URL", () => {
    assert.equal(
      resolveDevOsOrigin({
        NEXT_PUBLIC_DEVOS_URL: "https://factory-developer-os.vercel.app/",
        VERCEL_URL: "factory-developer-deadbeef-johnnyc.vercel.app",
        VERCEL: "1",
        VERCEL_ENV: "production",
      }),
      CANONICAL_DEVOS_ORIGIN,
    );
  });

  it("pins production to canonical origin — never VERCEL_URL", () => {
    const origin = resolveDevOsOrigin({
      VERCEL: "1",
      VERCEL_ENV: "production",
      VERCEL_URL: "factory-developer-4vf3fb75w-johnnyc.vercel.app",
      NODE_ENV: "production",
    });
    assert.equal(origin, CANONICAL_DEVOS_ORIGIN);

    const config = resolvePortOAuthConfig({
      PORT_FACTORY_CLIENT_ID: "factory-client-abc",
      VERCEL: "1",
      VERCEL_ENV: "production",
      VERCEL_URL: "factory-developer-4vf3fb75w-johnnyc.vercel.app",
      NODE_ENV: "production",
    });
    assert.equal(
      config.redirectUri,
      `${CANONICAL_DEVOS_ORIGIN}${CALLBACK_PATH}`,
    );
    assert.doesNotMatch(config.redirectUri, /4vf3fb75w/);
  });

  it("allows VERCEL_URL fallback only on preview when pin unset", () => {
    assert.equal(
      resolveDevOsOrigin({
        VERCEL: "1",
        VERCEL_ENV: "preview",
        VERCEL_URL: "factory-developer-preview-johnnyc.vercel.app",
      }),
      "https://factory-developer-preview-johnnyc.vercel.app",
    );
  });

  it("defaults to localhost off Vercel", () => {
    assert.equal(resolveDevOsOrigin({}), "http://localhost:3000");
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
