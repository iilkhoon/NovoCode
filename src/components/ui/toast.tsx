"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type Toast = { id: number; text: string; tone: "success" | "error" | "info" };
let push: ((t: Omit<Toast, "id">) => void) | null = null;

export const toast = {
  success: (text: string) => push?.({ text, tone: "success" }),
  error: (text: string) => push?.({ text, tone: "error" }),
  info: (text: string) => push?.({ text, tone: "info" }),
};

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    push = (t) => {
      const id = Date.now() + Math.random();
      setItems((x) => [...x, { ...t, id }]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3600);
    };
    return () => {
      push = null;
    };
  }, []);
  const icons = { success: CheckCircle2, error: XCircle, info: Info };
  const colors = { success: "text-nar-300", error: "text-danger", info: "text-info" };
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = icons[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-2.5 glass rounded-full border border-ink-100/12 px-4 py-2.5 text-sm text-ink shadow-[var(--shadow-panel)]"
            >
              <Icon className={`size-4 ${colors[t.tone]}`} />
              {t.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
