import "server-only";
import { isVisionModel, modelListHeaders, rankModels, type ModelInfo } from "./models";
import { loadConfig } from "./config";

/**
 * OpenAI-compatible model gateway. The built-in provider is NVIDIA (build.nvidia.com,
 * NVIDIA_API_KEY); the admin panel can add more (OpenRouter, Anthropic, OpenAI, a self-hosted
 * server…). Model ids of extra providers are qualified as "<providerId>::<model>".
 */
const NVIDIA = { id: "nvidia", name: "NVIDIA", baseUrl: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1", key: process.env.NVIDIA_API_KEY ?? "", enabled: true };
const SEP = "::";

interface Endpoint {
  id: string;
  name: string;
  baseUrl: string;
  key: string;
  enabled: boolean;
}

async function providers(): Promise<Endpoint[]> {
  const cfg = await loadConfig().catch(() => ({ providers: [] as Endpoint[] }));
  return [...(NVIDIA.key ? [NVIDIA] : []), ...cfg.providers.filter((p) => p.enabled && p.key)];
}

async function resolve(model: string): Promise<{ ep: Endpoint; model: string }> {
  const list = await providers();
  if (!list.length) throw new Error("NVIDIA_API_KEY təyin edilməyib (.env.local faylına əlavə edin) və ya admin paneldə provayder əlavə edin.");
  const i = model.indexOf(SEP);
  if (i > 0) {
    const ep = list.find((p) => p.id === model.slice(0, i));
    if (!ep) throw new Error(`Provayder tapılmadı: ${model.slice(0, i)}`);
    return { ep, model: model.slice(i + SEP.length) };
  }
  return { ep: list.find((p) => p.id === "nvidia") ?? list[0], model };
}

const modelCache = new Map<string, { at: number; ids: string[] }>();


async function fetchIds(ep: Endpoint): Promise<string[]> {
  const c = modelCache.get(ep.id + ep.baseUrl);
  if (c && Date.now() - c.at < 10 * 60_000) return c.ids;
  const res = await fetch(`${ep.baseUrl.replace(/\/$/, "")}/models`, { headers: modelListHeaders(ep), cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${ep.name} modelləri alınmadı: ${res.status}`);
  const data = (await res.json()) as { data: { id: string }[] };
  const ids = data.data.map((m) => m.id);
  modelCache.set(ep.id + ep.baseUrl, { at: Date.now(), ids });
  return ids;
}

/** All models users may pick: ranked NVIDIA models + every model of extra providers, minus hidden ones. */
export async function listModels(): Promise<ModelInfo[]> {
  const [list, cfg] = await Promise.all([providers(), loadConfig().catch(() => ({ models: [] as { id: string; label?: string; visible?: boolean }[] }))]);
  if (!list.length) throw new Error("NVIDIA_API_KEY təyin edilməyib (.env.local faylına əlavə edin).");
  const out: ModelInfo[] = [];
  const errors: string[] = [];
  const settings = new Map(cfg.models.map((m) => [m.id, m]));
  await Promise.all(
    list.map(async (ep) => {
      try {
        const ids = await fetchIds(ep);
        if (ep.id === "nvidia") out.push(...rankModels(ids));
        // extra providers can list hundreds of models: only the ones the admin switched on
        else
          for (const id of ids) {
            const q = `${ep.id}${SEP}${id}`;
            if (settings.get(q)?.visible === true) out.push({ id: q, label: `${id.split("/").pop()} · ${ep.name}`, vision: isVisionModel(id), rank: -1 });
          }
      } catch (e) {
        errors.push((e as Error).message);
      }
    })
  );
  if (!out.length && errors.length) throw new Error(errors.join("; "));
  return out
    .filter((m) => settings.get(m.id)?.visible !== false)
    .map((m) => (settings.get(m.id)?.label ? { ...m, label: settings.get(m.id)!.label! } : m))
    .sort((a, b) => a.rank - b.rank);
}

/** Default model: env override, then the admin's choice. */
export async function preferredModel(): Promise<string | undefined> {
  return process.env.NOVO_DEFAULT_MODEL || (await loadConfig().catch(() => null))?.defaultModel || undefined;
}

/** Raw model ids per provider, for the admin panel. */
export async function listAllModelIds(): Promise<{ provider: string; ids: string[]; error?: string }[]> {
  const list = await providers();
  return Promise.all(
    list.map(async (ep) => {
      try {
        const ids = await fetchIds(ep);
        return { provider: ep.id, ids: ep.id === "nvidia" ? rankModels(ids).map((m) => m.id) : ids.map((id) => `${ep.id}${SEP}${id}`) };
      } catch (e) {
        return { provider: ep.id, ids: [], error: (e as Error).message };
      }
    })
  );
}

export type ChatContent = string | ({ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } })[];
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: ChatContent;
}

export type StreamEvent = { kind: "delta"; text: string } | { kind: "reasoning" } | { kind: "usage"; tokens: number };

/** Streams a chat completion from the model's provider (OpenAI-compatible SSE). */
export async function* streamChat(opts: {
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
}): AsyncGenerator<StreamEvent> {
  const { ep, model } = await resolve(opts.model);
  const res = await fetch(`${ep.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ep.key}`, "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      stream: true,
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: opts.maxTokens ?? 16384,
      // NVIDIA's reasoning models otherwise think silently for 30s–minutes before the first word;
      // for site building, starting to write at once matters more (other providers may reject the field)
      ...(ep.id === "nvidia" ? { chat_template_kwargs: { enable_thinking: false } } : {}),
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`${ep.name} API xətası ${res.status}: ${body.slice(0, 400)}`);
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
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const j = JSON.parse(payload);
        const d = j.choices?.[0]?.delta ?? {};
        if (d.content) yield { kind: "delta", text: d.content };
        else if (d.reasoning_content || d.reasoning) yield { kind: "reasoning" };
        if (j.usage?.total_tokens) yield { kind: "usage", tokens: j.usage.total_tokens };
      } catch {
        /* ignore keep-alive / partial lines */
      }
    }
  }
}
