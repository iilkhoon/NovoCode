import { isGreeting, greetingPrompt } from "@/lib/ai/request-profile";
import { streamChat, listModels, preferredModel, type ChatMessage, type StreamEvent } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";
import { buildSystemPrompt, COMPACT_PROMPT } from "@/lib/ai/prompt";
import { loadSkills } from "@/lib/skills/load";
import { selectSkills } from "@/lib/skills/select";
import { recordUsage, userHash } from "@/lib/usage";
import { chunks, demoMode, demoReply } from "@/lib/demo/script";
import { markDown, orderByHealth, withFallback } from "@/lib/ai/fallback";
import { assertSameOrigin, errorResponse, HttpError, isDataImage, rateLimit, readJson } from "@/lib/api/guard";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface InMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[]; // data URLs
}

type Intent = "build" | "plan" | "chat" | "compact";
interface Body {
  messages: InMessage[];
  files: Record<string, string>;
  model?: string;
  intent: Intent;
  summary?: string;
  lang?: string;
}

const MAX_HISTORY = 12;
const MAX_COMPACT_HISTORY = 60;
const MAX_BODY = 12 * 1024 * 1024; // project files + up to 4 compressed screenshots
const MAX_MSG = 40_000;
const MAX_IMAGES = 4;
const MAX_FILES = 300;

/** Validates and normalises the untrusted request body. */
function parseBody(raw: unknown): Body {
  const b = raw as Partial<Body> | null;
  if (!b || !Array.isArray(b.messages)) throw new HttpError(400, "messages tələb olunur");
  const messages = b.messages.slice(-MAX_COMPACT_HISTORY).map((m) => {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") throw new HttpError(400, "Yanlış mesaj formatı");
    const images = Array.isArray(m.images) ? m.images.slice(0, MAX_IMAGES) : undefined;
    if (images && !images.every(isDataImage)) throw new HttpError(400, "Şəkillər yalnız data:image formatında qəbul olunur");
    return { role: m.role, content: m.content.slice(0, MAX_MSG), images };
  });
  const files: Record<string, string> = {};
  if (b.files && typeof b.files === "object") {
    for (const [k, v] of Object.entries(b.files).slice(0, MAX_FILES)) if (typeof v === "string") files[k] = v;
  }
  const model = typeof b.model === "string" && b.model.length < 200 ? b.model : undefined;
  const intent: Intent = b.intent === "plan" || b.intent === "chat" || b.intent === "compact" ? b.intent : "build";
  const summary = typeof b.summary === "string" && b.summary.trim() ? b.summary.slice(0, 8000) : undefined;
  const lang = typeof b.lang === "string" && /^(auto|az|tr|ru|en)$/.test(b.lang) ? b.lang : undefined;
  return { messages, files, model, intent, summary, lang };
}

export async function POST(req: Request) {
  let body: Body;
  try {
    assertSameOrigin(req);
    rateLimit(req, "chat", 60, 10 * 60_000); // ~4 calls per message incl. self-fix loop
    body = parseBody(await readJson(req, MAX_BODY));
  } catch (e) {
    return errorResponse(e);
  }
  const history = body.intent === "compact" ? body.messages : body.messages.slice(-MAX_HISTORY);
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return Response.json({ error: "Son mesaj istifadəçidən olmalıdır" }, { status: 400 });

  const greeting = body.intent !== "compact" && !last.images?.length && isGreeting(last.content);
  const hasImages = history.some((m) => m.images?.length);
  const userText = history.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const skills = selectSkills(loadSkills(), userText + (hasImages ? " screenshot" : ""));

  const mode = demoMode();
  const demo = () =>
    demoStream(
      demoReply({ intent: body.intent, prompt: last.content, firstPrompt: body.messages.find((m) => m.role === "user")?.content ?? last.content, files: body.files }),
      req.signal
    );
  if (mode === "always") return demo();

  let model = body.model;
  let backups: string[] = [];
  try {
    const models = await listModels();
    if (hasImages && !models.some((m) => m.vision)) return Response.json({ error: "Qoşulmuş modellər şəkil qəbul etmir. Şəkli çıxarın və ya görüntü dəstəyi olan provayder qoşun." }, { status: 400 });
    // only models the account actually offers
    if (model && !models.some((m) => m.id === model)) model = undefined;
    if (hasImages && !models.find((m) => m.id === model)?.vision) {
      model = pickDefault(models, process.env.NOVO_VISION_MODEL || undefined, true);
    }
    model ??= pickDefault(models, await preferredModel());
    // next-best models to try if this one is down or silent (same vision ability when images are attached)
    backups = models.filter((m) => m.id !== model && (!hasImages || m.vision)).slice(0, 2).map((m) => m.id);
  } catch (e) {
    if (mode === "fallback") return demo();
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }

  const system = greeting ? greetingPrompt() :
    body.intent === "compact"
      ? `${COMPACT_PROMPT}${body.summary ? `\n\nEarlier summary:\n${body.summary}` : ""}`
      : buildSystemPrompt({ skills, files: body.files ?? {}, intent: body.intent, summary: body.summary, lang: body.lang });
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    ...history.map<ChatMessage>((m) =>
      m.images?.length && m.role === "user"
        ? {
            role: "user",
            content: [
              { type: "text", text: m.content },
              ...m.images.map((url) => ({ type: "image_url" as const, image_url: { url } })),
            ],
          }
        : { role: m.role, content: m.content }
    ),
  ];

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      send({ t: "meta", model, skills: skills.map((s) => s.name) });
      let tokens = 0, chars = 0, ok = true;
      try {
        let thinking = 0;
        for await (const step of withFallback<StreamEvent>({
          models: orderByHealth([model!, ...backups]),
          onFail: markDown,
          signal: req.signal,
          isAnswer: (event) => event.kind === "delta" && event.text.length > 0,
          stream: (m, signal) => streamChat({ model: m, messages, signal }),
        })) {
          if (step.kind === "switch") {
            model = step.model;
            send({ t: "meta", model, skills: skills.map((s) => s.name) });
            continue;
          }
          const ev = step.event;
          if (ev.kind === "delta") {
            chars += ev.text.length;
            send({ t: "d", v: ev.text });
          } else if (ev.kind === "reasoning" && ++thinking % 20 === 1) send({ t: "thinking" });
          else if (ev.kind === "usage") {
            tokens = ev.tokens;
            send({ t: "usage", v: ev.tokens });
          }
        }
        send({ t: "done" });
      } catch (e) {
        ok = false;
        if (mode === "fallback" && chars === 0 && !req.signal.aborted) {
          // the provider failed before saying anything — finish the turn from the demo script
          for (const c of chunks(demoReply({ intent: body.intent, prompt: last.content, firstPrompt: body.messages.find((m) => m.role === "user")?.content ?? last.content, files: body.files }))) {
            if (req.signal.aborted) break;
            send({ t: "d", v: c });
            await sleep(18);
          }
          send({ t: "done" });
        } else if (!req.signal.aborted) send({ t: "error", v: (e as Error).message });
      } finally {
        // providers that don't report usage: estimate from prompt + reply size
        const est = tokens || Math.ceil((JSON.stringify(messages).length + chars) / 3.5);
        void recordUsage({ at: Date.now(), model: model!, intent: body.intent, tokens: est, ok, user: userHash(req) });
        try {
          controller.close();
        } catch {
          /* client already went away */
        }
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Streams a scripted reply in the same NDJSON shape as a real model. */
function demoStream(text: string, signal: AbortSignal) {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));
      send({ t: "meta", model: "novo-demo", skills: [] });
      await sleep(700);
      for (const c of chunks(text)) {
        if (signal.aborted) break;
        send({ t: "d", v: c });
        await sleep(18);
      }
      send({ t: "usage", v: Math.ceil(text.length / 3.5) });
      send({ t: "done" });
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
