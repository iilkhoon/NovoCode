import { describe, expect, it } from "vitest";
import { sanitizeCss, sanitizeImports, sanitizeFile } from "./sanitize";

describe("sanitizeCss", () => {
  it("fixes the Tailwind entry import", () => {
    expect(sanitizeCss('@import "@tailwindcss/vite";\nbody{}')).toBe('@import "tailwindcss";\nbody{}');
    expect(sanitizeCss("@tailwind base;\n@tailwind components;\n@tailwind utilities;\nbody{}")).toBe('@import "tailwindcss";\nbody{}');
  });
  it("renames bare colour tokens inside @theme only", () => {
    const out = sanitizeCss('@import "tailwindcss";\n@theme {\n  --background: #fff;\n  --primary: red;\n  --color-accent: blue;\n  --font-sans: Inter;\n  --radius: 1rem;\n}\n:root { --primary: x; }');
    expect(out).toContain("--color-background: #fff");
    expect(out).toContain("--color-primary: red");
    expect(out).toContain("--color-accent: blue");
    expect(out).not.toContain("--color-color");
    expect(out).toContain("--font-sans: Inter");
    expect(out).toContain("--radius: 1rem");
    expect(out).toContain(":root { --primary: x; }");
  });
  it("moves font url imports to the top", () => {
    const out = sanitizeCss('@import "tailwindcss";\n@import url("https://fonts.googleapis.com/css2?family=Inter");\nbody{}');
    expect(out.startsWith('@import url("https://fonts.googleapis.com/css2?family=Inter")')).toBe(true);
    expect(out).toContain('@import "tailwindcss";');
  });
  it("leaves correct CSS and non-CSS files alone", () => {
    const good = '@import "tailwindcss";\n@theme {\n  --color-primary: red;\n}\n';
    expect(sanitizeCss(good)).toBe(good);
    expect(sanitizeFile("src/App.jsx", "@tailwind base;")).toBe("@tailwind base;");
  });
});

describe("sanitizeImports", () => {
  it("fixes misspelt package names and leaves correct ones alone", () => {
    const code = `import { Mail } from "lucide.react";\nimport { motion } from 'framer_motion';\nimport { Link } from "react-router-dom";\nimport x from "./lucide.react";`;
    expect(sanitizeImports(code)).toBe(`import { Mail } from "lucide-react";\nimport { motion } from 'framer-motion';\nimport { Link } from "react-router-dom";\nimport x from "./lucide.react";`);
  });

  it("adds the React import when React.* is used without it", () => {
    expect(sanitizeImports(`export default function A() {\n  const [a] = React.useState(0);\n}`)).toMatch(/^import React from "react";\n/);
    const ok = `import React, { useState } from "react";\nReact.useMemo();`;
    expect(sanitizeImports(ok)).toBe(ok);
  });

  it("adds the cn import when the helper is used without it", () => {
    expect(sanitizeImports(`export const L = (p) => <label className={cn("a", p.c)} />;`)).toMatch(/^import \{ cn \} from "@\/lib\/utils";\n/);
    const ok = `import { cn } from "@/lib/utils";\ncn("a");`;
    expect(sanitizeImports(ok)).toBe(ok);
    expect(sanitizeImports(`export function cn(...a) { return a.join(" "); }\ncn("a");`)).not.toMatch(/^import/);
  });
});
