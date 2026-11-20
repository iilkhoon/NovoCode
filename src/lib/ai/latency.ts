/** Give direct DeepSeek enough time for the first token; avoid switching Flash to reasoning. */
export function firstTokenWaitMs(model: string): number {
  // NVIDIA models run with hidden thinking off and normally write within ~1–2s
  if (!model.startsWith("deepseek::")) return 15_000;
  return /reasoner|v4[-_]?pro/i.test(model) ? 90_000 : 60_000;
}
export function compatibleBackup(selected: string, candidate: string): boolean {
  if (selected === candidate) return false;
  if (selected.startsWith("deepseek::") && !/reasoner|v4[-_]?pro/i.test(selected)) {
    return !/reasoner|v4[-_]?pro/i.test(candidate);
  }
  return true;
}
