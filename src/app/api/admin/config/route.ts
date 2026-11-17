import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { assertSameOrigin, errorResponse, HttpError, rateLimit, readJson } from "@/lib/api/guard";
import { loadConfig, maskKey, saveConfig, type AiConfig, type ProviderConfig } from "@/lib/ai/config";
import { listAllModelIds } from "@/lib/ai/nvidia";

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

const view = (cfg: AiConfig) => ({
  ...cfg,
  providers: cfg.providers.map((p) => ({ ...p, key: maskKey(p.key), hasKey: !!p.key })),
  nvidia: { configured: !!process.env.NVIDIA_API_KEY },
  deepseek: { configured: !!process.env.DEEPSEEK_API_KEY },
});

export async function GET(req: Request) {
  try {
    authorize(req);
    const cfg = await loadConfig();
    const catalog = await listAllModelIds();
    return NextResponse.json({ ...view(cfg), catalog });
  } catch (e) {
    return errorResponse(e);
  }
}

const ID_RE = /^[a-z0-9][a-z0-9-]{1,23}$/;

export async function PUT(req: Request) {
  try {
    assertSameOrigin(req);
    authorize(req);
    const body = await readJson<AiConfig>(req, 256 * 1024);
    const current = await loadConfig();
    const providers: ProviderConfig[] = [];
    for (const p of body.providers ?? []) {
      if (!ID_RE.test(p.id) || p.id === "nvidia") throw new HttpError(400, `Yanlış provayder id: ${p.id}`);
      let url: URL;
      try {
        url = new URL(p.baseUrl);
      } catch {
        throw new HttpError(400, `Yanlış API ünvanı: ${p.baseUrl}`);
      }
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new HttpError(400, "API ünvanı http(s) olmalıdır");
      const old = current.providers.find((x) => x.id === p.id);
      // the client only ever sees masked keys: keep the stored one unless a new key was typed
      const key = p.key && !p.key.includes("…") && p.key !== "••••" ? p.key.trim() : (old?.key ?? "");
      providers.push({ id: p.id, name: String(p.name).slice(0, 60), baseUrl: url.toString().replace(/\/$/, ""), key, enabled: !!p.enabled });
    }
    const models = (body.models ?? []).slice(0, 2000).map((m) => ({ id: String(m.id).slice(0, 200), label: m.label ? String(m.label).slice(0, 80) : undefined, credits: Number.isFinite(m.credits) ? Number(m.credits) : undefined, visible: m.visible }));
    const next: AiConfig = { providers, models, defaultModel: body.defaultModel ? String(body.defaultModel).slice(0, 200) : undefined };
    await saveConfig(next);
    return NextResponse.json(view(next));
  } catch (e) {
    return errorResponse(e);
  }
}
