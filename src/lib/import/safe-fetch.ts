import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Fetches a public web page for the "clone a site" import, refusing anything that resolves
 * to a private, loopback or link-local address (SSRF protection), following redirects
 * manually so every hop is checked, with size and time limits.
 */

function privateIp(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80")) return true;
    const m = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return m ? privateIp(m[1]) : false;
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Link düzgün deyil");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Yalnız http(s) linkləri");
  if (url.username || url.password) throw new Error("Link düzgün deyil");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error("Bu ünvan açıq internetdə deyil");
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error("Sayt tapılmadı");
  if (addrs.some((a) => privateIp(a.address))) throw new Error("Bu ünvan açıq internetdə deyil");
  return url;
}

export async function fetchPublicHtml(raw: string, maxBytes = 2_000_000): Promise<{ url: string; html: string }> {
  let url = await assertPublicUrl(raw);
  for (let hop = 0; hop < 4; hop++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "Mozilla/5.0 (compatible; NovoCodeImporter/1.0)", accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(12_000),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = await assertPublicUrl(new URL(res.headers.get("location")!, url).toString());
      continue;
    }
    if (!res.ok) throw new Error(`Sayt cavab vermədi (${res.status})`);
    if (!/text\/html|xhtml/i.test(res.headers.get("content-type") ?? "")) throw new Error("Bu link HTML səhifə deyil");
    const reader = res.body!.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
    return { url: url.toString(), html: new TextDecoder().decode(Buffer.concat(chunks)) };
  }
  throw new Error("Çox yönləndirmə");
}

export { privateIp as _privateIp };
