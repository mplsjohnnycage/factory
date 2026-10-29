import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  META_FENCED_BLUEPRINTS,
  classifyBlueprint,
  isMetaFencedBlueprint,
  isOceanMirrorBlueprint,
} from "../src/meta-fences.ts";

describe("Meta fence blueprint classification", () => {
  it("marks every Spec Factory-governed blueprint as meta_fenced", () => {
    for (const bp of META_FENCED_BLUEPRINTS) {
      assert.equal(classifyBlueprint(bp), "meta_fenced");
      assert.equal(isMetaFencedBlueprint(bp), true);
      assert.equal(isOceanMirrorBlueprint(bp), false);
    }
  });

  it("classifies Ocean Context Lake mirrors by prefix", () => {
    for (const bp of [
      "githubRepository",
      "githubPullRequest",
      "linearIssue",
      "linear",
      "vercelProject",
      "convexDeployment",
    ]) {
      assert.equal(classifyBlueprint(bp), "ocean_mirror", bp);
      assert.equal(isOceanMirrorBlueprint(bp), true);
      assert.equal(isMetaFencedBlueprint(bp), false);
    }
  });

  it("fails closed: unknown blueprints are meta_fenced", () => {
    assert.equal(classifyBlueprint("mysteryWidget"), "meta_fenced");
    assert.equal(classifyBlueprint(""), "meta_fenced");
  });
});
