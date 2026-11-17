import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/components/landing/data";
import { SITE_TEMPLATES } from "./index";
import { welcomeMessage } from "./start";
import { extractNext } from "@/lib/chat";

describe("ready-made templates", () => {
  it.each(TEMPLATES.map((t) => [t.id, t] as const))("%s has files, a thumbnail and a welcome", (id, t) => {
    const files = SITE_TEMPLATES[id];
    expect(files, `src/lib/templates/sites/${id}`).toBeTruthy();
    expect(files["src/App.jsx"]).toContain("export default function App");
    expect(files["index.html"]).toContain('id="novo-badge"');
    expect(files["src/lib/img.js"]).toBeTruthy();
    expect(Object.values(files).join("")).not.toMatch(/img\.novo|picsum|loremflickr/);
    expect(existsSync(`public/templates/${id}.jpg`)).toBe(true);
    expect(extractNext(welcomeMessage(id, t.name).content).length).toBeGreaterThan(1);
  });
});
