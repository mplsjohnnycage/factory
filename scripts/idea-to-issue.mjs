#!/usr/bin/env node
/**
 * Approved idea → linked PBI-draft issue.
 *
 * Trigger: an issue labeled `idea` receives label `approved` (or a
 * `factory_idea_approved` repository_dispatch carrying the same shape).
 * Creates one issue that links back to the idea, comments the link on the idea,
 * and is idempotent via a hidden marker so re-labeling never duplicates.
 * Auth: GITHUB_TOKEN env only.
 */
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const markerFor = (ideaNumber) => `<!-- factory-idea:${ideaNumber} -->`;

export function isApprovedIdea(labels) {
  const names = (labels ?? []).map((l) => (typeof l === "string" ? l : l.name));
  return names.includes("idea") && names.includes("approved");
}

export function buildIssue(idea) {
  return {
    title: `PBI: ${String(idea.title).replace(/^idea:\s*/i, "").trim()}`.slice(0, 200),
    labels: ["pbi-draft", "needs-contract"],
    body: [
      markerFor(idea.number),
      `Parent idea: #${idea.number}`,
      "",
      "Auto-created from an approved idea. **Not startable** until the typed contract",
      "(C1–C3 + fields 1–16, master spec §0.1) is filled — use the PBI form fields.",
      "",
      "### Idea",
      "",
      idea.body?.trim() || "_(no body)_",
    ].join("\n"),
  };
}

async function gh(path, { method = "GET", body, token, fetchImpl = fetch }) {
  const res = await fetchImpl(`https://api.github.com${path}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: HTTP ${res.status}`);
  return res.json();
}

/** Returns { created, issue } — created=false when the marker already exists. */
export async function ideaToIssue({ repo, token, idea, fetchImpl }) {
  if (!isApprovedIdea(idea.labels)) return { created: false, skipped: "not_approved_idea" };
  const opts = { token, fetchImpl };
  const marker = markerFor(idea.number);
  const comments = await gh(`/repos/${repo}/issues/${idea.number}/comments?per_page=100`, opts);
  const prior = comments.find((c) => c.body?.includes(marker));
  if (prior) return { created: false, skipped: "already_linked" };

  const issue = await gh(`/repos/${repo}/issues`, { ...opts, method: "POST", body: buildIssue(idea) });
  await gh(`/repos/${repo}/issues/${idea.number}/comments`, {
    ...opts,
    method: "POST",
    body: { body: `${marker}\nLinked work issue: #${issue.number}` },
  });
  // Best effort: sub-issue link so the idea shows progress. Not all repos have it enabled.
  try {
    await gh(`/repos/${repo}/issues/${idea.number}/sub_issues`, {
      ...opts,
      method: "POST",
      body: { sub_issue_id: issue.id },
    });
  } catch {
    /* comment link above is the durable link */
  }
  return { created: true, issue: issue.number };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY, IDEA_JSON, GITHUB_STEP_SUMMARY } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !IDEA_JSON) {
    console.error("GITHUB_TOKEN, GITHUB_REPOSITORY, IDEA_JSON required");
    process.exit(2);
  }
  ideaToIssue({ repo: GITHUB_REPOSITORY, token: GITHUB_TOKEN, idea: JSON.parse(IDEA_JSON) }).then(
    (r) => {
      console.log(JSON.stringify(r));
      if (GITHUB_STEP_SUMMARY) appendFileSync(GITHUB_STEP_SUMMARY, `idea-to-issue: ${JSON.stringify(r)}\n`);
    },
    (e) => {
      console.error(e.message);
      process.exit(1);
    },
  );
}
