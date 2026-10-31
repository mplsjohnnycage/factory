import { actor, setup } from "rivetkit";
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
type Vars = { supervisor: ProjectSupervisorActor; chain: Promise<unknown> };

export const projectSupervisor = actor({
  state: { attempts: [] as WorkAttempt[] },
  createVars: (c): Vars => {
    const supervisor = new ProjectSupervisorActor({
      beads: new MemoryMetaBeads(),
      catalog: new MemoryCatalogWriter(),
    });
    supervisor.seed(c.state.attempts);
    return { supervisor, chain: Promise.resolve() };
  },
  actions: {
    admit: async (c, request: AdmitRequest): Promise<AdmitResult> => {
      const run = c.vars.chain.then(async () => {
        const result = await c.vars.supervisor.admit(request);
        c.state.attempts = [...c.vars.supervisor.listAttempts()];
        return result;
      });
      c.vars.chain = run.catch(() => undefined);
      return run;
    },
    recover: async (c, request: RecoverRequest): Promise<RecoverResult> => {
      const run = c.vars.chain.then(async () => {
        const result = await c.vars.supervisor.recover(request);
        c.state.attempts = [...c.vars.supervisor.listAttempts()];
        return result;
      });
      c.vars.chain = run.catch(() => undefined);
      return run;
    },
    listAttempts: (c): WorkAttempt[] => [...c.state.attempts],
  },
});

export const registry = setup({ use: { projectSupervisor } });
