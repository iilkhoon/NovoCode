import { describe, it, expect } from "vitest";
import { parseSkill, selectSkills, normalizeAz } from "./select";

const raw = (name: string, triggers: string, always = false) =>
  `---\nname: ${name}\ndescription: ${name} skill\ntriggers: ${triggers}\nalways: ${always}\n---\n# ${name}\nbody`;

describe("normalizeAz", () => {
  it("folds Azerbaijani letters", () => expect(normalizeAz("Şəkil ÇİÇƏK ğöü ı")).toBe("sekil cicek gou i"));
});

describe("parseSkill", () => {
  it("parses frontmatter and body", () => {
    const s = parseSkill(raw("restaurant", "restoran, menyu, kafe"));
    expect(s.name).toBe("restaurant");
    expect(s.triggers).toEqual(["restoran", "menyu", "kafe"]);
    expect(s.always).toBe(false);
    expect(s.body).toBe("# restaurant\nbody");
  });
});

describe("selectSkills", () => {
  const skills = [
    parseSkill(raw("core", "", true)),
    parseSkill(raw("restaurant", "restoran, menyu, kafe")),
    parseSkill(raw("auth", "giriş, qeydiyyat, login")),
    parseSkill(raw("shop", "mağaza, səbət, məhsul")),
  ];

  it("always includes always-on skills", () => {
    expect(selectSkills(skills, "salam").map((s) => s.name)).toEqual(["core"]);
  });

  it("matches triggers regardless of Azerbaijani letters and case", () => {
    const names = selectSkills(skills, "Kafe üçün sayt, QEYDIYYAT olsun").map((s) => s.name);
    expect(names).toEqual(["core", "restaurant", "auth"]);
  });

  it("caps the number of optional skills", () => {
    const names = selectSkills(skills, "restoran qeydiyyat magaza", 2).map((s) => s.name);
    expect(names).toHaveLength(3);
  });
});
