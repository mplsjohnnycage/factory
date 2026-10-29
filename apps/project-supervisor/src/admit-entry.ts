import type { ProjectSupervisorActor } from "./project-supervisor.js";
import type { AdmitRequest, AdmitResult, ReadyTaskEvent } from "./types.js";

/**
 * Offline / local admit entry (G6).
 *
 * Maps gateway-forwarded `SupervisorAdmit` blobs or explicit dry-run bodies into
 * `AdmitRequest`, then calls `ProjectSupervisorActor.admit`.
 * No Rivet Actor host, Funnel, or live Port required — pair with
 * `createMemorySupervisor` / `createBdSupervisor` (+ mock `BdRunner`).
 */

export type AdmitMapRefuseReason =
  | "invalid_body"
  | "missing_task_id"
  | "missing_work_key"
  | "claim_or_bypass_required";

export type AdmitMapRefuse = {
  ok: false;
  reason: AdmitMapRefuseReason;
  detail?: string;
};

export type AdmitMapOk = {
  ok: true;
  request: AdmitRequest;
};

export type AdmitMapResult = AdmitMapOk | AdmitMapRefuse;

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Unwrap gateway `SupervisorAdmit` (`{ id, payload, runId, actionIdentifier }`)
 * or accept a flat / nested explicit dry-run body.
 */
export function unwrapAdmitBody(body: unknown): JsonRecord | null {
  if (!isRecord(body)) return null;

  const nestedPayload = body.payload;
  const looksLikeGatewayAdmit =
    typeof body.id === "string" &&
    typeof body.receivedAt === "string" &&
    isRecord(nestedPayload);

  if (looksLikeGatewayAdmit) {
    return {
      ...nestedPayload,
      runId: body.runId ?? nestedPayload.runId,
      actionIdentifier: body.actionIdentifier ?? nestedPayload.actionIdentifier,
      admitId: body.id,
      receivedAt: body.receivedAt,
    };
  }

  if (isRecord(nestedPayload)) {
    return {
      ...body,
      ...nestedPayload,
      runId: body.runId ?? nestedPayload.runId,
      actionIdentifier: body.actionIdentifier ?? nestedPayload.actionIdentifier,
    };
  }

  return body;
}

function readyFromFields(
  fields: JsonRecord,
  projectId: string,
): ReadyTaskEvent | undefined {
  const nestedReady = fields.ready;
  if (isRecord(nestedReady)) {
    const beadId = asNonEmptyString(nestedReady.beadId);
    if (!beadId) return undefined;
    const claimedBy =
      asNonEmptyString(nestedReady.claimedBy) ??
      asNonEmptyString(fields.claimedBy) ??
      "project-supervisor";
    const claimedAt =
      asNonEmptyString(nestedReady.claimedAt) ??
      asNonEmptyString(fields.claimedAt) ??
      new Date().toISOString();
    const readyProjectId =
      asNonEmptyString(nestedReady.projectId) ?? projectId;
    const event: ReadyTaskEvent = {
      beadId,
      projectId: readyProjectId,
      claimedBy,
      claimedAt,
    };
    const ec =
      asNonEmptyString(nestedReady.executionContractId) ??
      asNonEmptyString(fields.executionContractId);
    if (ec !== undefined) {
      event.executionContractId = ec;
    }
    return event;
  }

  const beadId = asNonEmptyString(fields.beadId);
  if (!beadId) return undefined;
  const claimedBy =
    asNonEmptyString(fields.claimedBy) ?? "project-supervisor";
  const claimedAt =
    asNonEmptyString(fields.claimedAt) ?? new Date().toISOString();
  const event: ReadyTaskEvent = {
    beadId,
    projectId,
    claimedBy,
    claimedAt,
  };
  const ec = asNonEmptyString(fields.executionContractId);
  if (ec !== undefined) {
    event.executionContractId = ec;
  }
  return event;
}

function deriveWorkKey(fields: JsonRecord): string | undefined {
  const explicit = asNonEmptyString(fields.workKey);
  if (explicit) return explicit;
  const runId = asNonEmptyString(fields.runId);
  if (runId) return runId;
  const action = asNonEmptyString(fields.actionIdentifier);
  const admitId = asNonEmptyString(fields.admitId);
  if (action && admitId) return `${action}:${admitId}`;
  if (admitId) return admitId;
  return undefined;
}

function deriveTaskId(fields: JsonRecord): string | undefined {
  const explicit = asNonEmptyString(fields.taskId);
  if (explicit) return explicit;
  const beadId = asNonEmptyString(fields.beadId);
  if (beadId) return beadId;
  if (isRecord(fields.ready)) {
    const readyBead = asNonEmptyString(fields.ready.beadId);
    if (readyBead) return readyBead;
  }
  const action = asNonEmptyString(fields.actionIdentifier);
  if (action) return action;
  return asNonEmptyString(fields.runId);
}

/**
 * Map gateway-style or explicit dry-run JSON → `AdmitRequest`.
 * Incomplete shapes refuse without calling admit (unit-testable).
 */
export function mapToAdmitRequest(body: unknown): AdmitMapResult {
  const fields = unwrapAdmitBody(body);
  if (!fields) {
    return { ok: false, reason: "invalid_body", detail: "body must be a JSON object" };
  }

  const projectId =
    asNonEmptyString(fields.projectId) ?? "meta";
  const taskId = deriveTaskId(fields);
  if (!taskId) {
    return {
      ok: false,
      reason: "missing_task_id",
      detail: "provide taskId, beadId, actionIdentifier, or runId",
    };
  }
  const workKey = deriveWorkKey(fields);
  if (!workKey) {
    return {
      ok: false,
      reason: "missing_work_key",
      detail: "provide workKey, runId, or admitId",
    };
  }

  const portBypassId = asNonEmptyString(fields.portBypassId);
  const ready = readyFromFields(fields, projectId);
  if (!ready && !portBypassId) {
    return {
      ok: false,
      reason: "claim_or_bypass_required",
      detail:
        "offline admit requires beadId/ready or audited portBypassId (gateway {action,runId} alone is insufficient)",
    };
  }

  const portAuthorized =
    fields.portAuthorized === undefined
      ? true
      : fields.portAuthorized === true;

  const request: AdmitRequest = {
    projectId,
    taskId,
    workKey,
    portAuthorized,
  };
  if (ready) {
    request.ready = ready;
  }
  if (portBypassId) {
    request.portBypassId = portBypassId;
  }
  const claimedBy =
    asNonEmptyString(fields.claimedBy) ?? ready?.claimedBy;
  if (claimedBy) {
    request.claimedBy = claimedBy;
  }

  return { ok: true, request };
}

export type AdmitFromPayloadResult =
  | AdmitResult
  | AdmitMapRefuse;

/**
 * In-process admit entry: map body → AdmitRequest → supervisor.admit.
 */
export async function admitFromPayload(
  supervisor: ProjectSupervisorActor,
  body: unknown,
): Promise<AdmitFromPayloadResult> {
  const mapped = mapToAdmitRequest(body);
  if (!mapped.ok) {
    return mapped;
  }
  return supervisor.admit(mapped.request);
}
