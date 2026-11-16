import { describe, expect, it } from "vitest";
import { depsKey } from "./webcontainer";

describe("node_modules cache key", () => {
  it("depends only on dependencies", () => {
    const a = depsKey(JSON.stringify({ name: "a", version: "1", dependencies: { react: "^19" } }));
    const b = depsKey(JSON.stringify({ name: "b", version: "2", scripts: { x: "y" }, dependencies: { react: "^19" } }));
    const c = depsKey(JSON.stringify({ dependencies: { react: "^19", motion: "^11" } }));
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(depsKey(undefined)).toBeNull();
    expect(depsKey("{bad")).toBeNull();
  });
});
