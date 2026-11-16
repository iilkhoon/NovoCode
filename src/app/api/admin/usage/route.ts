import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { errorResponse, HttpError, rateLimit } from "@/lib/api/guard";
import { readMonth } from "@/lib/usage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/usage?month=YYYY-MM — AI calls, tokens and unique users. */
export async function GET(req: Request) {
  try {
    rateLimit(req, "admin", 60, 10 * 60_000);
    const pass = process.env.NOVO_ADMIN_PASSWORD;
    if (!pass) throw new HttpError(503, "NOVO_ADMIN_PASSWORD təyin edilməyib");
    const given = Buffer.from(req.headers.get("x-novo-admin") ?? "");
    if (given.length !== Buffer.byteLength(pass) || !timingSafeEqual(given, Buffer.from(pass))) throw new HttpError(401, "Şifrə yanlışdır");
    const month = new URL(req.url).searchParams.get("month") ?? undefined;
    if (month && !/^\d{4}-\d{2}$/.test(month)) throw new HttpError(400, "month=YYYY-MM");
    return NextResponse.json(await readMonth(month));
  } catch (e) {
    return errorResponse(e);
  }
}
