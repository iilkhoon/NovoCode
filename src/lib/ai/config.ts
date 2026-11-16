import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Admin-managed AI configuration, stored on the server (never in the browser):
 * extra OpenAI-compatible providers (keys encrypted at rest) and per-model settings.
 */

export interface ProviderConfig {
  id: string; // short slug, used as model prefix: "<id>::<model>"
  name: string;
  baseUrl: string;
  key: string; // decrypted in memory only
  enabled: boolean;
}
export interface ModelSetting {
  id: string; // qualified model id
  label?: string;
  credits?: number;
  visible?: boolean;
}
export interface AiConfig {
  providers: ProviderConfig[];
  models: ModelSetting[];
  defaultModel?: string;
}

const FILE = path.join(process.env.NOVO_DATA_DIR || path.join(process.cwd(), ".data"), "ai-config.json");

function secret(): Buffer {
  const s = process.env.NOVO_SECRET || process.env.NOVO_ADMIN_PASSWORD;
  if (!s) throw new Error("NOVO_ADMIN_PASSWORD təyin edilməyib");
  return scryptSync(s, "novocode-ai-config", 32);
}
function enc(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", secret(), iv);
  const data = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}
function dec(blob: string): string {
  const [iv, tag, data] = blob.split(".").map((p) => Buffer.from(p, "base64"));
  const d = createDecipheriv("aes-256-gcm", secret(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString("utf8");
}

let cache: { at: number; cfg: AiConfig } | null = null;

export async function loadConfig(): Promise<AiConfig> {
  if (cache && Date.now() - cache.at < 15_000) return cache.cfg;
  let cfg: AiConfig = { providers: [], models: [] };
  try {
    const raw = JSON.parse(await readFile(FILE, "utf8"));
    cfg = {
      ...raw,
      providers: (raw.providers ?? []).map((p: ProviderConfig & { keyEnc?: string }) => {
        let key = "";
        try {
          key = p.keyEnc ? dec(p.keyEnc) : "";
        } catch {
          /* secret changed — key must be re-entered */
        }
        return { id: p.id, name: p.name, baseUrl: p.baseUrl, enabled: p.enabled, key };
      }),
    };
  } catch {
    /* no config yet */
  }
  cache = { at: Date.now(), cfg };
  return cfg;
}

export async function saveConfig(cfg: AiConfig) {
  const stored = { ...cfg, providers: cfg.providers.map(({ key, ...p }) => ({ ...p, keyEnc: key ? enc(key) : undefined })) };
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(stored, null, 2));
  cache = { at: Date.now(), cfg };
}

export const maskKey = (k: string) => (k ? (k.length > 10 ? `${k.slice(0, 4)}…${k.slice(-4)}` : "••••") : "");
