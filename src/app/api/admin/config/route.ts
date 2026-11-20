import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { assertSameOrigin, errorResponse, HttpError, rateLimit, readJson } from "@/lib/api/guard";
import { loadConfig, saveConfig, type AiConfig } from "@/lib/ai/config";
import { catalog } from "@/lib/ai/openrouter";
import { configuredModels } from "@/lib/ai/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Admin API: needs the NOVO_ADMIN_PASSWORD in the x-novo-admin header. */
function authorize(req: Request) {
  rateLimit(req, "admin", 60, 10 * 60_000);
  const pass = process.env.NOVO_ADMIN_PASSWORD;
  if (!pass) throw new HttpError(503, "Admin panel bağlıdır: serverdə NOVO_ADMIN_PASSWORD təyin edin.");
  const given = Buffer.from(req.headers.get("x-novo-admin") ?? "");
  const want = Buffer.from(pass);
  if (given.length !== want.length || !timingSafeEqual(given, want)) throw new HttpError(401, "Şifrə yanlışdır");
}

async function view(cfg: AiConfig) {
  let ids: string[] = [];
  let error: string | undefined;
  try {
    ids = (await catalog()).map((m) => m.id);
  } catch (e) {
    error = (e as Error).message;
  }
  return {
    ...cfg,
    openrouter: { configured: !!process.env.OPENROUTER_API_KEY },
    builtIn: configuredModels(),
    catalog: [{ provider: "openrouter", ids, error }],
  };
}

export async function GET(req: Request) {
  try {
    authorize(req);
    return NextResponse.json(await view(await loadConfig()));
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PUT(req: Request) {
  try {
    assertSameOrigin(req);
    authorize(req);
    const body = await readJson<AiConfig>(req, 256 * 1024);
    const models = (body.models ?? []).slice(0, 2000).map((m) => ({ id: String(m.id).slice(0, 200), label: m.label ? String(m.label).slice(0, 80) : undefined, credits: Number.isFinite(m.credits) ? Number(m.credits) : undefined, visible: m.visible }));
    const next: AiConfig = { models, defaultModel: body.defaultModel ? String(body.defaultModel).slice(0, 200) : undefined };
    await saveConfig(next);
    return NextResponse.json(await view(next));
  } catch (e) {
    return errorResponse(e);
  }
}
