import { randomUUID } from "node:crypto";
import { resolveFactoryActionIdentifier } from "./factory-workflows.js";
import type { AdmitForwarder } from "./rivet-admit.js";
import type { PortWebhookBody, SupervisorAdmit } from "./types.js";

/**
 * Thin ProjectSupervisor enqueue surface.
 *
 * Contract (ADR-002 / rivet-execution): gateway verifies HMAC then enqueues.
 * Rivet never polls Port for work — admits are push-only from this path.
 */
export class ProjectSupervisorQueue {
  readonly #admits: SupervisorAdmit[] = [];
  readonly #forwardUrl: string | undefined;
  readonly #forwarder: AdmitForwarder | undefined;

  constructor(opts?: { rivetSupervisorUrl?: string; forwarder?: AdmitForwarder }) {
    this.#forwardUrl = opts?.rivetSupervisorUrl;
    this.#forwarder = opts?.forwarder;
  }

  /** Ordered admits received this process lifetime (tests / local observability). */
  list(): readonly SupervisorAdmit[] {
    return this.#admits;
  }

  /**
   * Enqueue an admit. Never reads or polls Port.
   * Optional HTTP forward to Rivet when RIVET_SUPERVISOR_URL is set.
   */
  async enqueue(payload: PortWebhookBody): Promise<SupervisorAdmit> {
    const admit: SupervisorAdmit = {
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
      actionIdentifier: resolveFactoryActionIdentifier({ body: payload }),
      runId:
        typeof payload.runId === "string"
          ? payload.runId
          : typeof (payload as { context?: { runId?: unknown } }).context?.runId === "string"
            ? ((payload as { context: { runId: string } }).context.runId)
            : undefined,
      payload,
    };

    this.#admits.push(admit);

    if (this.#forwarder) {
      // Typed path: Rivet projectSupervisor actor queue (single writer, duplicate workKey fenced).
      await this.#forwarder(admit);
    } else if (this.#forwardUrl) {
      const res = await fetch(this.#forwardUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(admit),
      });
      if (!res.ok) {
        throw new Error(`ProjectSupervisor forward failed: HTTP ${res.status}`);
      }
    }

    return admit;
  }
}
