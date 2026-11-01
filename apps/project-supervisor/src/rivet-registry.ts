import { actor, queue, setup } from "rivetkit";
import { agentSession } from "./rivet-agent-session.js";
import { admitFromPayload, type AdmitFromPayloadResult } from "./admit-entry.js";
import { MemoryCatalogWriter } from "./memory-catalog.js";
import { MemoryMetaBeads } from "./meta-beads.js";
import { ProjectSupervisorActor } from "./project-supervisor.js";
import type {
  AdmitRequest,
  AdmitResult,
  RecoverRequest,
  RecoverResult,
  WorkAttempt,
} from "./types.js";

/**
 * RivetKit wrapper around the ProjectSupervisor admit/recover logic.
 * One actor per project (key = [projectId]). Attempts persist in actor state;
 * a per-instance serial chain keeps admit/recover single-writer, so duplicate
 * `workKey` admits yield exactly one WorkAttempt.
 *
 * Meta Beads / Port catalog are in-memory stand-ins here (same as the local
 * dry-run). Live `bd` + §4.2.1 writer wiring is a follow-on, not this PR.
 */
type Vars = { supervisor: ProjectSupervisorActor };

/** Attempts still `admitted` after this long are flagged stale (internal state only; never polls Port). */
export const STALE_ADMIT_MS = 15 * 60_000;
export const STALE_SWEEP_INTERVAL_MS = 60_000;

export const projectSupervisor = actor({
  state: {
    attempts: [] as WorkAttempt[],
    /** Flagged by the cron sweep; recovery still needs a Port-authorized `recover` message. */
    staleAttemptIds: [] as string[],
  },
  createVars: (c): Vars => {
    const supervisor = new ProjectSupervisorActor({
      beads: new MemoryMetaBeads(),
      catalog: new MemoryCatalogWriter(),
    });
    supervisor.seed(c.state.attempts);
    return { supervisor };
  },
  onCreate: async (c) => {
    await c.cron.every({
      name: "stale-sweep",
      interval: STALE_SWEEP_INTERVAL_MS,
      action: "sweepStale",
    });
  },
  // Mutations go through queues (Rivet docs: "actions are for reading, queues for mutating"):
  // one run loop = single writer, so duplicate `workKey` admits yield one WorkAttempt.
  queues: {
    admit: queue<AdmitRequest, AdmitResult>(),
    recover: queue<RecoverRequest, RecoverResult>(),
    /** Raw gateway/dry-run payload (apps/factory-gateway forwards this over the Rivet HTTP queue API). */
    admitFromPayload: queue<unknown, AdmitFromPayloadResult>(),
  },
  run: async (c) => {
    for await (const message of c.queue.iter({ completable: true })) {
      if (message.name === "admit") {
        const result = await c.vars.supervisor.admit(message.body as AdmitRequest);
        c.state.attempts = [...c.vars.supervisor.listAttempts()];
        await message.complete(result);
      } else if (message.name === "admitFromPayload") {
        const result = await admitFromPayload(c.vars.supervisor, message.body);
        c.state.attempts = [...c.vars.supervisor.listAttempts()];
        await message.complete(result);
      } else if (message.name === "recover") {
        const result = await c.vars.supervisor.recover(message.body as RecoverRequest);
        c.state.attempts = [...c.vars.supervisor.listAttempts()];
        await message.complete(result);
      }
    }
  },
  actions: {
    listAttempts: (c): WorkAttempt[] => [...c.state.attempts],
    getStale: (c): string[] => [...c.state.staleAttemptIds],
    /** Cron target. Pure internal-state scan; Rivet never polls Port. */
    sweepStale: (c): string[] => {
      const cutoff = Date.now() - STALE_ADMIT_MS;
      c.state.staleAttemptIds = c.state.attempts
        .filter((a) => a.status === "admitted" && Date.parse(a.updatedAt) < cutoff)
        .map((a) => a.workAttemptId);
      return [...c.state.staleAttemptIds];
    },
  },
});

export const registry = setup({ use: { projectSupervisor, agentSession } });
