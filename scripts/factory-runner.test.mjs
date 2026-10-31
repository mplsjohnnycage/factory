import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEvidence, evidenceComment, parseJob, runCheck } from "./factory-runner.mjs";

describe("factory-runner", () => {
  it("parses a valid job with defaults", () => {
    const j = parseJob('{"workKey":"wk-1","action":"factory_claim_next_job","issue":"12"}');
    assert.deepEqual(j, { workKey: "wk-1", action: "factory_claim_next_job", check: "typecheck", issue: 12, runId: null });
  });

  it("refuses non-allowlisted check, action, bad workKey, injected command", () => {
    assert.throws(() => parseJob({ workKey: "a", check: "rm -rf /" }), /not allowlisted/);
    assert.throws(() => parseJob({ workKey: "a", action: "nope" }), /allowlisted factory workflow/);
    assert.throws(() => parseJob({ workKey: "a b; ls" }), /workKey/);
    assert.throws(() => parseJob("{"), /valid JSON/);
  });

  it("runs only the mapped command and reports pass/fail", () => {
    const seen = [];
    const spawn = (cmd, args) => (seen.push([cmd, ...args]), { status: 1, stdout: "", stderr: "boom" });
    const r = runCheck("test", { spawn });
    assert.deepEqual(seen, [["npm", "run", "test:packages"]]);
    assert.equal(r.ok, false);
    const ev = buildEvidence(parseJob({ workKey: "wk" }), r, "abc");
    assert.equal(ev.status, "fail");
    assert.match(evidenceComment(ev), /factory-evidence:wk:abc/);
  });
});
