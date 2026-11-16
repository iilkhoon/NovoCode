import { describe, expect, it } from "vitest";
import { DECK, formatAzn, marketSize, unitEconomics } from "./pitch";

describe("pitch maths", () => {
  it("sizes the market from SMEs × adoption × ARPU", () => {
    const m = marketSize(822_000, 3, 35);
    expect(m.customers).toBe(24_660);
    expect(m.annual).toBe(24_660 * 35 * 12);
  });
  it("computes gross margin per user", () => {
    const u = unitEconomics(29, 180, 0.04);
    expect(u.cost).toBeCloseTo(7.2);
    expect(u.margin).toBeCloseTo((29 - 7.2) / 29);
    expect(unitEconomics(0, 10, 1).margin).toBe(0);
  });
  it("formats manat amounts compactly", () => {
    expect(formatAzn(10_356_000)).toBe("10M ₼");
    expect(formatAzn(2_400_000)).toBe("2.4M ₼");
    expect(formatAzn(7.2)).toBe("7.20 ₼");
  });
  it("use of funds adds up to 100%", () => {
    expect(DECK.useOfFunds.reduce((a, u) => a + u.share, 0)).toBe(100);
  });
});
