export const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
export const DEEPSEEK_DEFAULT_MODEL = "deepseek-chat";

export function isDeepSeek(baseUrl: string): boolean {
  try { return new URL(baseUrl).hostname === "api.deepseek.com"; } catch { return false; }
}
