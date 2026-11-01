import type { SupervisorAdmit } from "./types.js";

/**
 * GitHub Actions runner dispatch.
 *
 * Push-only: after an admit is enqueued the gateway fires a
 * `repository_dispatch` (`factory_job`) that `.github/workflows/factory-runner.yml`
 * picks up. Rivet/Port are never polled. Disabled unless both env vars are set.
 */
export const RUNNER_DISPATCH_EVENT = "factory_job";

export type RunnerDispatchConfig = {
  /** `owner/repo` that hosts factory-runner.yml. */
  repo: string;
  /** Fine-grained PAT (contents:write) — env only, never logged. */
  token: string;
  fetchImpl?: typeof fetch;
};

export function runnerDispatchFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): RunnerDispatcher | undefined {
  const repo = env.FACTORY_RUNNER_REPO;
  const token = env.FACTORY_RUNNER_DISPATCH_TOKEN;
  if (!repo && !token) return undefined;
  if (!repo || !token) {
    throw new Error(
      "runner dispatch needs both FACTORY_RUNNER_REPO and FACTORY_RUNNER_DISPATCH_TOKEN",
    );
  }
  return new RunnerDispatcher({ repo, token });
}

export class RunnerDispatcher {
  readonly #cfg: RunnerDispatchConfig;

  constructor(cfg: RunnerDispatchConfig) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(cfg.repo)) {
      throw new Error(`invalid runner repo: ${cfg.repo}`);
    }
    this.#cfg = cfg;
  }

  async dispatch(admit: SupervisorAdmit): Promise<void> {
    const payload = admit.payload as Record<string, unknown>;
    const workKey =
      [payload.workKey, payload.entityIdentifier, admit.runId].find(
        (v): v is string => typeof v === "string" && v.length > 0,
      ) ?? admit.id;
    const res = await (this.#cfg.fetchImpl ?? fetch)(
      `https://api.github.com/repos/${this.#cfg.repo}/dispatches`,
      {
        method: "POST",
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${this.#cfg.token}`,
          "content-type": "application/json",
          "x-github-api-version": "2022-11-28",
        },
        body: JSON.stringify({
          event_type: RUNNER_DISPATCH_EVENT,
          client_payload: {
            admitId: admit.id,
            action: admit.actionIdentifier ?? null,
            runId: admit.runId ?? null,
            workKey,
            issue: typeof payload.issue === "number" ? payload.issue : null,
          },
        }),
      },
    );
    if (res.status !== 204) {
      throw new Error(`runner dispatch failed: HTTP ${res.status}`);
    }
  }
}
