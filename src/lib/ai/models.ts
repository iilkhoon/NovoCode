/** Ranks build.nvidia.com models for website generation. IDs come live from /v1/models. */

export interface ModelInfo {
  id: string;
  label: string;
  vision: boolean;
  rank: number;
}

const EXCLUDE = /embed|rerank|guard|safety|reward|parse|clip|tts|asr|whisper|ocr|retriever|nemoretriever|detector|translate|riva|cosmos|flux|sdxl|stable-diffusion|bge|arctic-embed|nv-embed|pii|topic-control|jailbreak|deplot|kosmos|fuyu|neva|paligemma|vila|starcoder|codegemma|gemma-2b|-1b|-3b|-8b|-7b/i;

const PREFERENCE: RegExp[] = [
  /glm-5/i,
  /kimi-k2/i,
  /deepseek-v4|deepseek-v3/i,
  /qwen3-coder/i,
  /qwen3/i,
  /nemotron.*(ultra|super)/i,
  /gpt-oss-120b/i,
  /llama-4-maverick/i,
  /mistral-(large|medium)|devstral|codestral/i,
  /glm|minimax|deepseek/i,
];

const VISION = /vision|-vl|vl-|kimi-k2\.[5-9]|kimi-k2-vision|llama-4|gemma-3|phi-4-multimodal|nemotron.*vl|mistral-medium-3|qwen.*vl|glm-.*v\b|glm-4\.\dv|multimodal/i;

export const isVisionModel = (id: string) => VISION.test(id);

export function rankModels(ids: string[]): ModelInfo[] {
  return ids
    .filter((id) => !EXCLUDE.test(id))
    .map((id) => {
      const i = PREFERENCE.findIndex((r) => r.test(id));
      return {
        id,
        label: id.split("/").pop() ?? id,
        vision: isVisionModel(id),
        rank: i === -1 ? PREFERENCE.length : i,
      };
    })
    .filter((m) => m.rank < PREFERENCE.length || m.vision)
    .sort((a, b) => a.rank - b.rank || b.id.localeCompare(a.id, undefined, { numeric: true }));
}

export function pickDefault(models: ModelInfo[], preferred?: string, needVision = false): string | undefined {
  const pool = needVision ? models.filter((m) => m.vision) : models;
  if (preferred && pool.some((m) => m.id === preferred)) return preferred;
  return pool[0]?.id ?? models[0]?.id;
}
