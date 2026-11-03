/**
 * Novo Code action protocol — streaming parser.
 *
 * The model answers with free text plus XML-like action tags:
 *   <novo-plan>short plan</novo-plan>
 *   <novo-file path="src/App.tsx">...full file content...</novo-file>
 *   <novo-delete path="src/old.tsx"/>
 *   <novo-shell>npm install recharts</novo-shell>
 *
 * Tags can arrive split across arbitrary chunk boundaries; the parser buffers
 * just enough to decide, so text and file contents stream out progressively.
 */

export type ParserEvent =
  | { type: "text"; text: string }
  | { type: "plan"; text: string }
  | { type: "file-open"; path: string }
  | { type: "file-delta"; path: string; text: string }
  | { type: "file-close"; path: string; content: string }
  | { type: "delete"; path: string }
  | { type: "shell"; command: string };

type Mode =
  | { kind: "text" }
  | { kind: "file"; path: string; content: string; started: boolean }
  | { kind: "block"; tag: "shell" | "plan"; content: string };

const OPENERS = ["<novo-file", "<novo-shell", "<novo-delete", "<novo-plan"];
const CLOSERS = { file: "</novo-file>", shell: "</novo-shell>", plan: "</novo-plan>" } as const;

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`));
  return m ? m[1] : null;
}

/** Length of the longest suffix of `s` that is a prefix of `needle`. */
function partialSuffix(s: string, needle: string): number {
  const max = Math.min(s.length, needle.length - 1);
  for (let n = max; n > 0; n--) {
    if (needle.startsWith(s.slice(s.length - n))) return n;
  }
  return 0;
}

export function cleanFileContent(raw: string): string {
  let c = raw.replace(/^\r?\n/, "");
  const fenced = c.match(/^\s*```[\w.+-]*\r?\n([\s\S]*?)\r?\n?```\s*$/);
  if (fenced) c = fenced[1] + "\n";
  return c;
}

export class ActionParser {
  private buf = "";
  private mode: Mode = { kind: "text" };

  feed(chunk: string): ParserEvent[] {
    this.buf += chunk;
    const out: ParserEvent[] = [];
    let progressed = true;
    while (progressed) progressed = this.step(out);
    return out;
  }

  end(): ParserEvent[] {
    const out: ParserEvent[] = [];
    const m = this.mode;
    if (m.kind === "text") {
      if (this.buf) out.push({ type: "text", text: this.buf });
    } else if (m.kind === "file") {
      const rest = this.buf;
      if (rest) out.push(...this.fileDelta(m, rest));
      out.push({ type: "file-close", path: m.path, content: cleanFileContent(m.content) });
    } else {
      const text = (m.content + this.buf).trim();
      out.push(m.tag === "shell" ? { type: "shell", command: text } : { type: "plan", text });
    }
    this.buf = "";
    this.mode = { kind: "text" };
    return out;
  }

  private fileDelta(m: Extract<Mode, { kind: "file" }>, text: string): ParserEvent[] {
    let t = text;
    if (!m.started) {
      t = t.replace(/^\r?\n/, "");
      if (t.length === 0) return [];
      m.started = true;
    }
    m.content += t;
    return [{ type: "file-delta", path: m.path, text: t }];
  }

  /** Returns true if it consumed something and should be called again. */
  private step(out: ParserEvent[]): boolean {
    const m = this.mode;
    if (this.buf.length === 0) return false;

    if (m.kind === "text") {
      const lt = this.buf.indexOf("<");
      if (lt === -1) {
        out.push({ type: "text", text: this.buf });
        this.buf = "";
        return false;
      }
      if (lt > 0) {
        out.push({ type: "text", text: this.buf.slice(0, lt) });
        this.buf = this.buf.slice(lt);
      }
      const rest = this.buf;
      const opener = OPENERS.find((o) => rest.startsWith(o));
      if (!opener) {
        // Could it still become an opener once more data arrives?
        if (OPENERS.some((o) => o.startsWith(rest))) return false;
        out.push({ type: "text", text: "<" });
        this.buf = rest.slice(1);
        return true;
      }
      const gt = rest.indexOf(">");
      if (gt === -1) return false; // wait for the rest of the tag
      const tag = rest.slice(0, gt + 1);
      this.buf = rest.slice(gt + 1);
      if (opener === "<novo-file") {
        const path = attr(tag, "path") ?? "untitled.txt";
        this.mode = { kind: "file", path, content: "", started: false };
        out.push({ type: "file-open", path });
      } else if (opener === "<novo-delete") {
        const path = attr(tag, "path");
        if (path) out.push({ type: "delete", path });
        if (!tag.endsWith("/>")) {
          // tolerate <novo-delete path="x"></novo-delete>
          if (this.buf.startsWith("</novo-delete>")) this.buf = this.buf.slice("</novo-delete>".length);
        }
      } else {
        this.mode = { kind: "block", tag: opener === "<novo-shell" ? "shell" : "plan", content: "" };
      }
      return true;
    }

    const closer = m.kind === "file" ? CLOSERS.file : CLOSERS[m.tag];
    const idx = this.buf.indexOf(closer);
    if (idx === -1) {
      const keep = partialSuffix(this.buf, closer);
      const emit = this.buf.slice(0, this.buf.length - keep);
      this.buf = this.buf.slice(this.buf.length - keep);
      if (emit) {
        if (m.kind === "file") out.push(...this.fileDelta(m, emit));
        else m.content += emit;
      }
      return false;
    }
    const body = this.buf.slice(0, idx);
    this.buf = this.buf.slice(idx + closer.length);
    if (m.kind === "file") {
      if (body) out.push(...this.fileDelta(m, body));
      out.push({ type: "file-close", path: m.path, content: cleanFileContent(m.content) });
    } else {
      const text = (m.content + body).trim();
      out.push(m.tag === "shell" ? { type: "shell", command: text } : { type: "plan", text });
    }
    this.mode = { kind: "text" };
    return true;
  }
}
