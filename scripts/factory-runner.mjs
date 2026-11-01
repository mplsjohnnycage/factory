#!/usr/bin/env node
/**
 * Factory GitHub Actions runner — picks up a Port-originated job
 * (gateway `repository_dispatch` `factory_job`, or manual workflow_dispatch),
 * runs one allowlisted deterministic check (no LLM, zero model spend), and
 * records evidence on the exact commit SHA.
 *
 * Job JSON comes from env FACTORY_JOB. Evidence: stdout JSON, step summary,
 * and a comment on the linked issue when `issue` is set and GITHUB_TOKEN exists.
 */
import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const JOB_ACTIONS = [
  "factory_create_execution_contract",
  "factory_start_delivery_run",
  "factory_claim_next_job",
  "factory_heartbeat",
  "factory_submit_evidence",
  "factory_record_review_verdict",
  "factory_request_release",
];

/** Allowlisted checks — a job can name one, never supply a command. */
export const CHECKS = {
  typecheck: ["npm", ["run", "typecheck"]],
  test: ["npm", ["run", "test:packages"]],
  gate: ["npm", ["run", "local-gate"]],
};

export function parseJob(raw) {
  let job;
  try {
    job = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new Error("job is not valid JSON");
  }
  if (!job || typeof job !== "object") throw new Error("job must be an object");
  const workKey = job.workKey;
  if (typeof workKey !== "string" || !/^[\w.:/-]{1,128}$/.test(workKey)) {
    throw new Error("job.workKey missing or malformed");
  }
  if (job.action != null && !JOB_ACTIONS.includes(job.action)) {
    throw new Error(`job.action not an allowlisted factory workflow: ${job.action}`);
  }
  const check = job.check ?? "typecheck";
  if (!Object.hasOwn(CHECKS, check)) throw new Error(`job.check not allowlisted: ${check}`);
  const issue = job.issue == null || job.issue === "" ? null : Number(job.issue);
  if (issue !== null && !Number.isInteger(issue)) throw new Error("job.issue must be an integer");
  return { workKey, action: job.action ?? null, check, issue, runId: job.runId ?? null };
}

export function runCheck(check, { cwd = process.cwd(), spawn = spawnSync } = {}) {
  const [cmd, args] = CHECKS[check];
  const r = spawn(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return { ok: r.status === 0, exit: r.status, tail: `${r.stdout ?? ""}${r.stderr ?? ""}`.slice(-1500) };
}

export function buildEvidence(job, result, sha) {
  return {
    workKey: job.workKey,
    action: job.action,
    check: job.check,
    sha,
    status: result.ok ? "pass" : "fail",
    exit: result.exit,
    at: new Date().toISOString(),
  };
}

export function evidenceComment(ev) {
  return [
    `<!-- factory-evidence:${ev.workKey}:${ev.sha} -->`,
    `**Factory runner** \`${ev.workKey}\` — \`${ev.check}\` **${ev.status}** on \`${ev.sha}\``,
    "",
    "```json",
    JSON.stringify(ev, null, 2),
    "```",
  ].join("\n");
}

async function postComment({ repo, token, issue, body, fetchImpl = fetch }) {
  const res = await fetchImpl(`https://api.github.com/repos/${repo}/issues/${issue}/comments`, {
    method: "POST",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  if (res.status !== 201) throw new Error(`evidence comment failed: HTTP ${res.status}`);
}

export async function main(env = process.env) {
  const job = parseJob(env.FACTORY_JOB ?? "");
  const sha = env.GITHUB_SHA ?? "unknown";
  const result = runCheck(job.check);
  const ev = buildEvidence(job, result, sha);
  console.log(JSON.stringify(ev));
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `${evidenceComment(ev)}\n`);
  if (job.issue && env.GITHUB_TOKEN && env.GITHUB_REPOSITORY) {
    await postComment({
      repo: env.GITHUB_REPOSITORY,
      token: env.GITHUB_TOKEN,
      issue: job.issue,
      body: evidenceComment(ev),
    });
  }
  return result.ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(err.message);
      process.exit(2);
    },
  );
}
