/**
 * OpenFleet ledger (append-only) — PBI-012.
 *
 * Events include `ceiling.refuse` when a spawn is denied by ceilings.
 * In-process MemoryLedger covers CI; FileLedger writes JSONL under OPENFLEET_HOME.
 */

import { appendFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { CeilingRefuseReason } from "./openfleet-ceilings.js";

export type LedgerActor = "sysop" | string;

export type CeilingRefuseEvent = {
  event: "ceiling.refuse";
  at: string;
  by: LedgerActor;
  fleet: string;
  swarm?: string;
  member?: string;
  reason: CeilingRefuseReason;
  detail: string;
  host?: string;
};

export type FleetOpenEvent = {
  event: "fleet.open";
  at: string;
  by: "sysop";
  fleet: string;
  sysop: string;
  ceiling?: Record<string, unknown>;
};

export type FleetCapEvent = {
  event: "fleet.cap";
  at: string;
  by: "sysop";
  fleet: string;
  target: string;
  ceiling: Record<string, unknown>;
};

export type SwarmSpawnEvent = {
  event: "swarm.spawn";
  at: string;
  by: LedgerActor;
  fleet: string;
  swarm: string;
  parent?: string;
  ceiling?: Record<string, unknown>;
};

export type MemberStartEvent = {
  event: "member.start";
  at: string;
  by: LedgerActor;
  fleet: string;
  member: string;
  swarm?: string;
  host?: string;
};

export type OpenFleetLedgerEvent =
  | CeilingRefuseEvent
  | FleetOpenEvent
  | FleetCapEvent
  | SwarmSpawnEvent
  | MemberStartEvent
  | {
      event: string;
      at: string;
      by: LedgerActor;
      fleet: string;
      [key: string]: unknown;
    };

export type OpenFleetLedger = {
  append(event: OpenFleetLedgerEvent): void;
  list(fleet?: string): readonly OpenFleetLedgerEvent[];
  listCeilingRefuses(fleet?: string): readonly CeilingRefuseEvent[];
};

export class MemoryOpenFleetLedger implements OpenFleetLedger {
  readonly #events: OpenFleetLedgerEvent[] = [];

  append(event: OpenFleetLedgerEvent): void {
    this.#events.push(event);
  }

  list(fleet?: string): readonly OpenFleetLedgerEvent[] {
    if (!fleet) return this.#events;
    return this.#events.filter((e) => e.fleet === fleet);
  }

  listCeilingRefuses(fleet?: string): readonly CeilingRefuseEvent[] {
    return this.list(fleet).filter(
      (e): e is CeilingRefuseEvent => e.event === "ceiling.refuse",
    );
  }
}

/**
 * Append-only JSONL ledger under `$OPENFLEET_HOME/fleets/<fleet>/ledger.jsonl`.
 * Creates directories on first write. Meta lane — no secrets in ledger lines.
 */
export class FileOpenFleetLedger implements OpenFleetLedger {
  readonly #home: string;
  readonly #memory = new MemoryOpenFleetLedger();

  constructor(home: string) {
    this.#home = home;
  }

  #path(fleet: string): string {
    return join(this.#home, "fleets", fleet, "ledger.jsonl");
  }

  append(event: OpenFleetLedgerEvent): void {
    this.#memory.append(event);
    const path = this.#path(event.fleet);
    mkdirSync(dirname(path), { recursive: true });
    appendFileSync(path, `${JSON.stringify(event)}\n`, "utf8");
  }

  list(fleet?: string): readonly OpenFleetLedgerEvent[] {
    if (!fleet) return this.#memory.list();
    const path = this.#path(fleet);
    if (!existsSync(path)) return this.#memory.list(fleet);
    const fromDisk = readFileSync(path, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as OpenFleetLedgerEvent);
    // Prefer disk as SoT when present
    return fromDisk;
  }

  listCeilingRefuses(fleet?: string): readonly CeilingRefuseEvent[] {
    return this.list(fleet).filter(
      (e): e is CeilingRefuseEvent => e.event === "ceiling.refuse",
    );
  }
}

export function buildOpenFleetLedger(
  env: NodeJS.ProcessEnv = process.env,
): OpenFleetLedger {
  const home = env.OPENFLEET_HOME?.trim();
  if (home) return new FileOpenFleetLedger(home);
  return new MemoryOpenFleetLedger();
}

export function recordCeilingRefuse(
  ledger: OpenFleetLedger,
  input: {
    fleet: string;
    by: LedgerActor;
    reason: CeilingRefuseReason;
    detail: string;
    swarm?: string;
    member?: string;
    host?: string;
    at?: string;
  },
): CeilingRefuseEvent {
  const event: CeilingRefuseEvent = {
    event: "ceiling.refuse",
    at: input.at ?? new Date().toISOString(),
    by: input.by,
    fleet: input.fleet,
    swarm: input.swarm,
    member: input.member,
    reason: input.reason,
    detail: input.detail,
    host: input.host,
  };
  ledger.append(event);
  return event;
}
