#!/usr/bin/env node
/**
 * Kit dry-run for sandbox-harness morning / readiness (PBI-006 / ADR-006).
 *
 * Default: verify docs/scripts/source markers (no network, no secrets, no Port).
 * Optional: --memory → run apps/sandbox-harness unit tests
 *           (npm ci in that package if needed; MemorySandboxLease only).
 *
 * Does NOT cover Rivet Compose + Tailscale Serve (see PR #76 / rivet-compose-serve kit).
 *
 * Usage:
 *   node scripts/sandbox-harness-dry-run.mjs
 *   npm run dry-run:sandbox-harness
 *   npm run dry-run:sandbox-harness -- --memory
 *
 * Exit 0 = kit OK (+ memory tests green when --memory).
 * Exit 1 = missing/broken kit or memory probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/sandbox-harness-readiness.md
 * @see specs/sandbox-harness/spec.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const harnessDir = join(root, "apps/sandbox-harness");

const REQUIRED = [
  {
    path: "docs/ops/sandbox-harness-readiness.md",
    markers: [
      "sandbox-harness",
      "MemorySandboxLease",
      "rivetdev/sandbox-agent:0.5.4-full",
      "dry-run:sandbox-harness",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "Rivet",
      "browser",
    ],
  },
  {
    path: "apps/sandbox-harness/README.md",
    markers: [
      "rivetdev/sandbox-agent:0.5.4-full",
      "sandbox-agent@0.5.4",
      "claude",
      "MemorySandboxLease",
      "DockerSandboxLease",
      "never calls Sandbox Agent",
      "specs/sandbox-harness/spec.md",
    ],
  },
  {
    path: "apps/sandbox-harness/src/image-pin.ts",
    markers: [
      'SANDBOX_AGENT_IMAGE_PIN = "rivetdev/sandbox-agent:0.5.4-full"',
      'SANDBOX_AGENT_SDK_VERSION = "0.5.4"',
      'M1_CODING_AGENT = "claude"',
      "resolveSandboxAgentImage",
    ],
  },
  {
    path: "apps/sandbox-harness/src/memory-lease.ts",
    markers: [
      "MemorySandboxLease",
      "without Docker or Claude",
      "ephemeral FS",
    ],
  },
  {
    path: "apps/sandbox-harness/src/docker-lease.ts",
    markers: [
      "DockerSandboxLease",
      "ANTHROPIC_API_KEY",
      "never git",
      "MemorySandboxLease",
    ],
  },
  {
    path: "apps/sandbox-harness/src/agent-session.ts",
    markers: ["AgentSessionActor", "checkpoint", "killSandbox"],
  },
  {
    path: "apps/sandbox-harness/test/agent-session.test.ts",
    markers: [
      "MemorySandboxLease",
      "SANDBOX_AGENT_IMAGE_PIN",
      "0.5.4-full",
      "kill preserves session identity",
    ],
  },
  {
    path: "apps/sandbox-harness/.env.example",
    markers: ["ANTHROPIC_API_KEY=", "SANDBOX_AGENT_IMAGE", "never commit"],
  },
  {
    path: "specs/sandbox-harness/spec.md",
    markers: [
      "rivetdev/sandbox-agent:0.5.4-full",
      "Browser never calls Sandbox Agent",
      "MemorySandboxLease",
      "claude",
    ],
  },
  {
    path: "docs/adrs/ADR-006-sandbox-agent-harness.md",
    markers: [
      "Sandbox Agent",
      "browser never calls",
      "Docker",
      "Claude Code",
    ],
  },
  {
    path: "scripts/sandbox-harness-dry-run.mjs",
    markers: ["Kit dry-run for sandbox-harness", "Exit 0 = kit OK"],
  },
];

/** Reject accidental committed secret assignments in the ops kit surface. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*GITHUB_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
];

function parseArgs(argv) {
  let memory = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/sandbox-harness-dry-run.mjs [--memory]
  npm run dry-run:sandbox-harness -- [--memory]

Default: kit markers only (no network, no npm install).
--memory: also run apps/sandbox-harness unit tests (MemorySandboxLease).
Does not run Rivet Compose/Serve smoke (separate kit / PR #76).`);
      process.exit(0);
    }
    if (arg === "--memory") {
      memory = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { memory };
}

let failed = false;
const { memory } = parseArgs(process.argv.slice(2));

console.log("=== sandbox-harness morning / readiness kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Live Docker / Claude spend: OUT OF SCOPE (default)");
console.log("Rivet Compose + Tailscale Serve: OUT OF SCOPE (see PR #76)");
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
  const script = pkg.scripts?.["dry-run:sandbox-harness"];
  if (script !== "node scripts/sandbox-harness-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:sandbox-harness"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:sandbox-harness"]');
  }
}

if (failed) {
  console.error("\nFAIL: sandbox-harness readiness kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!memory) {
  console.log(
    "SKIP memory probe: pass --memory to run sandbox-harness unit tests.",
  );
  process.exit(0);
}

if (!existsSync(join(harnessDir, "package.json"))) {
  console.error("FAIL: apps/sandbox-harness/package.json missing");
  process.exit(1);
}

const needInstall = !existsSync(join(harnessDir, "node_modules", "tsx"));
if (needInstall) {
  console.log("\n== npm ci @ apps/sandbox-harness ==");
  const ci = spawnSync("npm", ["ci"], {
    cwd: harnessDir,
    stdio: "inherit",
    env: process.env,
  });
  if (ci.status !== 0) {
    console.error("\nFAIL: npm ci in sandbox-harness failed.");
    process.exit(ci.status === null ? 1 : ci.status);
  }
}

console.log("\n== MemorySandboxLease unit tests ==");
const test = spawnSync("npm", ["test"], {
  cwd: harnessDir,
  stdio: "inherit",
  env: process.env,
});

if (test.status !== 0) {
  console.error("\nFAIL: sandbox-harness Memory probe failed.");
  process.exit(test.status === null ? 1 : test.status);
}

console.log(
  "\nOK: kit + Memory lifecycle gates green; Port left untouched; no Docker/Claude spend.",
);
process.exit(0);
