import type { ChatMessage } from "./types";

/** Chat helpers: intents, slash commands, context accounting and next-step suggestions. */

export type Intent = "build" | "plan" | "chat";

/** Context window we budget for (most hosted models give ≥128k; we stay conservative). */
export const CONTEXT_LIMIT = 128_000;
export const COMPACT_AT = 0.8;

export interface SlashCommand {
  name: string;
  hint: string;
  takesText?: boolean;
}
export const COMMANDS: SlashCommand[] = [
  { name: "/plan", hint: "Əvvəl plan qur, sonra təsdiqlə", takesText: true },
  { name: "/chat", hint: "Kodu dəyişmədən soruş və müzakirə et", takesText: true },
  { name: "/compact", hint: "Söhbəti xülasə et, yer aç" },
  { name: "/new", hint: "Yeni söhbət — layihə qalır" },
  { name: "/undo", hint: "Əvvəlki versiyaya qayıt" },
  { name: "/publish", hint: "Yayımla və ya yüklə" },
  { name: "/help", hint: "Bütün əmrlər" },
];

export function parseCommand(text: string): { name: string; arg: string } | null {
  const m = text.trim().match(/^(\/[a-z]+)(?:\s+([\s\S]*))?$/i);
  if (!m) return null;
  const name = m[1].toLowerCase();
  if (!COMMANDS.some((c) => c.name === name)) return null;
  return { name, arg: (m[2] ?? "").trim() };
}

/** Commands matching what the user has typed so far ("/pl" → /plan). */
export function matchCommands(text: string): SlashCommand[] {
  if (!/^\/[a-z]*$/i.test(text)) return [];
  return COMMANDS.filter((c) => c.name.startsWith(text.toLowerCase()));
}

const NEXT_RE = /<novo-next>([\s\S]*?)(?:<\/novo-next>|$)/i;

/** Ideas the model proposed for the next step: `<novo-next>A | B | C</novo-next>`. */
export function extractNext(raw: string): string[] {
  const m = raw.match(NEXT_RE);
  if (!m) return [];
  return m[1]
    .split(/\||\n/)
    .map((s) => s.replace(/^[-•*\d.\s]+/, "").trim())
    .filter((s) => s.length > 1 && s.length < 80)
    .slice(0, 3);
}

/** Text without the machine tags meant for the UI. */
export function stripMeta(text: string): string {
  return text.replace(/<novo-next>[\s\S]*?(?:<\/novo-next>|$)/gi, "").replace(/<\/?novo-next>?/gi, "");
}

/**
 * What the model actually sees: everything after the last compact marker, plus that
 * marker's summary. Compact markers themselves and pending messages are excluded.
 */
export function contextOf(messages: ChatMessage[]): { summary?: string; messages: ChatMessage[] } {
  let start = 0;
  let summary: string | undefined;
  messages.forEach((m, i) => {
    if (m.compact) {
      start = i + 1;
      summary = m.content.trim() || undefined;
    }
  });
  return { summary, messages: messages.slice(start).filter((m) => !m.compact && !m.pending) };
}

/** Rough token estimate (≈3.5 chars per token for mixed Azerbaijani/English/code). */
export const estimateTokens = (chars: number) => Math.ceil(chars / 3.5);

/**
 * Context usage: the last real measurement from the model when we have one,
 * otherwise an estimate from the files and the visible conversation.
 */
export function contextUsage(messages: ChatMessage[], filesChars: number): { tokens: number; ratio: number; measured: boolean } {
  const ctx = contextOf(messages);
  const lastMeasured = [...ctx.messages].reverse().find((m) => m.role === "assistant" && m.tokens);
  if (lastMeasured?.tokens) return { tokens: lastMeasured.tokens, ratio: lastMeasured.tokens / CONTEXT_LIMIT, measured: true };
  const chars = Math.min(filesChars, 60_000) + 6_000 + ctx.messages.reduce((n, m) => n + m.content.length, 0) + (ctx.summary?.length ?? 0);
  const tokens = estimateTokens(chars);
  return { tokens, ratio: tokens / CONTEXT_LIMIT, measured: false };
}
