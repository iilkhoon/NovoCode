import "server-only";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * AI usage log: one JSON line per model call in <data>/usage/YYYY-MM.jsonl.
 * Client IPs are stored only as a short salted hash (to count unique users).
 */
const DIR = path.join(process.env.NOVO_DATA_DIR || path.join(process.cwd(), ".data"), "usage");

export interface UsageEvent {
  at: number;
  model: string;
  intent: string;
  tokens: number;
  ok: boolean;
  user: string;
}

export const userHash = (req: Request) =>
  createHash("sha256")
    .update(((req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local") + (process.env.NOVO_SECRET ?? "novo"))
    .digest("hex")
    .slice(0, 12);

export async function recordUsage(e: UsageEvent) {
  try {
    await mkdir(DIR, { recursive: true });
    const d = new Date(e.at);
    await appendFile(path.join(DIR, `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}.jsonl`), JSON.stringify(e) + "\n");
  } catch {
    /* usage logging must never break a chat */
  }
}

export interface UsageSummary {
  month: string;
  calls: number;
  failed: number;
  tokens: number;
  users: number;
  days: { day: string; calls: number; tokens: number }[];
  models: { model: string; calls: number; tokens: number }[];
}

export function summarize(events: UsageEvent[], month: string): UsageSummary {
  const days = new Map<string, { calls: number; tokens: number }>();
  const models = new Map<string, { calls: number; tokens: number }>();
  const users = new Set<string>();
  let tokens = 0, failed = 0;
  for (const e of events) {
    const day = new Date(e.at).toISOString().slice(0, 10);
    const d = days.get(day) ?? { calls: 0, tokens: 0 };
    d.calls++;
    d.tokens += e.tokens;
    days.set(day, d);
    const m = models.get(e.model) ?? { calls: 0, tokens: 0 };
    m.calls++;
    m.tokens += e.tokens;
    models.set(e.model, m);
    users.add(e.user);
    tokens += e.tokens;
    if (!e.ok) failed++;
  }
  return {
    month,
    calls: events.length,
    failed,
    tokens,
    users: users.size,
    days: [...days.entries()].sort().map(([day, v]) => ({ day, ...v })),
    models: [...models.entries()].map(([model, v]) => ({ model, ...v })).sort((a, b) => b.tokens - a.tokens),
  };
}

export async function readMonth(month = new Date().toISOString().slice(0, 7)): Promise<UsageSummary> {
  let events: UsageEvent[] = [];
  try {
    events = (await readFile(path.join(DIR, `${month}.jsonl`), "utf8"))
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l));
  } catch {
    /* no usage yet */
  }
  return summarize(events, month);
}
