/**
 * Turns a fetched web page into a compact "design brief" the model can rebuild from:
 * title, description, navigation, section headings and text, colours, fonts, images.
 * Pure string processing (no DOM) so it runs on the server and in tests.
 */

export interface PageBrief {
  url: string;
  title: string;
  description: string;
  nav: string[];
  headings: { level: number; text: string }[];
  paragraphs: string[];
  buttons: string[];
  colors: string[];
  fonts: string[];
  images: string[];
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const uniq = <T,>(a: T[]) => [...new Set(a)];

export function briefFromHtml(html: string, url: string): PageBrief {
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<noscript[\s\S]*?<\/noscript>/gi, "").replace(/<svg[\s\S]*?<\/svg>/gi, "");
  const styles = (html.match(/<style[\s\S]*?<\/style>/gi) ?? []).join("\n") + (html.match(/style="[^"]*"/gi) ?? []).join("\n");
  const body = clean.replace(/<style[\s\S]*?<\/style>/gi, "");
  const base = (() => {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  })();
  const abs = (src: string) => {
    try {
      return base ? new URL(src, base).toString() : src;
    } catch {
      return src;
    }
  };

  const title = text(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = decode(body.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] ?? body.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)/i)?.[1] ?? "");
  const navHtml = body.match(/<nav[\s\S]*?<\/nav>/i)?.[0] ?? body.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "";
  const nav = uniq((navHtml.match(/<a[^>]*>([\s\S]*?)<\/a>/gi) ?? []).map(text).filter((t) => t && t.length < 40)).slice(0, 12);
  const headings = [...body.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: text(m[2]) })).filter((h) => h.text && h.text.length < 160).slice(0, 40);
  const paragraphs = uniq([...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => text(m[1])).filter((t) => t.length > 30)).slice(0, 25).map((t) => t.slice(0, 280));
  const buttons = uniq([...body.matchAll(/<(?:button|a)[^>]*class=["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*>([\s\S]*?)<\/(?:button|a)>/gi), ...body.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map((m) => text(m[1])).filter((t) => t && t.length < 40)).slice(0, 12);
  const colorCounts = new Map<string, number>();
  for (const c of styles.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]+\)|oklch\([^)]+\)/g) ?? []) {
    const k = c.toLowerCase();
    colorCounts.set(k, (colorCounts.get(k) ?? 0) + 1);
  }
  const colors = [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 12);
  const fonts = uniq(
    [...(styles.match(/font-family\s*:\s*([^;}"]+)/gi) ?? []).map((f) => f.split(":")[1].split(",")[0].replace(/["']/g, "").trim()), ...[...html.matchAll(/fonts\.googleapis\.com\/css2?\?family=([^"'&]+)/gi)].map((m) => decodeURIComponent(m[1]).split(":")[0].replace(/\+/g, " "))].filter((f) => f && !/inherit|var\(|system-ui|sans-serif|serif|monospace/i.test(f))
  ).slice(0, 6);
  const images = uniq([...body.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => abs(m[1])).filter((s) => /^https?:/.test(s) && !/\.svg(\?|$)|pixel|tracking|1x1/i.test(s))).slice(0, 12);
  return { url, title, description, nav, headings, paragraphs, buttons, colors, fonts, images };
}

/** Prompt for the model: rebuild a site inspired by the reference (structure + style). */
export function briefToPrompt(b: PageBrief, opts: { copyText: boolean; note?: string }): string {
  const lines = [
    `Build a new website inspired by this reference page: ${b.url}`,
    `Recreate its STRUCTURE (sections in this order, navigation) and VISUAL STYLE (colour palette, fonts, spacing, mood) as closely as reasonable, with clean original code.`,
    opts.copyText
      ? `The user owns this site: you may reuse its texts.`
      : `Do NOT copy the reference's texts, brand name or logos — write fresh, realistic Azerbaijani copy for the same kind of business.`,
    `Use real photos via https://img.novo/<w>x<h>/<keywords> matching each section.`,
    "",
    `Title: ${b.title || "—"}`,
    b.description && `Description: ${b.description}`,
    b.nav.length && `Navigation: ${b.nav.join(" · ")}`,
    b.headings.length && `Section headings (in order):\n${b.headings.map((h) => `${"  ".repeat(h.level - 1)}- H${h.level}: ${h.text}`).join("\n")}`,
    b.buttons.length && `Buttons / CTAs: ${b.buttons.join(" · ")}`,
    b.paragraphs.length && `Sample copy (for tone and content type):\n${b.paragraphs.slice(0, 8).map((p) => `- ${p}`).join("\n")}`,
    b.colors.length && `Most used colours: ${b.colors.join(", ")}`,
    b.fonts.length && `Fonts: ${b.fonts.join(", ")}`,
    opts.note && `User note: ${opts.note}`,
  ];
  return lines.filter(Boolean).join("\n");
}
