import { describe, expect, it } from "vitest";
import { briefFromHtml, briefToPrompt } from "./reference";

const html = `<html><head><title>Ayakkabı | Mağaza</title><meta name="description" content="En yeni koleksiyonlar">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700" rel="stylesheet">
<style>body{color:#111111;background:#ffffff} .btn{background:#d97706;font-family:'Inter',sans-serif} a{color:#d97706}</style>
<script>var x = "<h1>nope</h1>";</script></head><body>
<nav><a href="/">Tümü</a><a href="/erkek">Erkek</a><a href="/kadin">Kadın</a></nav>
<h1>Adımların İçin Mükemmel Ayakkabı</h1><p>Erkek, kadın ve çocuklar için en yeni koleksiyonlar. Seçili ürünlerde %50'ye varan indirim.</p>
<a class="btn btn-primary" href="/shop">Alışverişe Başla</a><h2>Kategoriler</h2><h2>Çok Satanlar</h2>
<img src="/img/hero.jpg"><img src="https://cdn.x/pixel.gif"></body></html>`;

describe("reference brief", () => {
  const b = briefFromHtml(html, "https://shop.example/");
  it("extracts structure and style", () => {
    expect(b.title).toBe("Ayakkabı | Mağaza");
    expect(b.description).toBe("En yeni koleksiyonlar");
    expect(b.nav).toEqual(["Tümü", "Erkek", "Kadın"]);
    expect(b.headings.map((h) => h.text)).toEqual(["Adımların İçin Mükemmel Ayakkabı", "Kategoriler", "Çok Satanlar"]);
    expect(b.buttons).toContain("Alışverişe Başla");
    expect(b.colors[0]).toBe("#d97706");
    expect(b.fonts).toContain("Inter");
    expect(b.images).toEqual(["https://shop.example/img/hero.jpg"]);
  });
  it("ignores scripts and respects text ownership", () => {
    expect(b.headings.some((h) => h.text === "nope")).toBe(false);
    expect(briefToPrompt(b, { copyText: false })).toContain("Do NOT copy");
    expect(briefToPrompt(b, { copyText: true })).toContain("may reuse its texts");
  });
});
