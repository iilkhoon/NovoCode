"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "success" | "error" | "info" | "warning" | "loading";
type ToastInput = { title: string; description?: string; tone?: Tone; action?: { label: string; onClick: () => void }; duration?: number };
type Item = ToastInput & { id: number; tone: Tone };

let push: ((t: ToastInput) => number) | null = null;
let dismissFn: ((id: number) => void) | null = null;

/** Notifications. `toast.success("Saxlanıldı")` or `toast.show({ title, description, action })`. */
export const toast = {
  show: (t: ToastInput) => push?.(t) ?? -1,
  success: (title: string, description?: string) => push?.({ title, description, tone: "success" }) ?? -1,
  error: (title: string, description?: string) => push?.({ title, description, tone: "error" }) ?? -1,
  info: (title: string, description?: string) => push?.({ title, description, tone: "info" }) ?? -1,
  warning: (title: string, description?: string) => push?.({ title, description, tone: "warning" }) ?? -1,
  loading: (title: string, description?: string) => push?.({ title, description, tone: "loading", duration: Infinity }) ?? -1,
  dismiss: (id: number) => dismissFn?.(id),
};

const ICON = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle, loading: Loader2 };
const COLOR = { success: "text-success", error: "text-danger", info: "text-info", warning: "text-warning", loading: "text-nar animate-spin" };

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const remove = (id: number) => setItems((x) => x.filter((i) => i.id !== id));
    push = (t) => {
      const id = Date.now() + Math.random();
      setItems((x) => [...x.slice(-3), { ...t, tone: t.tone ?? "info", id }]);
      const ms = t.duration ?? (t.description || t.action ? 5200 : 3600);
      if (Number.isFinite(ms)) setTimeout(() => remove(id), ms);
      return id;
    };
    dismissFn = remove;
    return () => {
      push = null;
      dismissFn = null;
    };
  }, []);
  return (
    <div role="region" aria-label="Bildirişlər" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:items-end">
      <AnimatePresence initial={false}>
        {items.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-2xl border border-ink-100/10 bg-ink-1000 py-3 pl-3.5 pr-2 shadow-[var(--shadow-panel)]"
            >
              <Icon className={cn("mt-0.5 size-[18px] shrink-0", COLOR[t.tone])} />
              <div className="min-w-0 flex-1 py-px">
                <p className="text-[14px] font-medium leading-snug text-ink-100">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[13px] leading-snug text-ink-400">{t.description}</p>}
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action!.onClick();
                      dismissFn?.(t.id);
                    }}
                    className="mt-2 text-[13px] font-medium text-nar hover:underline"
                  >
                    {t.action.label}
                  </button>
                )}
              </div>
              <button type="button" aria-label="Bağla" onClick={() => dismissFn?.(t.id)} className="grid size-7 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100/[0.06] hover:text-ink-100">
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
