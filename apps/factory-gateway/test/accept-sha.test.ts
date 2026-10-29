import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AcceptLedger,
  evaluateAcceptOnSha,
  META_ALWAYS_REQUIRED_CHECKS,
  type CheckRunSummary,
} from "../src/accept-sha.js";

function green(name: string, sha: string): CheckRunSummary {
  return { name, status: "completed", conclusion: "success", headSha: sha };
}

function red(name: string, sha: string): CheckRunSummary {
  return { name, status: "completed", conclusion: "failure", headSha: sha };
}

describe("accept on exact SHA (PBI-011 / ADR-008)", () => {
  const shaS = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const shaSp = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

  it("allows accept when required checks are green on exact SHA", () => {
    const result = evaluateAcceptOnSha({
      sha: shaS,
      requiredChecks: [...META_ALWAYS_REQUIRED_CHECKS],
      checks: [green("meta-ci-presence", shaS)],
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.greenChecks, ["meta-ci-presence"]);
  });

  it("denies when required checks are red", () => {
    const result = evaluateAcceptOnSha({
      sha: shaS,
      requiredChecks: ["meta-ci-presence"],
      checks: [red("meta-ci-presence", shaS)],
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "failed_required_checks");
  });

  it("denies when check headSha mismatches candidate", () => {
    const result = evaluateAcceptOnSha({
      sha: shaS,
      requiredChecks: ["meta-ci-presence"],
      checks: [green("meta-ci-presence", shaSp)],
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "check_sha_mismatch");
  });

  it("rewrite invalidates prior accept for old SHA", () => {
    const ledger = new AcceptLedger();
    const deliveryKey = "stl-172-demo";

    const first = evaluateAcceptOnSha({
      sha: shaS,
      requiredChecks: ["meta-ci-presence"],
      checks: [green("meta-ci-presence", shaS)],
    });
    assert.equal(first.ok, true);

    const recorded = ledger.record({
      deliveryKey,
      sha: shaS,
      actor: "cockpit",
      requiredChecks: ["meta-ci-presence"],
      evidenceRef: "checks/meta-ci-presence",
    });
    assert.equal(recorded.ok, true);
    assert.equal(ledger.isValidForTip(deliveryKey, shaS), true);

    // Force-push / rewrite tip → S'
    assert.equal(ledger.isValidForTip(deliveryKey, shaSp), false);

    const staleEval = evaluateAcceptOnSha({
      sha: shaSp,
      requiredChecks: ["meta-ci-presence"],
      checks: [green("meta-ci-presence", shaSp)],
      priorAccept: ledger.get(deliveryKey),
    });
    assert.equal(staleEval.ok, false);
    if (!staleEval.ok) assert.equal(staleEval.reason, "prior_accept_stale_after_rewrite");

    // Fresh accept on S' after re-eval without stale prior
    const fresh = evaluateAcceptOnSha({
      sha: shaSp,
      requiredChecks: ["meta-ci-presence"],
      checks: [green("meta-ci-presence", shaSp)],
    });
    assert.equal(fresh.ok, true);
    const r2 = ledger.record({
      deliveryKey,
      sha: shaSp,
      actor: "human",
      requiredChecks: ["meta-ci-presence"],
    });
    assert.equal(r2.ok, true);
    assert.equal(ledger.isValidForTip(deliveryKey, shaSp), true);
    assert.equal(ledger.isValidForTip(deliveryKey, shaS), false);
  });

  it("refuses agent self-accept", () => {
    const ledger = new AcceptLedger();
    const denied = ledger.record({
      deliveryKey: "x",
      sha: shaS,
      actor: "agent",
      requiredChecks: ["meta-ci-presence"],
    });
    assert.equal(denied.ok, false);
    if (!denied.ok) assert.equal(denied.reason, "agent_self_accept_forbidden");
  });
});
