import { streamChat, listModels, type ChatMessage } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { loadSkills } from "@/lib/skills/load";
import { selectSkills } from "@/lib/skills/select";
import { assertSameOrigin, errorResponse, HttpError, isDataImage, rateLimit, readJson } from "@/lib/api/guard";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface InMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[]; // data URLs
}

interface Body {
  messages: InMessage[];
  files: Record<string, string>;
  model?: string;
}

const MAX_HISTORY = 12;
const MAX_BODY = 12 * 1024 * 1024; // project files + up to 4 compressed screenshots
const MAX_MSG = 40_000;
const MAX_IMAGES = 4;
const MAX_FILES = 300;

/** Validates and normalises the untrusted request body. */
function parseBody(raw: unknown): Body {
  const b = raw as Partial<Body> | null;
  if (!b || !Array.isArray(b.messages)) throw new HttpError(400, "messages tələb olunur");
  const messages = b.messages.slice(-MAX_HISTORY).map((m) => {
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
  return { messages, files, model };
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
  const history = body.messages;
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return Response.json({ error: "Son mesaj istifadəçidən olmalıdır" }, { status: 400 });

  const hasImages = history.some((m) => m.images?.length);
  const userText = history.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const skills = selectSkills(loadSkills(), userText + (hasImages ? " screenshot" : ""));

  let model = body.model;
  try {
    const models = await listModels();
    // only models the account actually offers
    if (model && !models.some((m) => m.id === model)) model = undefined;
    if (hasImages && !models.find((m) => m.id === model)?.vision) {
      model = pickDefault(models, process.env.NOVO_VISION_MODEL || undefined, true);
    }
    model ??= pickDefault(models, process.env.NOVO_DEFAULT_MODEL || undefined);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt({ skills, files: body.files ?? {} }) },
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
      try {
        let thinking = 0;
        for await (const ev of streamChat({ model: model!, messages, signal: req.signal })) {
          if (ev.kind === "delta") send({ t: "d", v: ev.text });
          else if (ev.kind === "reasoning" && ++thinking % 20 === 1) send({ t: "thinking" });
          else if (ev.kind === "usage") send({ t: "usage", v: ev.tokens });
        }
        send({ t: "done" });
      } catch (e) {
        if (!req.signal.aborted) send({ t: "error", v: (e as Error).message });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
