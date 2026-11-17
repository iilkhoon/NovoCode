// Assembles ready-made site templates: base project + shared helpers + the site's own files.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export function readTree(root) {
  const files = {};
  if (!existsSync(root)) return files;
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else files[path.relative(root, p).split(path.sep).join("/")] = readFileSync(p, "utf8");
    }
  })(root);
  return files;
}

export const SITES_DIR = path.resolve("src/lib/templates/sites");

export function siteIds() {
  return readdirSync(SITES_DIR).filter((d) => statSync(path.join(SITES_DIR, d)).isDirectory()).sort();
}

/** Only the files a site adds or changes on top of the base template. */
export function siteFiles(id) {
  const base = readTree(path.resolve("src/lib/template/files"));
  const shared = readTree(path.resolve("src/lib/templates/shared"));
  const own = readTree(path.join(SITES_DIR, id));
  const meta = JSON.parse(own["meta.json"] ?? "{}");
  delete own["meta.json"];
  const out = { ...shared, ...own };
  let html = base["index.html"];
  if (meta.title) html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  if (meta.fonts) html = html.replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/, `https://fonts.googleapis.com/css2?${meta.fonts}&display=swap`);
  if (meta.lang) html = html.replace('<html lang="az">', `<html lang="${meta.lang}">`);
  out["index.html"] = html;
  return { files: out, meta };
}

/** The complete runnable project (base + site). */
export function fullSite(id) {
  const base = readTree(path.resolve("src/lib/template/files"));
  return { ...base, ...siteFiles(id).files };
}
