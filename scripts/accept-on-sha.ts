#!/usr/bin/env node
/**
 * PBI-011 / ADR-008 — evaluate accept eligibility for an exact commit SHA.
 *
 * Does NOT Port-accept. Cockpit/human performs Port governance accept after ok.
 *
 *   node --import tsx scripts/accept-on-sha.ts --sha <40hex> --fixture checks.json
 *   node --import tsx scripts/accept-on-sha.ts --sha <40hex> --repo owner/name
 *
 * Exit 0 = eligible; exit 2 = denied; exit 1 = usage/error.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import {
  evaluateAcceptOnSha,
  META_ALWAYS_REQUIRED_CHECKS,
  type AcceptRecord,
  type CheckRunSummary,
} from "../apps/factory-gateway/src/accept-sha.ts";

function usage(): never {
  console.error(
    "Usage: node --import tsx scripts/accept-on-sha.ts --sha <sha> [--fixture checks.json | --repo owner/name] [--required a,b] [--prior prior.json]",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const sha = flag("--sha");
if (!sha) usage();

const required = (flag("--required") ?? META_ALWAYS_REQUIRED_CHECKS.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

let checks: CheckRunSummary[] = [];
const fixture = flag("--fixture");
const repo = flag("--repo");

if (fixture) {
  const body = JSON.parse(readFileSync(fixture, "utf8")) as {
    checks?: CheckRunSummary[];
  } & CheckRunSummary[];
  checks = Array.isArray(body) ? body : (body.checks ?? []);
} else if (repo) {
  const out = spawnSync(
    "gh",
    [
      "api",
      `repos/${repo}/commits/${sha}/check-runs`,
      "--paginate",
      "-q",
      "[.check_runs[] | {name, status, conclusion, headSha: .head_sha}]",
    ],
    { encoding: "utf8" },
  );
  if (out.status !== 0) {
    console.error(out.stderr || out.stdout);
    process.exit(1);
  }
  const raw = out.stdout.trim();
  try {
    checks = JSON.parse(raw) as CheckRunSummary[];
  } catch {
    const parts = raw.match(/\[[\s\S]*?\]/g) ?? [];
    checks = parts.flatMap((p) => JSON.parse(p) as CheckRunSummary[]);
  }
} else {
  console.error("Provide --fixture or --repo");
  usage();
}

const priorPath = flag("--prior");
let priorAccept: AcceptRecord | null = null;
if (priorPath) {
  priorAccept = JSON.parse(readFileSync(priorPath, "utf8")) as AcceptRecord;
}

const result = evaluateAcceptOnSha({
  sha,
  requiredChecks: required,
  checks,
  priorAccept,
});

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 2);
