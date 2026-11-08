import { describe, expect, it } from "vitest";
import { loadSkills } from "./load";
import { selectSkills } from "./select";

const names = (p: string) => selectSkills(loadSkills(), p).map((s) => s.name);

describe("astryx-ui skill", () => {
  it("is picked for dashboards and admin panels", () => {
    expect(names("Anbar üçün idarəetmə paneli və statistika")).toContain("astryx-ui");
    expect(names("CRM dashboard qur")).toContain("astryx-ui");
  });
  it("is not picked for marketing sites", () => {
    expect(names("Bakıda kofe şopu üçün gözəl sayt")).not.toContain("astryx-ui");
  });
});
