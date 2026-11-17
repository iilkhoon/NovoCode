import { describe, expect, it } from "vitest";
import { brandFrom, chunks, demoReply } from "./script";
import { ActionParser } from "@/lib/protocol/parser";

describe("demo script", () => {
  it("takes the brand from quotes", () => {
    expect(brandFrom("Bakıda 'Dəmlə' adlı kofe şopu")).toBe("Dəmlə");
    expect(brandFrom("kofe şopu üçün sayt")).toBe("Dəmlə");
  });
  it("builds a full site on the first turn, then adds reviews", () => {
    const first = demoReply({ intent: "build", prompt: "x", firstPrompt: "'Aroma' kofe", files: {} });
    expect(first).toContain('<novo-file path="src/App.jsx">');
    expect(first).toContain("aroma.");
    expect(first).toContain("<novo-next>");
    const second = demoReply({ intent: "build", prompt: "rəylər", firstPrompt: "x", files: { "src/components/Hero.jsx": "" } });
    expect(second).toContain("src/components/Reviews.jsx");
  });
  it("parses into real files when streamed in chunks", () => {
    const p = new ActionParser();
    const ev = [...chunks(demoReply({ intent: "build", prompt: "x", firstPrompt: "x", files: {} }), 13)].flatMap((c) => p.feed(c)).concat(p.end());
    const files = ev.filter((e) => e.type === "file-close").map((e) => (e as { path: string }).path);
    expect(files).toEqual(["src/index.css", "src/components/Header.jsx", "src/components/Hero.jsx", "src/components/Menu.jsx", "src/components/Reservation.jsx", "src/components/Footer.jsx", "src/App.jsx"]);
    expect(ev.some((e) => e.type === "plan")).toBe(true);
  });
  it("plans without writing files", () => {
    const r = demoReply({ intent: "plan", prompt: "x", firstPrompt: "x", files: {} });
    expect(r).toContain("<novo-plan>");
    expect(r).not.toContain("<novo-file");
  });
  it("chunks rejoin to the original", () => {
    const t = "a".repeat(100);
    expect([...chunks(t, 7)].join("")).toBe(t);
  });
});
