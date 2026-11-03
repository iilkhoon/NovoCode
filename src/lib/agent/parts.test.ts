import { describe, it, expect } from "vitest";
import { applyEvent } from "./parts";
import type { ParserEvent } from "../protocol/parser";

const run = (evs: ParserEvent[]) => evs.reduce(applyEvent, [] as ReturnType<typeof applyEvent>);

describe("applyEvent", () => {
  it("keeps the stream order and merges adjacent text", () => {
    const parts = run([
      { type: "text", text: "Sal" },
      { type: "text", text: "am" },
      { type: "plan", text: "- a" },
      { type: "file-open", path: "a.jsx" },
      { type: "file-delta", path: "a.jsx", text: "x" },
      { type: "file-close", path: "a.jsx", content: "x" },
      { type: "shell", command: "npm i zod" },
      { type: "delete", path: "b.jsx" },
      { type: "text", text: "Bitdi" },
    ]);
    expect(parts).toEqual([
      { kind: "text", text: "Salam" },
      { kind: "plan", text: "- a" },
      { kind: "file", path: "a.jsx", status: "done" },
      { kind: "shell", command: "npm i zod" },
      { kind: "file", path: "b.jsx", status: "deleted" },
      { kind: "text", text: "Bitdi" },
    ]);
  });
});
