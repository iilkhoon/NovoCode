"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Code2, Cpu, Download, Eye, MessageSquare, Pencil, Rocket, SquareTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PublishModal } from "./PublishModal";
import { CommandMenu, type Command } from "./CommandMenu";
import { AstryxTheme } from "@/components/AstryxTheme";
import { Kbd } from "@/components/ui/badge";
import { LogoMark } from "@/components/Logo";
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
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

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
          const done: ChatMessage = {
            ...messagesRef.current.find((m) => m.id === aid)!,
            content: raw,
            pending: false,
            snapshot: actions > 0 ? { ...filesRef.current } : undefined,
          };
          patchMessage(aid, () => done);
          if (actions > 0) setCurrentVersion(aid);
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
      setCurrentVersion([...p.messages].reverse().find((m) => m.snapshot)?.id ?? null);
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

  // ---------- version restore ----------
  async function restore(mid: string) {
    const snap = messagesRef.current.find((m) => m.id === mid)?.snapshot;
    if (!snap || busy) return;
    const current = filesRef.current;
    for (const path of Object.keys(current)) if (!(path in snap)) await runtime.deleteFile(path);
    for (const [path, content] of Object.entries(snap)) if (current[path] !== content) await runtime.writeFile(path, content);
    commitFiles({ ...snap });
    setCurrentVersion(mid);
    await persist();
    toast.success("Əvvəlki versiya bərpa edildi");
  }

  async function rename(name: string) {
    const p = projectRef.current;
    if (!p || !name.trim()) return;
    projectRef.current = { ...p, name: name.trim() };
    setProject(projectRef.current);
    await persist();
  }

  // warn before leaving while Novo is still writing files
  useEffect(() => {
    if (!busy) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [busy]);

  // ---------- keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      } else if (mod && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        setTab((["preview", "code", "terminal"] as Tab[])[+e.key - 1]);
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        persist().then(() => toast.success("Yadda saxlanıldı"));
      } else if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, persist]);

  const onPreviewError = useCallback((msg: string) => runtime.reportPreviewError(msg), [runtime]);
  const versionCount = messages.filter((m) => m.snapshot).length;

  const TABS: { t: Tab; icon: typeof Eye; label: string; key: string }[] = [
    { t: "preview", icon: Eye, label: "Önizləmə", key: "1" },
    { t: "code", icon: Code2, label: "Kod", key: "2" },
    { t: "terminal", icon: SquareTerminal, label: "Terminal", key: "3" },
  ];

  const lastSnapshot = [...messages].reverse().find((m) => m.snapshot && m.id !== currentVersion);
  const commands: Command[] = [
    { id: "tab-preview", group: "Görünüş", label: "Önizləməni aç", hint: "Ctrl 1", keywords: ["preview", "sayt"], run: () => { setTab("preview"); setMobileView("work"); } },
    { id: "tab-code", group: "Görünüş", label: "Kodu aç", hint: "Ctrl 2", keywords: ["code", "fayl"], run: () => { setTab("code"); setMobileView("work"); } },
    { id: "tab-terminal", group: "Görünüş", label: "Terminalı aç", hint: "Ctrl 3", keywords: ["terminal", "konsol"], run: () => { setTab("terminal"); setMobileView("work"); } },
    { id: "fullscreen", group: "Görünüş", label: fullscreen ? "Tam ekrandan çıx" : "Önizləməni tam ekran et", keywords: ["fullscreen"], run: () => { setTab("preview"); setFullscreen((f) => !f); } },
    { id: "save", group: "Layihə", label: "Yadda saxla", hint: "Ctrl S", keywords: ["save"], run: () => void persist().then(() => toast.success("Yadda saxlanıldı")) },
    { id: "publish", group: "Layihə", label: "Yayımla / yüklə", keywords: ["publish", "zip", "deploy", "download"], run: () => setPublishOpen(true) },
    ...(lastSnapshot ? [{ id: "restore", group: "Layihə", label: "Əvvəlki versiyanı bərpa et", keywords: ["undo", "geri"], run: () => void restore(lastSnapshot.id) }] : []),
    { id: "new", group: "Layihə", label: "Yeni layihə", keywords: ["new", "home"], run: () => location.assign("/") },
    ...Object.keys(files)
      .sort()
      .slice(0, 40)
      .map((f) => ({ id: `file:${f}`, group: "Fayllar", label: f, keywords: [f.split("/").pop() ?? f], run: () => { setActive(f); setTab("code"); setMobileView("work"); } })),
  ];

  return (
    <AstryxTheme className="contents">
    <div className="flex h-dvh flex-col bg-ink-950">
      {/* top bar */}
      <header className="relative flex h-14 shrink-0 items-center gap-2 border-b border-ink-100/10 px-3">
        <a href="/" aria-label="Ana səhifə" className="group grid size-9 place-items-center rounded-xl transition hover:bg-ink-100/5">
          <LogoMark className="size-7 transition-transform duration-500 group-hover:-rotate-12" />
        </a>
        <span className="text-ink-600">/</span>
        <ProjectName name={project?.name ?? ""} onRename={rename} />
        {versionCount > 0 && (
          <span className="hidden rounded-full bg-ink-100/5 px-2 py-0.5 text-[11px] text-ink-400 lg:inline">v{versionCount}</span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Əmrlər (Ctrl+K)"
            className="hidden h-8 items-center gap-2 rounded-full border border-ink-100/10 px-3 text-xs text-ink-400 transition-colors hover:border-ink-100/25 hover:text-ink-100 lg:flex"
          >
            Əmrlər <Kbd>Ctrl K</Kbd>
          </button>
          <ModelPicker models={models} value={model} onChange={setModel} error={modelError} />
          <Button variant="ghost" size="sm" onClick={() => setPublishOpen(true)} className="hidden sm:inline-flex" title="Kodu yüklə">
            <Download className="size-3.5" /> Kod
          </Button>
          <Button size="sm" onClick={() => setPublishOpen(true)}>
            <Rocket className="size-3.5" /> Yayımla
          </Button>
        </div>
      </header>

      {/* mobile switcher */}
      <div className="flex gap-1 border-b border-ink-100/12 p-1.5 md:hidden">
        {(["chat", "work"] as const).map((v) => (
          <button key={v} onClick={() => setMobileView(v)} className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs transition ${mobileView === v ? "text-ink-100" : "text-ink-400"}`}>
            {mobileView === v && <motion.span layoutId="mob-pill" className="absolute inset-0 rounded-lg bg-ink-100/8" />}
            <span className="relative flex items-center gap-1.5">
              {v === "chat" ? <MessageSquare className="size-3.5" /> : <Eye className="size-3.5" />}
              {v === "chat" ? "Söhbət" : "Sayt"}
            </span>
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className={`min-h-0 w-full shrink-0 border-r border-ink-100/12 bg-ink-900/40 md:block md:w-[400px] lg:w-[440px] ${mobileView === "chat" ? "block" : "hidden"} ${fullscreen ? "md:hidden" : ""}`}>
          <ChatPanel
            messages={messages}
            busy={busy}
            thinking={thinking}
            onSend={send}
            onStop={() => abortRef.current?.abort()}
            onRestore={restore}
            currentVersionId={currentVersion}
            onOpenFile={(p) => {
              setActive(p);
              setTab("code");
              setMobileView("work");
            }}
          />
        </aside>
        <section className={`min-h-0 min-w-0 flex-1 flex-col md:flex ${mobileView === "work" ? "flex" : "hidden"}`}>
          <div className="flex items-center gap-1 border-b border-ink-100/12 px-2 py-1.5">
            {TABS.map(({ t, icon: Icon, label, key }) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                title={`${label} (Ctrl+${key})`}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${tab === t ? "text-ink-100" : "text-ink-400 hover:text-ink-100"}`}
              >
                {tab === t && <motion.span layoutId="tab-pill" className="absolute inset-x-2 -bottom-[7px] h-[2px] bg-nar" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <Icon className="relative size-3.5" />
                <span className="relative">{label}</span>
              </button>
            ))}
            <AnimatePresence>
              {busy && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="ml-auto mr-2 flex items-center gap-2 text-xs">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-nar-400" />
                    <span className="relative size-2 rounded-full bg-nar-500" />
                  </span>
                  <span className="text-shimmer">Novo işləyir…</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative min-h-0 flex-1">
            <div className={`absolute inset-0 ${tab === "preview" ? "" : "invisible"}`}>
              <PreviewPanel url={url} status={status} onPreviewError={onPreviewError} fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen((f) => !f)} />
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

      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} projectName={project?.name ?? "layihe"} runtime={runtime} files={files} />
      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} commands={commands} />
    </div>
    </AstryxTheme>
  );
}

function ProjectName({ name, onRename }: { name: string; onRename: (n: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  useEffect(() => setValue(name), [name]);
  if (editing)
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onRename(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setValue(name);
            setEditing(false);
          }
        }}
        className="h-8 w-48 rounded-lg bg-ink-100/5 px-2 text-sm outline-none ring-1 ring-nar-500/40"
      />
    );
  return (
    <button onClick={() => setEditing(true)} title="Adı dəyiş" className="group flex h-8 max-w-[180px] items-center gap-1.5 rounded-lg px-2 text-sm text-ink-200 transition hover:bg-ink-100/5 sm:max-w-[260px]">
      <span className="truncate">{name}</span>
      <Pencil className="size-3 shrink-0 text-ink-500 opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}

function ModelPicker({ models, value, onChange, error }: { models: ModelInfo[]; value: string; onChange: (v: string) => void; error: string | null }) {
  const [open, setOpen] = useState(false);
  const current = models.find((m) => m.id === value);
  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((o) => !o)}
        title={error ?? "AI modeli"}
        className={`flex h-8 items-center gap-2 rounded-[3px] px-3 text-xs ring-1 ring-inset transition ${error ? "text-danger ring-danger/30" : "text-ink-300 ring-ink-100/10 hover:ring-ink-100/20"}`}
      >
        <Cpu className="size-3.5" />
        <span className="max-w-[140px] truncate">{error ? "API əlçatan deyil" : current?.label ?? "Modellər…"}</span>
        <ChevronDown className="size-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div aria-hidden="true" className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-10 bg-ink-1000 z-50 max-h-80 w-72 overflow-y-auto rounded-2xl border border-ink-100/10 p-1.5 shadow-[var(--shadow-panel)] scroll-thin"
            >
              <div className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium text-ink-400">AI modeli · <span lang="en">build.nvidia.com</span></div>
              {error && <div className="px-2.5 py-2 text-xs text-danger">{error}</div>}
              {models.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] transition hover:bg-ink-100/5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-ink-100">{m.label}</span>
                    <span className="block truncate text-[11px] text-ink-500">{m.id.split("/")[0]}</span>
                  </span>
                  {i === 0 && <Badge tone="nar">Tövsiyə</Badge>}
                  {m.vision && <Badge>Şəkil</Badge>}
                  {m.id === value && <Check className="size-4 text-nar-400" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
