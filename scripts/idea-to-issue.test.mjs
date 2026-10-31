import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildIssue, ideaToIssue, isApprovedIdea, markerFor } from "./idea-to-issue.mjs";

const idea = { number: 7, title: "Idea: add widget", body: "why", labels: [{ name: "idea" }, { name: "approved" }] };

function fakeGh(existingComments = []) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const path = url.replace("https://api.github.com", "");
    calls.push([init.method, path]);
    const json = (b, status = 200) => new Response(JSON.stringify(b), { status });
    if (init.method === "GET") return json(existingComments);
    if (path.endsWith("/sub_issues")) return json({}, 404);
    if (path.endsWith("/issues")) return json({ number: 8, id: 99 }, 201);
    return json({}, 201);
  };
  return { calls, fetchImpl };
}

describe("idea-to-issue", () => {
  it("requires both idea and approved labels", () => {
    assert.equal(isApprovedIdea(["idea"]), false);
    assert.equal(isApprovedIdea(["approved"]), false);
    assert.equal(isApprovedIdea(idea.labels), true);
  });

  it("builds a linked, not-startable draft", () => {
    const i = buildIssue(idea);
    assert.equal(i.title, "PBI: add widget");
    assert.match(i.body, /Parent idea: #7/);
    assert.ok(i.body.includes(markerFor(7)));
    assert.ok(i.labels.includes("needs-contract"));
  });

  it("creates issue, comments link, tolerates sub-issue 404", async () => {
    const g = fakeGh();
    const r = await ideaToIssue({ repo: "o/r", token: "t", idea, fetchImpl: g.fetchImpl });
    assert.deepEqual(r, { created: true, issue: 8 });
    assert.deepEqual(g.calls.map((c) => c.join(" ")), [
      "GET /repos/o/r/issues/7/comments?per_page=100",
      "POST /repos/o/r/issues",
      "POST /repos/o/r/issues/7/comments",
      "POST /repos/o/r/issues/7/sub_issues",
    ]);
  });

  it("is idempotent when marker comment exists", async () => {
    const g = fakeGh([{ body: `${markerFor(7)}\nLinked work issue: #8` }]);
    const r = await ideaToIssue({ repo: "o/r", token: "t", idea, fetchImpl: g.fetchImpl });
    assert.equal(r.created, false);
    assert.equal(g.calls.length, 1);
  });
});
