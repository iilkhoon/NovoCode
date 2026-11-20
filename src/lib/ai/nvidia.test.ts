import { afterEach, expect, it, vi } from "vitest";
vi.mock("./config", () => ({ loadConfig: async () => ({ providers: [] }) }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.resetModules(); });

it("signals output truncation so the caller can resume safely", async () => {
  vi.stubEnv("NVIDIA_API_KEY", "test-only");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
    'data: {"choices":[{"delta":{"content":"partial"}}]}\n\n' +
    'data: {"choices":[{"delta":{"content":"last"},"finish_reason":"length"}]}\n\ndata: [DONE]\n\n'
  ));
  const { streamChat } = await import("./nvidia");
  const events: unknown[] = [];
  for await (const event of streamChat({ model: "test", messages: [] })) events.push(event);
  expect(events).toEqual([{ kind: "delta", text: "partial" }, { kind: "delta", text: "last" }, { kind: "length" }]);
});
