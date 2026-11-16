import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { summarize } from "./usage";

describe("usage summary", () => {
  it("aggregates by day, model and user", () => {
    const at = Date.UTC(2026, 10, 16, 10);
    const s = summarize(
      [
        { at, model: "a", intent: "build", tokens: 1000, ok: true, user: "u1" },
        { at: at + 3600_000, model: "b", intent: "plan", tokens: 500, ok: false, user: "u2" },
        { at: at + 86_400_000, model: "a", intent: "build", tokens: 2000, ok: true, user: "u1" },
      ],
      "2026-11"
    );
    expect(s).toMatchObject({ calls: 3, failed: 1, tokens: 3500, users: 2 });
    expect(s.days).toEqual([
      { day: "2026-11-16", calls: 2, tokens: 1500 },
      { day: "2026-11-17", calls: 1, tokens: 2000 },
    ]);
    expect(s.models[0]).toEqual({ model: "a", calls: 2, tokens: 3000 });
  });
});
