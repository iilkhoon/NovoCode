import { NextResponse } from "next/server";
import { assertSameOrigin, errorResponse, rateLimit, readJson } from "@/lib/api/guard";
import { PublishError, publishSite, siteUrl } from "@/lib/publish/sites";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY = 40 * 1024 * 1024;
const MAX_FILES = 600;

interface Body {
  slug: string;
  name?: string;
  token?: string;
  files: Record<string, string>; // base64
}

/** POST /api/publish — store a built site and return its public URL + owner token. */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    rateLimit(req, "publish", 20, 10 * 60_000);
    const b = await readJson<Body>(req, MAX_BODY);
    if (!b || typeof b.slug !== "string" || !b.files || typeof b.files !== "object") return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 });
    const list = Object.entries(b.files);
    if (list.length > MAX_FILES) return NextResponse.json({ error: "Çox fayl var" }, { status: 413 });
    const files: Record<string, Buffer> = {};
    for (const [p, v] of list) if (typeof v === "string") files[p] = Buffer.from(v, "base64");
    const { token, meta } = await publishSite({ slug: b.slug.toLowerCase(), name: b.name ?? b.slug, token: b.token, files });
    return NextResponse.json({ url: siteUrl(meta.slug, req), slug: meta.slug, token, updatedAt: meta.updatedAt });
  } catch (e) {
    if (e instanceof PublishError) return NextResponse.json({ error: e.message, suggestion: e.suggestion }, { status: e.status });
    return errorResponse(e);
  }
}
