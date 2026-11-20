/** Model catalog shared by the server gateway and the model picker. */

export interface ModelInfo {
  id: string; // OpenRouter model id, e.g. "baidu/ernie-5.5-flash-preview:free"
  label: string;
  vision: boolean;
  rank: number;
}

/**
 * Models used when NOVO_MODELS is not set, in order of preference. The first is the default;
 * the rest are silent backups when it is rate-limited, down or slow to answer.
 */
export const DEFAULT_MODELS = [
  "baidu/ernie-5.5-flash-preview:free",
  "nvidia/nemotron-3.5-super-vl:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "google/gemma-4-31b-it:free",
];

/** Brand names shown in the picker, by position in the configured list. */
const BRANDS = ["Novo Flash", "Novo Vision", "Novo Ultra", "Novo Lite"];

export function configuredModels(env = process.env.NOVO_MODELS): string[] {
  const list = (env ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.length ? [...new Set(list)] : DEFAULT_MODELS;
}

export const brandName = (rank: number) => BRANDS[rank];

export function pickDefault(models: ModelInfo[], preferred?: string, needVision = false): string | undefined {
  const pool = needVision ? models.filter((m) => m.vision) : models;
  if (preferred && pool.some((m) => m.id === preferred)) return preferred;
  return pool[0]?.id ?? (needVision ? undefined : models[0]?.id);
}
