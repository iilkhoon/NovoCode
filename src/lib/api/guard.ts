/**
 * Lightweight protection for the AI routes. The NVIDIA key lives on the
 * server, so without this anyone could use /api/chat as a free proxy.
 */

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Reject cross-site calls: browsers always send Origin on cross-origin POSTs. */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) {
    // Browsers send Origin on every POST (same-origin too), so a missing header
    // means a script. Allowed in dev (curl, tests), refused in production.
    if (process.env.NODE_ENV === "production" && req.method !== "GET" && req.method !== "HEAD") {
      throw new HttpError(403, "Bu API yalnız NovoCode saytından istifadə oluna bilər");
    }
    return;
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Etibarsız mənbə");
  }
  if (originHost !== host) throw new HttpError(403, "Bu API yalnız NovoCode saytından istifadə oluna bilər");
}

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/** Fixed-window, in-memory rate limit per client IP (per server instance). */
export function rateLimit(req: Request, name: string, limit: number, windowMs: number, now = Date.now()) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const key = `${name}:${ip}`;
  const b = buckets.get(key);
  if (!b || now >= b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 10_000) for (const [k, v] of buckets) if (now >= v.reset) buckets.delete(k);
    return;
  }
  if (++b.count > limit) {
    const sec = Math.ceil((b.reset - now) / 1000);
    throw new HttpError(429, `Çox sorğu göndərildi. ${sec} saniyə sonra yenidən cəhd edin.`);
  }
}

/** Parse a JSON body, refusing anything larger than `maxBytes`. */
export async function readJson<T>(req: Request, maxBytes: number): Promise<T> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) throw new HttpError(413, "Sorğu çox böyükdür");
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "Sorğu çox böyükdür");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Yanlış JSON");
  }
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
  return Response.json({ error: (e as Error).message ?? "Xəta" }, { status: 500 });
}

/** Only inline images; never let the model provider fetch arbitrary URLs. */
export const isDataImage = (s: unknown): s is string =>
  typeof s === "string" && /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(s);

/** @internal test helper */
export function _resetRateLimits() {
  buckets.clear();
}
