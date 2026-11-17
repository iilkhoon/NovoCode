import { describe, expect, it } from "vitest";
import { sanitizeCss, sanitizeFile } from "./sanitize";

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
