"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, ChevronDown, FileCode2, History, Loader2, Package, RotateCcw, Terminal, Trash, Wrench } from "lucide-react";
import type { ChatMessage, Part } from "@/lib/types";
import { PromptBox } from "@/components/PromptBox";
import { LogoMark } from "@/components/Logo";
import { applyStyle } from "@/lib/styles";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/cn";
import { friendlyFile, humanizeError } from "@/lib/humanize";

interface Props {
  messages: ChatMessage[];
  busy: boolean;
  thinking: boolean;
  /** developer mode: show paths, commands, raw errors, models */
  dev: boolean;
  onRetry: () => void;
  onSend: (text: string, images: string[]) => void;
  onStop: () => void;
  onOpenFile: (path: string) => void;
  onRestore: (messageId: string) => void;
  currentVersionId: string | null;
}

const SUGGESTIONS = ["Dizaynı daha premium et", "Qeydiyyat və giriş əlavə et", "Rəylər bölməsi əlavə et", "Mobil görünüşü təkmilləşdir", "Tünd rejim əlavə et"];

export function ChatPanel({ messages, busy, thinking, dev, onSend, onStop, onRetry, onOpenFile, onRestore, currentVersionId }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  let version = 0;
  const versions = new Map<string, number>();
  for (const m of messages) if (m.role === "assistant" && m.snapshot) versions.set(m.id, ++version);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-6 scroll-thin">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div>
              <LogoMark className="mx-auto size-12" blink />
              <p className="mt-4 font-display text-2xl tracking-[-0.02em]">Nə quraq?</p>
              <p className="mt-1 text-sm text-ink-400">Saytınızı təsvir edin və ya şəkil atın.</p>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, mi) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              {m.role === "user" ? (
                m.auto ? <AutoFixNote m={m} dev={dev} /> : <UserBubble m={m} />
              ) : (
                <AssistantMessage
                  m={m}
                  thinking={thinking && !!m.pending}
                  onOpenFile={onOpenFile}
                  version={versions.get(m.id)}
                  isCurrent={currentVersionId === m.id}
                  onRestore={() => onRestore(m.id)}
                  canRestore={!busy}
                  dev={dev}
                  onRetry={!busy && mi === messages.length - 1 ? onRetry : undefined}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {!busy && messages.some((m) => m.role === "assistant" && !m.pending) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onSend(s, [])}
                className="rounded-full border border-ink-100/10 bg-ink-950 px-3 py-1.5 text-xs text-ink-300 transition hover:-translate-y-0.5 hover:border-nar/40 hover:text-ink-100 active:scale-[0.97]"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      <div className="border-t border-ink-100/[0.08] p-3">
        <PromptBox busy={busy} onSubmit={({ text, images, styleId }) => onSend(applyStyle(text, styleId), images)} onStop={onStop} placeholder="Dəyişiklik istəyin… (Enter — göndər, Shift+Enter — yeni sətir)" />
      </div>
    </div>
  );
}

function UserBubble({ m }: { m: ChatMessage }) {
  const [text, style] = m.content.split(/\n\n\[(?=[^\]]+ üslub\])/);
  return (
    <div className="flex flex-col items-end gap-2">
      {m.images?.length ? (
        <div className="flex gap-2">
          {m.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-24 rounded-2xl object-cover ring-1 ring-ink-100/10" />
          ))}
        </div>
      ) : null}
      <div className="max-w-[88%] whitespace-pre-wrap rounded-[20px] rounded-br-md bg-ink-900 px-4 py-2.5 text-[14px] leading-relaxed">{text}</div>
      {style && <span className="rounded-full bg-ink-900 px-2.5 py-0.5 text-[11px] text-ink-400">Üslub: {style.split("]")[0]}</span>}
    </div>
  );
}

function AutoFixNote({ m, dev }: { m: ChatMessage; dev: boolean }) {
  const [open, setOpen] = useState(false);
  const err = m.content.match(/```\n([\s\S]*?)\n```/)?.[1] ?? m.content;
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/[0.07] px-3.5 py-2.5 text-xs text-warning">
      <button onClick={() => dev && setOpen(!open)} className={cn("flex w-full items-center gap-2", !dev && "cursor-default")}>
        <Wrench className="size-3.5" />
        <span className="flex-1 text-left font-medium">{dev ? "Xəta tapıldı — avtomatik düzəldirəm" : "Kiçik problem tapdım, düzəldirəm…"}</span>
        {dev && <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.pre initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-ink-300 scroll-thin">
            {err}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}

function AssistantMessage({
  m,
  thinking,
  onOpenFile,
  version,
  isCurrent,
  onRestore,
  canRestore,
  dev,
  onRetry,
}: {
  m: ChatMessage;
  thinking: boolean;
  onOpenFile: (p: string) => void;
  version?: number;
  isCurrent: boolean;
  onRestore: () => void;
  canRestore: boolean;
  dev: boolean;
  onRetry?: () => void;
}) {
  const [opsOpen, setOpsOpen] = useState(false);
  const parts = m.parts ?? [];
  const empty = !parts.some((p) => p.kind !== "text" || p.text.trim());
  const groups: (Part | Part[])[] = [];
  for (const p of parts) {
    const last = groups[groups.length - 1];
    if (p.kind === "file" || p.kind === "shell") {
      if (Array.isArray(last)) last.push(p);
      else groups.push([p]);
    } else if (p.kind !== "text" || p.text.trim()) groups.push(p);
  }
  const fileCount = parts.filter((p) => p.kind === "file").length;

  return (
    <div className="flex gap-3">
      <div className="relative mt-0.5 shrink-0 self-start">
        <LogoMark className="size-7" />
        {m.pending && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 animate-pulse rounded-full bg-success ring-2 ring-ink-1000" />}
      </div>
      <div className="min-w-0 flex-1 space-y-3 text-[14px] leading-relaxed">
        {empty && m.pending && (
          <div className="flex items-center gap-2 pt-1">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="size-1.5 rounded-full bg-nar" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </span>
            <span className="text-shimmer text-sm">{thinking ? "Düşünürəm…" : "Hazırlayıram…"}</span>
          </div>
        )}
        {groups.map((g, gi) =>
          Array.isArray(g) && !dev ? (
            <SimpleOps key={gi} ops={g} pending={!!m.pending} open={opsOpen} onToggle={() => setOpsOpen((o) => !o)} />
          ) : Array.isArray(g) ? (
            <div key={gi} className="overflow-hidden rounded-2xl border border-ink-100/[0.08] bg-ink-950">
              <div className="flex items-center justify-between border-b border-ink-100/5 px-3 py-1.5 text-[11px] text-ink-400">
                <span>{g.length} əməliyyat</span>
                {m.pending && <Loader2 className="size-3 animate-spin" />}
              </div>
              {g.map((p, i) =>
                p.kind === "shell" ? (
                  <div key={i} className="flex items-center gap-2 border-b border-ink-100/5 px-3 py-2 font-mono text-[12px] text-ink-300 last:border-0">
                    <Terminal className="size-3.5 text-warning" />
                    {p.command}
                  </div>
                ) : p.kind === "file" ? (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => p.status !== "deleted" && onOpenFile(p.path)}
                    className="flex w-full items-center gap-2 border-b border-ink-100/5 px-3 py-2 text-left font-mono text-[12px] text-ink-300 transition last:border-0 hover:bg-ink-100/[0.03] hover:text-ink-100"
                  >
                    {p.status === "writing" ? (
                      <Loader2 className="size-3.5 animate-spin text-nar" />
                    ) : p.status === "deleted" ? (
                      <Trash className="size-3.5 text-ink-400" />
                    ) : (
                      <Check className="size-3.5 text-success" />
                    )}
                    <FileCode2 className="size-3.5 text-ink-400" />
                    <span className={cn("truncate", p.status === "deleted" && "line-through")}>{p.path}</span>
                  </motion.button>
                ) : null
              )}
            </div>
          ) : g.kind === "plan" ? (
            <div key={gi} className="rounded-2xl border border-ink-100/[0.08] bg-ink-950 px-4 py-3 text-[13px] text-ink-300">
              <div className="label-mono mb-1.5 flex items-center gap-1.5 text-nar-600">Plan</div>
              <div className="whitespace-pre-wrap">{g.text}</div>
            </div>
          ) : g.kind === "text" ? (
            <div key={gi} className="whitespace-pre-wrap text-ink-100">{g.text.trim()}</div>
          ) : null
        )}
        {m.error && <ErrorNote raw={m.error} dev={dev} onRetry={onRetry} />}
        {!m.pending && (m.model || version) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500">
            {version && (
              <span className={cn("rounded-full px-2 py-0.5 font-label text-[10px] font-medium", isCurrent ? "bg-nar text-white" : "bg-ink-900 text-ink-400")}>
                v{version}
                {isCurrent && " · cari"}
              </span>
            )}
            {fileCount > 0 && <span>{fileCount} {dev ? "fayl" : "hissə"}</span>}
            {dev && m.model && <span>{m.model.split("/").pop()}</span>}
            {version && !isCurrent && (
              <button disabled={!canRestore} onClick={onRestore} className="ml-auto inline-flex items-center gap-1 text-ink-400 transition hover:text-ink-100 disabled:opacity-40">
                <History className="size-3" /> Bu versiyaya qayıt
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple mode: one calm line instead of a list of file paths and shell commands. */
function SimpleOps({ ops, pending, open, onToggle }: { ops: Part[]; pending: boolean; open: boolean; onToggle: () => void }) {
  const files = ops.filter((p): p is Extract<Part, { kind: "file" }> => p.kind === "file");
  const installs = ops.filter((p) => p.kind === "shell").length;
  const writing = files.find((f) => f.status === "writing");
  const done = files.filter((f) => f.status !== "writing").length;
  const names = [...new Set(files.filter((f) => f.status !== "deleted").map((f) => friendlyFile(f.path)))];
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100/[0.08] bg-ink-950">
      <button onClick={onToggle} className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px]">
        {pending ? <Loader2 className="size-4 shrink-0 animate-spin text-nar" /> : <Check className="size-4 shrink-0 text-success" />}
        <span className="min-w-0 flex-1 truncate text-ink-200">
          {pending && writing ? (
            <>Qurulur: <span className="text-ink-100">{friendlyFile(writing.path)}</span></>
          ) : (
            <>{done} hissə hazırlandı{installs ? ` · ${installs} paket` : ""}</>
          )}
        </span>
        {names.length > 0 && <ChevronDown className={cn("size-3.5 shrink-0 text-ink-400 transition", open && "rotate-180")} />}
      </button>
      {/* progress hairline */}
      {pending && files.length > 0 && (
        <div className="h-[2px] bg-ink-900">
          <motion.div className="h-full bg-nar" animate={{ width: `${Math.max(8, (done / Math.max(files.length, 1)) * 100)}%` }} transition={{ ease: EASE, duration: 0.5 }} />
        </div>
      )}
      <AnimatePresence initial={false}>
        {open && names.length > 0 && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="overflow-hidden border-t border-ink-100/[0.06] px-3.5 py-2">
            {names.map((n) => (
              <li key={n} className="flex items-center gap-2 py-1 text-[12.5px] text-ink-400">
                <span className="size-1 rounded-full bg-ink-500" /> {n}
              </li>
            ))}
            {installs > 0 && (
              <li className="flex items-center gap-2 py-1 text-[12.5px] text-ink-400">
                <Package className="size-3" /> Lazımi paketlər quraşdırıldı
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Friendly error with a retry button; developers also see the raw message. */
function ErrorNote({ raw, dev, onRetry }: { raw: string; dev: boolean; onRetry?: () => void }) {
  const e = humanizeError(raw);
  const stopped = raw === "Dayandırıldı.";
  return (
    <div className={cn("rounded-2xl border px-3.5 py-3 text-[13px]", stopped ? "border-ink-100/10 bg-ink-950 text-ink-300" : "border-danger/25 bg-danger/[0.06]")}>
      <div className="flex items-start gap-2.5">
        <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", stopped ? "text-ink-400" : "text-danger")} />
        <div className="min-w-0 flex-1">
          <div className={cn("font-medium", stopped ? "text-ink-200" : "text-ink-100")}>{e.title}</div>
          {e.hint && <div className="mt-0.5 text-ink-400">{e.hint}</div>}
          {dev && !stopped && <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-ink-950 p-2 font-mono text-[11px] text-ink-400 scroll-thin">{raw}</pre>}
        </div>
      </div>
      {onRetry && e.retryable && (
        <button onClick={onRetry} className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-pill px-3.5 text-[12.5px] font-medium text-wool transition hover:-translate-y-px active:scale-[0.97]">
          <RotateCcw className="size-3.5" /> {stopped ? "Davam et" : "Yenidən cəhd et"}
        </button>
      )}
    </div>
  );
}
