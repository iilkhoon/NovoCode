import { NextResponse, type NextRequest } from "next/server";

/**
 * <slug>.<root domain> → the published site. Root domain comes from NOVO_ROOT_DOMAIN
 * (e.g. "novocode.app"); in development any "<slug>.localhost" works out of the box.
 */
const ROOT = process.env.NOVO_ROOT_DOMAIN;

export function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const root = ROOT ?? "localhost";
  if (!host.endsWith("." + root)) return NextResponse.next();
  const slug = host.slice(0, -(root.length + 1));
  if (!slug || slug.includes(".") || slug === "www") return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/sites-serve/${slug}${req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!_next/|sites-serve/).*)"] };
