/**
 * Real, on-topic photos for generated sites.
 * The model writes image placeholders like `https://img.novo/800x600/white-sneakers-on-shelf`
 * (or `.../800x600/white-sneakers?n=2` for a different photo with the same query).
 * Before a file reaches the preview we swap each placeholder for a real photo URL from
 * /api/images (Pexels when a key is configured, a keyword photo service otherwise).
 */

import { libraryIds, unsplashUrl } from "./photo-library";

export const IMG_RE = /https?:\/\/img\.novo\/(\d{2,4})x(\d{2,4})\/([a-z0-9][a-z0-9-]{0,80})(?:\?n=(\d{1,2}))?/gi;

export interface ImgRequest {
  w: number;
  h: number;
  q: string;
  n: number;
}

export function findImages(content: string): { token: string; req: ImgRequest }[] {
  const out: { token: string; req: ImgRequest }[] = [];
  const seen = new Set<string>();
  for (const m of content.matchAll(IMG_RE)) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    out.push({ token: m[0], req: { w: Math.min(+m[1], 2400), h: Math.min(+m[2], 2400), q: m[3].toLowerCase(), n: m[4] ? +m[4] : 0 } });
  }
  return out;
}

/** On-topic photo from our verified library — needs no API key, the always-available fallback. */
export function fallbackUrl({ w, h, q, n }: ImgRequest): string {
  const ids = libraryIds(q);
  return unsplashUrl(ids[(hash(q) + n) % ids.length], w, h);
}

export function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10000;
}

export async function resolveImages(content: string, resolve: (r: ImgRequest) => Promise<string>): Promise<string> {
  const found = findImages(content);
  if (!found.length) return content;
  const urls = await Promise.all(found.map(({ req }) => resolve(req).catch(() => fallbackUrl(req))));
  let out = content;
  found.forEach(({ token }, i) => (out = out.split(token).join(urls[i])));
  return out;
}

const cache = new Map<string, Promise<string>>();
/** Browser resolver: asks our API, caches per placeholder for the session. */
export function apiResolver(req: ImgRequest): Promise<string> {
  const key = `${req.w}x${req.h}/${req.q}/${req.n}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`/api/images?q=${encodeURIComponent(req.q)}&w=${req.w}&h=${req.h}&n=${req.n}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: { url?: string }) => d.url || fallbackUrl(req))
        .catch(() => fallbackUrl(req))
    );
  }
  return cache.get(key)!;
}
