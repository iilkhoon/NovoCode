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
  it("shows follow-up batches as file actions only, plus the final closing sentence", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response([
        { t: "d", v: 'Mağazanı qururam.<novo-plan>- ana səhifə</novo-plan><novo-file path="src/App.jsx">export default 1;</novo-file><novo-continue>səbət</novo-continue>' },
        { t: "done" },
      ]))
      .mockResolvedValueOnce(response([
        { t: "d", v: 'Səbəti yazıram.<novo-plan>- səbət</novo-plan><novo-file path="src/Cart.jsx">export default 2;</novo-file>Mağaza hazırdır.' },
        { t: "done" },
      ]));
    const events: any[] = [];
    try {
      await streamTurn({ messages: [{ role: "user", content: "Mağaza" }], files: {}, onEvent: (e) => events.push(e) });
      const text = events.filter((e) => e.type === "text").map((e) => e.text).join("");
      expect(text).toContain("Mağazanı qururam.");
      expect(text).toContain("Mağaza hazırdır.");
      expect(text).not.toContain("Səbəti yazıram");
      expect(text).not.toContain("Qalan faylları");
      expect(events.filter((e) => e.type === "plan")).toHaveLength(1);
      expect(events.filter((e) => e.type === "file-close").map((e) => e.path)).toEqual(["src/App.jsx", "src/Cart.jsx"]);
    } finally { fetchMock.mockRestore(); }
  });
  it("bounds continuations when a model keeps hitting the limit", async () => {
    const { streamTurn } = await import("./turn"); const { vi } = await import("vitest");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => response([{ t: "length" }, { t: "done" }]));
    try {
      await expect(streamTurn({ messages: [], files: {}, onEvent: () => {} })).rejects.toThrow("iki ardıcıl");
      expect(fetchMock).toHaveBeenCalledTimes(2);
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

describe("streamTurn recovery", () => {
  it("keeps finished files and continues when a batch breaks off mid-file", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const replies = [
      // batch 1: one finished file, then the connection drops inside the next one
      [JSON.stringify({ t: "d", v: '<novo-file path="src/App.jsx">export default 1;</novo-file><novo-file path="src/Hero.jsx">export' }) + "\n"],
      // batch 2: the model rewrites the broken file and finishes
      [JSON.stringify({ t: "d", v: '<novo-file path="src/Hero.jsx">export default 2;</novo-file>Hazırdır.' }) + "\n", '{"t":"done"}\n'],
    ];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(streamOf(replies.shift()!)));
    const events: any[] = [];
    try {
      await streamTurn({ messages: [{ role: "user", content: "sayt" }], files: {}, onEvent: (e) => events.push(e) });
      const closed = events.filter((e) => e.type === "file-close").map((e) => [e.path, e.content]);
      expect(closed).toEqual([["src/App.jsx", "export default 1;"], ["src/Hero.jsx", "export default 2;"]]);
      expect(events.some((e) => e.type === "file-abort" && e.path === "src/Hero.jsx")).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally { fetchMock.mockRestore(); }
  });

  it("continues after a provider error once some files are done", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const replies = [
      [JSON.stringify({ t: "d", v: '<novo-file path="src/App.jsx">a</novo-file>' }) + "\n", JSON.stringify({ t: "error", v: "OpenRouter: model cavabı yarıda kəsdi" }) + "\n"],
      [JSON.stringify({ t: "d", v: '<novo-file path="src/B.jsx">b</novo-file>' }) + "\n", '{"t":"done"}\n'],
    ];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(streamOf(replies.shift()!)));
    const events: any[] = [];
    try {
      await streamTurn({ messages: [{ role: "user", content: "sayt" }], files: {}, onEvent: (e) => events.push(e) });
      expect(events.filter((e) => e.type === "file-close").map((e) => e.path)).toEqual(["src/App.jsx", "src/B.jsx"]);
    } finally { fetchMock.mockRestore(); }
  });
});

describe("streamTurn fake file notes", () => {
  it("asks again when a follow-up batch only claims to have written files", async () => {
    const { streamTurn } = await import("./turn");
    const { vi } = await import("vitest");
    const bodies: any[] = [];
    const replies = [
      [JSON.stringify({ t: "d", v: '<novo-file path="src/App.jsx">a</novo-file><novo-continue>pages</novo-continue>' }) + "\n", '{"t":"done"}\n'],
      [JSON.stringify({ t: "d", v: "Səhifələr yazıldı.\n[wrote files: src/pages/Cart.jsx]" }) + "\n", '{"t":"done"}\n'],
      [JSON.stringify({ t: "d", v: '<novo-file path="src/pages/Cart.jsx">c</novo-file>Hazırdır.' }) + "\n", '{"t":"done"}\n'],
    ];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (_u, init) => {
      bodies.push(JSON.parse(String(init!.body)));
      return new Response(streamOf(replies.shift()!));
    });
    const events: any[] = [];
    try {
      const raw = await streamTurn({ messages: [{ role: "user", content: "sayt" }], files: {}, onEvent: (e) => events.push(e) });
      expect(events.filter((e) => e.type === "file-close").map((e) => e.path)).toEqual(["src/App.jsx", "src/pages/Cart.jsx"]);
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(bodies[2].messages.at(-1).content).toContain("only CLAIMED");
      expect(bodies[1].messages.some((m: any) => m.role === "assistant")).toBe(false);
      expect(raw).not.toContain("[wrote files");
      expect(events.filter((e) => e.type === "text").map((e) => e.text).join("")).not.toContain("[wrote files");
    } finally { fetchMock.mockRestore(); }
  });
});
