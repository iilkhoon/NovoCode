import { readSiteFile } from "@/lib/publish/sites";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Serves a published site. Reached through the subdomain rewrite in middleware. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string; path?: string[] }> }) {
  const { slug, path } = await ctx.params;
  const file = await readSiteFile(slug, (path ?? []).join("/"));
  if (!file) return new Response("Sayt tapılmadı", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(new Uint8Array(file.body), {
    headers: {
      "content-type": file.type,
      "cache-control": file.immutable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
    },
  });
}
