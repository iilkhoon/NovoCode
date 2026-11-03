import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseSkill, type Skill } from "./select";

let cache: Skill[] | null = null;

export function loadSkills(): Skill[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const dir = path.join(process.cwd(), "skills");
  cache = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parseSkill(readFileSync(path.join(dir, f), "utf8")));
  // always-on skills first, in a fixed order
  const order = ["core", "design-excellence", "azerbaijani-content"];
  cache.sort((a, b) => {
    const ia = order.indexOf(a.name), ib = order.indexOf(b.name);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return cache;
}
