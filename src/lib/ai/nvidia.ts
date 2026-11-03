import "server-only";
import { rankModels, type ModelInfo } from "./models";

const BASE = process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1";

function key(): string {
  const k = process.env.NVIDIA_API_KEY;
  if (!k) throw new Error("NVIDIA_API_KEY təyin edilməyib (.env.local faylına əlavə edin).");
  return k;
}

let modelCache: { at: number; models: ModelInfo[] } | null = null;

export async function listModels(): Promise<ModelInfo[]> {
  if (modelCache && Date.now() - modelCache.at < 10 * 60_000) return modelCache.models;
  const res = await fetch(`${BASE}/models`, { headers: { Authorization: `Bearer ${key()}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`NVIDIA modelləri alınmadı: ${res.status}`);
  const data = (await res.json()) as { data: { id: string }[] };
  const models = rankModels(data.data.map((m) => m.id));
  modelCache = { at: Date.now(), models };
  return models;
}

export type ChatContent = string | ({ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } })[];
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: ChatContent;
}

export type StreamEvent = { kind: "delta"; text: string } | { kind: "reasoning" } | { kind: "usage"; tokens: number };

/** Streams a chat completion from build.nvidia.com (OpenAI-compatible SSE). */
export async function* streamChat(opts: {
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
}): AsyncGenerator<StreamEvent> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: true,
      temperature: 0.4,
      top_p: 0.95,
      max_tokens: opts.maxTokens ?? 16384,
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`NVIDIA API xətası ${res.status}: ${body.slice(0, 400)}`);
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
