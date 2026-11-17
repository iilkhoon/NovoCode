import { expect, it } from "vitest";
import { isGreeting, greetingPrompt } from "./request-profile";
it("uses small prompts only for standalone greetings", () => {
  expect(isGreeting(" Salam! ")).toBe(true);
  expect(isGreeting("salam mənə mağaza qur")).toBe(false);
  expect(isGreeting("hello world saytı yarat")).toBe(false);
  expect(greetingPrompt()).not.toContain("<novo-file");
});
