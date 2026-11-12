import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HERO_STATS } from "./data";
import { STYLE_PRESETS } from "@/lib/styles";

const stat = (label: string) => HERO_STATS.find((s) => s.label === label)!.target;

/** The hero shows these numbers to investors and users — keep them true. */
describe("hero stats match the product", () => {
  it("skill count equals the skills/ library", () => {
    const skills = readdirSync(path.join(process.cwd(), "skills")).filter((f) => f.endsWith(".md"));
    expect(stat("Peşəkar skill")).toBe(skills.length);
  });
  it("design style count equals the presets (excluding 'auto')", () => {
    expect(stat("Dizayn üslubu")).toBe(STYLE_PRESETS.filter((s) => s.id !== "auto").length);
  });
});
