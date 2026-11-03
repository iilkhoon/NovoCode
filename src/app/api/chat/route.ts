import { streamChat, listModels, type ChatMessage } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { loadSkills } from "@/lib/skills/load";
import { selectSkills } from "@/lib/skills/select";

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

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const history = body.messages.slice(-MAX_HISTORY);
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return new Response("Son mesaj istifadəçidən olmalıdır", { status: 400 });

  const hasImages = history.some((m) => m.images?.length);
  const userText = history.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const skills = selectSkills(loadSkills(), userText + (hasImages ? " screenshot" : ""));

  let model = body.model;
  try {
    const models = await listModels();
    if (hasImages && !models.find((m) => m.id === model)?.vision) {
      model = pickDefault(models, process.env.NOVO_VISION_MODEL || undefined, true);
    }
    model ??= pickDefault(models, process.env.NOVO_DEFAULT_MODEL || undefined);
  } catch (e) {
    return new Response(JSON.stringify({ t: "error", v: (e as Error).message }) + "\n", { status: 502 });
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
