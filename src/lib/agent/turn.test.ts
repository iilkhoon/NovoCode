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
