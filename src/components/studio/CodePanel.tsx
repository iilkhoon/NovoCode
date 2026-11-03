"use client";
import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { ChevronRight, FileCode2, Folder, FolderOpen } from "lucide-react";

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
      <div className="hidden w-56 shrink-0 overflow-y-auto border-r border-ink-800 py-2 text-[13px] scroll-thin md:block">
        {tree.map((n) => (
          <TreeNode key={n.path} node={n} depth={0} active={active} onSelect={onSelect} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-ink-800 px-3 py-2 font-mono text-xs text-ink-300">
          <select className="max-w-full bg-transparent outline-none md:hidden" value={active ?? ""} onChange={(e) => onSelect(e.target.value)}>
            {Object.keys(files).sort().map((p) => (
              <option key={p} value={p} className="bg-ink-900">{p}</option>
            ))}
          </select>
          <span className="hidden md:inline">{active}</span>
          {isStreaming && <span className="ml-auto text-shimmer">AI yazır…</span>}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {active ? (
            <CodeMirror
              value={value}
              theme={oneDark}
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
          {open ? <FolderOpen className="size-3.5 text-saffron/80" /> : <Folder className="size-3.5 text-saffron/80" />}
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
      className={`flex w-full items-center gap-1.5 py-1 pr-2 text-left ${active === node.path ? "bg-ink-800 text-ink-100" : "text-ink-300 hover:text-ink-100"}`}
    >
      <FileCode2 className="size-3.5 shrink-0 text-ink-400" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
