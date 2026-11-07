import { cn } from "@/lib/cn";

export function Badge({ className, tone = "neutral", ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "nar" | "success" | "gold" }) {
  const tones = {
    neutral: "bg-ink-100/6 text-ink-300",
    nar: "bg-nar/15 text-nar-300",
    success: "bg-success/12 text-success",
    gold: "bg-saffron/15 text-saffron",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide", tones[tone], className)} {...p} />;
}

/** Small mono label, e.g. "№ 02 — Necə işləyir" */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-400", className)}>{children}</span>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] border border-ink-100/20 bg-ink-900 px-1.5 font-mono text-[10px] text-ink-300">{children}</kbd>;
}
