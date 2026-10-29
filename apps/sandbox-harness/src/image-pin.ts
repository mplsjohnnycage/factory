/**
 * Deliberate Sandbox Agent Docker image pin (ADR-006 / sandbox-harness Spec).
 *
 * Do not float to `:latest` or `:full` for M1. Bump only with intentional PBI.
 * Matches npm `sandbox-agent@0.5.4` SDK line; Hub tags include `0.5.4-full`.
 */
export const SANDBOX_AGENT_IMAGE_PIN = "rivetdev/sandbox-agent:0.5.4-full" as const;

export const SANDBOX_AGENT_SDK_VERSION = "0.5.4" as const;

/** M1 first harness inside Sandbox Agent (ASSUMPTION 3 / ADR-006). */
export const M1_CODING_AGENT = "claude" as const;

export function resolveSandboxAgentImage(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const override = env.SANDBOX_AGENT_IMAGE?.trim();
  return override && override.length > 0 ? override : SANDBOX_AGENT_IMAGE_PIN;
}
