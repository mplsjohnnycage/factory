/**
 * Gateway rate limiter (PBI-012 / security-blast-radius).
 *
 * Sliding-window counter per key. Applied on mutating gateway routes.
 * Meta lane — in-process only (no shared Redis for M1+/pilot).
 */

export type RateLimitConfig = {
  /** Max requests per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export type RateLimitResult =
  | { ok: true; remaining: number; limit: number; resetAt: number }
  | {
      ok: false;
      remaining: 0;
      limit: number;
      resetAt: number;
      retryAfterSec: number;
    };

type Bucket = {
  timestamps: number[];
};

export class SlidingWindowRateLimiter {
  readonly #config: RateLimitConfig;
  readonly #buckets = new Map<string, Bucket>();

  constructor(config: RateLimitConfig) {
    this.#config = config;
  }

  get config(): RateLimitConfig {
    return this.#config;
  }

  /** Clear all buckets (tests). */
  reset(): void {
    this.#buckets.clear();
  }

  /**
   * Attempt to consume one unit for `key`.
   * Returns ok:false when over limit (caller should respond 429).
   */
  take(key: string, nowMs: number = Date.now()): RateLimitResult {
    const { limit, windowMs } = this.#config;
    const bucket = this.#buckets.get(key) ?? { timestamps: [] };
    const cutoff = nowMs - windowMs;
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

    if (bucket.timestamps.length >= limit) {
      const oldest = bucket.timestamps[0] ?? nowMs;
      const resetAt = oldest + windowMs;
      this.#buckets.set(key, bucket);
      return {
        ok: false,
        remaining: 0,
        limit,
        resetAt,
        retryAfterSec: Math.max(1, Math.ceil((resetAt - nowMs) / 1000)),
      };
    }

    bucket.timestamps.push(nowMs);
    this.#buckets.set(key, bucket);
    const remaining = Math.max(0, limit - bucket.timestamps.length);
    const resetAt =
      (bucket.timestamps[0] ?? nowMs) + windowMs;
    return { ok: true, remaining, limit, resetAt };
  }
}

export function rateLimitConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): RateLimitConfig {
  const limit = Number(env.GATEWAY_RATE_LIMIT_RPM ?? "60");
  const windowMs = Number(env.GATEWAY_RATE_LIMIT_WINDOW_MS ?? String(60_000));
  return {
    limit: Number.isFinite(limit) && limit > 0 ? limit : 60,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 60_000,
  };
}

/** Prefer client IP / fleet id / explicit header for the rate-limit key. */
export function rateLimitKeyFromRequest(input: {
  headers: Record<string, string | string[] | undefined>;
  remoteAddress?: string;
  path: string;
}): string {
  const fleet = header(input.headers, "x-factory-fleet");
  if (fleet) return `fleet:${fleet}`;
  const forwarded = header(input.headers, "x-forwarded-for");
  if (forwarded) return `ip:${forwarded.split(",")[0]!.trim()}`;
  if (input.remoteAddress) return `ip:${input.remoteAddress}`;
  return `path:${input.path}`;
}

function header(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const v = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}
