import "server-only";

/** Imports a public GitHub repository's source files (text only, size-limited). */

const SKIP = /(^|\/)(node_modules|dist|build|\.next|\.git|coverage|\.turbo|\.vercel|vendor)\/|(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb)$/;
const TEXT = /\.(jsx?|tsx?|mjs|cjs|json|css|scss|html?|md|mdx|svg|txt|ya?ml|toml|env\.example|gitignore|vue|svelte|astro)$|(^|\/)(README|LICENSE|\.gitignore|\.npmrc)$/i;
const MAX_FILES = 250;
const MAX_FILE = 200_000;
const MAX_TOTAL = 3_000_000;

export function parseRepo(input: string): { owner: string; repo: string; ref?: string } | null {
  const s = input.trim().replace(/\.git$/, "");
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/tree\/([\w./-]+))?\/?$/i) ?? s.match(/^([\w.-]+)\/([\w.-]+)$/);
  return m ? { owner: m[1], repo: m[2], ref: m[3] } : null;
}

const gh = (path: string) =>
  fetch(`https://api.github.com${path}`, {
    headers: { accept: "application/vnd.github+json", "user-agent": "NovoCode", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
    signal: AbortSignal.timeout(15_000),
  });

export async function importRepo(input: string): Promise<{ name: string; files: Record<string, string>; skipped: number }> {
  const r = parseRepo(input);
  if (!r) throw new Error("Repo linki düzgün deyil (məs. github.com/ad/layihə)");
  const info = await gh(`/repos/${r.owner}/${r.repo}`);
  if (info.status === 404) throw new Error("Repo tapılmadı və ya şəxsidir (private)");
  if (info.status === 403) throw new Error("GitHub limiti doldu — bir az sonra yenidən cəhd edin");
  if (!info.ok) throw new Error(`GitHub xətası ${info.status}`);
  const meta = (await info.json()) as { default_branch: string; name: string };
  const ref = r.ref ?? meta.default_branch;
  const tree = await gh(`/repos/${r.owner}/${r.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`);
  if (!tree.ok) throw new Error(`Fayllar alınmadı (${tree.status})`);
  const entries = ((await tree.json()).tree as { path: string; type: string; size?: number }[]).filter((e) => e.type === "blob");
  const wanted = entries.filter((e) => !SKIP.test(e.path) && TEXT.test(e.path) && (e.size ?? 0) <= MAX_FILE);
  let total = 0;
  const pick: typeof wanted = [];
  for (const e of wanted) {
    if (pick.length >= MAX_FILES || total + (e.size ?? 0) > MAX_TOTAL) break;
    total += e.size ?? 0;
    pick.push(e);
  }
  const files: Record<string, string> = {};
  for (let i = 0; i < pick.length; i += 8) {
    await Promise.all(
      pick.slice(i, i + 8).map(async (e) => {
        const res = await fetch(`https://raw.githubusercontent.com/${r.owner}/${r.repo}/${encodeURIComponent(ref)}/${e.path.split("/").map(encodeURIComponent).join("/")}`, { signal: AbortSignal.timeout(15_000) });
        if (res.ok) files[e.path] = await res.text();
      })
    );
  }
  if (!Object.keys(files).length) throw new Error("Repoda gətiriləcək mətn faylı tapılmadı");
  return { name: meta.name, files, skipped: entries.length - Object.keys(files).length };
}
