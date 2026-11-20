/** Only standalone greetings skip the website-building context. Requests containing work keep it. */
export function isGreeting(text: string): boolean {
  return /^(salam|salam aleyk[uü]m|hello|hi|hey|merhaba|привет)[\s!.?]*$/iu.test(text.trim());
}

export function greetingPrompt(): string {
  return "You are Novo, an assistant that helps users build websites. Reply to the greeting briefly in the user's language and ask what website they want to build. Do not write code or action tags.";
}
