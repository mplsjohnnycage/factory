import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateSpawnAgainstCeiling,
  mergeCeilingsNarrow,
  parseBudgetAmount,
  type OpenFleetCeiling,
} from "../src/openfleet-ceilings.js";
import { MemoryOpenFleetLedger } from "../src/openfleet-ledger.js";
import { gateFleetSpawn } from "../src/fleet-spawn.js";
import {
  SlidingWindowRateLimiter,
  rateLimitKeyFromRequest,
} from "../src/rate-limit.js";

describe("OpenFleet ceilings (PBI-012)", () => {
  const baseCeiling: OpenFleetCeiling = {
    approvals: "native",
    depth: 1,
    fan_out: 2,
    hosts: ["dev"],
    until: "2099-01-01T00:00:00Z",
    budget: "1000 tokens",
  };

  it("allows spawn within fan_out / depth / hosts", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 1,
      currentSwarmMembers: 1,
      host: "dev",
      approvals: "native",
    });
    assert.equal(result.ok, true);
  });

  it("refuses over fan_out ceiling", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 1,
      currentSwarmMembers: 2,
      host: "dev",
      approvals: "native",
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "fan_out");
  });

  it("refuses over depth ceiling", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 2,
      currentSwarmMembers: 0,
      host: "dev",
      approvals: "native",
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "depth");
  });

  it("refuses host not in ceiling.hosts", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 1,
      currentSwarmMembers: 0,
      host: "prod-box",
      approvals: "native",
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "hosts");
  });

  it("refuses bypass when ceiling.approvals is native", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 1,
      currentSwarmMembers: 0,
      host: "dev",
      approvals: "bypass",
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "approvals");
  });

  it("refuses when until has passed", () => {
    const result = evaluateSpawnAgainstCeiling({
      ceiling: { ...baseCeiling, until: "2020-01-01T00:00:00Z" },
      proposedDepth: 1,
      currentSwarmMembers: 0,
      host: "dev",
      approvals: "native",
      now: new Date("2026-10-29T00:00:00Z"),
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "until");
  });

  it("refuses when budget would be exceeded", () => {
    assert.equal(parseBudgetAmount("1000 tokens"), 1000);
    const result = evaluateSpawnAgainstCeiling({
      ceiling: baseCeiling,
      proposedDepth: 1,
      currentSwarmMembers: 0,
      host: "dev",
      approvals: "native",
      spendSoFar: 900,
      proposedSpend: 200,
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "budget");
  });

  it("mergeCeilingsNarrow cannot widen approvals to bypass", () => {
    const merged = mergeCeilingsNarrow(
      { approvals: "native", depth: 2, fan_out: 4 },
      { approvals: "bypass", depth: 3, fan_out: 8 },
    );
    assert.equal(merged.approvals, "native");
    assert.equal(merged.depth, 2);
    assert.equal(merged.fan_out, 4);
  });
});

describe("gateFleetSpawn → ceiling.refuse ledger (PBI-012 Contract)", () => {
  it("over-ceiling spawn refuses and ledgers ceiling.refuse", () => {
    const ledger = new MemoryOpenFleetLedger();
    const result = gateFleetSpawn(ledger, {
      fleet: "johnny@meta",
      swarm: "fanout-test",
      member: "member-3",
      by: "parent-1",
      host: "dev",
      approvals: "native",
      proposedDepth: 1,
      currentSwarmMembers: 2,
      fleetCeiling: { fan_out: 2, depth: 1, hosts: ["dev"] },
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "fan_out");
    assert.equal(result.ledgerEvent.event, "ceiling.refuse");
    assert.equal(result.ledgerEvent.reason, "fan_out");
    assert.equal(result.ledgerEvent.fleet, "johnny@meta");

    const refuses = ledger.listCeilingRefuses("johnny@meta");
    assert.equal(refuses.length, 1);
    assert.equal(refuses[0]!.event, "ceiling.refuse");
  });

  it("in-ceiling spawn allows without ledger refuse", () => {
    const ledger = new MemoryOpenFleetLedger();
    const result = gateFleetSpawn(ledger, {
      fleet: "johnny@meta",
      swarm: "ok-swarm",
      member: "member-1",
      by: "sysop",
      host: "dev",
      approvals: "native",
      proposedDepth: 1,
      currentSwarmMembers: 0,
      fleetCeiling: { fan_out: 2, depth: 1, hosts: ["dev"] },
    });
    assert.equal(result.ok, true);
    assert.equal(ledger.listCeilingRefuses("johnny@meta").length, 0);
  });
});

describe("gateway rate limiter (PBI-012)", () => {
  it("allows under limit and refuses over limit", () => {
    const limiter = new SlidingWindowRateLimiter({ limit: 2, windowMs: 60_000 });
    const t0 = 1_000_000;
    assert.equal(limiter.take("ip:1.1.1.1", t0).ok, true);
    assert.equal(limiter.take("ip:1.1.1.1", t0 + 1).ok, true);
    const blocked = limiter.take("ip:1.1.1.1", t0 + 2);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec >= 1);
  });

  it("rateLimitKeyFromRequest prefers fleet header", () => {
    const key = rateLimitKeyFromRequest({
      headers: { "x-factory-fleet": "johnny@meta" },
      path: "/fleet/spawn",
    });
    assert.equal(key, "fleet:johnny@meta");
  });
});
