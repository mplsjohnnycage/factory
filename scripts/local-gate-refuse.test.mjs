/**
 * PBI-013 — prove local gate refuses dirty/invalid.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { validate, parseDocument } from "@logicsrc/validators";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

describe("PBI-013 local gate refuse", () => {
  it("validates Meta LogicSRC agent fixture", () => {
    const abs = join(ROOT, "fixtures/logicsrc/valid/factory-meta-agent.yaml");
    const data = parseDocument(readFileSync(abs, "utf8"), abs);
    const result = validate("agent", data);
    assert.equal(result.ok, true);
  });

  it("refuses broken LogicSRC agent fixture", () => {
    const abs = join(ROOT, "fixtures/logicsrc/invalid/broken-agent.yaml");
    const data = parseDocument(readFileSync(abs, "utf8"), abs);
    const result = validate("agent", data);
    assert.equal(result.ok, false);
    assert.ok((result.errors?.length ?? 0) > 0);
  });

  it("local-gate exits non-zero when a Spec is dirty (scaffold placeholder)", () => {
    const scratch = mkdtempSync(join(tmpdir(), "factory-local-gate-"));
    try {
      // Minimal dirty tree: copy gate script + validators dep via NODE_PATH from ROOT,
      // and a fake specs tree with one dirty Spec.
      mkdirSync(join(scratch, "scripts"), { recursive: true });
      mkdirSync(join(scratch, "specs/asdlc-lifecycle"), { recursive: true });
      mkdirSync(join(scratch, "docs/adrs"), { recursive: true });
      mkdirSync(join(scratch, ".well-known"), { recursive: true });
      mkdirSync(join(scratch, "fixtures/logicsrc/valid"), { recursive: true });
      mkdirSync(join(scratch, "fixtures/logicsrc/invalid"), { recursive: true });

      cpSync(join(ROOT, "scripts/local-gate.mjs"), join(scratch, "scripts/local-gate.mjs"));
      cpSync(join(ROOT, "scripts/validate-well-known.mjs"), join(scratch, "scripts/validate-well-known.mjs"));
      cpSync(join(ROOT, "package.json"), join(scratch, "package.json"));
      if (existsSync(join(ROOT, "package-lock.json"))) {
        cpSync(join(ROOT, "package-lock.json"), join(scratch, "package-lock.json"));
      }
      cpSync(join(ROOT, "node_modules"), join(scratch, "node_modules"), { recursive: true });
      cpSync(
        join(ROOT, "fixtures/logicsrc/valid/factory-meta-agent.yaml"),
        join(scratch, "fixtures/logicsrc/valid/factory-meta-agent.yaml"),
      );
      cpSync(
        join(ROOT, "fixtures/logicsrc/invalid/broken-agent.yaml"),
        join(scratch, "fixtures/logicsrc/invalid/broken-agent.yaml"),
      );

      // Copy real emits so well-known + inventory can pass until Spec dirtiness.
      for (const rel of [
        "AGENTS.md",
        "OpenStack.md",
        "OpenProfile.md",
        ".well-known/openstack.md",
        ".well-known/openprofile.md",
        ".well-known/openmcp.json",
        ".well-known/openaccess.json",
      ]) {
        cpSync(join(ROOT, rel), join(scratch, rel));
      }
      for (const name of [
        "ADR-001-port-system-of-record.md",
        "ADR-002-rivet-execution-kernel.md",
        "ADR-003-port-to-rivet-path.md",
        "ADR-004-asdlc-spec-canonical.md",
        "ADR-005-factory-oauth-deferred.md",
        "ADR-006-sandbox-agent-harness.md",
        "ADR-007-developer-os-superseded-by-011.md",
        "ADR-008-visibility-accept-ci-sha.md",
        "ADR-009-iso-12207-lifecycle-map.md",
        "ADR-010-chatgpt-plugins-mcp-apps.md",
        "ADR-011-developer-os-next-rivet-native.md",
      ]) {
        cpSync(join(ROOT, "docs/adrs", name), join(scratch, "docs/adrs", name));
      }
      for (const domain of [
        "factory-kernel",
        "port-governance",
        "rivet-execution",
        "sandbox-harness",
        "developer-os",
        "auth-port-oauth",
        "logicsrc-interop",
        "visibility-accept",
        "security-blast-radius",
        "asdlc-lifecycle",
      ]) {
        mkdirSync(join(scratch, "specs", domain), { recursive: true });
        cpSync(join(ROOT, "specs", domain, "spec.md"), join(scratch, "specs", domain, "spec.md"));
      }

      // Dirty one Spec with scaffold marker.
      const dirty = join(scratch, "specs/asdlc-lifecycle/spec.md");
      writeFileSync(dirty, `${readFileSync(dirty, "utf8")}\n\n0.0.0-scaffold\n`);

      const result = spawnSync(process.execPath, [join(scratch, "scripts/local-gate.mjs")], {
        cwd: scratch,
        encoding: "utf8",
        env: {
          ...process.env,
          LOCAL_GATE_SKIP_APPS: "factory-gateway,project-supervisor,sandbox-harness,developer-os",
        },
      });
      assert.notEqual(result.status, 0, `expected refuse, got exit ${result.status}\n${result.stdout}\n${result.stderr}`);
      assert.match(`${result.stdout}\n${result.stderr}`, /REFUSED|placeholder|FAIL:/);
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });
});
