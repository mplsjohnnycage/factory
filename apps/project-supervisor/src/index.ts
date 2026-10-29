import { MemoryMetaBeads } from "./meta-beads.js";
import { MemoryCatalogWriter } from "./memory-catalog.js";
import { ProjectSupervisorActor } from "./project-supervisor.js";

export type {
  AdmitOk,
  AdmitRefused,
  AdmitRequest,
  AdmitResult,
  CatalogEntity,
  CatalogWriteRequest,
  CatalogWriteResult,
  CatalogWriterPort,
  ReadyTaskEvent,
  RecoverRequest,
  RecoverResult,
  WorkAttempt,
  WorkAttemptStatus,
} from "./types.js";
export type { MetaBeadsGate, MemoryBead } from "./meta-beads.js";
export { MemoryMetaBeads } from "./meta-beads.js";
export { MemoryCatalogWriter } from "./memory-catalog.js";
export { PortProjectionMapper } from "./port-projections.js";
export { ProjectSupervisorActor } from "./project-supervisor.js";

/** Local dry-run: Memory Meta Beads + Memory catalog (no live Port / bd). */
export function createMemorySupervisor(): {
  supervisor: ProjectSupervisorActor;
  beads: MemoryMetaBeads;
  catalog: MemoryCatalogWriter;
} {
  const beads = new MemoryMetaBeads();
  const catalog = new MemoryCatalogWriter();
  const supervisor = new ProjectSupervisorActor({ beads, catalog });
  return { supervisor, beads, catalog };
}

