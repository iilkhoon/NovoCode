import { NextResponse } from "next/server";
import { assertSameOrigin, errorResponse, HttpError, rateLimit, readJson } from "@/lib/api/guard";
import { fetchPublicHtml } from "@/lib/import/safe-fetch";
import { briefFromHtml, briefToPrompt } from "@/lib/import/reference";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST { url, copyText?, note? } → { brief, prompt } for "clone a site". */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    rateLimit(req, "import-url", 20, 10 * 60_000);
    const b = await readJson<{ url?: string; copyText?: boolean; note?: string }>(req, 8 * 1024);
    if (!b?.url || typeof b.url !== "string") throw new HttpError(400, "Link tələb olunur");
    const raw = /^https?:\/\//i.test(b.url) ? b.url : `https://${b.url}`;
    let page;
    try {
      page = await fetchPublicHtml(raw);
    } catch (e) {
      throw new HttpError(422, (e as Error).message);
    }
    const brief = briefFromHtml(page.html, page.url);
    if (!brief.title && !brief.headings.length) throw new HttpError(422, "Səhifədən məzmun oxunmadı (sayt JavaScript ilə yüklənir). Ekran görüntüsü atın — dizaynı şəkildən quraq.");
    return NextResponse.json({ brief, prompt: briefToPrompt(brief, { copyText: !!b.copyText, note: typeof b.note === "string" ? b.note.slice(0, 500) : undefined }) });
  } catch (e) {
    return errorResponse(e);
  }
}
