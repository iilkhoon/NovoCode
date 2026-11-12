import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { assertSameOrigin, HttpError, isDataImage, rateLimit, readJson, _resetRateLimits } from "./guard";

const req = (headers: Record<string, string>, body = "") => new Request("http://novo.test/api/chat", { method: "POST", headers, body });

describe("assertSameOrigin", () => {
  it("allows same host and missing origin", () => {
    expect(() => assertSameOrigin(req({ host: "novo.test", origin: "http://novo.test" }))).not.toThrow();
    expect(() => assertSameOrigin(req({ host: "novo.test" }))).not.toThrow();
  });
  it("refuses POSTs without Origin in production (scripts, not browsers)", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertSameOrigin(req({ host: "novo.test" }))).toThrow(HttpError);
    expect(() => assertSameOrigin(req({ host: "novo.test", origin: "http://novo.test" }))).not.toThrow();
  });
  afterEach(() => vi.unstubAllEnvs());
  it("rejects other sites", () => {
    expect(() => assertSameOrigin(req({ host: "novo.test", origin: "https://evil.example" }))).toThrow(HttpError);
  });
});

describe("rateLimit", () => {
  beforeEach(() => _resetRateLimits());
  it("blocks after the limit and resets after the window", () => {
    const r = req({ "x-forwarded-for": "1.2.3.4" });
    for (let i = 0; i < 3; i++) rateLimit(r, "t", 3, 1000, 0);
    expect(() => rateLimit(r, "t", 3, 1000, 10)).toThrow(/Çox sorğu/);
    expect(() => rateLimit(r, "t", 3, 1000, 1001)).not.toThrow();
  });
  it("counts IPs separately", () => {
    for (let i = 0; i < 3; i++) rateLimit(req({ "x-forwarded-for": "1.1.1.1" }), "t", 3, 1000, 0);
    expect(() => rateLimit(req({ "x-forwarded-for": "2.2.2.2" }), "t", 3, 1000, 0)).not.toThrow();
  });
});

describe("readJson", () => {
  it("parses and enforces size", async () => {
    await expect(readJson(req({}, '{"a":1}'), 100)).resolves.toEqual({ a: 1 });
    await expect(readJson(req({}, "x".repeat(200)), 100)).rejects.toMatchObject({ status: 413 });
    await expect(readJson(req({}, "{oops"), 100)).rejects.toMatchObject({ status: 400 });
  });
});

describe("isDataImage", () => {
  it("accepts only inline base64 images", () => {
    expect(isDataImage("data:image/png;base64,iVBORw0KGgo=")).toBe(true);
    expect(isDataImage("https://169.254.169.254/latest")).toBe(false);
    expect(isDataImage("data:text/html;base64,PGI+")).toBe(false);
  });
});
