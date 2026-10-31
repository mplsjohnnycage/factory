import type { SandboxLease } from "./sandbox-lease.js";
import {
  M1_CODING_AGENT,
  resolveSandboxAgentImage,
  SANDBOX_AGENT_IMAGE_PIN,
} from "./image-pin.js";
import type { CodingAgentId, PromptResult, SessionEvent } from "./types.js";

export interface DockerLeaseOptions {
  /** Override image pin (tests / operators). Default = SANDBOX_AGENT_IMAGE_PIN. */
  image?: string;
  env?: NodeJS.ProcessEnv;
}

/**
 * Live Docker SandboxLease via `sandbox-agent` Docker provider.
 *
 * Requires Docker Engine + optional peer deps (`dockerode`, `get-port`).
 * Claude credentials via ANTHROPIC_API_KEY env only — never git.
 * Optional ANTHROPIC_BASE_URL points Claude Code at the OmniRoute gateway
 * (default http://127.0.0.1:20128, rewritten to host.docker.internal).
 *
 * CI unit tests use MemorySandboxLease; this module is the operator live path.
 */
export class DockerSandboxLease implements SandboxLease {
  readonly #image: string;
  readonly #env: NodeJS.ProcessEnv;
  #alive = false;
  #sandboxId: string | null = null;
  #sdk: DockerSdkHandle | null = null;
  #sessions = new Map<string, { id: string; agent: string }>();

  constructor(opts?: DockerLeaseOptions) {
    this.#env = opts?.env ?? process.env;
    this.#image = opts?.image ?? resolveSandboxAgentImage(this.#env);
  }

  get sandboxId(): string {
    return this.#sandboxId ?? `docker/pending`;
  }

  get alive(): boolean {
    return this.#alive;
  }

  get image(): string {
    return this.#image;
  }

  async start(): Promise<void> {
    if (this.#alive) return;

    const { SandboxAgent } = await import("sandbox-agent");
    const { docker } = await import("sandbox-agent/docker");

    const envPairs = [
      this.#env.ANTHROPIC_API_KEY
        ? `ANTHROPIC_API_KEY=${this.#env.ANTHROPIC_API_KEY}`
        : undefined,
      this.#env.GITHUB_TOKEN
        ? `GITHUB_TOKEN=${this.#env.GITHUB_TOKEN}`
        : undefined,
      // LLM gateway (OmniRoute): Claude Code in the sandbox talks to the gateway.
      this.#env.ANTHROPIC_BASE_URL
        ? `ANTHROPIC_BASE_URL=${containerReachableUrl(this.#env.ANTHROPIC_BASE_URL)}`
        : undefined,
    ].filter((v): v is string => Boolean(v));

    const sdk = await SandboxAgent.start({
      sandbox: docker({
        image: this.#image,
        env: envPairs,
      }),
    });

    this.#sdk = sdk as DockerSdkHandle;
    this.#sandboxId = sdk.sandboxId ?? `docker/${SANDBOX_AGENT_IMAGE_PIN}`;
    this.#alive = true;
  }

  async createAgentSession(opts: {
    sessionId: string;
    agent: CodingAgentId;
    cwd?: string;
  }): Promise<{ remoteSessionId: string }> {
    this.#assertAlive();
    const agent = opts.agent === "mock" ? M1_CODING_AGENT : opts.agent;
    const session = await this.#sdk!.createSession({
      id: opts.sessionId,
      agent,
      cwd: opts.cwd ?? "/workspace",
    });
    this.#sessions.set(opts.sessionId, { id: session.id, agent: session.agent });
    return { remoteSessionId: session.id };
  }

  async prompt(opts: {
    remoteSessionId: string;
    text: string;
    onEvent: (event: Omit<SessionEvent, "sequence" | "sessionId">) => void;
  }): Promise<PromptResult> {
    this.#assertAlive();
    const session = await this.#sdk!.getSession(opts.remoteSessionId);
    if (!session) {
      throw new Error(`unknown remote session: ${opts.remoteSessionId}`);
    }

    const unsub = session.onEvent((event: {
      eventIndex?: number;
      sender?: string;
      payload?: unknown;
    }) => {
      opts.onEvent({
        sender: event.sender === "client" ? "client" : "agent",
        type: "session_event",
        at: new Date().toISOString(),
        payload: {
          eventIndex: event.eventIndex,
          sender: event.sender,
          payload: event.payload,
        },
      });
    });

    try {
      const response = await session.prompt([
        { type: "text", text: opts.text },
      ]);
      return {
        stopReason:
          typeof response?.stopReason === "string"
            ? response.stopReason
            : "unknown",
        events: [],
      };
    } finally {
      unsub();
    }
  }

  async checkpoint(opts: {
    remoteSessionId: string;
    message: string;
  }): Promise<{ sha: string }> {
    this.#assertAlive();
    // Scoped git commit inside sandbox when repo is mounted; fall back to
    // process run that echoes a documented placeholder if git unavailable.
    const run = await this.#sdk!.runProcess({
      command: "bash",
      args: [
        "-lc",
        [
          "set -euo pipefail",
          'if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then',
          `  git add -A && git commit -m ${shellQuote(opts.message)} --allow-empty && git rev-parse HEAD`,
          "else",
          `  printf 'no-git-worktree:%s\\n' ${shellQuote(opts.remoteSessionId)}`,
          "fi",
        ].join("\n"),
      ],
      timeoutMs: 60_000,
    });
    const sha = (run.stdout ?? "").trim().split("\n").pop()?.trim();
    if (!sha) {
      throw new Error("checkpoint produced empty SHA");
    }
    return { sha };
  }

  async kill(): Promise<void> {
    if (!this.#sdk) {
      this.#alive = false;
      return;
    }
    try {
      await this.#sdk.killSandbox();
    } finally {
      this.#alive = false;
      this.#sessions.clear();
      this.#sdk = null;
    }
  }

  #assertAlive(): void {
    if (!this.#alive || !this.#sdk) {
      throw new Error(`sandbox ${this.sandboxId} is not alive`);
    }
  }
}

/** Minimal structural type so we do not couple compile to every SDK method. */
interface DockerSdkHandle {
  sandboxId?: string;
  createSession(req: {
    id?: string;
    agent: string;
    cwd?: string;
  }): Promise<{ id: string; agent: string; onEvent: (cb: (e: unknown) => void) => () => void; prompt: (p: unknown) => Promise<{ stopReason?: string }> }>;
  getSession(id: string): Promise<{
    id: string;
    agent: string;
    onEvent: (cb: (e: {
      eventIndex?: number;
      sender?: string;
      payload?: unknown;
    }) => void) => () => void;
    prompt: (p: unknown) => Promise<{ stopReason?: string }>;
  } | null>;
  runProcess(req: {
    command: string;
    args?: string[];
    timeoutMs?: number;
  }): Promise<{ stdout?: string; stderr?: string; exitCode?: number | null }>;
  killSandbox(): Promise<void>;
}

/** Loopback on the host is not loopback inside the container. */
export function containerReachableUrl(url: string): string {
  return url.replace(
    /^(https?:\/\/)(127\.0\.0\.1|localhost)(?=[:/]|$)/,
    "$1host.docker.internal",
  );
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
