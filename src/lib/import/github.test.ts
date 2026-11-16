import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { parseRepo } from "./github";

describe("github repo links", () => {
  it("parses common forms", () => {
    expect(parseRepo("https://github.com/vercel/next.js")).toEqual({ owner: "vercel", repo: "next.js", ref: undefined });
    expect(parseRepo("github.com/a/b.git")).toMatchObject({ owner: "a", repo: "b" });
    expect(parseRepo("a/b")).toMatchObject({ owner: "a", repo: "b" });
    expect(parseRepo("https://github.com/a/b/tree/dev")).toMatchObject({ ref: "dev" });
    expect(parseRepo("https://gitlab.com/a/b")).toBeNull();
    expect(parseRepo("just text")).toBeNull();
  });
});
