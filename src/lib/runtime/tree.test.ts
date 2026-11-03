import { describe, it, expect } from "vitest";
import { toFileSystemTree } from "./tree";

describe("toFileSystemTree", () => {
  it("nests flat paths into a WebContainer tree", () => {
    expect(toFileSystemTree({ "a.txt": "A", "src/x/y.js": "Y", "src/z.js": "Z" })).toEqual({
      "a.txt": { file: { contents: "A" } },
      src: {
        directory: {
          x: { directory: { "y.js": { file: { contents: "Y" } } } },
          "z.js": { file: { contents: "Z" } },
        },
      },
    });
  });
});
