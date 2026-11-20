/**
 * Deterministic fixes for mistakes models make again and again, applied to every file before it
 * reaches the preview. Cheaper and faster than a self-fix round-trip to the model.
 */

const COLOR_TOKENS = ["background", "foreground", "muted", "muted-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground", "border", "input", "ring", "card", "card-foreground", "popover", "popover-foreground", "destructive", "destructive-foreground"];

export function sanitizeFile(path: string, content: string): string {
  if (/\.css$/.test(path)) return sanitizeCss(content);
  if (/\.(jsx?|tsx?)$/.test(path)) return sanitizeImports(content);
  return content;
}

/** Misspelt package names in imports ("lucide.react", "framer_motion", "react-router") that break the build. */
const PACKAGE_FIXES: [RegExp, string][] = [
  [/^lucide[._ ]?react$|^lucide$|^lucide-icons$/i, "lucide-react"],
  [/^framer[._ ]motion$/i, "framer-motion"],
  [/^motion[._ ]react$/i, "motion/react"],
  [/^react[._ ]router[._ ]dom$/i, "react-router-dom"],
];

export function sanitizeImports(code: string): string {
  const out = code.replace(/(\bfrom\s*|\bimport\s*\(?\s*)(["'])([^"'\n]+)\2/g, (all, pre: string, q: string, spec: string) => {
    const fix = PACKAGE_FIXES.find(([re, to]) => spec !== to && re.test(spec));
    return fix ? `${pre}${q}${fix[1]}${q}` : all;
  });
  // React.useState(...) with no React import: works in old JSX setups, "React is not defined" here
  const missing: string[] = [];
  if (/\bReact\.\w/.test(out) && !/import\s+(\*\s+as\s+)?React\b/.test(out)) missing.push(`import React from "react";`);
  // the kit's class-name helper, used everywhere and often forgotten
  if (/(^|[^.\w])cn\(/.test(out) && !/\bcn\b[^\n]*from|(function|const|let)\s+cn\b/.test(out)) missing.push(`import { cn } from "@/lib/utils";`);
  return missing.length ? `${missing.join("\n")}\n${out}` : out;
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
