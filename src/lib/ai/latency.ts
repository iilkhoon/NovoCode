/** Give direct DeepSeek enough time for the first token; avoid switching Flash to reasoning. */
export function firstTokenWaitMs(model: string): number {
  if (!model.startsWith("deepseek::")) return 25_000;
  return /reasoner|v4[-_]?pro/i.test(model) ? 90_000 : 60_000;
}
export function compatibleBackup(selected: string, candidate: string): boolean {
  if (selected === candidate) return false;
  if (selected.startsWith("deepseek::") && !/reasoner|v4[-_]?pro/i.test(selected)) {
    return !/reasoner|v4[-_]?pro/i.test(candidate);
  }
  return true;
}
