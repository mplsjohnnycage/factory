#!/usr/bin/env node
/**
 * Kit dry-run for factory-gateway Dockerfile + /health ops checklist.
 *
 * Default: verify docs/scripts/source markers (no network, no secrets, no Port).
 * Optional: --lint → structural Dockerfile contract checks (no docker build).
 *
 * Does NOT cover Funnel unsigned/signed admit, remount live BASE_URL, Windows
 * logon, Rivet Compose/Serve, or BdMetaBeads kits.
 *
 * Usage:
 *   node scripts/gateway-dockerfile-health-dry-run.mjs
 *   npm run dry-run:gateway-dockerfile-health
 *   npm run dry-run:gateway-dockerfile-health -- --lint
 *
 * Exit 0 = kit OK (+ Dockerfile lint green when --lint).
 * Exit 1 = missing/broken kit or lint fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/gateway-dockerfile-health.md
 * @see apps/factory-gateway/Dockerfile
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "docs/ops/gateway-dockerfile-health.md",
    markers: [
      "Audience:** Projects Manager",
      "dry-run:gateway-dockerfile-health",
      "HEALTHCHECK",
      "factory-gateway",
      "FE-142",
      "FE-172",
      "Do not ask Johnny",
      "Port schema",
      "gateway-remount-dry-run",
      "non-root",
    ],
  },
  {
    path: "apps/factory-gateway/Dockerfile",
    markers: [
      "node:20-alpine",
      "AS deps",
      "AS build",
      "AS runtime",
      "adduser -S -G factory factory",
      "USER factory",
      "EXPOSE 8787",
      "HEALTHCHECK",
      "/health",
      '"node", "dist/index.js"',
    ],
  },
  {
    path: "apps/factory-gateway/src/server.ts",
    markers: [
      'pathname === "/health"',
      'service: "factory-gateway"',
      "ok: true",
    ],
  },
  {
    path: "apps/factory-gateway/README.md",
    markers: [
      "Dockerfile",
      "HEALTHCHECK",
      "GET /health",
      "docker build",
      "--profile gateway",
      "factory-gateway",
    ],
  },
  {
    path: "compose/docker-compose.yml",
    markers: [
      'profiles: ["gateway"]',
      "factory-gateway",
      "../apps/factory-gateway",
      "dockerfile: Dockerfile",
      "8787",
      "/health",
    ],
  },
  {
    path: "docs/gateway-remount-dry-run.md",
    markers: [
      "GET /health",
      "factory-gateway",
      "do not remount",
      "FACTORY_GATEWAY_BASE_URL",
    ],
  },
  {
    path: "scripts/gateway-dockerfile-health-dry-run.mjs",
    markers: [
      "Kit dry-run for factory-gateway Dockerfile",
      "Exit 0 = kit OK",
    ],
  },
];

/** Reject accidental committed secret assignments in the ops kit docs/scripts. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*RIVET_ADMIN_TOKEN\s*=\s*['"]?(?!replace-with-)[^\s'"#]{16,}/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
];

function parseArgs(argv) {
  let lint = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/gateway-dockerfile-health-dry-run.mjs [--lint]
  npm run dry-run:gateway-dockerfile-health -- [--lint]

Default: kit markers only (no Docker required).
--lint: structural Dockerfile contract (stages, USER, HEALTHCHECK) — no docker build.`);
      process.exit(0);
    }
    if (arg === "--lint") {
      lint = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { lint };
}

let failed = false;
const { lint } = parseArgs(process.argv.slice(2));

console.log("=== factory-gateway Dockerfile + /health kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 human Sign-in: CLOSED (do not ask Johnny)");
console.log("Live docker build / Funnel: OPERATOR ONLY");
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

if (failed) {
  console.error("\nFAIL: gateway Dockerfile/health kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!lint) {
  console.log(
    "SKIP Dockerfile lint: pass --lint for structural Dockerfile contract.",
  );
  process.exit(0);
}

console.log("\n== Dockerfile structural lint ==");
const dockerfile = readFileSync(
  join(root, "apps/factory-gateway/Dockerfile"),
  "utf8",
);

const stageMatches = [...dockerfile.matchAll(/^FROM\s+\S+\s+AS\s+(\S+)/gim)];
const stageNames = stageMatches.map((m) => m[1]);
const expectedStages = ["deps", "build", "runtime"];
for (const name of expectedStages) {
  if (!stageNames.includes(name)) {
    console.error(`FAIL: Dockerfile missing stage AS ${name}`);
    failed = true;
  }
}
if (!failed) {
  console.log(`OK: stages ${expectedStages.join(" → ")}`);
}

if (!/^\s*USER\s+factory\s*$/m.test(dockerfile)) {
  console.error("FAIL: Dockerfile must run as USER factory (non-root)");
  failed = true;
} else {
  console.log("OK: USER factory");
}

if (!/^\s*EXPOSE\s+8787\s*$/m.test(dockerfile)) {
  console.error("FAIL: Dockerfile must EXPOSE 8787");
  failed = true;
} else {
  console.log("OK: EXPOSE 8787");
}

if (!/HEALTHCHECK[\s\S]*\/health/.test(dockerfile)) {
  console.error("FAIL: Dockerfile HEALTHCHECK must probe /health");
  failed = true;
} else {
  console.log("OK: HEALTHCHECK probes /health");
}

if (!/CMD\s*\[\s*"node"\s*,\s*"dist\/index\.js"\s*\]/.test(dockerfile)) {
  console.error('FAIL: Dockerfile CMD must be ["node", "dist/index.js"]');
  failed = true;
} else {
  console.log("OK: CMD node dist/index.js");
}

const server = readFileSync(
  join(root, "apps/factory-gateway/src/server.ts"),
  "utf8",
);
if (
  !server.includes('pathname === "/health"') ||
  !server.includes('service: "factory-gateway"')
) {
  console.error("FAIL: server.ts /health contract marker missing");
  failed = true;
} else {
  console.log('OK: /health returns service "factory-gateway"');
}

if (failed) {
  console.error("\nFAIL: Dockerfile structural lint failed.");
  process.exit(1);
}

console.log("\nOK: kit + Dockerfile lint green; Port left untouched.");
process.exit(0);
