"use client";
import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { ChevronRight, FileCode2, Folder, FolderOpen } from "lucide-react";
import { toast } from "@/components/ui/toast";

type Node = { name: string; path: string; children?: Node[] };

function buildTree(paths: string[]): Node[] {
  const root: Node = { name: "", path: "", children: [] };
  for (const p of paths.sort()) {
    let cur = root;
    p.split("/").forEach((part, i, arr) => {
      const path = arr.slice(0, i + 1).join("/");
      let next = cur.children!.find((c) => c.name === part);
      if (!next) {
        next = { name: part, path, children: i < arr.length - 1 ? [] : undefined };
        cur.children!.push(next);
      }
      cur = next;
    });
  }
  const sort = (n: Node[]): Node[] =>
    n.sort((a, b) => Number(!!b.children) - Number(!!a.children) || a.name.localeCompare(b.name)).map((x) => ({ ...x, children: x.children && sort(x.children) }));
  return sort(root.children!);
}

function langFor(path: string) {
  if (/\.(jsx?|tsx?|mjs)$/.test(path)) return [javascript({ jsx: true, typescript: /\.tsx?$/.test(path) })];
  if (path.endsWith(".html")) return [html()];
  if (path.endsWith(".css")) return [css()];
  return [];
}

export function CodePanel({
  files,
  active,
  streaming,
  onSelect,
  onChange,
}: {
  files: Record<string, string>;
  active: string | null;
  streaming: { path: string; content: string } | null;
  onSelect: (p: string) => void;
  onChange: (path: string, content: string) => void;
}) {
  const tree = useMemo(() => buildTree(Object.keys(files).filter((p) => !p.includes("node_modules"))), [files]);
  const isStreaming = streaming && streaming.path === active;
  const value = isStreaming ? streaming.content : active ? files[active] ?? "" : "";

  return (
    <div className="flex h-full min-h-0">
      <div className="hidden w-60 shrink-0 overflow-y-auto border-r border-ink-100/12 bg-ink-950/40 py-2 text-[13px] scroll-thin md:block">
        <div className="px-4 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-ink-500">Fayllar</div>
        {tree.map((n) => (
          <TreeNode key={n.path} node={n} depth={0} active={active} onSelect={onSelect} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-ink-100/12 px-3 py-2 font-mono text-xs text-ink-300">
          <select className="max-w-full bg-transparent outline-none md:hidden" value={active ?? ""} onChange={(e) => onSelect(e.target.value)}>
            {Object.keys(files).sort().map((p) => (
              <option key={p} value={p} className="bg-ink-900">{p}</option>
            ))}
          </select>
          <span className="hidden md:inline">{active}</span>
          {isStreaming && <span className="ml-auto text-shimmer">AI yazır…</span>}
          {!isStreaming && active && (
            <button
              className="ml-auto rounded-md px-2 py-0.5 text-[11px] text-ink-400 transition hover:bg-ink-100/5 hover:text-ink-100"
              onClick={() => navigator.clipboard.writeText(value).then(() => toast.success("Kopyalandı"))}
            >
              Kopyala
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {active ? (
            <CodeMirror
              value={value}
              theme="dark"
              extensions={langFor(active)}
              editable={!isStreaming}
              onChange={(v) => onChange(active, v)}
              basicSetup={{ foldGutter: true, highlightActiveLine: true }}
              height="100%"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-ink-400">Fayl seçin</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TreeNode({ node, depth, active, onSelect }: { node: Node; depth: number; active: string | null; onSelect: (p: string) => void }) {
  const [open, setOpen] = useState(depth < 1 || !!active?.startsWith(node.path + "/"));
  const pad = { paddingLeft: 10 + depth * 12 };
  if (node.children) {
    return (
      <div>
        <button style={pad} onClick={() => setOpen(!open)} className="flex w-full items-center gap-1.5 py-1 pr-2 text-ink-300 hover:text-ink-100">
          <ChevronRight className={`size-3 transition ${open ? "rotate-90" : ""}`} />
          {open ? <FolderOpen className="size-3.5 text-gold-400/80" /> : <Folder className="size-3.5 text-gold-400/80" />}
          {node.name}
        </button>
        {open && node.children.map((c) => <TreeNode key={c.path} node={c} depth={depth + 1} active={active} onSelect={onSelect} />)}
      </div>
    );
  }
  return (
    <button
      style={{ paddingLeft: 10 + depth * 12 + 16 }}
      onClick={() => onSelect(node.path)}
      className={`flex w-full items-center gap-1.5 py-1 pr-2 text-left ${active === node.path ? "bg-nar-500/10 text-ink-100 shadow-[inset_2px_0_0_var(--color-nar-500)]" : "text-ink-300 hover:text-ink-100"}`}
    >
      <FileCode2 className="size-3.5 shrink-0 text-ink-400" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
