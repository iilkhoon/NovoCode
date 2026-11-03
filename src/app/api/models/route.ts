import { NextResponse } from "next/server";
import { listModels } from "@/lib/ai/nvidia";
import { pickDefault } from "@/lib/ai/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const models = await listModels();
    return NextResponse.json({
      models,
      defaultModel: pickDefault(models, process.env.NOVO_DEFAULT_MODEL || undefined),
      visionModel: pickDefault(models, process.env.NOVO_VISION_MODEL || undefined, true),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message, models: [] }, { status: 502 });
  }
}
