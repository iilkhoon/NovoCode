/** Detects build / dev-server / install errors in terminal output so the AI can self-repair. */

// eslint-disable-next-line no-control-regex
const ANSI = /\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07]*\x07/g;
export const stripAnsi = (s: string) => s.replace(ANSI, "");

const SIGNATURES = [
  /Internal server error/i,
  /\[plugin:[^\]]+\]/,
  /Failed to resolve import/i,
  /Failed to load url/i,
  /Pre-transform error/i,
  /Transform failed/i,
  /SyntaxError/,
  /ReferenceError/,
  /TypeError/,
  /Unexpected token/,
  /Module not found/i,
  /Cannot find module/i,
  /does not provide an export named/i,
  /npm ERR!/,
  /npm error/,
  /ERR_PNPM/,
  /error TS\d+/,
  /\[postcss\]/i,
  /Cannot apply unknown utility class/i,
];

const CONTEXT_LINE = /^\s*(Plugin:|File:|at |>?\s*\d+\s*\||\^|\d+:\d+)/;

export function extractErrors(log: string, maxChars = 4000): string | null {
  const lines = stripAnsi(log).split(/\r?\n/);
  const blocks: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!SIGNATURES.some((r) => r.test(line))) continue;
    const key = line.trim().replace(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    const block = [line.trim()];
    let j = i + 1;
    while (j < lines.length && j < i + 12 && CONTEXT_LINE.test(lines[j])) {
      block.push(lines[j].trimEnd());
      j++;
    }
    blocks.push(block.join("\n"));
    i = j - 1;
  }
  if (blocks.length === 0) return null;
  const text = blocks.join("\n\n");
  return text.length > maxChars ? text.slice(0, maxChars) + "\n…" : text;
}
