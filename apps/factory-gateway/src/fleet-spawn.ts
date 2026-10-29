/**
 * OpenFleet spawn gate (PBI-012).
 *
 * Contract: over-ceiling spawn → refuse + ledger `ceiling.refuse`.
 */

import {
  evaluateSpawnAgainstCeiling,
  mergeCeilingsNarrow,
  type ApprovalsMode,
  type OpenFleetCeiling,
  type SpawnCeilingResult,
} from "./openfleet-ceilings.js";
import {
  recordCeilingRefuse,
  type OpenFleetLedger,
  type CeilingRefuseEvent,
} from "./openfleet-ledger.js";

export type FleetSpawnRequest = {
  fleet: string;
  swarm: string;
  member: string;
  /** Actor recording the attempt (member id or "sysop"). */
  by: string;
  host: string;
  approvals: ApprovalsMode;
  proposedDepth: number;
  currentSwarmMembers: number;
  /** Fleet-level ceiling (from fleet.open / fleet.cap). */
  fleetCeiling: OpenFleetCeiling;
  /** Optional swarm-narrowed ceiling keys. */
  swarmCeiling?: OpenFleetCeiling;
  spendSoFar?: number;
  proposedSpend?: number;
  now?: Date;
};

export type FleetSpawnAllowed = {
  ok: true;
  effectiveCeiling: OpenFleetCeiling;
};

export type FleetSpawnRefused = {
  ok: false;
  reason: string;
  detail: string;
  ledgerEvent: CeilingRefuseEvent;
  effectiveCeiling: OpenFleetCeiling;
};

export type FleetSpawnResult = FleetSpawnAllowed | FleetSpawnRefused;

/**
 * Gate a swarm member spawn. On refuse, appends `ceiling.refuse` to the ledger.
 */
export function gateFleetSpawn(
  ledger: OpenFleetLedger,
  request: FleetSpawnRequest,
): FleetSpawnResult {
  const effectiveCeiling = request.swarmCeiling
    ? mergeCeilingsNarrow(request.fleetCeiling, request.swarmCeiling)
    : { ...request.fleetCeiling };

  const evalResult: SpawnCeilingResult = evaluateSpawnAgainstCeiling({
    ceiling: effectiveCeiling,
    proposedDepth: request.proposedDepth,
    currentSwarmMembers: request.currentSwarmMembers,
    host: request.host,
    approvals: request.approvals,
    spendSoFar: request.spendSoFar,
    proposedSpend: request.proposedSpend,
    now: request.now,
  });

  if (evalResult.ok) {
    return { ok: true, effectiveCeiling };
  }

  const ledgerEvent = recordCeilingRefuse(ledger, {
    fleet: request.fleet,
    by: request.by,
    swarm: request.swarm,
    member: request.member,
    host: request.host,
    reason: evalResult.reason,
    detail: evalResult.detail,
    at: (request.now ?? new Date()).toISOString(),
  });

  return {
    ok: false,
    reason: evalResult.reason,
    detail: evalResult.detail,
    ledgerEvent,
    effectiveCeiling,
  };
}
