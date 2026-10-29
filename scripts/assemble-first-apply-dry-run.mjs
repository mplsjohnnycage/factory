#!/usr/bin/env node
/**
 * Kit dry-run for assemble-first apply contract (offline Spec/AGENTS/gateway).
 *
 * Default: verify §4.2.2 stack-assembly + §4.2.1 fencing markers
 * (no network mutate, no secrets, no Port upserts, no Project-store master edit).
 *
 * Does NOT cover Funnel remount (#90), queue mirror (#88), Atlas BFF smoke,
 * Rivet/sandbox/BdMetaBeads/Dolt kits, or admit HMAC kits.
 *
 * Usage:
 *   node scripts/assemble-first-apply-dry-run.mjs
 *   npm run dry-run:assemble-first-apply
 *
 * Exit 0 = kit OK.
 * Exit 1 = missing/broken kit.
 * Exit 2 = bad args.
 *
 * @see docs/ops/assemble-first-apply.md
 * @see specs/port-governance/spec.md
 * @see docs/ocean-mcp-write-fencing.md
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "docs/ops/assemble-first-apply.md",
    markers: [
      "dry-run:assemble-first-apply",
      "assemble-first",
      "§4.2.2",
      "§4.2.1",
      "needs implementation",
      "machine-validated",
      "CatalogWriter",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "REFUSED",
      "upsert_blueprint",
      "factory-master-spec",
      "ocean-mcp-write-fencing",
      "port-governance",
    ],
  },
  {
    path: "specs/port-governance/spec.md",
    markers: [
      "§4.2.1 catalog write fencing",
      "§4.2.2 stack assembly",
      "CatalogWriter",
      "catalogVersion",
      "dual-write",
      "Machine-validated stack conflicts reject",
      "apps/factory-gateway",
      "meta_fence_bypass_forbidden",
    ],
  },
  {
    path: "AGENTS.md",
    markers: [
      "NEVER** dual-write Port catalog outside §4.2.1 gateway writer",
      "NEVER** call Sandbox Agent from the browser",
      "specs/{domain}/spec.md",
    ],
  },
  {
    path: "docs/ocean-mcp-write-fencing.md",
    markers: [
      "§4.2.1",
      "CatalogWriter",
      "Meta-fenced",
      "bypassFence",
      "/catalog/sync-write",
      "dual-write",
      "executionContract",
    ],
  },
  {
    path: "apps/factory-gateway/src/catalog-writer.ts",
    markers: [
      "export class CatalogWriter",
      "catalogVersion",
      "expectedCatalogVersion",
      "§4.2.1",
      "no partial apply",
    ],
  },
  {
    path: "apps/factory-gateway/src/meta-fences.ts",
    markers: [
      "Meta-fenced",
      "CatalogWriter",
      "executionContract",
      "META_FENCED_BLUEPRINTS",
      "dual-write",
    ],
  },
  {
    path: "apps/factory-gateway/src/sync-ingress.ts",
    markers: [
      "bypassFence",
      "meta_fence_bypass_forbidden",
      "CatalogWriter",
      "isMetaFencedBlueprint",
    ],
  },
  {
    path: "specs/factory-kernel/spec.md",
    markers: ["§4.2.1 writer", "No catalog dual-write outside the gateway writer"],
  },
  {
    path: "specs/rivet-execution/spec.md",
    markers: ["§4.2.1", "never raw dual-write"],
  },
  {
    path: "scripts/assemble-first-apply-dry-run.mjs",
    markers: [
      "Kit dry-run for assemble-first apply contract",
      "Exit 0 = kit OK",
      "Port mutate: REFUSED",
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
];

/** Port mutate verbs this kit must never invoke — documented refuse surface. */
const REFUSED_PORT_MUTATE = [
  "upsert_blueprint",
  "upsert_workflow",
  "upsert_entity",
  "trigger_run",
  "create External Interface",
];

function parseArgs(argv) {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/assemble-first-apply-dry-run.mjs
  npm run dry-run:assemble-first-apply

Default: kit markers only (no network mutate, no npm install).
Port schema upserts: always REFUSED.
Project-store factory-master-spec.md: never edited by this kit.
FE-142 / FE-172 CLOSED — do not re-ask Johnny.`);
      process.exit(0);
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
}

let failed = false;
parseArgs(process.argv.slice(2));

console.log("=== Assemble-first apply kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
for (const verb of REFUSED_PORT_MUTATE) {
  console.log(`  refuse: ${verb}`);
}
console.log("Project-store master edit: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Funnel remount checklist (#90): OUT OF SCOPE");
console.log("Queue mirror (#88): OUT OF SCOPE");
console.log("Atlas BFF live smoke: OUT OF SCOPE");
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

// Soft check: ops kit must keep literal assemble-first + needs implementation together
const opsPath = join(root, "docs/ops/assemble-first-apply.md");
if (existsSync(opsPath)) {
  const ops = readFileSync(opsPath, "utf8");
  if (!/assemble-first/i.test(ops) || !/needs implementation/i.test(ops)) {
    console.error(
      "FAIL: docs/ops/assemble-first-apply.md must keep assemble-first + needs implementation",
    );
    failed = true;
  } else {
    console.log("OK: assemble-first + needs implementation locked in ops kit");
  }
  if (!/Do\s+\*\*not\*\*\s+weaken §4\.2\.1/i.test(ops) && !/weaken §4\.2\.1/i.test(ops)) {
    console.error(
      "FAIL: docs/ops/assemble-first-apply.md must keep §4.2.1 weaken ban",
    );
    failed = true;
  } else {
    console.log("OK: §4.2.1 weaken ban present in ops kit");
  }
}

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL: missing package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:assemble-first-apply"];
  if (script !== "node scripts/assemble-first-apply-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:assemble-first-apply"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:assemble-first-apply"]');
  }
}

if (failed) {
  console.error("\nFAIL: Assemble-first apply kit incomplete.");
  process.exit(1);
}

console.log(
  "\nOK: kit markers green (offline); Port upserts REFUSED; Project master untouched; no #88/#90 overlap.",
);
process.exit(0);
