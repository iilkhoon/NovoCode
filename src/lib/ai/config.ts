import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Admin-managed model settings, stored on the server. The only AI key is OPENROUTER_API_KEY in
 * the server environment, so nothing secret is kept in this file.
 */

export interface ModelSetting {
  id: string; // OpenRouter model id
  label?: string;
  credits?: number;
  visible?: boolean;
}
export interface AiConfig {
  models: ModelSetting[];
  defaultModel?: string;
}

const FILE = path.join(process.env.NOVO_DATA_DIR || path.join(process.cwd(), ".data"), "ai-config.json");

let cache: { at: number; cfg: AiConfig } | null = null;

export async function loadConfig(): Promise<AiConfig> {
  if (cache && Date.now() - cache.at < 15_000) return cache.cfg;
  let cfg: AiConfig = { models: [] };
  try {
    const raw = JSON.parse(await readFile(FILE, "utf8"));
    // ids from the old multi-provider setup ("deepseek::…") no longer resolve: drop them
    cfg = {
      models: (raw.models ?? []).filter((m: ModelSetting) => !String(m.id).includes("::")),
      defaultModel: raw.defaultModel && !String(raw.defaultModel).includes("::") ? raw.defaultModel : undefined,
    };
  } catch {
    /* no config yet */
  }
  cache = { at: Date.now(), cfg };
  return cfg;
}

export async function saveConfig(cfg: AiConfig) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(cfg, null, 2));
  cache = { at: Date.now(), cfg };
}
