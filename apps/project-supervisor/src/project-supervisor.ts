import { randomUUID } from "node:crypto";
import type { MetaBeadsGate } from "./meta-beads.js";
import { PortProjectionMapper } from "./port-projections.js";
import type {
  AdmitRequest,
  AdmitResult,
  CatalogWriterPort,
  RecoverRequest,
  RecoverResult,
  WorkAttempt,
  WorkAttemptStatus,
} from "./types.js";

/**
 * Rivet-shaped ProjectSupervisor (Meta M1).
 *
 * - Single admission fence per `workKey` → duplicate work.start yields one WorkAttempt.
 * - Meta Beads ready gate: refuse admit without beadId unless audited Port bypass.
 * - Port projections via §4.2.1 writer only (executionContract / deliveryRun / executionAttempt).
 * - Port-authorized recover preserves attempt identity after worker/sandbox loss.
 *
 * Never polls Port. Never touches Product Beads.
 */
export class ProjectSupervisorActor {
  readonly #beads: MetaBeadsGate;
  readonly #projections: PortProjectionMapper;
  readonly #attempts = new Map<string, WorkAttempt>();
  readonly #byWorkKey = new Map<string, string>();

  constructor(opts: { beads: MetaBeadsGate; catalog: CatalogWriterPort }) {
    this.#beads = opts.beads;
    this.#projections = new PortProjectionMapper(opts.catalog);
  }

  listAttempts(): readonly WorkAttempt[] {
    return [...this.#attempts.values()];
  }

  getAttempt(workAttemptId: string): WorkAttempt | undefined {
    return this.#attempts.get(workAttemptId);
  }

  getAttemptByWorkKey(workKey: string): WorkAttempt | undefined {
    const id = this.#byWorkKey.get(workKey);
    return id ? this.#attempts.get(id) : undefined;
  }

  async admit(request: AdmitRequest): Promise<AdmitResult> {
    if (!request.portAuthorized) {
      return { ok: false, reason: "not_port_authorized" };
    }

    const existingId = this.#byWorkKey.get(request.workKey);
    if (existingId) {
      const existing = this.#attempts.get(existingId);
      if (existing) {
        return { ok: true, attempt: existing, duplicate: true };
      }
    }

    const bypass = request.portBypassId?.trim() || null;
    const ready = request.ready;
    const beadId = ready?.beadId?.trim() || null;

    if (!beadId && !bypass) {
      return {
        ok: false,
        reason: "claim_id_required",
        detail: "ProjectSupervisor refuses admit without beadId or audited Port bypass",
      };
    }

    let resolvedBeadId = beadId ?? `bypass:${bypass}`;
    let executionContractId =
      ready?.executionContractId ?? `ec-${request.workKey}`;

    if (beadId && !bypass) {
      const isReady = await this.#beads.isReady(beadId);
      if (!isReady) {
        return { ok: false, reason: "bead_not_ready", detail: beadId };
      }
      const claimedBy = request.claimedBy ?? ready?.claimedBy ?? "project-supervisor";
      if (ready) {
        if (ready.projectId !== request.projectId) {
          return {
            ok: false,
            reason: "bead_claim_mismatch",
            detail: "ReadyTaskEvent.projectId mismatch",
          };
        }
        const holder = await this.#beads.claimHolder(beadId);
        if (holder && holder !== ready.claimedBy) {
          return {
            ok: false,
            reason: "bead_claim_mismatch",
            detail: `claimed by ${holder}, event says ${ready.claimedBy}`,
          };
        }
        if (!holder) {
          await this.#beads.claim(beadId, {
            projectId: request.projectId,
            claimedBy,
          });
        }
      } else {
        await this.#beads.claim(beadId, {
          projectId: request.projectId,
          claimedBy,
        });
      }
      resolvedBeadId = beadId;
    }

    const now = new Date().toISOString();
    const workAttemptId = randomUUID();
    const attempt: WorkAttempt = {
      workAttemptId,
      projectId: request.projectId,
      taskId: request.taskId,
      workKey: request.workKey,
      beadId: resolvedBeadId,
      status: "admitted",
      createdAt: now,
      updatedAt: now,
      portBypassId: bypass,
      duplicateOf: null,
      executionContractId,
      deliveryRunId: `run-${request.workKey}`,
      executionAttemptId: `att-${workAttemptId}`,
    };

    this.#attempts.set(workAttemptId, attempt);
    this.#byWorkKey.set(request.workKey, workAttemptId);
    await this.#projections.projectAttempt(attempt);

    return { ok: true, attempt, duplicate: false };
  }

  /**
   * Port-authorized recover after worker kill / sandbox loss.
   * Preserves WorkAttempt identity; re-projects Port status.
   */
  async recover(request: RecoverRequest): Promise<RecoverResult> {
    if (!request.portAuthorized) {
      return { ok: false, reason: "not_port_authorized" };
    }
    const attempt = this.#attempts.get(request.workAttemptId);
    if (!attempt) {
      return { ok: false, reason: "attempt_not_found" };
    }
    const updated: WorkAttempt = {
      ...attempt,
      status: "recovered",
      updatedAt: new Date().toISOString(),
    };
    this.#attempts.set(attempt.workAttemptId, updated);
    await this.#projections.projectAttempt(updated);
    return { ok: true, attempt: updated };
  }

  /**
   * Move an attempt through its lifecycle (running / completed / failed) and
   * re-project to Port. Used by the sandbox runner; never creates attempts.
   */
  async markStatus(
    workAttemptId: string,
    status: WorkAttemptStatus,
  ): Promise<WorkAttempt | undefined> {
    const attempt = this.#attempts.get(workAttemptId);
    if (!attempt) return undefined;
    const updated: WorkAttempt = {
      ...attempt,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.#attempts.set(workAttemptId, updated);
    await this.#projections.projectAttempt(updated);
    return updated;
  }
}
