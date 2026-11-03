"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { Code2, Download, Eye, MessageSquare, Rocket, SquareTerminal } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ChatPanel } from "./ChatPanel";
import { PreviewPanel } from "./PreviewPanel";
import { CodePanel } from "./CodePanel";
import { TerminalPanel } from "./TerminalPanel";
import { ProjectRuntime, type RuntimeStatus } from "@/lib/runtime/webcontainer";
import { streamTurn, compactAssistant } from "@/lib/agent/turn";
import { applyEvent } from "@/lib/agent/parts";
import { buildFixPrompt } from "@/lib/ai/prompt";
import { getProject, saveProject, uid } from "@/lib/store/projects";
import type { ChatMessage, Project } from "@/lib/types";
import type { ModelInfo } from "@/lib/ai/models";

const MAX_FIX = 3;
type Tab = "preview" | "code" | "terminal";

export default function Studio({ id }: { id: string }) {
  const router = useRouter();
  const runtime = useMemo(() => new ProjectRuntime(), []);
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<RuntimeStatus>("idle");
  const [url, setUrl] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("preview");
  const [mobileView, setMobileView] = useState<"chat" | "work">("chat");
  const [active, setActive] = useState<string | null>("src/App.jsx");
  const [streaming, setStreaming] = useState<{ path: string; content: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [model, setModel] = useState<string>("");
  const [modelError, setModelError] = useState<string | null>(null);

  const filesRef = useRef<Record<string, string>>({});
  const messagesRef = useRef<ChatMessage[]>([]);
  const projectRef = useRef<Project | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const started = useRef(false);

  const commitFiles = (next: Record<string, string>) => {
    filesRef.current = next;
    setFiles(next);
  };
  const commitMessages = (next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  };
  const patchMessage = (mid: string, fn: (m: ChatMessage) => ChatMessage) =>
    commitMessages(messagesRef.current.map((m) => (m.id === mid ? fn(m) : m)));

  const persist = useCallback(async () => {
    const p = projectRef.current;
    if (!p) return;
    const next = { ...p, files: filesRef.current, messages: messagesRef.current.map((m) => ({ ...m, pending: false })), pendingPrompt: undefined };
    projectRef.current = next;
    await saveProject(next);
  }, []);

  // ---------- agent loop ----------
  const runAgent = useCallback(
    async (history: ChatMessage[]) => {
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let convo = history;
      try {
        for (let attempt = 0; attempt <= MAX_FIX; attempt++) {
          const aid = uid();
          const assistant: ChatMessage = { id: aid, role: "assistant", content: "", parts: [], pending: true, createdAt: Date.now() };
          commitMessages([...messagesRef.current, assistant]);
          runtime.markChange();
          setThinking(false);

          let chain: Promise<unknown> = Promise.resolve();
          let actions = 0;
          const queue = (fn: () => Promise<unknown>) => (chain = chain.then(fn).catch((e) => console.error(e)));
          const lastUser = [...convo].reverse().find((m) => m.role === "user");

          let raw = "";
          try {
            raw = await streamTurn({
              messages: convo.map((m) => ({
                role: m.role,
                content: m.role === "assistant" ? compactAssistant(m.content) : m.content,
                images: m === lastUser ? m.images : undefined,
              })),
              files: filesRef.current,
              model: model || undefined,
              signal: ctrl.signal,
              onMeta: (meta) => patchMessage(aid, (m) => ({ ...m, model: meta.model, skills: meta.skills })),
              onThinking: () => setThinking(true),
              onEvent: (e) => {
                setThinking(false);
                if (e.type !== "file-delta") patchMessage(aid, (m) => ({ ...m, parts: applyEvent(m.parts ?? [], e) }));
                switch (e.type) {
                  case "file-open":
                    actions++;
                    setStreaming({ path: e.path, content: "" });
                    setActive(e.path);
                    break;
                  case "file-delta":
                    setStreaming((s) => (s && s.path === e.path ? { ...s, content: s.content + e.text } : s));
                    break;
                  case "file-close":
                    commitFiles({ ...filesRef.current, [e.path]: e.content });
                    setStreaming(null);
                    queue(() => runtime.writeFile(e.path, e.content));
                    break;
                  case "delete": {
                    actions++;
                    const next = { ...filesRef.current };
                    delete next[e.path];
                    commitFiles(next);
                    queue(() => runtime.deleteFile(e.path));
                    break;
                  }
                  case "shell":
                    actions++;
                    queue(async () => {
                      await runtime.run(e.command);
                      const pkg = await runtime.readFile("package.json");
                      if (pkg) commitFiles({ ...filesRef.current, "package.json": pkg });
                    });
                    break;
                }
              },
            });
          } catch (err) {
            const aborted = ctrl.signal.aborted;
            patchMessage(aid, (m) => ({ ...m, pending: false, error: aborted ? "Dayandırıldı." : (err as Error).message }));
            await chain;
            await persist();
            return;
          } finally {
            setStreaming(null);
          }

          await chain;
          const done = { ...messagesRef.current.find((m) => m.id === aid)!, content: raw, pending: false };
          patchMessage(aid, () => done);
          await persist();
          convo = [...convo, done];

          if (actions === 0) break;
          const errors = await runtime.collectErrors();
          if (!errors || ctrl.signal.aborted) break;
          if (attempt === MAX_FIX) {
            patchMessage(aid, (m) => ({ ...m, error: "Bir neçə cəhddən sonra xəta qaldı. Problemi sözlə təsvir edin və ya Terminal bölməsinə baxın." }));
            break;
          }
          const fix: ChatMessage = { id: uid(), role: "user", auto: true, content: buildFixPrompt(errors, attempt + 1, MAX_FIX), createdAt: Date.now() };
          commitMessages([...messagesRef.current, fix]);
          convo = [...convo, fix];
        }
      } finally {
        setBusy(false);
        setThinking(false);
        abortRef.current = null;
        await persist();
      }
    },
    [model, runtime, persist]
  );

  const send = useCallback(
    (text: string, images: string[]) => {
      if (busy) return;
      const msg: ChatMessage = { id: uid(), role: "user", content: text, images: images.length ? images : undefined, createdAt: Date.now() };
      const history = [...messagesRef.current.filter((m) => !m.pending), msg];
      commitMessages(history);
      setMobileView("chat");
      runAgent(history);
    },
    [busy, runAgent]
  );

  // ---------- boot ----------
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const offS = runtime.onStatus(setStatus);
    const offU = runtime.onUrl(setUrl);
    (async () => {
      const p = await getProject(id);
      if (!p) {
        router.replace("/");
        return;
      }
      projectRef.current = p;
      setProject(p);
      commitFiles(p.files);
      commitMessages(p.messages);
      fetch("/api/models")
        .then((r) => r.json())
        .then((d) => {
          if (d.error) setModelError(d.error);
          setModels(d.models ?? []);
          setModel((cur) => cur || d.defaultModel || "");
        })
        .catch((e) => setModelError(String(e)));
      runtime.start(p.files).catch((e) => console.error(e));
      if (p.pendingPrompt) {
        const msg: ChatMessage = { id: uid(), role: "user", content: p.pendingPrompt.text, images: p.pendingPrompt.images, createdAt: Date.now() };
        commitMessages([msg]);
        projectRef.current = { ...p, pendingPrompt: undefined };
        runAgent([msg]);
      }
    })();
    return () => {
      offS();
      offU();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // debounce user code edits into the container
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEdit = (path: string, content: string) => {
    commitFiles({ ...filesRef.current, [path]: content });
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(() => {
      runtime.writeFile(path, content);
      persist();
    }, 500);
  };

  async function downloadZip() {
    const zip = new JSZip();
    for (const [p, c] of Object.entries(filesRef.current)) zip.file(p, c);
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(project?.name ?? "novo-sayt").replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const onPreviewError = useCallback((msg: string) => runtime.reportPreviewError(msg), [runtime]);

  const TabBtn = ({ t, icon: Icon, label }: { t: Tab; icon: typeof Eye; label: string }) => (
    <button
      onClick={() => setTab(t)}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === t ? "bg-ink-700 text-ink-100" : "text-ink-400 hover:text-ink-100"}`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      {/* top bar */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-ink-800 px-3">
        <Logo />
        <span className="hidden text-ink-600 sm:inline">/</span>
        <span className="hidden max-w-[220px] truncate text-sm text-ink-300 sm:inline">{project?.name}</span>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            title={modelError ?? "AI modeli"}
            className={`hidden max-w-[210px] truncate rounded-lg border bg-ink-850 px-2 py-1.5 text-xs outline-none md:block ${modelError ? "border-nar-500/50 text-nar-400" : "border-ink-700 text-ink-300"}`}
          >
            {models.length === 0 && <option value="">{modelError ? "API əlçatan deyil" : "Modellər yüklənir…"}</option>}
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-ink-900">
                {m.label}
                {m.vision ? " 👁" : ""}
              </option>
            ))}
          </select>
          <button onClick={downloadZip} className="flex items-center gap-1.5 rounded-lg border border-ink-700 px-2.5 py-1.5 text-xs text-ink-300 hover:text-ink-100">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">ZIP</span>
          </button>
          <button
            disabled
            title="Bir kliklə yayım növbəti mərhələdə: layihe.novocode.az"
            className="flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-nar-500/90 px-3 py-1.5 text-xs font-medium text-white opacity-60"
          >
            <Rocket className="size-3.5" />
            Yayımla
          </button>
        </div>
      </header>

      {/* mobile switcher */}
      <div className="flex gap-1 border-b border-ink-800 p-1.5 md:hidden">
        <button onClick={() => setMobileView("chat")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs ${mobileView === "chat" ? "bg-ink-700" : "text-ink-400"}`}>
          <MessageSquare className="size-3.5" /> Söhbət
        </button>
        <button onClick={() => setMobileView("work")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs ${mobileView === "work" ? "bg-ink-700" : "text-ink-400"}`}>
          <Eye className="size-3.5" /> Sayt
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className={`min-h-0 w-full shrink-0 border-r border-ink-800 bg-ink-900/40 md:block md:w-[400px] lg:w-[440px] ${mobileView === "chat" ? "block" : "hidden"}`}>
          <ChatPanel
            messages={messages}
            busy={busy}
            thinking={thinking}
            onSend={send}
            onStop={() => abortRef.current?.abort()}
            onOpenFile={(p) => {
              setActive(p);
              setTab("code");
              setMobileView("work");
            }}
          />
        </aside>
        <section className={`min-h-0 min-w-0 flex-1 flex-col md:flex ${mobileView === "work" ? "flex" : "hidden"}`}>
          <div className="flex items-center gap-1 border-b border-ink-800 px-2 py-1.5">
            <TabBtn t="preview" icon={Eye} label="Önizləmə" />
            <TabBtn t="code" icon={Code2} label="Kod" />
            <TabBtn t="terminal" icon={SquareTerminal} label="Terminal" />
            {busy && <span className="ml-auto mr-2 text-xs text-shimmer">Novo işləyir…</span>}
          </div>
          <div className="relative min-h-0 flex-1">
            <div className={`absolute inset-0 ${tab === "preview" ? "" : "invisible"}`}>
              <PreviewPanel url={url} status={status} onPreviewError={onPreviewError} />
            </div>
            <div className={`absolute inset-0 ${tab === "code" ? "" : "invisible"}`}>
              <CodePanel files={files} active={active} streaming={streaming} onSelect={setActive} onChange={onEdit} />
            </div>
            <div className={`absolute inset-0 ${tab === "terminal" ? "" : "invisible"}`}>
              <TerminalPanel runtime={runtime} ready={status === "ready"} visible={tab === "terminal"} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
