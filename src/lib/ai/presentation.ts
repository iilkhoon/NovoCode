import type { ModelInfo } from "./models";

/** Display names only: the OpenRouter model ID sent to the API remains unchanged. */
export function modelPresentation(model: Pick<ModelInfo, "id" | "label"> & { vision?: boolean }): { label: string; description: string } {
  return { label: model.label, description: model.vision ? "Şəkil də oxuyur" : "Novo AI" };
}
