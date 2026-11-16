import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseSkill, type Skill } from "./select";

/**
 * Skills = built-in markdown in /skills plus admin-uploaded ones in <data>/skills.
 * Admins can switch any skill off (<data>/skills-disabled.json). Cached for a few seconds
 * so admin changes apply without a restart.
 */
export const DATA_DIR = process.env.NOVO_DATA_DIR || path.join(process.cwd(), ".data");
export const CUSTOM_DIR = path.join(DATA_DIR, "skills");
export const DISABLED_FILE = path.join(DATA_DIR, "skills-disabled.json");
const BUILTIN_DIR = path.join(process.cwd(), "skills");

export interface SkillEntry extends Skill {
  source: "builtin" | "custom";
  file: string;
  enabled: boolean;
}

let cache: { at: number; all: SkillEntry[] } | null = null;

function readDir(dir: string, source: SkillEntry["source"]): Omit<SkillEntry, "enabled">[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ ...parseSkill(readFileSync(path.join(dir, f), "utf8")), source, file: f }));
}

export function allSkills(fresh = false): SkillEntry[] {
  if (!fresh && cache && Date.now() - cache.at < 10_000) return cache.all;
  let disabled: string[] = [];
  try {
    disabled = JSON.parse(readFileSync(DISABLED_FILE, "utf8"));
  } catch {
    /* none disabled */
  }
  const builtin = readDir(BUILTIN_DIR, "builtin");
  const names = new Set(builtin.map((s) => s.name));
  // a custom skill may not shadow a built-in one
  const custom = readDir(CUSTOM_DIR, "custom").filter((s) => !names.has(s.name));
  const order = ["core", "design-excellence", "azerbaijani-content"];
  const all = [...builtin, ...custom]
    .map((s) => ({ ...s, enabled: !disabled.includes(s.name) }))
    .sort((a, b) => {
      const ia = order.indexOf(a.name), ib = order.indexOf(b.name);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  cache = { at: Date.now(), all };
  return all;
}

/** Skills the model may use (enabled only); always-on skills first. */
export function loadSkills(): Skill[] {
  return allSkills().filter((s) => s.enabled);
}

export function invalidateSkills() {
  cache = null;
}
