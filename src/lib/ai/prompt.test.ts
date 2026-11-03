import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildFixPrompt, filesContext } from "./prompt";
import type { Skill } from "../skills/select";

const skill: Skill = { name: "core", description: "d", triggers: [], always: true, body: "# Core body" };

describe("buildSystemPrompt", () => {
  it("contains protocol, skills and file context", () => {
    const p = buildSystemPrompt({ skills: [skill], files: { "src/App.jsx": "export default 1" } });
    expect(p).toContain("<novo-file");
    expect(p).toContain("# Core body");
    expect(p).toContain("src/App.jsx");
    expect(p).toContain("export default 1");
  });
});

describe("filesContext", () => {
  it("skips lockfiles and truncates when over budget", () => {
    const ctx = filesContext(
      { "package-lock.json": "x".repeat(50), "src/a.jsx": "a".repeat(30), "src/b.jsx": "b".repeat(30) },
      40
    );
    expect(ctx).not.toContain("xxxx");
    expect(ctx).toContain("src/a.jsx");
    expect(ctx).toContain("src/b.jsx"); // listed in the tree even when content is omitted
    expect(ctx).toContain("content omitted");
  });
});

describe("buildFixPrompt", () => {
  it("wraps the error and attempt counter", () => {
    const p = buildFixPrompt("Failed to resolve import", 2, 3);
    expect(p).toContain("Failed to resolve import");
    expect(p).toContain("2/3");
  });
});
