import { describe, it, expect } from "vitest";
import { ActionParser, type ParserEvent } from "./parser";

function runChunks(chunks: string[]): ParserEvent[] {
  const p = new ActionParser();
  const out: ParserEvent[] = [];
  for (const c of chunks) out.push(...p.feed(c));
  out.push(...p.end());
  return out;
}

const merged = (events: ParserEvent[]) =>
  events
    .filter((e) => e.type === "text")
    .map((e) => (e as { text: string }).text)
    .join("");

describe("ActionParser", () => {
  it("passes plain text through", () => {
    const ev = runChunks(["Salam, ", "sayt hazırdır."]);
    expect(merged(ev)).toBe("Salam, sayt hazırdır.");
  });

  it("parses a complete file in one chunk", () => {
    const ev = runChunks([
      'Hazırlayıram.\n<novo-file path="src/App.tsx">\nexport default 1;\n</novo-file>\nBitdi.',
    ]);
    const close = ev.find((e) => e.type === "file-close");
    expect(close).toEqual({ type: "file-close", path: "src/App.tsx", content: "export default 1;\n" });
    expect(merged(ev)).toBe("Hazırlayıram.\n\nBitdi.");
  });

  it("handles tags split across arbitrary chunk boundaries", () => {
    const src =
      'A<novo-file path="a.ts">const x = "<div>";\n</novo-file>B<novo-shell>npm install zod</novo-shell>C<novo-delete path="old.ts"/>D';
    // feed one character at a time
    const ev = runChunks(src.split(""));
    expect(ev.filter((e) => e.type === "file-close")).toEqual([
      { type: "file-close", path: "a.ts", content: 'const x = "<div>";\n' },
    ]);
    expect(ev.filter((e) => e.type === "shell")).toEqual([{ type: "shell", command: "npm install zod" }]);
    expect(ev.filter((e) => e.type === "delete")).toEqual([{ type: "delete", path: "old.ts" }]);
    expect(merged(ev)).toBe("ABCD");
  });

  it("emits file-open and progressive file-delta events", () => {
    const ev = runChunks(['<novo-file path="x.css">', "body{}", "\n</novo-file>"]);
    expect(ev[0]).toEqual({ type: "file-open", path: "x.css" });
    const delta = ev.filter((e) => e.type === "file-delta").map((e) => (e as { text: string }).text).join("");
    expect(delta).toBe("body{}\n");
  });

  it("strips markdown code fences the model wraps around file contents", () => {
    const ev = runChunks(['<novo-file path="a.tsx">\n```tsx\nlet a = 1;\n```\n</novo-file>']);
    expect(ev.find((e) => e.type === "file-close")).toMatchObject({ content: "let a = 1;\n" });
  });

  it("parses the plan tag as its own event", () => {
    const ev = runChunks(["<novo-plan>Restoran saytı quracağam</novo-plan>ok"]);
    expect(ev[0]).toEqual({ type: "plan", text: "Restoran saytı quracağam" });
    expect(merged(ev)).toBe("ok");
  });

  it("closes an unterminated file at end of stream", () => {
    const ev = runChunks(['<novo-file path="a.ts">let a', " = 2;"]);
    expect(ev.find((e) => e.type === "file-close")).toEqual({ type: "file-close", path: "a.ts", content: "let a = 2;" });
  });

  it("does not treat unrelated angle brackets in text as tags", () => {
    expect(merged(runChunks(["a < b ", "<b>bold</b>"]))).toBe("a < b <b>bold</b>");
  });
});
