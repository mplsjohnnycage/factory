import { registry } from "@factory/project-supervisor/rivet";

/**
 * Rivet serverless endpoint. Register `https://<app>/api/rivet` in the Rivet
 * dashboard connect form. Specific routes under /api/rivet/sessions/* take
 * precedence over this catch-all.
 * Env (Vercel only, never committed): RIVET_ENDPOINT (secret), RIVET_PUBLIC_ENDPOINT.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const handler = (req: Request) => registry.handler(req);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
