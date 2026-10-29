#!/usr/bin/env node
/**
 * Kit dry-run for Meta Beads Dolt health / docs (hybrid refs/dolt/data path).
 *
 * Default: verify docs/scripts/hybrid markers (no network mutate, no secrets, no Port).
 * Optional: --ls-remote → read-only `git ls-remote origin 'refs/dolt/*'`
 *           and require `refs/dolt/data` (zero spend; no bootstrap execute).
 *
 * Does NOT cover BdMetaBeads adapter unit tests (PR #80) or gateway Dockerfile
 * health (PR #82).
 *
 * Usage:
 *   node scripts/beads-dolt-health-dry-run.mjs
 *   npm run dry-run:beads-dolt-health
 *   npm run dry-run:beads-dolt-health -- --ls-remote
 *
 * Exit 0 = kit OK (+ remote tip present when --ls-remote).
 * Exit 1 = missing/broken kit or remote tip missing.
 * Exit 2 = bad args.
 *
 * @see docs/ops/beads-dolt-health.md
 * @see docs/meta-beads.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "docs/ops/beads-dolt-health.md",
    markers: [
      "refs/dolt/data",
      "dry-run:beads-dolt-health",
      "bd-bootstrap-safe",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "Product Beads",
      "BdMetaBeads",
      "never bd dolt push",
    ],
  },
  {
    path: "docs/meta-beads.md",
    markers: [
      "factory-",
      "bd-bootstrap-safe.sh",
      "refs/dolt/data",
      "never Product Beads",
      "git ls-remote origin",
      "never bd dolt push",
      "embeddeddolt",
    ],
  },
  {
    path: "docs/meta-beads-bootstrap-dry-run.md",
    markers: [
      "refs/dolt/data",
      "bd bootstrap",
      "embeddeddolt",
      "No bd init",
      "No bd dolt push",
    ],
  },
  {
    path: ".beads/config.yaml",
    markers: [
      'issue-prefix: "factory"',
      "never Product Beads",
      "git+https://github.com/mplsjohnnycage/factory.git",
    ],
  },
  {
    path: ".beads/README.md",
    markers: [
      "factory-",
      "bd-bootstrap-safe.sh",
      "Product Beads",
      "refs/dolt/data",
      "embeddeddolt",
    ],
  },
  {
    path: ".beads/metadata.json",
    markers: [],
  },
  {
    path: "scripts/bd-bootstrap-safe.sh",
    markers: [
      "dry-run",
      "never bd init --force",
      "never bd dolt push",
      "never Product Beads",
      "refs/dolt/data",
      "plan_is_reversible",
    ],
  },
  {
    path: "scripts/beads-dolt-health-dry-run.mjs",
    markers: ["Kit dry-run for Meta Beads Dolt health", "Exit 0 = kit OK"],
  },
  {
    path: "docs/ops/bdmetabeads-readiness.md",
    markers: [
      "BdMetaBeads",
      "dry-run:bdmetabeads",
      "bd-bootstrap-safe",
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

function parseArgs(argv) {
  let lsRemote = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/beads-dolt-health-dry-run.mjs [--ls-remote]
  npm run dry-run:beads-dolt-health -- [--ls-remote]

Default: kit markers only (no network mutate, no npm install).
--ls-remote: also require origin refs/dolt/data via git ls-remote (read-only).
Does not run BdMetaBeads (#80) or gateway Dockerfile health (#82) kits.
Never bd dolt push / Port schema upsert.`);
      process.exit(0);
    }
    if (arg === "--ls-remote") {
      lsRemote = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { lsRemote };
}

let failed = false;
const { lsRemote } = parseArgs(process.argv.slice(2));

console.log("=== Meta Beads Dolt health / docs kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("BdMetaBeads adapter tests: OUT OF SCOPE (see PR #80)");
console.log("Gateway Dockerfile health: OUT OF SCOPE (see PR #82)");
console.log("Live bd dolt push: OUT OF SCOPE");
console.log("");

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) {
    console.error(`FAIL: missing ${item.path}`);
    failed = true;
    continue;
  }
  if (item.markers.length === 0) {
    console.log(`OK: ${item.path} (exists)`);
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
  // Skip binary-ish / empty-marker existence-only files for secret scan content
  if (item.markers.length === 0) continue;
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
  const script = pkg.scripts?.["dry-run:beads-dolt-health"];
  if (script !== "node scripts/beads-dolt-health-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:beads-dolt-health"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:beads-dolt-health"]');
  }
}

// Hybrid layout: embeddeddolt must NOT be tracked as a committed tree tip
const gitignorePath = join(root, ".beads/.gitignore");
if (!existsSync(gitignorePath)) {
  console.error("FAIL: missing .beads/.gitignore");
  failed = true;
} else {
  const gi = readFileSync(gitignorePath, "utf8");
  if (!gi.includes("embeddeddolt")) {
    console.error("FAIL: .beads/.gitignore must ignore embeddeddolt");
    failed = true;
  } else {
    console.log("OK: .beads/.gitignore ignores embeddeddolt");
  }
}

if (failed) {
  console.error("\nFAIL: Meta Beads Dolt health kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!lsRemote) {
  console.log(
    "SKIP ls-remote probe: pass --ls-remote to require origin refs/dolt/data.",
  );
  process.exit(0);
}

console.log("\n== git ls-remote origin refs/dolt/* (read-only) ==");
const probe = spawnSync(
  "git",
  ["ls-remote", "origin", "refs/dolt/*"],
  {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  },
);

if (probe.status !== 0) {
  console.error("FAIL: git ls-remote origin refs/dolt/* failed.");
  if (probe.stderr) {
    // Never print credentials; stderr from git is usually safe but truncate hard.
    console.error(String(probe.stderr).slice(0, 400));
  }
  process.exit(probe.status === null ? 1 : probe.status);
}

const out = String(probe.stdout || "");
const lines = out
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

if (!lines.some((l) => /\srefs\/dolt\/data$/.test(l))) {
  console.error("FAIL: origin missing refs/dolt/data (hydrate path broken).");
  console.error(
    "Operator fix (authorized only): bd dolt push from authoritative local DB — not this kit.",
  );
  process.exit(1);
}

// Print tip shape without claiming secrets; hash is public git object id.
for (const line of lines) {
  console.log(`OK tip: ${line}`);
}

console.log(
  "\nOK: kit + origin refs/dolt/data present; Port untouched; no dolt push; no #80/#82 overlap.",
);
process.exit(0);
