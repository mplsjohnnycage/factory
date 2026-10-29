#!/usr/bin/env node
/**
 * Kit dry-run for OpenAccess + OpenMCP linkage smoke (PBI-010 refresh).
 *
 * Default: verify docs/scripts/source markers + run validate-well-known.mjs
 *           (no Port mutations, no secrets printed).
 * Optional: --memory → run apps/developer-os Port OAuth unit tests.
 * Optional: --live   → HTTP GET raw GitHub main well-knowns (read-only).
 *
 * Does NOT cover Atlas BFF live invoke, gateway Dockerfile health (#82),
 * signed/unsigned Funnel admit, or human Port Sign-in (FE-172 CLOSED).
 *
 * Usage:
 *   node scripts/openaccess-linkage-dry-run.mjs
 *   npm run dry-run:openaccess-linkage
 *   npm run dry-run:openaccess-linkage -- --memory
 *   npm run dry-run:openaccess-linkage -- --live
 *
 * Exit 0 = kit OK (+ optional probes green).
 * Exit 1 = missing/broken kit or probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/openaccess-linkage-smoke.md
 * @see scripts/validate-well-known.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const devOsDir = join(root, "apps/developer-os");
const CALLBACK_PATH = "/api/auth/callback";
const RAW_OPENACCESS =
  "https://raw.githubusercontent.com/mplsjohnnycage/factory/main/.well-known/openaccess.json";
const RAW_OPENMCP =
  "https://raw.githubusercontent.com/mplsjohnnycage/factory/main/.well-known/openmcp.json";

const REQUIRED = [
  {
    path: "docs/ops/openaccess-linkage-smoke.md",
    markers: [
      "OpenAccess",
      "OpenMCP",
      "dry-run:openaccess-linkage",
      "validate-well-known",
      "/api/auth/callback",
      "PORT_FACTORY_CLIENT_ID",
      "observatory_forbidden",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "Dockerfile",
      "atlas-bff",
    ],
  },
  {
    path: "docs/devos-port-oauth-vercel-env.md",
    markers: [
      "PORT_FACTORY_CLIENT_ID",
      "/api/auth/callback",
      "factory-developer-os.vercel.app",
      "PORT_OBSERVATORY_CLIENT_ID",
      "openaccess-linkage",
    ],
  },
  {
    path: ".well-known/openaccess.json",
    markers: [
      '"openaccess": "0.1"',
      "PORT_FACTORY_CLIENT_ID",
      "port_client_id",
      "observatory_forbidden",
      "no_port_oauth_create_delete",
      "/api/auth/callback",
      "factory-developer-os.vercel.app",
    ],
  },
  {
    path: ".well-known/openmcp.json",
    markers: [
      '"openmcp": "0.1"',
      "https://mcp.port.io/v1",
      "no_port_oauth_mutation",
      "atlas.find_node",
      "openmcp-dotted",
    ],
  },
  {
    path: "apps/developer-os/src/lib/port-oauth.ts",
    markers: [
      'CALLBACK_PATH = "/api/auth/callback"',
      "PORT_FACTORY_CLIENT_ID",
      "PORT_OBSERVATORY_CLIENT_ID",
      "FACTORY_PORT_CLIENT_ID_LIVE",
      "CANONICAL_DEVOS_ORIGIN",
      "NEVER",
    ],
  },
  {
    path: "apps/developer-os/src/app/api/auth/callback/route.ts",
    markers: [
      "/api/auth/callback",
      "observatory_forbidden",
      "exchangePortToken",
    ],
  },
  {
    path: "apps/developer-os/src/app/api/auth/port/login/route.ts",
    markers: ["PORT_FACTORY_CLIENT_ID", "Observatory", "buildAuthorizeRedirect"],
  },
  {
    path: "apps/developer-os/test/port-oauth.test.ts",
    markers: [
      "CALLBACK_PATH",
      "/api/auth/callback",
      "Observatory",
      "CANONICAL_DEVOS_ORIGIN",
      "VERCEL_URL",
    ],
  },
  {
    path: "apps/developer-os/.env.example",
    markers: [
      "PORT_FACTORY_CLIENT_ID",
      "Do NOT set PORT_OBSERVATORY_CLIENT_ID",
      "/api/auth/callback",
    ],
  },
  {
    path: "apps/developer-os/README.md",
    markers: [
      "/api/auth/callback",
      "PORT_FACTORY_CLIENT_ID",
      "Observatory",
      "openaccess-linkage",
    ],
  },
  {
    path: "scripts/validate-well-known.mjs",
    markers: [
      "openaccess",
      "openmcp",
      "no_port_oauth_mutation",
      "observatory_forbidden",
      "no_port_oauth_create_delete",
      "port_client_id",
    ],
  },
  {
    path: "scripts/openaccess-linkage-dry-run.mjs",
    markers: [
      "Kit dry-run for OpenAccess + OpenMCP linkage",
      "Exit 0 = kit OK",
    ],
  },
];

/** Reject accidental committed secret assignments in the ops kit surface. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*LINEAR_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*GITHUB_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*client_secret\s*[:=]\s*['"]?[^\s'"#,}]+/i,
];

function parseArgs(argv) {
  let memory = false;
  let live = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/openaccess-linkage-dry-run.mjs [--memory] [--live]
  npm run dry-run:openaccess-linkage -- [--memory] [--live]

Default: kit markers + validate-well-known (no Port mutations).
--memory: also run Developer OS Port OAuth unit tests.
--live:   also GET raw GitHub main well-knowns (read-only).
Does not run Atlas BFF smoke, gateway Dockerfile health (#82), or Funnel admit.`);
      process.exit(0);
    }
    if (arg === "--memory") {
      memory = true;
      continue;
    }
    if (arg === "--live") {
      live = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { memory, live };
}

function loadJson(rel) {
  const abs = join(root, rel);
  return JSON.parse(readFileSync(abs, "utf8"));
}

function assertRedirectAlignment(openaccess) {
  const uris = openaccess.redirect_uris;
  if (!Array.isArray(uris) || uris.length < 1) {
    console.error("FAIL: openaccess.redirect_uris missing/empty");
    return false;
  }
  let ok = true;
  for (const uri of uris) {
    if (typeof uri !== "string" || !uri.endsWith(CALLBACK_PATH)) {
      console.error(
        `FAIL: redirect_uri must end with ${CALLBACK_PATH}: ${JSON.stringify(uri)}`,
      );
      ok = false;
    }
  }
  if (ok) {
    console.log(
      `OK: openaccess.redirect_uris align with CALLBACK_PATH (${uris.length})`,
    );
  }
  return ok;
}

function assertClientIdLinkage(openaccess) {
  const fromAccess = openaccess.factory?.port_client_id;
  const envKey = openaccess.factory?.port_client_id_env;
  if (!fromAccess || typeof fromAccess !== "string") {
    console.error("FAIL: openaccess.factory.port_client_id missing");
    return false;
  }
  if (envKey !== "PORT_FACTORY_CLIENT_ID") {
    console.error(
      `FAIL: openaccess.factory.port_client_id_env expected PORT_FACTORY_CLIENT_ID, got ${JSON.stringify(envKey)}`,
    );
    return false;
  }
  const oauthSrc = readFileSync(
    join(root, "apps/developer-os/src/lib/port-oauth.ts"),
    "utf8",
  );
  if (!oauthSrc.includes(`FACTORY_PORT_CLIENT_ID_LIVE = "${fromAccess}"`)) {
    console.error(
      "FAIL: Dev OS FACTORY_PORT_CLIENT_ID_LIVE does not match OpenAccess port_client_id",
    );
    return false;
  }
  const envExample = readFileSync(
    join(root, "apps/developer-os/.env.example"),
    "utf8",
  );
  if (!envExample.includes(`PORT_FACTORY_CLIENT_ID=${fromAccess}`)) {
    console.error(
      "FAIL: Dev OS .env.example PORT_FACTORY_CLIENT_ID does not match OpenAccess",
    );
    return false;
  }
  console.log(
    "OK: OpenAccess port_client_id ↔ Dev OS FACTORY_PORT_CLIENT_ID_LIVE ↔ .env.example (public PKCE id)",
  );
  return true;
}

let failed = false;
const { memory, live } = parseArgs(process.argv.slice(2));

console.log("=== OpenAccess + OpenMCP linkage kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Atlas BFF live invoke: OUT OF SCOPE (smoke:atlas-bff)");
console.log("Gateway Dockerfile health (#82): OUT OF SCOPE");
console.log("Funnel unsigned/signed admit: OUT OF SCOPE");
console.log("");

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) {
    console.error(`FAIL: missing ${item.path}`);
    failed = true;
    continue;
  }
  const text = readFileSync(abs, "utf8");
  const missing = item.markers.filter((m) => !text.includes(m));
  if (missing.length) {
    console.error(`FAIL: ${item.path} missing markers: ${missing.join(", ")}`);
    failed = true;
    continue;
  }
  console.log(`OK: ${item.path}`);
}

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) continue;
  const text = readFileSync(abs, "utf8");
  for (const re of FORBIDDEN_SECRET_ASSIGNMENTS) {
    if (re.test(text)) {
      console.error(
        `FAIL: ${item.path} appears to assign a secret value (refuse commit)`,
      );
      failed = true;
    }
  }
}

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL: missing package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:openaccess-linkage"];
  if (script !== "node scripts/openaccess-linkage-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:openaccess-linkage"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:openaccess-linkage"]');
  }
  if (pkg.scripts?.["validate:well-known"] !== "node scripts/validate-well-known.mjs") {
    console.error('FAIL: package.json scripts["validate:well-known"] missing or wrong');
    failed = true;
  } else {
    console.log('OK: package.json scripts["validate:well-known"]');
  }
}

try {
  const openaccess = loadJson(".well-known/openaccess.json");
  if (!assertRedirectAlignment(openaccess)) failed = true;
  if (!assertClientIdLinkage(openaccess)) failed = true;
  if (openaccess.factory?.observatory_forbidden !== true) {
    console.error("FAIL: openaccess.factory.observatory_forbidden must be true");
    failed = true;
  } else {
    console.log("OK: openaccess.factory.observatory_forbidden");
  }
  if (openaccess.factory?.no_port_oauth_create_delete !== true) {
    console.error(
      "FAIL: openaccess.factory.no_port_oauth_create_delete must be true",
    );
    failed = true;
  } else {
    console.log("OK: openaccess.factory.no_port_oauth_create_delete");
  }

  const openmcp = loadJson(".well-known/openmcp.json");
  if (openmcp.factory?.no_port_oauth_mutation !== true) {
    console.error("FAIL: openmcp.factory.no_port_oauth_mutation must be true");
    failed = true;
  } else {
    console.log("OK: openmcp.factory.no_port_oauth_mutation");
  }
} catch (err) {
  console.error(`FAIL: well-known parse/linkage — ${err.message}`);
  failed = true;
}

if (failed) {
  console.error("\nFAIL: OpenAccess linkage kit incomplete (before validate-well-known).");
  process.exit(1);
}

console.log("\n== validate-well-known.mjs ==");
const validate = spawnSync(
  process.execPath,
  [join(root, "scripts/validate-well-known.mjs")],
  { cwd: root, stdio: "inherit", env: process.env },
);
if (validate.status !== 0) {
  console.error("\nFAIL: validate-well-known refused.");
  process.exit(validate.status === null ? 1 : validate.status);
}

console.log("\nOK: kit markers + well-known validator green (offline).");

if (live) {
  console.log("\n== live raw GitHub well-knowns (GET only) ==");
  for (const url of [RAW_OPENACCESS, RAW_OPENMCP]) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      if (res.status !== 200) {
        console.error(`FAIL: ${url} → HTTP ${res.status}`);
        failed = true;
        continue;
      }
      const body = await res.text();
      JSON.parse(body);
      if (body.includes("0.0.0-scaffold")) {
        console.error(`FAIL: ${url} still scaffold`);
        failed = true;
        continue;
      }
      console.log(`OK: ${url} → 200 (JSON)`);
    } catch (err) {
      console.error(`FAIL: ${url} — ${err.message}`);
      failed = true;
    }
  }
  if (failed) {
    console.error("\nFAIL: live well-known probe failed.");
    process.exit(1);
  }
}

if (!memory) {
  console.log(
    "SKIP memory probe: pass --memory to run Developer OS Port OAuth unit tests.",
  );
  if (!live) {
    console.log("SKIP live probe: pass --live to GET raw GitHub well-knowns.");
  }
  console.log(
    "\nOK: OpenAccess linkage kit green; Port left untouched; no spend; FE-142/FE-172 closed.",
  );
  process.exit(0);
}

if (!existsSync(join(devOsDir, "package.json"))) {
  console.error("FAIL: apps/developer-os/package.json missing");
  process.exit(1);
}

const needInstall = !existsSync(join(devOsDir, "node_modules"));
if (needInstall) {
  console.log("\n== npm ci @ apps/developer-os ==");
  const ci = spawnSync("npm", ["ci"], {
    cwd: devOsDir,
    stdio: "inherit",
    env: process.env,
  });
  if (ci.status !== 0) {
    console.error("\nFAIL: npm ci in developer-os failed.");
    process.exit(ci.status === null ? 1 : ci.status);
  }
}

console.log("\n== Developer OS Port OAuth unit tests ==");
const test = spawnSync("npm", ["test"], {
  cwd: devOsDir,
  stdio: "inherit",
  env: process.env,
});

if (test.status !== 0) {
  console.error("\nFAIL: Developer OS Port OAuth memory probe failed.");
  process.exit(test.status === null ? 1 : test.status);
}

console.log(
  "\nOK: kit + OpenAccess linkage + Dev OS OAuth gates green; Port left untouched; no Funnel/spend.",
);
process.exit(0);
