/**
 * Canonical Software Factory workflow identifiers (live Port + Spec).
 * Do not invent parallel names — bind these exact IDs only.
 *
 * @see specs/port-governance/spec.md
 * @see ADR-003 Port → webhook → factory-gateway → ProjectSupervisor
 */
export const FACTORY_WORKFLOW_IDS = [
  "factory_create_execution_contract",
  "factory_start_delivery_run",
  "factory_claim_next_job",
  "factory_heartbeat",
  "factory_submit_evidence",
  "factory_record_review_verdict",
  "factory_request_release",
] as const;

export type FactoryWorkflowId = (typeof FACTORY_WORKFLOW_IDS)[number];

const ALLOWED = new Set<string>(FACTORY_WORKFLOW_IDS);

export function isFactoryWorkflowId(value: string): value is FactoryWorkflowId {
  return ALLOWED.has(value);
}

/**
 * Resolve action identifier from Port classic webhook body and/or path suffix.
 * Path wins only when allowlisted (Port WEBHOOK node URL template).
 */
export function resolveFactoryActionIdentifier(args: {
  pathAction?: string;
  body: Record<string, unknown>;
}): string | undefined {
  if (args.pathAction && isFactoryWorkflowId(args.pathAction)) {
    return args.pathAction;
  }
  if (typeof args.body.action === "string" && args.body.action.length > 0) {
    return args.body.action;
  }
  if (
    typeof args.body.actionIdentifier === "string" &&
    args.body.actionIdentifier.length > 0
  ) {
    return args.body.actionIdentifier;
  }
  const ctx = args.body.context;
  if (ctx && typeof ctx === "object" && ctx !== null) {
    const action = (ctx as { action?: unknown }).action;
    if (typeof action === "string" && action.length > 0) return action;
  }
  return undefined;
}
