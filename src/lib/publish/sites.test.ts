import { describe, expect, it, vi, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

vi.mock("server-only", () => ({}));
process.env.NOVO_SITES_DIR = mkdtempSync(path.join(tmpdir(), "novo-sites-"));

let lib: typeof import("./sites");
beforeAll(async () => {
  lib = await import("./sites");
});

describe("published sites", () => {
  it("validates slugs", () => {
    expect(lib.validSlug("kofe-evi")).toBe(true);
    expect(lib.validSlug("ab")).toBe(false);
    expect(lib.validSlug("-x-y")).toBe(false);
    expect(lib.validSlug("admin")).toBe(false);
    expect(lib.validSlug("Kofe")).toBe(false);
  });

  it("publishes, serves with SPA fallback, protects ownership and paths", async () => {
    const files = { "index.html": Buffer.from("<h1>hi</h1>"), "assets/app.js": Buffer.from("1") };
    const { token } = await lib.publishSite({ slug: "test-site", name: "T", files });
    expect((await lib.readSiteFile("test-site", "/"))?.body.toString()).toBe("<h1>hi</h1>");
    expect((await lib.readSiteFile("test-site", "/catalog/5"))?.type).toContain("text/html");
    expect(await lib.readSiteFile("test-site", "/assets/missing.js")).toBeNull();
    expect((await lib.readSiteFile("test-site", "assets/app.js"))?.immutable).toBe(true);
    expect(await lib.readSiteFile("test-site", "../../etc/passwd")).not.toMatchObject({ type: "application/octet-stream" });
    await expect(lib.publishSite({ slug: "test-site", name: "x", files })).rejects.toMatchObject({ status: 409 });
    await expect(lib.publishSite({ slug: "test-site", name: "x", token, files: { "index.html": Buffer.from("v2") } })).resolves.toBeTruthy();
    expect((await lib.readSiteFile("test-site", "/"))?.body.toString()).toBe("v2");
    await expect(lib.publishSite({ slug: "other-site", name: "x", files: { "index.html": Buffer.from(""), "../x": Buffer.from("") } })).rejects.toMatchObject({ status: 400 });
  });
});
