import { ActionParser, type ParserEvent } from "../protocol/parser";

export async function* readNdjson(body: ReadableStream<Uint8Array>): AsyncGenerator<Record<string, unknown>> {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (value) buf += dec.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (line) yield JSON.parse(line);
    }
    if (done) break;
  }
  if (buf.trim()) yield JSON.parse(buf);
}

/** History sent back to the model: keep prose, summarise actions (files are already in the system prompt). */
export function compactAssistant(raw: string): string {
  const p = new ActionParser();
  const events = [...p.feed(raw), ...p.end()];
  const text: string[] = [];
  const files: string[] = [];
  const shells: string[] = [];
  const deleted: string[] = [];
  for (const e of events) {
    if (e.type === "text") text.push(e.text);
    else if (e.type === "file-close") files.push(e.path);
    else if (e.type === "shell") shells.push(e.command);
    else if (e.type === "delete") deleted.push(e.path);
  }
  const notes = [
    files.length && `[wrote files: ${files.join(", ")}]`,
    deleted.length && `[deleted: ${deleted.join(", ")}]`,
    shells.length && `[ran: ${shells.join("; ")}]`,
  ].filter(Boolean);
  return [text.join("").trim(), ...notes].join("\n");
}

export interface TurnRequest {
  messages: { role: "user" | "assistant"; content: string; images?: string[] }[];
  files: Record<string, string>;
  model?: string;
  signal?: AbortSignal;
  onMeta?: (meta: { model: string; skills: string[] }) => void;
  onThinking?: () => void;
  onEvent: (e: ParserEvent) => void;
}

/** Calls /api/chat and turns the token stream into parser events. Returns the raw reply. */
export async function streamTurn(req: TurnRequest): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: req.messages, files: req.files, model: req.model }),
    signal: req.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text;
    try {
      const j = JSON.parse(text.split("\n")[0]);
      msg = j.error ?? j.v ?? text;
    } catch {}
    throw new Error(msg || `Server cavab vermədi (${res.status})`);
  }
  if (!res.body) throw new Error(`Server cavab vermədi (${res.status})`);
  const parser = new ActionParser();
  let raw = "";
  for await (const msg of readNdjson(res.body)) {
    switch (msg.t) {
      case "meta":
        req.onMeta?.(msg as unknown as { model: string; skills: string[] });
        break;
      case "thinking":
        req.onThinking?.();
        break;
      case "d": {
        const v = String(msg.v);
        raw += v;
        parser.feed(v).forEach(req.onEvent);
        break;
      }
      case "error":
        parser.end().forEach(req.onEvent);
        throw new Error(String(msg.v));
    }
  }
  parser.end().forEach(req.onEvent);
  return raw;
}
