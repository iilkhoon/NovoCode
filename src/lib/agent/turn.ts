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
  intent?: "build" | "plan" | "chat" | "compact";
  summary?: string;
  lang?: string;
  signal?: AbortSignal;
  onUsage?: (tokens: number) => void;
  onMeta?: (meta: { model: string; skills: string[] }) => void;
  onThinking?: () => void;
  onEvent: (e: ParserEvent) => void;
}

/** Calls /api/chat and turns the token stream into parser events. Returns the raw reply. */
export async function streamTurn(req: TurnRequest): Promise<string> {
  const files = { ...req.files };
  let model = req.model;
  let raw = "";
  let usedTokens = 0;
  const maxBatches = 12;
  let stalledBatches = 0;
  let messages = req.messages;
  for (let round = 0; round < maxBatches; round++) {
    req.signal?.throwIfAborted();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, files, model, intent: req.intent, summary: req.summary, lang: req.lang }),
      signal: req.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let msg = text;
      try { const j = JSON.parse(text.split("\n")[0]); msg = j.error ?? j.v ?? text; } catch {}
      throw new Error(msg || `Server cavab vermədi (${res.status})`);
    }
    if (!res.body) throw new Error(`Server cavab vermədi (${res.status})`);
    const parser = new ActionParser();
    let completed = false;
    let limited = false;
    let remaining = "";
    let wantsMore = false;
    let changes = 0;
    let roundTokens = 0;
    const emit = (event: ParserEvent) => {
      // Keep only closed actions in history: unfinished source is never saved or replayed.
      switch (event.type) {
        case "text": raw += event.text; break;
        case "plan": raw += `<novo-plan>${event.text}</novo-plan>`; break;
        case "continue": wantsMore = true; remaining = event.text.slice(0, 4000); break;
        case "file-close":
          if (files[event.path] !== event.content) changes++;
          files[event.path] = event.content;
          raw += `<novo-file path=${JSON.stringify(event.path)}>${event.content}</novo-file>`;
          break;
        case "delete": if (event.path in files) changes++; delete files[event.path]; raw += `<novo-delete path=${JSON.stringify(event.path)}/>`; break;
        case "shell": raw += `<novo-shell>${event.command}</novo-shell>`; break;
      }
      req.onEvent(event);
    };
    for await (const msg of readNdjson(res.body)) {
      switch (msg.t) {
        case "meta":
          model = String(msg.model);
          req.onMeta?.(msg as unknown as { model: string; skills: string[] });
          break;
        case "thinking": req.onThinking?.(); break;
        case "usage": roundTokens = Number(msg.v); req.onUsage?.(usedTokens + roundTokens); break;
        case "d": parser.feed(String(msg.v)).forEach(emit); break;
        case "done": completed = true; break;
        case "length": limited = true; break;
        case "error": throw new Error(String(msg.v));
      }
    }
    usedTokens += roundTokens;
    if (!completed) throw new Error("AI cavabı yarımçıq qaldı. Bağlantı kəsildi — yenidən cəhd edin.");
    if (!limited && !wantsMore) {
      if (parser.incomplete) throw new Error("AI cavabı yarımçıq qaldı. Tam sayt yaradılmadı — yenidən cəhd edin.");
      parser.end().forEach(emit);
      return raw;
    }
    const unfinished = parser.pendingFile;
    if (unfinished) req.onEvent({ type: "file-abort", path: unfinished });
    stalledBatches = changes === 0 ? stalledBatches + 1 : 0;
    if (stalledBatches >= 2) throw new Error("AI iki ardıcıl sorğuda tamamlanmış fayl yaratmadı. Yenidən yazdırmaq dayandırıldı; tamamlanmış fayllar saxlanılıb.");
    if (round === maxBatches - 1) throw new Error("Sayt 12 avtomatik mərhələdən sonra hələ tamamlanmayıb. İşlək fayllar saxlanılıb; qalan işi ayrıca istəyin.");
    emit({ type: "text", text: "\nQalan faylları tamamlayıram…\n" });
    messages = [
      ...req.messages,
      { role: "assistant", content: compactAssistant(raw) },
      { role: "user", content: `Continue the ORIGINAL website request; the previous batch ended. Produce at most FOUR small complete files in this response and use <novo-continue> if more work remains. Completed files are in the project context. Do not rewrite completed files or rerun shell commands. ${unfinished ? `The unfinished file ${JSON.stringify(unfinished)} was discarded: write that file again IN FULL using a fresh <novo-file> tag.` : "Write the remaining files."} Finish the remaining work over small runnable batches. FIRST ensure App.jsx renders a working page using only existing files. Split large files into smaller components. ${remaining ? `Remaining work from the previous batch: ${remaining}` : ""} Use complete action tags, never resume in the middle of source code. Keep prose very short.` },
    ];
  }
  throw new Error("AI cavabı yarımçıq qaldı.");
}
