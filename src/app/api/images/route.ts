import { NextResponse } from "next/server";
import { fallbackUrl, hash, type ImgRequest } from "@/lib/images";

/**
 * GET /api/images?q=white-sneakers&w=800&h=600&n=0 → { url, source }
 * Uses Pexels (free key: PEXELS_API_KEY) for on-topic, high-quality photos; otherwise a
 * keyword photo service. Results are cached in memory per query.
 */
export const dynamic = "force-dynamic";

type Photo = { src: { original: string }; alt?: string };
const cache = new Map<string, Photo[]>();

async function searchPexels(q: string, key: string, orientation: string): Promise<Photo[]> {
  const ck = `${q}|${orientation}`;
  if (cache.has(ck)) return cache.get(ck)!;
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=15&orientation=${orientation}`, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`pexels ${r.status}`);
  const photos = ((await r.json()).photos ?? []) as Photo[];
  if (cache.size > 500) cache.clear();
  cache.set(ck, photos);
  return photos;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80);
  const w = Math.min(Math.max(Number(u.searchParams.get("w")) || 800, 16), 2400);
  const h = Math.min(Math.max(Number(u.searchParams.get("h")) || 600, 16), 2400);
  const n = Math.min(Math.max(Number(u.searchParams.get("n")) || 0, 0), 99);
  if (!q) return NextResponse.json({ error: "q is required" }, { status: 400 });
  const ir: ImgRequest = { w, h, q, n };

  const key = process.env.PEXELS_API_KEY;
  if (key) {
    try {
      const orientation = w > h * 1.15 ? "landscape" : h > w * 1.15 ? "portrait" : "square";
      const photos = await searchPexels(q.replace(/-/g, " "), key, orientation);
      if (photos.length) {
        const p = photos[(hash(q) + n) % photos.length];
        const url = `${p.src.original}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
        return NextResponse.json({ url, source: "pexels", alt: p.alt ?? "" }, { headers: { "cache-control": "public, max-age=86400" } });
      }
    } catch {
      /* fall through to the keyword service */
    }
  }
  return NextResponse.json({ url: fallbackUrl(ir), source: "fallback" });
}
