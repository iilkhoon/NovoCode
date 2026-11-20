import type { ModelInfo } from "./models";

/** Display names only: the provider model ID sent to the API remains unchanged. */
export function modelPresentation(model: Pick<ModelInfo, "id" | "label">): { label: string; description: string } {
  const id = model.id.toLowerCase();
  if (/deepseek/.test(id)) {
    if (/reasoner|v4[-_]?pro/.test(id)) return { label: "Novo V4 Pro", description: "Mürəkkəb tapşırıqlar" };
    return { label: "Novo Flash", description: "Sürətli cavablar" };
  }
  return { label: model.label, description: "Novo AI" };
}
