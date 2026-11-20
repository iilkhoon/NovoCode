import { describe, it, expect } from "vitest";
import { rankModels, isVisionModel, pickDefault, modelListHeaders } from "./models";

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
      "moonshotai/kimi-k2.6",
      "deepseek-ai/deepseek-v4-pro",
      "qwen/qwen3-coder-480b-a35b-instruct",
      "z-ai/glm-5.2",
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
    expect(pickDefault(r, "missing/model")).toBe("moonshotai/kimi-k2.6");
    expect(pickDefault(r, undefined, true)).toBe("moonshotai/kimi-k2.6");
  });

  it("puts fast-starting NVIDIA models ahead of ones that hang", () => {
    const r = rankModels(["z-ai/glm-5.3-flash", "google/gemma-4-31b-it", "nvidia/nemotron-3.5-super-vl-120b-a12b", "mistralai/mistral-large-4-1t-a52b"]);
    expect(r.map((m) => m.id)).toEqual(["nvidia/nemotron-3.5-super-vl-120b-a12b", "google/gemma-4-31b-it", "z-ai/glm-5.3-flash", "mistralai/mistral-large-4-1t-a52b"]);
    expect(r[0].vision).toBe(true);
  });
});

describe("modelListHeaders", () => {
  it("uses a Bearer token for OpenAI-compatible providers (NVIDIA returns nothing with Anthropic headers)", () => {
    expect(modelListHeaders({ baseUrl: "https://integrate.api.nvidia.com/v1", key: "k" })).toEqual({ Authorization: "Bearer k" });
    expect(modelListHeaders({ baseUrl: "https://openrouter.ai/api/v1", key: "k" })).toEqual({ Authorization: "Bearer k" });
  });
  it("uses Anthropic's own headers for Anthropic", () => {
    expect(modelListHeaders({ baseUrl: "https://api.anthropic.com/v1", key: "k" })).toEqual({ "x-api-key": "k", "anthropic-version": "2023-06-01" });
  });
});
