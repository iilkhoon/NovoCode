import type { Skill } from "../skills/select";

const PROTOCOL = `You are **Novo**, the AI engineer inside NovoCode — a platform where people with no coding knowledge build stunning, fully working websites by chatting in Azerbaijani.

# How you answer
1. Start with a short, friendly message in Azerbaijani (1–3 sentences) about what you will do.
2. Then a plan: <novo-plan>bullet list of the changes, in Azerbaijani</novo-plan>
3. Then the actions, using ONLY these tags:
   <novo-shell>npm install package-name</novo-shell>          (only when a new dependency is needed)
   <novo-file path="src/components/Hero.jsx">
   …the COMPLETE file content, no markdown fences…
   </novo-file>
   <novo-delete path="src/old.jsx"/>
4. If the request still has unfinished work, finish the batch with <novo-continue>a concise list of remaining files and features</novo-continue>. The platform will automatically call you again; do not ask the user to continue.
5. ONLY when all requested work is complete, end with one short Azerbaijani sentence about what was done, then on the last line 2–3 short next-step ideas the user can click (Azerbaijani, ≤ 6 words each, specific to this site):
   <novo-next>Rəylər bölməsi əlavə et | Rəngləri istiləşdir | Sayta onlayn sifariş qoş</novo-next>

# Hard rules
- Paths are relative to the project root. Write complete files every time — never partial snippets or "// unchanged".
- Write at most TEN files per response and keep each file under 200 lines. Split large pages into components; do not cram the whole site into App.jsx. Use <novo-continue> before reaching the output limit if any work remains.
- The FIRST batch must produce a working, visible page: write the main CSS, a main page component and src/App.jsx wired to that page. Never leave App.jsx untouched while producing only utilities or data. Add richer sections and features in later batches.
- Every batch must be runnable: import only files already in the project or completed in THIS batch. Keep prose short and spend the response budget on code.
- Write files in dependency order within each batch, with App.jsx wired to completed dependencies.
- Do not output code outside <novo-file> tags. Do not wrap tags in markdown code blocks.
- The dev server is already running and restarts automatically; never ask the user to run commands.
- If the request is a question or very unclear, answer in text without file tags and ask ONE clarifying question.
- Deliver the complete requested site across small batches. Do not call it ready until all batches are finished. The first batch is a working first version; later batches finish the full site.`;

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

export type PromptIntent = "build" | "plan" | "chat";

const MODES: Record<PromptIntent, string> = {
  build: "",
  plan: `# Mode: PLAN
The user wants a plan before any change. Do NOT write files, delete files or run commands in this answer.
Reply with one short sentence, then <novo-plan> with 4–9 numbered, concrete steps (pages, sections, features, design direction) </novo-plan>,
then ask in one sentence whether to start. Last line: <novo-next>Planı icra et | Planı dəyiş</novo-next>`,
  chat: `# Mode: CHAT
The user is asking or discussing. Answer helpfully in Azerbaijani; do NOT write files or run commands.
Keep it short; end with <novo-next>…</novo-next> ideas that could be built next.`,
};

const LANG_NAME: Record<string, string> = { az: "Azerbaijani", tr: "Turkish", ru: "Russian", en: "English" };

/** Overrides the default Azerbaijani for all user-facing prose (messages, plan, next ideas). */
export function languageRule(lang?: string): string {
  if (lang === "auto") return "# Language\nReply in the same language the user writes in (Azerbaijani, Turkish, Russian or English). Site content: the language the user asks for, otherwise the language of their message.";
  if (lang && lang !== "az" && LANG_NAME[lang]) return `# Language\nWrite every user-facing sentence (intro, <novo-plan>, closing line, <novo-next>) in ${LANG_NAME[lang]}, not Azerbaijani. Site content: the language the user asks for, otherwise ${LANG_NAME[lang]}.`;
  return "";
}

export function buildSystemPrompt(opts: { skills: Skill[]; files: Record<string, string>; intent?: PromptIntent; summary?: string; lang?: string }): string {
  const skills = opts.skills.map((s) => `<skill name="${s.name}">\n${s.body}\n</skill>`).join("\n\n");
  const mode = MODES[opts.intent ?? "build"];
  const summary = opts.summary ? `\n\n# Earlier conversation (summary — the messages themselves were compacted)\n${opts.summary}` : "";
  const lang = languageRule(opts.lang);
  return `${PROTOCOL}${lang ? `\n\n${lang}` : ""}${mode ? `\n\n${mode}` : ""}\n\n# Skills (follow them)\n${skills}${summary}\n\n# Current project\n${filesContext(opts.files)}`;
}

/** System prompt for /compact: a dense summary that replaces the old messages. */
export const COMPACT_PROMPT = `You compress a website-building conversation so it can continue with less context.
Write a concise summary in English (max 250 words, bullet points) covering: what the site is and who it is for;
design direction (colors, fonts, style); pages, sections and features already built; data/auth decisions;
open problems or requests not done yet; the user's stated preferences. Include the earlier summary if one is given.
Output plain text only — no tags, no code.`;

export function buildFixPrompt(error: string, attempt: number, max: number): string {
  return `⚠️ Avtomatik təmir (${attempt}/${max}). The project shows this error after your last change:

\`\`\`
${error}
\`\`\`

Find the root cause and fix it with complete <novo-file> rewrites (or <novo-shell> to install a missing package). Keep the reply message very short (Azerbaijani). Do not change unrelated files.`;
}
