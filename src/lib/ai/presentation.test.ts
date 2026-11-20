import { expect, it } from "vitest";
import { modelPresentation } from "./presentation";
import { compatibleBackup, firstTokenWaitMs } from "./latency";
it("brands DeepSeek models without changing their API IDs", () => {
  expect(modelPresentation({ id: "deepseek::deepseek-chat", label: "deepseek-chat" }).label).toBe("Novo Flash");
  expect(modelPresentation({ id: "deepseek::deepseek-v4-pro", label: "deepseek-v4-pro" }).label).toBe("Novo V4 Pro");
  expect(modelPresentation({ id: "deepseek::deepseek-reasoner", label: "deepseek-reasoner" }).label).toBe("Novo V4 Pro");
});
it("does not escalate a slow Flash request to a reasoning model", () => {
  expect(compatibleBackup("deepseek::deepseek-chat", "deepseek::deepseek-reasoner")).toBe(false);
  expect(firstTokenWaitMs("deepseek::deepseek-chat")).toBe(60_000);
  expect(firstTokenWaitMs("deepseek::deepseek-reasoner")).toBe(90_000);
  expect(firstTokenWaitMs("nvidia/model")).toBe(15_000);
});
