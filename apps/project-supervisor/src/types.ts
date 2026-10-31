/**
 * M1 Factory shapes for ProjectSupervisor + Meta Beads ready gate (PBI-007).
 * Spec home: specs/factory-kernel/spec.md §13.1 ReadyTaskEvent.
 */

/** Produced after Meta Beads `bd ready` + `bd update --claim` (or Memory stand-in). */
export type ReadyTaskEvent = {
  beadId: string;
  projectId: string;
  claimedBy: string;
  claimedAt: string;
  executionContractId?: string;
};

export type WorkAttemptStatus =
  | "admitted"
  | "running"
  | "recovered"
  | "cancelled"
  | "completed"
  | "failed";

export type WorkAttempt = {
  workAttemptId: string;
  projectId: string;
  taskId: string;
  /** Stable fence key — duplicate work.start with same key yields one attempt. */
  workKey: string;
  beadId: string;
  status: WorkAttemptStatus;
  createdAt: string;
  updatedAt: string;
  portBypassId: string | null;
  duplicateOf: string | null;
  executionContractId: string;
  deliveryRunId: string;
  executionAttemptId: string;
};

export type AdmitRequest = {
  projectId: string;
  taskId: string;
  workKey: string;
  /** Port-authorized start — required for admit and recover. */
  portAuthorized: boolean;
  /** Meta Beads claim evidence. Required unless audited Port bypass. */
  ready?: ReadyTaskEvent;
  /** Audited human bypass id from Port executionContract (optional). */
  portBypassId?: string;
  claimedBy?: string;
};

export type AdmitOk = {
  ok: true;
  attempt: WorkAttempt;
  duplicate: boolean;
};

export type AdmitRefused = {
  ok: false;
  reason:
    | "not_port_authorized"
    | "claim_id_required"
    | "bead_not_ready"
    | "bead_claim_mismatch";
  detail?: string;
};

export type AdmitResult = AdmitOk | AdmitRefused;

export type RecoverRequest = {
  workAttemptId: string;
  portAuthorized: boolean;
};

export type RecoverResult =
  | { ok: true; attempt: WorkAttempt }
  | {
      ok: false;
      reason: "not_port_authorized" | "attempt_not_found";
    };

/** Minimal §4.2.1 writer surface used for Port projections (no dual-write bypass). */
export type CatalogWriteRequest = {
  blueprint: string;
  entityIdentifier: string;
  expectedCatalogVersion: number;
  patch: Record<string, unknown>;
};

export type CatalogEntity = {
  blueprint: string;
  entityIdentifier: string;
  catalogVersion: number;
  properties: Record<string, unknown>;
};

export type CatalogWriteResult =
  | { ok: true; entity: CatalogEntity }
  | {
      ok: false;
      reason: "stale_catalog_version";
      currentVersion: number;
      expectedCatalogVersion: number;
    };

export type CatalogWriterPort = {
  apply(request: CatalogWriteRequest): Promise<CatalogWriteResult>;
};
