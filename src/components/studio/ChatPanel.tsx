"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, ChevronDown, FileCode2, History, Loader2, Terminal, Trash, Wrench } from "lucide-react";
import type { ChatMessage, Part } from "@/lib/types";
import { PromptBox } from "@/components/PromptBox";
import { LogoMark } from "@/components/Logo";
import { applyStyle } from "@/lib/styles";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

interface Props {
  messages: ChatMessage[];
  busy: boolean;
  thinking: boolean;
  onSend: (text: string, images: string[]) => void;
  onStop: () => void;
  onOpenFile: (path: string) => void;
  onRestore: (messageId: string) => void;
  currentVersionId: string | null;
}

const SUGGESTIONS = ["✨ Dizaynı daha premium et", "🔐 Qeydiyyat və giriş əlavə et", "💬 Rəylər bölməsi əlavə et", "📱 Mobil görünüşü təkmilləşdir", "🌙 Tünd rejim əlavə et"];

export function ChatPanel({ messages, busy, thinking, onSend, onStop, onOpenFile, onRestore, currentVersionId }: Props) {
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
              <LogoMark className="mx-auto size-12" animated />
              <p className="mt-4 font-display text-lg tracking-tight">Nə quraq?</p>
              <p className="mt-1 text-sm text-ink-400">Saytınızı təsvir edin və ya şəkil atın.</p>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              {m.role === "user" ? (
                m.auto ? <AutoFixNote m={m} /> : <UserBubble m={m} />
              ) : (
                <AssistantMessage
                  m={m}
                  thinking={thinking && !!m.pending}
                  onOpenFile={onOpenFile}
                  version={versions.get(m.id)}
                  isCurrent={currentVersionId === m.id}
                  onRestore={() => onRestore(m.id)}
                  canRestore={!busy}
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
                onClick={() => onSend(s.replace(/^\S+\s/, ""), [])}
                className="rounded-[3px] border border-ink-100/8 bg-ink-100/[0.02] px-3 py-1.5 text-xs text-ink-300 transition hover:-translate-y-0.5 hover:border-ink-100/20 hover:text-ink-100"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      <div className="border-t border-ink-100/12 bg-ink-950/40 p-3">
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
            <img key={i} src={src} alt="" className="h-24 rounded-xl object-cover ring-1 ring-ink-100/10" />
          ))}
        </div>
      ) : null}
      <div className="max-w-[88%] whitespace-pre-wrap rounded-[3px] border border-ink-100/15 bg-ink-1000 px-4 py-2.5 text-[14px] leading-relaxed">{text}</div>
      {style && <span className="rounded-full bg-ink-100/5 px-2.5 py-0.5 text-[11px] text-ink-400">Üslub: {style.split("]")[0]}</span>}
    </div>
  );
}

function AutoFixNote({ m }: { m: ChatMessage }) {
  const [open, setOpen] = useState(false);
  const err = m.content.match(/```\n([\s\S]*?)\n```/)?.[1] ?? m.content;
  return (
    <div className="rounded-[3px] border border-saffron bg-saffron/10 px-3.5 py-2.5 text-xs text-gold-400">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2">
        <Wrench className="size-3.5" />
        <span className="flex-1 text-left font-medium">Xəta tapıldı — avtomatik düzəldirəm</span>
        <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} />
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
}: {
  m: ChatMessage;
  thinking: boolean;
  onOpenFile: (p: string) => void;
  version?: number;
  isCurrent: boolean;
  onRestore: () => void;
  canRestore: boolean;
}) {
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
        {m.pending && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 animate-pulse rounded-full bg-success ring-2 ring-ink-900" />}
      </div>
      <div className="min-w-0 flex-1 space-y-3 text-[14px] leading-relaxed">
        {empty && m.pending && (
          <div className="flex items-center gap-2 pt-1">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="size-1.5 rounded-full bg-nar-400" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </span>
            <span className="text-shimmer text-sm">{thinking ? "Düşünürəm…" : "Hazırlayıram…"}</span>
          </div>
        )}
        {groups.map((g, gi) =>
          Array.isArray(g) ? (
            <div key={gi} className="overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-900/80">
              <div className="flex items-center justify-between border-b border-ink-100/5 px-3 py-1.5 text-[11px] text-ink-400">
                <span>{g.length} əməliyyat</span>
                {m.pending && <Loader2 className="size-3 animate-spin" />}
              </div>
              {g.map((p, i) =>
                p.kind === "shell" ? (
                  <div key={i} className="flex items-center gap-2 border-b border-ink-100/5 px-3 py-2 font-mono text-[12px] text-ink-300 last:border-0">
                    <Terminal className="size-3.5 text-gold-400" />
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
                      <Loader2 className="size-3.5 animate-spin text-nar-400" />
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
            <div key={gi} className="rounded-2xl border border-ink-100/8 bg-ink-1000 px-4 py-3 text-[13px] text-ink-300">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-nar">Plan</div>
              <div className="whitespace-pre-wrap">{g.text}</div>
            </div>
          ) : g.kind === "text" ? (
            <div key={gi} className="whitespace-pre-wrap text-ink-100">{g.text.trim()}</div>
          ) : null
        )}
        {m.error && (
          <div className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[13px] text-danger">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span className="break-words">{m.error}</span>
          </div>
        )}
        {!m.pending && (m.model || version) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-500">
            {version && (
              <span className={cn("rounded-[3px] px-2 py-0.5 font-medium", isCurrent ? "bg-nar text-wool" : "bg-ink-100/5 text-ink-400")}>
                v{version}
                {isCurrent && " · cari"}
              </span>
            )}
            {fileCount > 0 && <span>{fileCount} fayl</span>}
            {m.model && <span>{m.model.split("/").pop()}</span>}
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
