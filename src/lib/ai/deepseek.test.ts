import { afterEach, expect, it, vi } from "vitest";
import { isDeepSeek } from "./deepseek";
const state = vi.hoisted(() => ({ providers: [] as any[], models: [] as any[] }));
vi.mock("./config", () => ({ loadConfig: async () => state }));
afterEach(() => {
  state.providers = []; state.models = [];
  vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.resetModules();
});
function configure() {
  vi.stubEnv("NVIDIA_API_KEY", "");
  vi.stubEnv("DEEPSEEK_API_KEY", "test-only");
  vi.stubEnv("NOVO_DEFAULT_MODEL", "");
  vi.stubEnv("DEEPSEEK_MODEL", "");
}
it("recognizes only the official DeepSeek host", () => {
  expect(isDeepSeek("https://api.deepseek.com/v1")).toBe(true);
  expect(isDeepSeek("https://api.deepseek.com.evil.test/v1")).toBe(false);
});
it("discovers visible DeepSeek models without requiring NVIDIA", async () => {
  configure();
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: [{ id: "deepseek-chat" }, { id: "deepseek-reasoner" }] }));
  const api = await import("./nvidia");
  expect((await api.listModels()).map((m) => m.id)).toEqual(["deepseek::deepseek-chat", "deepseek::deepseek-reasoner"]);
  expect(await api.preferredModel()).toBe("deepseek::deepseek-chat");
  expect(fetch.mock.calls[0][0]).toBe("https://api.deepseek.com/v1/models");
  expect(fetch.mock.calls[0][1]?.headers).toMatchObject({ Authorization: "Bearer test-only" });
});
it("streams reasoning, answer and usage with DeepSeek's supported token budget", async () => {
  configure();
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
    'data: {"choices":[{"delta":{"reasoning_content":"private reasoning"}}]}\n\n' +
    'data: {"choices":[{"delta":{"content":"Salam"}}],"usage":{"total_tokens":12}}\n\ndata: [DONE]\n\n'
  ));
  const api = await import("./nvidia");
  const events = [];
  for await (const e of api.streamChat({ model: "deepseek::deepseek-chat", messages: [{ role: "user", content: "Salam" }] })) events.push(e);
  expect(events).toEqual([{ kind: "reasoning" }, { kind: "delta", text: "Salam" }, { kind: "usage", tokens: 12 }]);
  const [url, init] = fetch.mock.calls[0];
  expect(url).toBe("https://api.deepseek.com/v1/chat/completions");
  expect(init?.headers).toMatchObject({ Authorization: "Bearer test-only" });
  expect(JSON.parse(init!.body as string)).toMatchObject({ model: "deepseek-chat", stream: true, max_tokens: 8192 });
});
it("honours admin key precedence, hidden models and disabled providers", async () => {
  configure();
  state.providers = [{ id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", key: "admin-test", enabled: true }];
  state.models = [{ id: "deepseek::deepseek-chat", visible: false }];
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: [{ id: "deepseek-chat" }] }));
  const api = await import("./nvidia");
  expect(await api.listModels()).toEqual([]);
  expect(fetch.mock.calls[0][1]?.headers).toMatchObject({ Authorization: "Bearer admin-test" });
  state.providers[0].enabled = false;
  await expect(api.listModels()).rejects.toThrow("DEEPSEEK_API_KEY");
});
it("reports authentication failure without returning request credentials", async () => {
  configure();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response('Invalid API key', { status: 401 }));
  const api = await import("./nvidia");
  await expect((async () => { for await (const _ of api.streamChat({ model: "deepseek::deepseek-chat", messages: [] })) {} })()).rejects.toThrow("DeepSeek API xətası 401");
});

it("prefers V4 Flash when the old configured alias is absent from the live catalog", async () => {
  configure();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: [{ id: "deepseek-v4-pro" }, { id: "deepseek-v4-flash" }] }));
  const { listModels } = await import("./nvidia");
  const { pickDefault } = await import("./models");
  const models = await listModels();
  expect(pickDefault(models, "deepseek::deepseek-chat")).toBe("deepseek::deepseek-v4-flash");
});

it("allows a larger V4 output budget while respecting an explicit smaller request", async () => {
  configure();
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response('data: [DONE]\n\n'));
  const { streamChat } = await import("./nvidia");
  for await (const _ of streamChat({ model: "deepseek::deepseek-v4-flash", messages: [] })) {}
  expect(JSON.parse(fetch.mock.calls[0][1]!.body as string).max_tokens).toBe(16384);
  for await (const _ of streamChat({ model: "deepseek::deepseek-v4-pro", messages: [], maxTokens: 600 })) {}
  expect(JSON.parse(fetch.mock.calls[1][1]!.body as string).max_tokens).toBe(600);
});
