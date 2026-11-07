"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Check, ImagePlus, Loader2, Mic, Palette, PenLine, Square, X } from "lucide-react";
import { fileToDataUrl } from "@/lib/image";
import { useSpeech } from "@/lib/useSpeech";
import { STYLE_PRESETS } from "@/lib/styles";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export interface PromptSubmit {
  text: string;
  images: string[];
  styleId: string;
}

interface Props {
  onSubmit: (p: PromptSubmit) => void;
  onStop?: () => void;
  busy?: boolean;
  placeholder?: string;
  typewriter?: string[];
  autoFocus?: boolean;
  size?: "lg" | "md";
  /** externally injected text (e.g. example chips) */
  value?: string;
  onValueChange?: (v: string) => void;
}

function useTypewriter(lines: string[] | undefined, active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!lines?.length || !active) return;
    let li = 0;
    let ci = 0;
    let dir = 1;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const line = lines[li];
      ci += dir;
      setText(line.slice(0, ci));
      if (dir === 1 && ci >= line.length) {
        dir = -1;
        t = setTimeout(tick, 2200);
        return;
      }
      if (dir === -1 && ci <= 0) {
        dir = 1;
        li = (li + 1) % lines.length;
      }
      t = setTimeout(tick, dir === 1 ? 32 : 12);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, [lines, active]);
  return text;
}

export function PromptBox({ onSubmit, onStop, busy, placeholder, typewriter, autoFocus, size = "md", value, onValueChange }: Props) {
  const [inner, setInner] = useState("");
  const text = value ?? inner;
  const setText = (v: string) => (onValueChange ? onValueChange(v) : setInner(v));
  const [images, setImages] = useState<string[]>([]);
  const [styleId, setStyleId] = useState("auto");
  const [styleOpen, setStyleOpen] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [focused, setFocused] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const baseText = useRef("");

  const typed = useTypewriter(typewriter, !text && !focused);
  const speech = useSpeech((t, final) => {
    const next = (baseText.current ? baseText.current + " " : "") + t;
    setText(next);
    if (final) baseText.current = next;
  });

  // auto-grow
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, size === "lg" ? 260 : 200) + "px";
  }, [text, size]);

  async function addFiles(files: FileList | File[]) {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 3);
    if (!imgs.length) return;
    const urls = await Promise.all(imgs.map((f) => fileToDataUrl(f)));
    setImages((prev) => [...prev, ...urls].slice(0, 3));
    toast.success("Şəkil əlavə edildi — AI dizaynı təhlil edəcək");
  }

  async function enhance() {
    if (!text.trim() || enhancing) return;
    setEnhancing(true);
    try {
      const r = await fetch("/api/enhance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text }) });
      const d = await r.json();
      if (d.prompt) {
        setText(d.prompt);
        toast.success("Sorğu təkmilləşdirildi");
      } else toast.error(d.error ?? "Təkmilləşdirmək alınmadı");
    } catch {
      toast.error("Təkmilləşdirmək alınmadı");
    } finally {
      setEnhancing(false);
    }
  }

  function submit() {
    if (busy || (!text.trim() && images.length === 0)) return;
    onSubmit({ text: text.trim() || "Bu şəkildəki dizaynı işlək sayt kimi qur.", images, styleId });
    setText("");
    baseText.current = "";
    setImages([]);
  }

  const lg = size === "lg";
  const style = STYLE_PRESETS.find((s) => s.id === styleId)!;

  return (
    <div className="relative">
      <div
        className={cn(
          "glass relative rounded-[22px] border shadow-[var(--shadow-panel)] transition-[border-color] duration-200",
          focused ? "border-nar/60" : "border-ink-100/15"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex gap-2 overflow-hidden px-4 pt-4">
              {images.map((src, i) => (
                <motion.div key={src.slice(-40) + i} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Əlavə edilmiş şəkil" className="size-16 rounded-full object-cover ring-1 ring-ink-100/15" />
                  <button
                    aria-label="Şəkli sil"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-ink-1000 transition hover:bg-nar"
                  >
                    <X className="size-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <textarea
            ref={taRef}
            value={text}
            autoFocus={autoFocus}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              setText(e.target.value);
              baseText.current = e.target.value;
            }}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.length) {
                e.preventDefault();
                addFiles(files);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={typewriter ? "" : placeholder ?? "Necə sayt istəyirsiniz?"}
            rows={lg ? 3 : 2}
            aria-label="Sayt təsviri"
            className={cn(
              "block w-full resize-none bg-transparent px-5 pt-4 text-ink-100 outline-none placeholder:text-ink-500 scroll-thin",
              lg ? "min-h-[112px] text-[16px] leading-relaxed" : "min-h-[64px] text-[14px]"
            )}
          />
          {typewriter && !text && (
            <div className={cn("pointer-events-none absolute left-5 right-5 top-4 text-ink-400", lg ? "text-[16px] leading-relaxed" : "text-[14px]")}>
              {typed}
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-nar-300" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 px-3 pb-3 pt-1">
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <ToolButton label="Şəkil / eskiz əlavə et" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="size-4" />
          </ToolButton>
          {speech.supported && (
            <ToolButton label={speech.listening ? "Dinləməni dayandır" : "Səslə yaz (Azərbaycan dili)"} onClick={speech.toggle} active={speech.listening}>
              <span className="relative grid place-items-center">
                {speech.listening && <span className="absolute size-6 animate-pulse-ring rounded-full bg-nar/40" />}
                <Mic className="relative size-4" />
              </span>
            </ToolButton>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStyleOpen((o) => !o)}
              className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-ink-300 transition hover:bg-ink-100/5 hover:text-ink-100"
              aria-label="Dizayn üslubu"
            >
              <span className="flex -space-x-1">
                {style.swatch.map((c, i) => (
                  <span key={i} className="size-3 rounded-full ring-1 ring-ink-100/20" style={{ background: c }} />
                ))}
              </span>
              <span className="hidden sm:inline">{style.name}</span>
              <Palette className="size-3.5 sm:hidden" />
            </button>
            <AnimatePresence>
              {styleOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setStyleOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-10 left-0 z-50 w-64 origin-bottom-left rounded-2xl border border-ink-100/12 bg-ink-850 p-1.5 shadow-[var(--shadow-panel)]"
                  >
                    <div className="px-2.5 pb-1.5 pt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Dizayn üslubu</div>
                    {STYLE_PRESETS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setStyleId(s.id);
                          setStyleOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-ink-100/6"
                      >
                        <span className="flex -space-x-1">
                          {s.swatch.map((c, i) => (
                            <span key={i} className="size-3.5 rounded-full ring-1 ring-ink-100/20" style={{ background: c }} />
                          ))}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] text-ink-100">{s.name}</span>
                          <span className="block truncate text-[11px] text-ink-400">{s.hint}</span>
                        </span>
                        {s.id === styleId && <Check className="size-4 text-nar-300" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={enhance}
              disabled={!text.trim() || enhancing}
              className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-ink-300 transition hover:bg-ink-100/5 hover:text-nar-300 disabled:opacity-40"
              title="Sorğunu AI ilə təkmilləşdir"
            >
              {enhancing ? <Loader2 className="size-3.5 animate-spin" /> : <PenLine className="size-3.5" />}
              <span className="hidden sm:inline">Təkmilləşdir</span>
            </button>
            {busy ? (
              <button onClick={onStop} aria-label="Dayandır" className="grid size-9 place-items-center rounded-full bg-ink-700 text-ink transition hover:bg-ink-600">
                <Square className="size-3.5 fill-current" />
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={submit}
                aria-label="Göndər"
                disabled={!text.trim() && images.length === 0}
                className="grid size-9 place-items-center rounded-full bg-ink text-ink-1000 transition-[transform,background-color] duration-150 hover:bg-nar-300 active:scale-[0.95] disabled:bg-ink-700 disabled:text-ink-500"
              >
                <ArrowUp className="size-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
          </div>
  );
}

function ToolButton({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn("grid size-8 place-items-center rounded-full transition", active ? "bg-nar/15 text-nar-300" : "text-ink-300 hover:bg-ink-100/5 hover:text-ink-100")}
    >
      {children}
    </button>
  );
}
