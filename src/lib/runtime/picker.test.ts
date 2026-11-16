import { describe, expect, it } from "vitest";
import { describePick, ensurePicker, PICKER_MARK } from "./picker";

describe("element picker", () => {
  it("injects once before </head>", () => {
    const html = "<html><head><title>x</title></head><body></body></html>";
    const once = ensurePicker(html);
    expect(once).toContain(PICKER_MARK);
    expect(once.indexOf(PICKER_MARK)).toBeLessThan(once.indexOf("</head>"));
    expect(ensurePicker(once)).toBe(once);
    expect(ensurePicker("no head")).toBe("no head");
  });
  it("describes the picked element for the model", () => {
    const d = describePick({ tag: "h1", label: "Başlıq", text: "Salam", selector: "section > h1", html: "<h1>Salam</h1>" });
    expect(d).toContain("<h1>");
    expect(d).toContain('"Salam"');
    expect(d).toContain("section > h1");
  });
});
