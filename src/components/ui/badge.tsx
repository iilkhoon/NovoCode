import { cn } from "@/lib/cn";

export function Badge({ className, tone = "neutral", ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "nar" | "success" | "gold" }) {
  const tones = {
    neutral: "bg-ink-100/6 text-ink-300",
    nar: "bg-nar/12 text-nar-600",
    success: "bg-success/12 text-success",
    gold: "bg-warning/15 text-warning",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-label text-[9.5px] font-medium uppercase tracking-[0.04em]", tones[tone], className)} {...p} />;
}

/** Small mono label, e.g. "№ 02 — Necə işləyir" */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-2 label-mono text-ink-400", className)}>{children}</span>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-ink-100/15 bg-ink-1000 px-1.5 font-mono text-[10px] text-ink-300">{children}</kbd>;
}
