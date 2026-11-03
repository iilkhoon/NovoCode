/** Skill library: markdown files with a small frontmatter, picked per request. */

export interface Skill {
  name: string;
  description: string;
  triggers: string[];
  always: boolean;
  body: string;
}

const FOLD: Record<string, string> = { ə: "e", ı: "i", ö: "o", ü: "u", ş: "s", ç: "c", ğ: "g", i̇: "i" };

export function normalizeAz(s: string): string {
  return s
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .replace(/i̇/g, "i")
    .replace(/[əıöüşçğ]/g, (c) => FOLD[c] ?? c);
}

export function parseSkill(raw: string): Skill {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return {
    name: meta.name ?? "skill",
    description: meta.description ?? "",
    triggers: (meta.triggers ?? "")
      .split(",")
      .map((t) => normalizeAz(t.trim()))
      .filter(Boolean),
    always: meta.always === "true",
    body: (m ? m[2] : raw).trim(),
  };
}

export function selectSkills(skills: Skill[], prompt: string, maxOptional = 3): Skill[] {
  const text = normalizeAz(prompt);
  const always = skills.filter((s) => s.always);
  const scored = skills
    .filter((s) => !s.always)
    .map((s) => ({ s, score: s.triggers.filter((t) => text.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxOptional)
    .map((x) => x.s);
  // keep original library order for stable prompts
  const picked = new Set([...always, ...scored]);
  return skills.filter((s) => picked.has(s));
}
