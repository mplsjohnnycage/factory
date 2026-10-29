import { createHmac, timingSafeEqual } from "node:crypto";
import type { PortWebhookHeaders } from "./types.js";

/**
 * Verify Port classic webhook HMAC-SHA-256 signature.
 *
 * Port signs `${timestamp}.${payload}` with the client secret, Base64-encodes
 * the digest, and prefixes version: `x-port-signature: v1,<base64>`.
 *
 * @see https://docs.port.io/create-self-service-experiences/setup-backend/webhook/signature-verification
 */
export function verifyPortWebhookHmac(args: {
  secret: string;
  rawBody: string;
  headers: PortWebhookHeaders;
}): boolean {
  const { secret, rawBody, headers } = args;
  if (!secret) return false;
  if (!headers.signature || !headers.timestamp) return false;

  const parts = headers.signature.split(",");
  if (parts.length < 2 || parts[0] !== "v1" || !parts[1]) return false;
  const provided = parts[1];

  const expected = createHmac("sha256", secret)
    .update(`${headers.timestamp}.${rawBody}`)
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Convenience: stringify a parsed JSON body the way Port's JS examples do. */
export function portJsonBody(body: unknown): string {
  return JSON.stringify(body);
}
