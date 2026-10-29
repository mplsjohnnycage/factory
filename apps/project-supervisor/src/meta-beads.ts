import type { ReadyTaskEvent } from "./types.js";

/**
 * Meta Beads ready/claim gate (Meta lane only — never Product Beads).
 *
 * Live operators use `bd ready` / `bd update --claim` via BdMetaBeads (or CLI).
 * CI uses MemoryMetaBeads — no Dolt / no `bd` binary required.
 */
export type MetaBeadsGate = {
  /** True when bead exists, has no open blockers, and is claimable/ready. */
  isReady(beadId: string): Promise<boolean>;
  /**
   * Claim a ready bead for admit. Returns ReadyTaskEvent.
   * Throws if not ready or already claimed by another actor without reclaim.
   */
  claim(beadId: string, args: { projectId: string; claimedBy: string }): Promise<ReadyTaskEvent>;
  /** Release claim after cancelled/failed admit (bd reclaim semantics). */
  reclaim(beadId: string): Promise<void>;
  /** Inspect current claim holder (tests / observability). */
  claimHolder(beadId: string): Promise<string | null>;
};

export type MemoryBead = {
  beadId: string;
  projectId: string;
  ready: boolean;
  claimedBy: string | null;
  claimedAt: string | null;
  executionContractId?: string;
};

/** In-process Meta Beads stand-in for unit tests and CI (no Product Beads). */
export class MemoryMetaBeads implements MetaBeadsGate {
  readonly #beads = new Map<string, MemoryBead>();

  seed(bead: {
    beadId: string;
    projectId: string;
    ready?: boolean;
    executionContractId?: string;
  }): void {
    const row: MemoryBead = {
      beadId: bead.beadId,
      projectId: bead.projectId,
      ready: bead.ready ?? true,
      claimedBy: null,
      claimedAt: null,
    };
    if (bead.executionContractId !== undefined) {
      row.executionContractId = bead.executionContractId;
    }
    this.#beads.set(bead.beadId, row);
  }

  async isReady(beadId: string): Promise<boolean> {
    const b = this.#beads.get(beadId);
    return Boolean(b?.ready);
  }

  async claim(
    beadId: string,
    args: { projectId: string; claimedBy: string },
  ): Promise<ReadyTaskEvent> {
    const b = this.#beads.get(beadId);
    if (!b || !b.ready) {
      throw new Error(`Meta Beads: bead not ready: ${beadId}`);
    }
    if (b.claimedBy && b.claimedBy !== args.claimedBy) {
      throw new Error(`Meta Beads: bead already claimed by ${b.claimedBy}`);
    }
    const claimedAt = new Date().toISOString();
    b.claimedBy = args.claimedBy;
    b.claimedAt = claimedAt;
    const event: ReadyTaskEvent = {
      beadId,
      projectId: args.projectId,
      claimedBy: args.claimedBy,
      claimedAt,
    };
    if (b.executionContractId !== undefined) {
      event.executionContractId = b.executionContractId;
    }
    return event;
  }

  async reclaim(beadId: string): Promise<void> {
    const b = this.#beads.get(beadId);
    if (!b) return;
    b.claimedBy = null;
    b.claimedAt = null;
  }

  async claimHolder(beadId: string): Promise<string | null> {
    return this.#beads.get(beadId)?.claimedBy ?? null;
  }
}
