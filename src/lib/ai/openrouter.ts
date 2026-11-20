import "server-only";
import { brandName, configuredModels, type ModelInfo } from "./models";
import { loadConfig } from "./config";

/**
 * The only AI gateway: OpenRouter (https://openrouter.ai), one key for every model family.
 * OPENROUTER_API_KEY lives in .env.local on the server and never reaches the browser.
 */
const BASE_URL = "https://openrouter.ai/api/v1";

function apiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_API_KEY təyin edilməyib (.env.local faylına əlavə edin).");
  return key;
}

const headers = (key: string) => ({
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  // shown on openrouter.ai activity pages
  "HTTP-Referer": process.env.NOVO_SITE_URL || "https://novocode.app",
  "X-Title": "NovoCode",
});

interface CatalogEntry {
  id: string;
  name: string;
  vision: boolean;
  maxOutput?: number;
}

let catalogCache: { at: number; list: CatalogEntry[] } | null = null;

/** Every model OpenRouter offers (cached 10 minutes). */
export async function catalog(): Promise<CatalogEntry[]> {
  if (catalogCache && Date.now() - catalogCache.at < 10 * 60_000) return catalogCache.list;
  const res = await fetch(`${BASE_URL}/models`, { headers: headers(apiKey()), cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`OpenRouter modelləri alınmadı: ${res.status}`);
  const data = (await res.json()) as {
    data: { id: string; name: string; architecture?: { input_modalities?: string[] }; top_provider?: { max_completion_tokens?: number | null } }[];
  };
  const list = data.data.map((m) => ({
    id: m.id,
    name: m.name.replace(/^[^:]+:\s*/, "").replace(/\s*\(free\)\s*$/i, ""),
    vision: !!m.architecture?.input_modalities?.includes("image"),
    maxOutput: m.top_provider?.max_completion_tokens ?? undefined,
  }));
  catalogCache = { at: Date.now(), list };
  return list;
}

/** Models users may pick: NOVO_MODELS (or the free defaults) plus any the admin switched on. */
export async function listModels(): Promise<ModelInfo[]> {
  const [all, cfg] = await Promise.all([catalog(), loadConfig()]);
  const byId = new Map(all.map((m) => [m.id, m]));
  const settings = new Map(cfg.models.map((m) => [m.id, m]));
  const wanted = [...configuredModels(), ...cfg.models.filter((m) => m.visible === true).map((m) => m.id)];
  const out: ModelInfo[] = [];
  for (const id of [...new Set(wanted)]) {
    const m = byId.get(id);
    if (!m || settings.get(id)?.visible === false) continue; // retired upstream or hidden by the admin
    const rank = out.length;
    out.push({ id, label: settings.get(id)?.label || brandName(rank) || m.name, vision: m.vision, rank });
  }
  if (!out.length) throw new Error("NOVO_MODELS-dəki modellərin heç biri OpenRouter-də tapılmadı.");
  return out;
}

/** Default model: env override, then the admin's choice (otherwise the first listed). */
export async function preferredModel(): Promise<string | undefined> {
  return process.env.NOVO_DEFAULT_MODEL || (await loadConfig()).defaultModel;
}

export type ChatContent = string | ({ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } })[];
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: ChatContent;
}

export type StreamEvent = { kind: "delta"; text: string } | { kind: "reasoning" } | { kind: "usage"; tokens: number } | { kind: "length" };

/** Streams a chat completion from OpenRouter (OpenAI-compatible SSE). */
export async function* streamChat(opts: {
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
}): AsyncGenerator<StreamEvent> {
  const key = apiKey();
  const info = (await catalog().catch(() => [] as CatalogEntry[])).find((m) => m.id === opts.model);
  // big budgets let a whole site fit in one reply; never ask for more than the model can give
  const want = opts.maxTokens ?? 48_000;
  const maxTokens = info?.maxOutput ? Math.min(want, info.maxOutput) : want;
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { ...headers(key), Accept: "text/event-stream" },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: true,
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: maxTokens,
      // some models (ERNIE) refuse to switch thinking off: keep it short so code starts quickly
      reasoning: { effort: "low" },
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    let msg = body.slice(0, 400);
    try {
      const j = JSON.parse(body);
      msg = j.error?.metadata?.raw || j.error?.message || msg;
    } catch {}
    throw new Error(`OpenRouter xətası ${res.status}: ${msg}`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      // ": OPENROUTER PROCESSING" keep-alive comments and blank lines are skipped
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      let j;
      try { j = JSON.parse(payload); } catch { continue; }
      if (j.error) throw new Error(`OpenRouter: ${j.error.metadata?.raw || j.error.message || "stream xətası"}`);
      const choice = j.choices?.[0];
      const d = choice?.delta ?? {};
      if (d.content) yield { kind: "delta", text: d.content };
      else if (d.reasoning || d.reasoning_content || d.reasoning_details?.length) yield { kind: "reasoning" };
      if (j.usage?.total_tokens) yield { kind: "usage", tokens: j.usage.total_tokens };
      if (choice?.finish_reason === "length") { yield { kind: "length" }; return; }
      if (choice?.finish_reason === "error") throw new Error("OpenRouter: model cavabı yarıda kəsdi");
    }
  }
}
