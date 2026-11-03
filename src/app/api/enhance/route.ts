import { NextResponse } from "next/server";
import { listModels, streamChat } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = `You turn a short website idea into a clear, inspiring brief for an AI website builder.
Reply ONLY with the improved brief in natural Azerbaijani (Latin script), 60–130 words, no preamble, no markdown headings.
Include: business name (invent a fitting Azerbaijani one if missing), audience, 5–7 concrete sections/pages, key working features (forms, booking, cart, login…), visual style (palette, mood, typography) and tone. Keep every fact the user gave.`;

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt?.trim()) return NextResponse.json({ error: "Boş sorğu" }, { status: 400 });
  try {
    const models = await listModels();
    const fast = models.find((m) => /flash/i.test(m.id))?.id ?? pickDefault(models)!;
    let out = "";
    for await (const ev of streamChat({
      model: process.env.NOVO_FAST_MODEL || fast,
      maxTokens: 600,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt.slice(0, 2000) },
      ],
      signal: req.signal,
    })) {
      if (ev.kind === "delta") out += ev.text;
    }
    return NextResponse.json({ prompt: out.trim().replace(/^["“]|["”]$/g, "") });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
