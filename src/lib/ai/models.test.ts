import { describe, it, expect } from "vitest";
import { rankModels, isVisionModel, pickDefault } from "./models";

const ids = [
  "nvidia/nv-embedqa-e5-v5",
  "meta/llama-3.1-8b-instruct",
  "moonshotai/kimi-k2.6",
  "z-ai/glm-5.2",
  "deepseek-ai/deepseek-v4-pro",
  "nvidia/llama-3.1-nemoguard-8b-content-safety",
  "qwen/qwen3-coder-480b-a35b-instruct",
  "meta/llama-3.2-90b-vision-instruct",
  "nvidia/nv-rerankqa-mistral-4b-v3",
];

describe("rankModels", () => {
  it("drops non-chat models and orders by coding preference", () => {
    const r = rankModels(ids).map((m) => m.id);
    expect(r.slice(0, 4)).toEqual([
      "z-ai/glm-5.2",
      "moonshotai/kimi-k2.6",
      "deepseek-ai/deepseek-v4-pro",
      "qwen/qwen3-coder-480b-a35b-instruct",
    ]);
    expect(r).not.toContain("nvidia/nv-embedqa-e5-v5");
    expect(r).not.toContain("nvidia/nv-rerankqa-mistral-4b-v3");
    expect(r).not.toContain("nvidia/llama-3.1-nemoguard-8b-content-safety");
  });

  it("flags vision-capable models", () => {
    expect(isVisionModel("meta/llama-3.2-90b-vision-instruct")).toBe(true);
    expect(isVisionModel("moonshotai/kimi-k2.6")).toBe(true);
    expect(isVisionModel("z-ai/glm-5.2")).toBe(false);
  });

  it("pickDefault honours env override when available", () => {
    const r = rankModels(ids);
    expect(pickDefault(r, "deepseek-ai/deepseek-v4-pro")).toBe("deepseek-ai/deepseek-v4-pro");
    expect(pickDefault(r, "missing/model")).toBe("z-ai/glm-5.2");
    expect(pickDefault(r, undefined, true)).toBe("moonshotai/kimi-k2.6");
  });
});
