/**
 * Thin Convex Management API client for Meta self-service handlers.
 * @see https://docs.convex.dev/management-api
 * @see https://api.convex.dev/v1/openapi.json
 */

export const CONVEX_MANAGEMENT_BASE = "https://api.convex.dev/v1";

export type ConvexDeploymentKind = "dev" | "prod" | "preview" | "custom";

export type CreateDeploymentInput = {
  projectId: string | number;
  type: ConvexDeploymentKind;
  /** Branch / unique ref for preview (and multi-dev) deployments. */
  reference?: string;
};

export type CreateDeploymentResult = {
  id: string;
  name: string;
  deploymentType: string;
  projectId: number | string;
  deploymentUrl?: string;
  reference?: string | null;
  region?: string;
};

export type SetDefaultEnvInput = {
  projectId: string | number;
  name: string;
  deploymentType: ConvexDeploymentKind;
  value: string;
};

export type ConvexManagementClient = {
  createDeployment(input: CreateDeploymentInput): Promise<CreateDeploymentResult>;
  setDefaultEnv(input: SetDefaultEnvInput): Promise<void>;
};

export type ConvexFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export function createConvexManagementClient(args: {
  teamToken: string;
  fetchImpl?: ConvexFetch;
  baseUrl?: string;
}): ConvexManagementClient {
  const fetchImpl = args.fetchImpl ?? fetch;
  const base = (args.baseUrl ?? CONVEX_MANAGEMENT_BASE).replace(/\/$/, "");
  const auth = `Bearer ${args.teamToken}`;

  async function requestJson<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await fetchImpl(`${base}${path}`, {
      method,
      headers: {
        authorization: auth,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = { raw: text };
      }
    }
    if (!res.ok) {
      const detail =
        typeof parsed === "object" && parsed !== null
          ? JSON.stringify(parsed)
          : text || res.statusText;
      throw new Error(`convex_management_${res.status}:${detail}`);
    }
    return parsed as T;
  }

  return {
    async createDeployment(input) {
      const projectId = encodeURIComponent(String(input.projectId));
      const payload: Record<string, unknown> = { type: input.type };
      if (input.reference) {
        payload.reference = input.reference;
        payload.isDefault = false;
      }
      return requestJson<CreateDeploymentResult>(
        "POST",
        `/projects/${projectId}/create_deployment`,
        payload,
      );
    },

    async setDefaultEnv(input) {
      const projectId = encodeURIComponent(String(input.projectId));
      await requestJson<unknown>(
        "POST",
        `/projects/${projectId}/update_default_environment_variables`,
        {
          changes: [
            {
              name: input.name,
              deploymentType: input.deploymentType,
              value: input.value,
            },
          ],
        },
      );
    },
  };
}
