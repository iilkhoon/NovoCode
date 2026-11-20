import { expect, it } from "vitest";
import { modelPresentation } from "./presentation";
import { configuredModels, DEFAULT_MODELS, pickDefault } from "./models";

it("shows the brand label, never the provider id", () => {
  expect(modelPresentation({ id: "baidu/ernie-5.5-flash-preview:free", label: "Novo Flash" }).label).toBe("Novo Flash");
});
it("reads the model list from NOVO_MODELS, falling back to the free defaults", () => {
  expect(configuredModels("")).toEqual(DEFAULT_MODELS);
  expect(configuredModels(" a/b , c/d,a/b ")).toEqual(["a/b", "c/d"]);
});
it("picks a vision model only when one exists", () => {
  const m = [{ id: "a", label: "A", vision: false, rank: 0 }, { id: "b", label: "B", vision: true, rank: 1 }];
  expect(pickDefault(m)).toBe("a");
  expect(pickDefault(m, "b")).toBe("b");
  expect(pickDefault(m, undefined, true)).toBe("b");
  expect(pickDefault([m[0]], undefined, true)).toBeUndefined();
});
