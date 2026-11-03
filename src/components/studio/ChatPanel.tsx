"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, FileCode2, Loader2, Terminal, Trash, Wrench, AlertTriangle } from "lucide-react";
import type { ChatMessage, Part } from "@/lib/types";
import { PromptBox } from "@/components/PromptBox";
import { LogoMark } from "@/components/Logo";

interface Props {
  messages: ChatMessage[];
  busy: boolean;
  thinking: boolean;
  onSend: (text: string, images: string[]) => void;
  onStop: () => void;
  onOpenFile: (path: string) => void;
}

const SUGGESTIONS = ["Rəng palitrasını daha premium et", "Qeydiyyat və giriş əlavə et", "Rəylər bölməsi əlavə et", "Mobil görünüşü yaxşılaşdır"];

export function ChatPanel({ messages, busy, thinking, onSend, onStop, onOpenFile }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 scroll-thin">
        {messages.map((m) =>
          m.role === "user" ? (
            m.auto ? <AutoFixNote key={m.id} m={m} /> : <UserBubble key={m.id} m={m} />
          ) : (
            <AssistantMessage key={m.id} m={m} thinking={thinking && !!m.pending} onOpenFile={onOpenFile} />
          )
        )}
        {!busy && messages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => onSend(s, [])} className="rounded-full border border-ink-700 px-2.5 py-1 text-xs text-ink-300 hover:border-ink-600 hover:text-ink-100">
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-ink-800 p-3">
        <PromptBox busy={busy} onSubmit={onSend} onStop={onStop} placeholder="Dəyişiklik istəyin… (Enter — göndər)" />
      </div>
    </div>
  );
}

function UserBubble({ m }: { m: ChatMessage }) {
  return (
    <div className="flex flex-col items-end gap-2">
      {m.images?.length ? (
        <div className="flex gap-2">
          {m.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-20 rounded-lg object-cover ring-1 ring-ink-700" />
          ))}
        </div>
      ) : null}
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink-700 px-3.5 py-2.5 text-[14px] leading-relaxed">{m.content}</div>
    </div>
  );
}

function AutoFixNote({ m }: { m: ChatMessage }) {
  const [open, setOpen] = useState(false);
  const err = m.content.match(/```\n([\s\S]*?)\n```/)?.[1] ?? m.content;
  return (
    <div className="rounded-xl border border-saffron/25 bg-saffron/5 px-3 py-2 text-xs text-saffron">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2">
        <Wrench className="size-3.5" />
        <span className="flex-1 text-left">Xəta tapıldı — avtomatik düzəldirəm</span>
        <ChevronDown className={`size-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-ink-300 scroll-thin">{err}</pre>}
    </div>
  );
}

function AssistantMessage({ m, thinking, onOpenFile }: { m: ChatMessage; thinking: boolean; onOpenFile: (p: string) => void }) {
  const parts = m.parts ?? [];
  const empty = !parts.some((p) => p.kind !== "text" || p.text.trim());
  // group consecutive file/shell parts into one card
  const groups: (Part | Part[])[] = [];
  for (const p of parts) {
    const last = groups[groups.length - 1];
    if (p.kind === "file" || p.kind === "shell") {
      if (Array.isArray(last)) last.push(p);
      else groups.push([p]);
    } else if (p.kind !== "text" || p.text.trim()) groups.push(p);
  }
  return (
    <div className="flex gap-3">
      <LogoMark className="mt-0.5 size-6 shrink-0" />
      <div className="min-w-0 flex-1 space-y-3 text-[14px] leading-relaxed">
        {empty && m.pending && <div className="text-shimmer text-sm">{thinking ? "Düşünürəm…" : "Yazıram…"}</div>}
        {groups.map((g, gi) =>
          Array.isArray(g) ? (
            <div key={gi} className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
              {g.map((p, i) =>
                p.kind === "shell" ? (
                  <div key={i} className="flex items-center gap-2 border-b border-ink-800 px-3 py-2 font-mono text-[12px] text-ink-300 last:border-0">
                    <Terminal className="size-3.5 text-saffron" />
                    {p.command}
                  </div>
                ) : p.kind === "file" ? (
                  <button
                    key={i}
                    onClick={() => p.status !== "deleted" && onOpenFile(p.path)}
                    className="flex w-full items-center gap-2 border-b border-ink-800 px-3 py-2 text-left font-mono text-[12px] text-ink-300 last:border-0 hover:bg-ink-850"
                  >
                    {p.status === "writing" ? (
                      <Loader2 className="size-3.5 animate-spin text-nar-400" />
                    ) : p.status === "deleted" ? (
                      <Trash className="size-3.5 text-ink-400" />
                    ) : (
                      <Check className="size-3.5 text-mint" />
                    )}
                    <FileCode2 className="size-3.5 text-ink-400" />
                    <span className={`truncate ${p.status === "deleted" ? "line-through" : ""}`}>{p.path}</span>
                  </button>
                ) : null
              )}
            </div>
          ) : g.kind === "plan" ? (
            <div key={gi} className="rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-3 text-[13px] text-ink-300">
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">Plan</div>
              <div className="whitespace-pre-wrap">{g.text}</div>
            </div>
          ) : g.kind === "text" ? (
            <div key={gi} className="whitespace-pre-wrap text-ink-100">{g.text.trim()}</div>
          ) : null
        )}
        {m.error && (
          <div className="flex items-start gap-2 rounded-xl border border-nar-500/30 bg-nar-500/10 px-3 py-2 text-[13px] text-nar-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span className="break-words">{m.error}</span>
          </div>
        )}
        {m.model && !m.pending && (
          <div className="text-[11px] text-ink-400">
            {m.model.split("/").pop()} {m.skills?.length ? `· skill: ${m.skills.join(", ")}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
