import { libraryIds } from "./photo-library";
import { describe, expect, it } from "vitest";
import { fallbackUrl, findImages, resolveImages } from "./images";

describe("image placeholders", () => {
  const src = `<img src="https://img.novo/800x600/white-sneakers-on-shelf" />
<img src="https://img.novo/400x400/leather-boots?n=2" /><img src="https://img.novo/800x600/white-sneakers-on-shelf" />`;

  it("finds unique placeholders with size, query and variant", () => {
    const f = findImages(src);
    expect(f).toHaveLength(2);
    expect(f[0].req).toEqual({ w: 800, h: 600, q: "white-sneakers-on-shelf", n: 0 });
    expect(f[1].req).toEqual({ w: 400, h: 400, q: "leather-boots", n: 2 });
  });

  it("replaces every occurrence", async () => {
    const out = await resolveImages(src, async (r) => `https://cdn.test/${r.q}.jpg`);
    expect(out).not.toContain("img.novo");
    expect(out.match(/white-sneakers-on-shelf\.jpg/g)).toHaveLength(2);
  });

  it("falls back to a library photo when the resolver fails", async () => {
    const out = await resolveImages(src, async () => Promise.reject(new Error("x")));
    expect(out).not.toContain("img.novo");
    expect(out).toMatch(/images\.unsplash\.com\/photo-[\w-]+\?w=800&h=600/);
  });

  it("picks on-topic library photos", () => {
    expect(libraryIds("latte-art-coffee-cup")).toBe(libraryIds("espresso"));
    expect(libraryIds("modern-dental-clinic-interior")).toBe(libraryIds("dentist"));
    expect(libraryIds("bride-holding-bouquet")).toBe(libraryIds("wedding"));
    expect(libraryIds("plov-azerbaijani-pilaf")).toBe(libraryIds("restaurant"));
    expect(libraryIds("zzz-qqq")).toHaveLength(5); // generic set
    expect(fallbackUrl({ w: 10, h: 10, q: "a-b", n: 0 })).not.toBe(fallbackUrl({ w: 10, h: 10, q: "a-b", n: 1 }));
  });

  it("leaves other content untouched", async () => {
    expect(await resolveImages("no images here", async () => "x")).toBe("no images here");
  });
});
