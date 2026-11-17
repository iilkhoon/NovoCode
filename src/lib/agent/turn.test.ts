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
