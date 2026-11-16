import { describe, expect, it } from "vitest";
import { contextOf, contextUsage, extractNext, matchCommands, parseCommand, stripMeta } from "./chat";
import type { ChatMessage } from "./types";

const msg = (p: Partial<ChatMessage>): ChatMessage => ({ id: Math.random().toString(), role: "user", content: "", createdAt: 0, ...p });

describe("chat helpers", () => {
  it("parses known slash commands only", () => {
    expect(parseCommand("/plan restoran saytı")).toEqual({ name: "/plan", arg: "restoran saytı" });
    expect(parseCommand("/compact")).toEqual({ name: "/compact", arg: "" });
    expect(parseCommand("/xyz")).toBeNull();
    expect(parseCommand("salam /plan")).toBeNull();
    expect(matchCommands("/p").map((c) => c.name)).toEqual(["/plan", "/publish"]);
    expect(matchCommands("/plan x")).toEqual([]);
  });

  it("extracts and strips next-step ideas", () => {
    const raw = "Hazırdır.\n<novo-next>Rəylər əlavə et | Rəngləri istiləşdir | Yayımla</novo-next>";
    expect(extractNext(raw)).toEqual(["Rəylər əlavə et", "Rəngləri istiləşdir", "Yayımla"]);
    expect(stripMeta(raw).trim()).toBe("Hazırdır.");
    expect(stripMeta("yarım <novo-next>A | B").trim()).toBe("yarım");
    expect(extractNext("no tags")).toEqual([]);
  });

  it("uses only messages after the last compact marker", () => {
    const list = [msg({ content: "old" }), msg({ role: "assistant", compact: true, content: "SUMMARY" }), msg({ content: "new" })];
    const c = contextOf(list);
    expect(c.summary).toBe("SUMMARY");
    expect(c.messages.map((m) => m.content)).toEqual(["new"]);
    expect(contextOf([msg({ compact: true, role: "assistant", content: "" })]).summary).toBeUndefined();
  });

  it("prefers measured usage over estimates", () => {
    expect(contextUsage([msg({ role: "assistant", content: "x", tokens: 64_000 })], 0)).toMatchObject({ measured: true, ratio: 0.5 });
    expect(contextUsage([msg({ content: "a".repeat(3500) })], 0).measured).toBe(false);
  });
});
