import type { ParserEvent } from "../protocol/parser";
import type { Part } from "../types";

/** Folds a parser event into the ordered list of message parts shown in chat. */
export function applyEvent(parts: Part[], e: ParserEvent): Part[] {
  const last = parts[parts.length - 1];
  switch (e.type) {
    case "text":
      if (last?.kind === "text") return [...parts.slice(0, -1), { kind: "text", text: last.text + e.text }];
      return [...parts, { kind: "text", text: e.text }];
    case "plan":
      return [...parts, { kind: "plan", text: e.text }];
    case "file-open":
      return [...parts, { kind: "file", path: e.path, status: "writing" }];
    case "file-close": {
      let idx = -1;
      parts.forEach((p, i) => { if (p.kind === "file" && p.path === e.path && p.status === "writing") idx = i; });
      if (idx === -1) return [...parts, { kind: "file", path: e.path, status: "done" }];
      return parts.map((p, i) => (i === idx ? { kind: "file", path: e.path, status: "done" } : p));
    }
    case "delete":
      return [...parts, { kind: "file", path: e.path, status: "deleted" }];
    case "shell":
      return [...parts, { kind: "shell", command: e.command }];
    default:
      return parts;
  }
}
