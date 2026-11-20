import { NextResponse } from "next/server";
import { listModels, streamChat, type StreamEvent } from "@/lib/ai/openrouter";
import { withFallback } from "@/lib/ai/fallback";
import { assertSameOrigin, errorResponse, rateLimit, readJson } from "@/lib/api/guard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = `You turn a short website idea into a clear, inspiring brief for an AI website builder.
Reply ONLY with the improved brief in natural Azerbaijani (Latin script), 60–130 words, no preamble, no markdown headings.
Include: business name (invent a fitting Azerbaijani one if missing), audience, 5–7 concrete sections/pages, key working features (forms, booking, cart, login…), visual style (palette, mood, typography) and tone. Keep every fact the user gave.`;

export async function POST(req: Request) {
  let prompt: unknown;
  try {
    assertSameOrigin(req);
    rateLimit(req, "enhance", 20, 10 * 60_000);
    ({ prompt } = await readJson<{ prompt?: unknown }>(req, 16_000));
  } catch (e) {
    return errorResponse(e);
  }
  if (typeof prompt !== "string" || !prompt.trim()) return NextResponse.json({ error: "Boş sorğu" }, { status: 400 });
  try {
    const models = await listModels();
    const order = [...new Set([process.env.NOVO_FAST_MODEL, ...models.map((m) => m.id)].filter(Boolean) as string[])];
    let out = "";
    for await (const step of withFallback<StreamEvent>({
      models: order.slice(0, 3),
      signal: req.signal,
      firstEventMs: 45_000,
      isAnswer: (ev) => ev.kind === "delta",
      stream: (model, signal) =>
        streamChat({
          model,
          maxTokens: 2000, // thinking models spend part of the budget before writing
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt.slice(0, 2000) },
          ],
          signal,
        }),
    })) {
      if (step.kind !== "event") continue;
      const ev = step.event;
      if (ev.kind === "length") break; // keep what was written
      if (ev.kind === "delta") out += ev.text;
    }
    if (!out.trim()) throw new Error("Sorğunu təkmilləşdirmək alınmadı. Yenidən cəhd edin.");
    return NextResponse.json({ prompt: out.trim().replace(/^["“]|["”]$/g, "") });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
