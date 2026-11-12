"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ExternalLink, Loader2, Lock, Maximize2, Minimize2, Monitor, RotateCw, Smartphone, Tablet, TriangleAlert } from "lucide-react";
import type { RuntimeStatus } from "@/lib/runtime/webcontainer";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

const STEPS: { key: RuntimeStatus; label: string }[] = [
  { key: "booting", label: "Mühit işə düşür" },
  { key: "installing", label: "Paketlər yüklənir" },
  { key: "starting", label: "Sayt işə salınır" },
];
const ORDER: RuntimeStatus[] = ["idle", "booting", "installing", "starting", "ready"];

const DEVICES = {
  desktop: { w: "100%", icon: Monitor, label: "Kompüter" },
  tablet: { w: "820px", icon: Tablet, label: "Planşet" },
  mobile: { w: "390px", icon: Smartphone, label: "Telefon" },
} as const;

export function PreviewPanel({
  url,
  status,
  dev,
  onPreviewError,
  fullscreen,
  onToggleFullscreen,
}: {
  url: string | null;
  status: RuntimeStatus;
  dev: boolean;
  onPreviewError: (msg: string) => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");
  const [path, setPath] = useState("/");
  const [nonce, setNonce] = useState(0);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.source !== "novo-preview") return;
      if (e.data.type === "error") onPreviewError([e.data.message, e.data.stack].filter(Boolean).join("\n"));
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onPreviewError]);

  const src = url ? url.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path) : undefined;
  const idx = ORDER.indexOf(status);
  const [isolated, setIsolated] = useState(true);
  useEffect(() => setIsolated(typeof window === "undefined" || window.crossOriginIsolated), []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-ink-100/[0.08] bg-ink-1000 px-3 py-2">
        <button
          aria-label="Yenilə"
          title="Yenilə"
          onClick={() => {
            setNonce((n) => n + 1);
            setSpin(true);
            setTimeout(() => setSpin(false), 600);
          }}
          className="grid size-8 place-items-center rounded-lg text-ink-300 transition hover:bg-ink-100/5 hover:text-ink-100"
        >
          <RotateCw className={cn("size-4 transition-transform duration-500", spin && "rotate-[360deg]")} />
        </button>
        <form
          className="flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-ink-950 px-3.5 text-xs text-ink-300 ring-1 ring-inset ring-ink-100/[0.06] transition focus-within:ring-nar/40"
          onSubmit={(e) => {
            e.preventDefault();
            setNonce((n) => n + 1);
          }}
        >
          <Lock className="size-3 text-success" />
          <span className="text-ink-400">sayt.novocode.az</span>
          <input value={path} onChange={(e) => setPath(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" aria-label="Səhifə yolu" />
        </form>
        <div className="hidden items-center rounded-full bg-ink-950 p-0.5 ring-1 ring-inset ring-ink-100/[0.06] sm:flex">
          {(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((d) => {
            const Icon = DEVICES[d].icon;
            return (
              <button key={d} aria-label={DEVICES[d].label} title={DEVICES[d].label} onClick={() => setDevice(d)} className={cn("relative grid size-7 place-items-center rounded-full transition", device === d ? "text-ink-100" : "text-ink-400 hover:text-ink-100")}>
                {device === d && <motion.span layoutId="device-pill" className="absolute inset-0 rounded-full bg-ink-1000 shadow-[var(--shadow-card)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <Icon className="relative size-3.5" />
              </button>
            );
          })}
        </div>
        <button onClick={onToggleFullscreen} aria-label="Tam ekran" title="Tam ekran" className="grid size-8 place-items-center rounded-lg text-ink-300 transition hover:bg-ink-100/5 hover:text-ink-100">
          {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
        {url && (
          <a href={src} target="_blank" rel="noreferrer" aria-label="Yeni tabda aç" title="Yeni tabda aç" className="grid size-8 place-items-center rounded-lg text-ink-300 transition hover:bg-ink-100/5 hover:text-ink-100">
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>
      <div className="dot-grid relative min-h-0 flex-1 overflow-auto bg-ink-950 sm:p-4">
        {url ? (
          <motion.div layout transition={{ type: "spring", stiffness: 200, damping: 26 }} className="mx-auto h-full" style={{ width: DEVICES[device].w, maxWidth: "100%" }}>
            <iframe
              key={nonce}
              src={src}
              title="Önizləmə"
              className={cn("h-full w-full bg-white sm:shadow-[var(--shadow-panel)] sm:ring-1 sm:ring-ink-100/10", device === "mobile" ? "sm:rounded-[28px]" : "sm:rounded-2xl")}
              allow="cross-origin-isolated; clipboard-write"
            />
          </motion.div>
        ) : null}
        <AnimatePresence>
          {status !== "ready" && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }} className="absolute inset-0 grid place-items-center bg-ink-950">
              {status === "error" ? (
                <div className="max-w-sm px-6 text-center">
                  <TriangleAlert className="mx-auto size-8 text-danger" />
                  <p className="mt-3 font-display text-xl">{isolated ? "Önizləmə işə düşmədi" : "Bu brauzer önizləməni dəstəkləmir"}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {isolated
                      ? dev
                        ? "Səbəbi Terminal bölməsindədir. Səhifəni yeniləyib yenidən cəhd edin."
                        : "Səhifəni yeniləyib yenidən cəhd edin. Saytınız və söhbətiniz yadda saxlanılıb."
                      : "Canlı önizləmə üçün kompüterdə Chrome, Edge və ya Brave istifadə edin. Söhbət və kod burada da işləyir."}
                  </p>
                  <button onClick={() => location.reload()} className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-full bg-pill px-4 text-[13px] font-medium text-wool transition hover:-translate-y-px">
                    <RotateCw className="size-3.5" /> Yenilə
                  </button>
                </div>
              ) : (
                <div className="w-64">
                  <LogoMark className="mx-auto size-14" blink />
                  <div className="mt-6 space-y-2.5">
                    {STEPS.map((s) => {
                      const si = ORDER.indexOf(s.key);
                      const done = idx > si;
                      const active = idx === si;
                      return (
                        <div key={s.key} className={cn("flex items-center gap-3 text-sm transition-colors", done ? "text-ink-300" : active ? "text-ink-100" : "text-ink-500")}>
                          <span className={cn("grid size-5 place-items-center rounded-full", done ? "bg-success/15" : active ? "bg-nar/15" : "bg-ink-900")}>
                            {done ? <Check className="size-3 text-success" /> : active ? <Loader2 className="size-3 animate-spin text-nar" /> : <span className="size-1 rounded-full bg-ink-500" />}
                          </span>
                          {s.label}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-center text-xs text-ink-500">İlk açılış bir az vaxt apara bilər — sonrakılar sürətli olur</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
