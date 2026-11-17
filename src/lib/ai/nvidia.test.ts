import { afterEach, expect, it, vi } from "vitest";
vi.mock("./config", () => ({ loadConfig: async () => ({ providers: [] }) }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.resetModules(); });

it("reports output truncation rather than silently accepting a partial site", async () => {
  vi.stubEnv("NVIDIA_API_KEY", "test-only");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
    'data: {"choices":[{"delta":{"content":"partial"}}]}\n\n' +
    'data: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\ndata: [DONE]\n\n'
  ));
  const { streamChat } = await import("./nvidia");
  const events: unknown[] = [];
  await expect((async () => {
    for await (const event of streamChat({ model: "test", messages: [] })) events.push(event);
  })()).rejects.toThrow("token limitinə");
  expect(events).toEqual([{ kind: "delta", text: "partial" }]);
});
