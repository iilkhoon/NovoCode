/**
 * Deterministic fixes for mistakes models make again and again, applied to every file before it
 * reaches the preview. Cheaper and faster than a self-fix round-trip to the model.
 */

const COLOR_TOKENS = ["background", "foreground", "muted", "muted-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground", "border", "input", "ring", "card", "card-foreground", "popover", "popover-foreground", "destructive", "destructive-foreground"];

export function sanitizeFile(path: string, content: string): string {
  if (/\.css$/.test(path)) return sanitizeCss(content);
  return content;
}

export function sanitizeCss(css: string): string {
  let out = css
    // Tailwind v4 entry: models often import the Vite plugin or use v3 directives
    .replace(/@import\s+["']@tailwindcss\/(vite|postcss)["'];?/g, '@import "tailwindcss";')
    .replace(/@import\s+["']tailwindcss\/(base|components|utilities|preflight)(\.css)?["'];?\s*/g, "");
  if (/@tailwind\s+(base|components|utilities)/.test(out)) {
    out = out.replace(/@tailwind\s+(base|components|utilities);?\s*/g, "");
    if (!/@import\s+["']tailwindcss["']/.test(out)) out = `@import "tailwindcss";\n${out}`;
  }
  // inside @theme, bare colour names (--primary) do nothing in v4: they must be --color-primary
  out = out.replace(/@theme\s*(inline\s*)?\{([\s\S]*?)\n\}/g, (block, _inline, body: string) =>
    block.replace(body, body.replace(new RegExp(`(^|\\n)(\\s*)--(${COLOR_TOKENS.join("|")})\\s*:`, "g"), "$1$2--color-$3:"))
  );
  // @import url(...) for fonts must come before everything else, or the browser ignores it
  const fontImports = out.match(/@import\s+url\([^)]*\)\s*;?/g);
  if (fontImports && !out.trimStart().startsWith("@import url(")) {
    out = fontImports.join("\n") + "\n" + fontImports.reduce((s, imp) => s.replace(imp, ""), out).replace(/^\s+/, "");
  }
  return out;
}
