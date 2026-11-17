import { describe, it, expect } from "vitest";
import { readNdjson, compactAssistant } from "./turn";

function streamOf(parts: string[]) {
  const enc = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(c) { parts.forEach((p) => c.enqueue(enc.encode(p))); c.close(); },
  });
}

describe("readNdjson", () => {
  it("yields objects across split chunks", async () => {
    const out = [];
    for await (const o of readNdjson(streamOf(['{"t":"d","v":"a', 'b"}\n{"t":"do', 'ne"}\n']))) out.push(o);
    expect(out).toEqual([{ t: "d", v: "ab" }, { t: "done" }]);
  });
});

describe("compactAssistant", () => {
  it("replaces file bodies with a short summary for history", () => {
    const raw = 'Hazırdır.<novo-plan>- hero</novo-plan><novo-file path="src/App.jsx">long code</novo-file><novo-shell>npm install zod</novo-shell> Növbəti addım?';
    const c = compactAssistant(raw);
    expect(c).toContain("Hazırdır.");
    expect(c).toContain("Növbəti addım?");
    expect(c).toContain("src/App.jsx");
    expect(c).toContain("npm install zod");
    expect(c).not.toContain("long code");
  });
});

// An interrupted response must never commit a partially generated source file.
describe("streamTurn completion", () => {
  it("rejects a disconnected stream without closing its partial file", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(streamOf([
      JSON.stringify({ t: "d", v: '<novo-file path="src/App.jsx">export default' }) + '\n',
    ])));
    const events: unknown[] = [];
    try {
      await expect(streamTurn({ messages: [], files: {}, onEvent: (e) => events.push(e) })).rejects.toThrow("yarımçıq");
      expect(events.some((e: any) => e.type === "file-close")).toBe(false);
    } finally { fetchMock.mockRestore(); }
  });

  it("accepts completed file actions only after an explicit done event", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(streamOf([
      JSON.stringify({ t: "d", v: '<novo-file path="src/App.jsx">export default 1;</novo-file>' }) + '\n',
      '{"t":"done"}\n',
    ])));
    const events: any[] = [];
    try {
      await streamTurn({ messages: [], files: {}, onEvent: (e) => events.push(e) });
      expect(events.find((e) => e.type === "file-close")?.content).toBe("export default 1;");
    } finally { fetchMock.mockRestore(); }
  });
});

describe("automatic output-limit continuation", () => {
  const response = (events: unknown[]) => new Response(streamOf(events.map((e) => JSON.stringify(e) + '\n')));
  it("keeps completed files and rewrites only the unfinished file using the same model", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response([
        { t: "meta", model: "deepseek::deepseek-v4-flash", skills: [] },
        { t: "d", v: '<novo-file path="src/a.js">export const a = 1;</novo-file><novo-file path="src/App.jsx">broken' },
        { t: "usage", v: 100 }, { t: "length" }, { t: "done" },
      ]))
      .mockResolvedValueOnce(response([
        { t: "d", v: '<novo-file path="src/App.jsx">export default 1;</novo-file>' },
        { t: "usage", v: 40 }, { t: "done" },
      ]));
    const events: any[] = []; const usage: number[] = [];
    try {
      const raw = await streamTurn({ messages: [{ role: "user", content: "Build a site" }], files: {}, onEvent: (e) => events.push(e), onUsage: (n) => usage.push(n) });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const followup = JSON.parse(fetchMock.mock.calls[1][1]!.body as string);
      expect(followup.model).toBe("deepseek::deepseek-v4-flash");
      expect(followup.files).toEqual({ "src/a.js": "export const a = 1;" });
      expect(followup.messages.at(-1).content).toContain('src/App.jsx');
      expect(events.filter((e) => e.type === "file-close").map((e) => e.content)).toEqual(["export const a = 1;", "export default 1;"]);
      expect(events).toContainEqual({ type: "file-abort", path: "src/App.jsx" });
      expect(raw).not.toContain("broken");
      expect(usage.at(-1)).toBe(140);
    } finally { fetchMock.mockRestore(); }
  });
  it("bounds continuations when a model keeps hitting the limit", async () => {
    const { streamTurn } = await import("./turn"); const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => response([{ t: "length" }, { t: "done" }]));
    try {
      await expect(streamTurn({ messages: [], files: {}, onEvent: () => {} })).rejects.toThrow("iki avtomatik");
      expect(fetchMock).toHaveBeenCalledTimes(3);
    } finally { fetchMock.mockRestore(); }
  });
  it("does not continue after user cancellation", async () => {
    const { streamTurn } = await import("./turn"); const { vi } = await import("vitest");
    const ctrl = new AbortController();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      ctrl.abort();
      return response([{ t: "length" }, { t: "done" }]);
    });
    try {
      await expect(streamTurn({ messages: [], files: {}, signal: ctrl.signal, onEvent: () => {} })).rejects.toThrow();
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally { fetchMock.mockRestore(); }
  });
});
