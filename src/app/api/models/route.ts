import { NextResponse } from "next/server";
import { listModels, preferredModel } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";
import { DEMO_MODEL, demoMode } from "@/lib/demo/script";

export const dynamic = "force-dynamic";

const demoList = () => NextResponse.json({ models: [DEMO_MODEL], defaultModel: DEMO_MODEL.id, visionModel: DEMO_MODEL.id });

export async function GET() {
  const mode = demoMode();
  if (mode === "always") return demoList();
  try {
    const models = await listModels();
    return NextResponse.json({
      models,
      defaultModel: pickDefault(models, await preferredModel()),
      visionModel: pickDefault(models, process.env.NOVO_VISION_MODEL || undefined, true),
    });
  } catch (e) {
    // during a live demo the picker should look normal even if the provider is down
    if (mode === "fallback") return demoList();
    return NextResponse.json({ error: (e as Error).message, models: [] }, { status: 502 });
  }
}
