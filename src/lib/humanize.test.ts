import { describe, expect, it } from "vitest";
import { friendlyFile, humanizeError } from "./humanize";

describe("friendlyFile", () => {
  it("names well-known files", () => {
    expect(friendlyFile("src/App.jsx")).toBe("Səhifə quruluşu");
    expect(friendlyFile("src/index.css")).toBe("Rənglər və şriftlər");
  });
  it("turns component paths into sections", () => {
    expect(friendlyFile("src/components/MenuSection.jsx")).toBe("Menu section bölməsi");
    expect(friendlyFile("src/pages/about-us.jsx")).toBe("About us səhifəsi");
  });
});

describe("humanizeError", () => {
  it("hides the missing key behind a plain message", () => {
    const e = humanizeError("OPENROUTER_API_KEY təyin edilməyib");
    expect(e.title).toMatch(/qoşulmayıb/);
    expect(e.retryable).toBe(false);
  });
  it("recognises network and rate limits", () => {
    expect(humanizeError("TypeError: Failed to fetch").title).toMatch(/İnternet/);
    expect(humanizeError("HTTP 429 Too Many Requests").retryable).toBe(true);
  });
  it("never leaks the raw message", () => {
    expect(humanizeError("Unexpected token < in JSON at position 0").title).toBe("Nəsə alınmadı");
  });
});

it("distinguishes billing, authentication, timeout and rate limits", () => {
  expect(humanizeError("DeepSeek API xətası 402: Insufficient Balance").retryable).toBe(false);
  expect(humanizeError("DeepSeek API xətası 401: Invalid API key").title).toContain("qəbul edilmədi");
  expect(humanizeError("deepseek 60 saniyədə cavab vermədi").title).toContain("vaxtında");
  expect(humanizeError("OpenRouter xətası 429: rate-limited upstream").title).toContain("məşğuldur");
  expect(humanizeError("token limitinə çataraq yarımçıq kəsildi").title).toContain("tam bitmədi");
});
