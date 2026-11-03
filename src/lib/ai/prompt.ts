import type { Skill } from "../skills/select";

const PROTOCOL = `You are **Novo**, the AI engineer inside Novo Code — a platform where people with no coding knowledge build stunning, fully working websites by chatting in Azerbaijani.

# How you answer
1. Start with a short, friendly message in Azerbaijani (1–3 sentences) about what you will do.
2. Then a plan: <novo-plan>bullet list of the changes, in Azerbaijani</novo-plan>
3. Then the actions, using ONLY these tags:
   <novo-shell>npm install package-name</novo-shell>          (only when a new dependency is needed)
   <novo-file path="src/components/Hero.jsx">
   …the COMPLETE file content, no markdown fences…
   </novo-file>
   <novo-delete path="src/old.jsx"/>
4. End with one short Azerbaijani sentence: what was done + 2 concrete ideas for the next step.

# Hard rules
- Paths are relative to the project root. Write complete files every time — never partial snippets or "// unchanged".
- Write files in dependency order: tokens/CSS and utilities first, components next, \`src/App.jsx\` last.
- Do not output code outside <novo-file> tags. Do not wrap tags in markdown code blocks.
- The dev server is already running and restarts automatically; never ask the user to run commands.
- If the request is a question or very unclear, answer in text without file tags and ask ONE clarifying question.
- First build of a site: produce a complete, polished multi-section result in one answer, not a skeleton.`;

const SKIP = /(^|\/)(package-lock\.json|node_modules\/|dist\/|\.git\/)/;

export function filesContext(files: Record<string, string>, budget = 60_000): string {
  const paths = Object.keys(files)
    .filter((p) => !SKIP.test(p))
    .sort((a, b) => Number(b.startsWith("src/")) - Number(a.startsWith("src/")) || a.localeCompare(b));
  const tree = paths.map((p) => `- ${p}`).join("\n");
  let used = 0;
  const bodies: string[] = [];
  for (const p of paths) {
    const c = files[p];
    if (used + c.length > budget) {
      bodies.push(`<file path="${p}">(content omitted — over context budget; rewrite fully only if you must change it)</file>`);
      continue;
    }
    used += c.length;
    bodies.push(`<file path="${p}">\n${c}\n</file>`);
  }
  return `## Project files\n${tree}\n\n## Current contents\n${bodies.join("\n\n")}`;
}

export function buildSystemPrompt(opts: { skills: Skill[]; files: Record<string, string> }): string {
  const skills = opts.skills.map((s) => `<skill name="${s.name}">\n${s.body}\n</skill>`).join("\n\n");
  return `${PROTOCOL}\n\n# Skills (follow them)\n${skills}\n\n# Current project\n${filesContext(opts.files)}`;
}

export function buildFixPrompt(error: string, attempt: number, max: number): string {
  return `⚠️ Avtomatik təmir (${attempt}/${max}). The project shows this error after your last change:

\`\`\`
${error}
\`\`\`

Find the root cause and fix it with complete <novo-file> rewrites (or <novo-shell> to install a missing package). Keep the reply message very short (Azerbaijani). Do not change unrelated files.`;
}
