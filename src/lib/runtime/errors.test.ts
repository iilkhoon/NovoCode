import { describe, it, expect } from "vitest";
import { extractErrors, stripAnsi } from "./errors";

describe("extractErrors", () => {
  it("returns null for a healthy dev server log", () => {
    expect(extractErrors("VITE v6.0.0  ready in 300 ms\n  ➜  Local:   http://localhost:5173/\n")).toBeNull();
  });

  it("detects vite import resolution errors", () => {
    const log = '\x1b[31m[vite] Internal server error: Failed to resolve import "./Hero" from "src/App.tsx". Does the file exist?\x1b[39m\n  Plugin: vite:import-analysis\n  File: /home/project/src/App.tsx:3:17\n';
    const e = extractErrors(log)!;
    expect(e).toContain('Failed to resolve import "./Hero"');
    expect(e).toContain("src/App.tsx:3:17");
    expect(e).not.toContain("\x1b");
  });

  it("detects syntax errors with context lines", () => {
    const log = "x\n[plugin:vite:react-babel] /home/project/src/App.tsx: Unexpected token (12:4)\n  10 | <div>\n> 12 |   }\n";
    expect(extractErrors(log)).toContain("Unexpected token (12:4)");
  });

  it("detects npm install failures", () => {
    expect(extractErrors("npm ERR! code E404\nnpm ERR! 404 Not Found - GET https://registry.npmjs.org/fake-pkg\n")).toContain("E404");
  });

  it("deduplicates repeated errors", () => {
    const line = "[vite] Internal server error: Failed to resolve import \"x\" from \"a.tsx\".\n";
    const e = extractErrors(line + line + line)!;
    expect(e.split("Failed to resolve").length - 1).toBe(1);
  });
});

describe("stripAnsi", () => {
  it("removes color codes", () => expect(stripAnsi("\x1b[32mok\x1b[0m")).toBe("ok"));
});
