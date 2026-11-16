import { NextResponse } from "next/server";
import { assertSameOrigin, errorResponse, HttpError, rateLimit, readJson } from "@/lib/api/guard";
import { importRepo } from "@/lib/import/github";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** POST { repo } → { name, files, skipped } for a public GitHub repository. */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    rateLimit(req, "import-github", 10, 10 * 60_000);
    const b = await readJson<{ repo?: string }>(req, 4 * 1024);
    if (!b?.repo) throw new HttpError(400, "Repo linki tələb olunur");
    try {
      return NextResponse.json(await importRepo(b.repo));
    } catch (e) {
      throw new HttpError(422, (e as Error).message);
    }
  } catch (e) {
    return errorResponse(e);
  }
}
