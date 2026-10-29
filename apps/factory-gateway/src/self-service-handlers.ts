/**
 * Port NEEDS HANDLER self-service dispatch (Meta lane).
 *
 * Meta-wired: ss_convex_create_preview, ss_convex_set_env
 * Product stubs (Prospect / Painter): explicit 501 — not Meta kernel path
 */

import { timingSafeEqual } from "node:crypto";
import type { CatalogWriter } from "./catalog-writer.js";
import {
  createConvexManagementClient,
  type ConvexDeploymentKind,
  type ConvexManagementClient,
} from "./convex-management.js";

export const META_SELF_SERVICE_ACTIONS = [
  "ss_convex_create_preview",
  "ss_convex_set_env",
] as const;

export const PRODUCT_SELF_SERVICE_STUBS = [
  "ss_painter_create_tenant_site",
  "ss_prospect_qualify",
  "ss_prospect_generate_site",
  "ss_prospect_request_outreach",
  "ss_prospect_run_discovery",
] as const;

export type MetaSelfServiceAction = (typeof META_SELF_SERVICE_ACTIONS)[number];
export type ProductSelfServiceStub = (typeof PRODUCT_SELF_SERVICE_STUBS)[number];

export type SelfServiceRequest = {
  action: string;
  runId?: string;
  product?: string;
  kind?: string;
  branch?: string;
  deployment?: string;
  key?: string;
  value?: string;
  convexProjectId?: string | number;
};

export type SelfServiceOk = {
  ok: true;
  action: string;
  lane: "meta";
  result: Record<string, unknown>;
};

export type SelfServiceErr = {
  ok: false;
  action: string;
  error: string;
  lane?: "meta" | "product";
  detail?: string;
};

export type SelfServiceResult = SelfServiceOk | SelfServiceErr;

export type SelfServiceHandlerDeps = {
  convex?: ConvexManagementClient | null;
  writer?: CatalogWriter;
  /** When true and Convex token missing, return structured missing_credentials instead of throwing. */
  allowMissingCredentials?: boolean;
};

const META_SET = new Set<string>(META_SELF_SERVICE_ACTIONS);
const PRODUCT_SET = new Set<string>(PRODUCT_SELF_SERVICE_STUBS);

function asDeploymentKind(raw: string | undefined): ConvexDeploymentKind | null {
  if (raw === "dev" || raw === "prod" || raw === "preview" || raw === "custom") {
    return raw;
  }
  return null;
}

function requireProjectId(
  body: SelfServiceRequest,
): { ok: true; projectId: string } | SelfServiceErr {
  if (
    body.convexProjectId === undefined ||
    body.convexProjectId === null ||
    String(body.convexProjectId).trim() === ""
  ) {
    return {
      ok: false,
      action: body.action,
      error: "convex_project_id_required",
      lane: "meta",
      detail: "Pass convexProjectId (Convex Management project id).",
    };
  }
  return { ok: true, projectId: String(body.convexProjectId).trim() };
}

export function verifyHandlerBearer(args: {
  expectedToken: string;
  authorizationHeader: string;
}): boolean {
  const { expectedToken, authorizationHeader } = args;
  if (!expectedToken) return false;
  const m = /^Bearer\s+(.+)$/i.exec(authorizationHeader.trim());
  if (!m?.[1]) return false;
  const provided = Buffer.from(m[1]);
  const expected = Buffer.from(expectedToken);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function dispatchSelfService(
  body: SelfServiceRequest,
  deps: SelfServiceHandlerDeps = {},
): Promise<SelfServiceResult> {
  const action = String(body.action ?? "").trim();
  if (!action) {
    return { ok: false, action: "", error: "action_required" };
  }

  if (PRODUCT_SET.has(action)) {
    return {
      ok: false,
      action,
      error: "product_lane_stub",
      lane: "product",
      detail:
        "Prospect / Painter OS handlers are Product lane — not Factory Meta kernel. Keep Port CONDITION stub until Product owns the backend.",
    };
  }

  if (!META_SET.has(action)) {
    return {
      ok: false,
      action,
      error: "unknown_self_service_action",
      detail: `Meta wires: ${META_SELF_SERVICE_ACTIONS.join(", ")}`,
    };
  }

  if (action === "ss_convex_create_preview") {
    return handleConvexCreatePreview(body, deps);
  }
  return handleConvexSetEnv(body, deps);
}

async function handleConvexCreatePreview(
  body: SelfServiceRequest,
  deps: SelfServiceHandlerDeps,
): Promise<SelfServiceResult> {
  const kind = asDeploymentKind(body.kind) ?? "preview";
  if (kind !== "preview" && kind !== "dev") {
    return {
      ok: false,
      action: body.action,
      error: "unsupported_deployment_kind",
      lane: "meta",
      detail: "ss_convex_create_preview supports kind=preview|dev only",
    };
  }
  const project = requireProjectId(body);
  if (!project.ok) return project;

  if (!deps.convex) {
    if (deps.allowMissingCredentials) {
      return {
        ok: false,
        action: body.action,
        error: "missing_credentials",
        lane: "meta",
        detail: "CONVEX_TEAM_TOKEN unset on factory-gateway",
      };
    }
    return {
      ok: false,
      action: body.action,
      error: "missing_credentials",
      lane: "meta",
      detail: "CONVEX_TEAM_TOKEN unset on factory-gateway",
    };
  }

  const reference =
    kind === "preview"
      ? (body.branch?.trim() || `preview-${body.product ?? "meta"}`)
      : body.branch?.trim() || undefined;

  const created = await deps.convex.createDeployment({
    projectId: project.projectId,
    type: kind,
    reference,
  });

  if (deps.writer && created.name) {
    await deps.writer.apply({
      blueprint: "convexDeployment",
      entityIdentifier: created.name,
      expectedCatalogVersion: 0,
      patch: {
        projectId: String(created.projectId ?? project.projectId),
        deploymentId: String(created.id),
        deploymentName: created.name,
        deploymentType: created.deploymentType ?? kind,
        deploymentUrl: created.deploymentUrl ?? "",
        region: created.region ?? "",
        state: "created",
        product: body.product ?? "",
        runId: body.runId ?? "",
      },
    });
  }

  return {
    ok: true,
    action: body.action,
    lane: "meta",
    result: {
      deploymentName: created.name,
      deploymentId: created.id,
      deploymentType: created.deploymentType ?? kind,
      deploymentUrl: created.deploymentUrl ?? null,
      reference: created.reference ?? reference ?? null,
      product: body.product ?? null,
    },
  };
}

async function handleConvexSetEnv(
  body: SelfServiceRequest,
  deps: SelfServiceHandlerDeps,
): Promise<SelfServiceResult> {
  const key = body.key?.trim() ?? "";
  if (!key || !/^[A-Z_][A-Z0-9_]*$/.test(key)) {
    return {
      ok: false,
      action: body.action,
      error: "invalid_env_key",
      lane: "meta",
    };
  }
  if (typeof body.value !== "string" || body.value.length === 0) {
    return {
      ok: false,
      action: body.action,
      error: "value_required",
      lane: "meta",
      detail: "Pass value from Port trigger (use Port secret input for secrets).",
    };
  }
  const deployment = asDeploymentKind(body.deployment);
  if (!deployment || deployment === "custom") {
    return {
      ok: false,
      action: body.action,
      error: "invalid_deployment_type",
      lane: "meta",
      detail: "deployment must be dev|preview|prod",
    };
  }
  const project = requireProjectId(body);
  if (!project.ok) return project;

  if (!deps.convex) {
    return {
      ok: false,
      action: body.action,
      error: "missing_credentials",
      lane: "meta",
      detail: "CONVEX_TEAM_TOKEN unset on factory-gateway",
    };
  }

  await deps.convex.setDefaultEnv({
    projectId: project.projectId,
    name: key,
    deploymentType: deployment,
    value: body.value,
  });

  return {
    ok: true,
    action: body.action,
    lane: "meta",
    result: {
      key,
      deployment,
      product: body.product ?? null,
      convexProjectId: project.projectId,
      note: "default_env_upserted_via_convex_management_api",
    },
  };
}

export function convexClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ConvexManagementClient | null {
  const token = env.CONVEX_TEAM_TOKEN?.trim() ?? "";
  if (!token) return null;
  return createConvexManagementClient({ teamToken: token });
}
