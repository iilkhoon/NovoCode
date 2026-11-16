import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rm, writeFile, rename, stat } from "node:fs/promises";
import path from "node:path";

/**
 * Published sites live on this server's disk: <NOVO_SITES_DIR>/<slug>/{meta.json, site/…}.
 * Served at <slug>.<NOVO_ROOT_DOMAIN> (see middleware). Works on any Node host with a
 * persistent disk (e.g. our own server); object storage can replace this later.
 */

export const SITES_DIR = process.env.NOVO_SITES_DIR || path.join(process.cwd(), ".data", "sites");
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
const RESERVED = new Set(["www", "app", "api", "admin", "mail", "novo", "novocode", "static", "assets", "cdn", "dashboard", "studio"]);
const FILE_RE = /^(?!\/)(?!.*\.\.)[A-Za-z0-9._\-/@]+$/;

export interface SiteMeta {
  slug: string;
  name: string;
  tokenHash: string;
  createdAt: number;
  updatedAt: number;
  files: number;
  bytes: number;
}

const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const metaPath = (slug: string) => path.join(SITES_DIR, slug, "meta.json");

export function validSlug(slug: string) {
  return SLUG_RE.test(slug) && !RESERVED.has(slug);
}

export async function readMeta(slug: string): Promise<SiteMeta | null> {
  try {
    return JSON.parse(await readFile(metaPath(slug), "utf8"));
  } catch {
    return null;
  }
}

export class PublishError extends Error {
  constructor(public status: number, message: string, public suggestion?: string) {
    super(message);
  }
}

/** Writes a new version atomically (temp dir → swap). Returns the owner token. */
export async function publishSite(opts: { slug: string; name: string; token?: string; files: Record<string, Buffer> }): Promise<{ token: string; meta: SiteMeta }> {
  const { slug, name, files } = opts;
  if (!validSlug(slug)) throw new PublishError(400, "Ünvan 3–40 kiçik hərf, rəqəm və “-” olmalıdır");
  const entries = Object.entries(files);
  if (!entries.length || !files["index.html"]) throw new PublishError(400, "index.html tapılmadı — əvvəlcə saytı build edin");
  for (const [p] of entries) if (!FILE_RE.test(p)) throw new PublishError(400, `Yanlış fayl yolu: ${p}`);

  const existing = await readMeta(slug);
  let token = opts.token;
  if (existing) {
    if (!token || hash(token) !== existing.tokenHash) throw new PublishError(409, "Bu ünvan artıq tutulub", `${slug.slice(0, 33)}-${randomBytes(2).toString("hex")}`);
  } else token = randomBytes(24).toString("base64url");

  const root = path.join(SITES_DIR, slug);
  const tmp = path.join(SITES_DIR, `.tmp-${slug}-${Date.now()}`);
  let bytes = 0;
  for (const [p, buf] of entries) {
    const dest = path.join(tmp, p);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    bytes += buf.length;
  }
  await mkdir(root, { recursive: true });
  const old = path.join(root, `site-old-${Date.now()}`);
  const live = path.join(root, "site");
  if (await exists(live)) await rename(live, old);
  await rename(tmp, live);
  await rm(old, { recursive: true, force: true });

  const now = Date.now();
  const meta: SiteMeta = { slug, name: name.slice(0, 120), tokenHash: hash(token!), createdAt: existing?.createdAt ?? now, updatedAt: now, files: entries.length, bytes };
  await writeFile(metaPath(slug), JSON.stringify(meta));
  return { token: token!, meta };
}

async function exists(p: string) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml",
  webmanifest: "application/manifest+json",
  mp4: "video/mp4",
  webm: "video/webm",
};

/** Resolves a request path to a file of the published site (SPA fallback to index.html). */
export async function readSiteFile(slug: string, reqPath: string): Promise<{ body: Buffer; type: string; immutable: boolean } | null> {
  if (!validSlug(slug)) return null;
  const base = path.join(SITES_DIR, slug, "site");
  const clean = decodeURIComponent(reqPath).replace(/^\/+/, "") || "index.html";
  const full = path.resolve(base, clean);
  if (!full.startsWith(base + path.sep) && full !== base) return null;
  const ext = path.extname(full).slice(1).toLowerCase();
  try {
    const body = await readFile(full);
    return { body, type: TYPES[ext] ?? "application/octet-stream", immutable: clean.startsWith("assets/") };
  } catch {
    if (ext && ext !== "html") return null; // a missing asset is a real 404
    try {
      return { body: await readFile(path.join(base, "index.html")), type: TYPES.html, immutable: false };
    } catch {
      return null;
    }
  }
}

/** Public URL for a slug, derived from the request (works for localhost and real domains). */
export function siteUrl(slug: string, req: Request): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const root = process.env.NOVO_ROOT_DOMAIN;
  const port = host.includes(":") ? ":" + host.split(":")[1] : "";
  return `${proto}://${slug}.${root ?? host.split(":")[0]}${root ? "" : port}`;
}
