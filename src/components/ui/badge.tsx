import { cn } from "@/lib/cn";

export function Badge({ className, tone = "neutral", ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "nar" | "success" | "gold" }) {
  const tones = {
    neutral: "bg-white/5 text-ink-300 ring-white/10",
    nar: "bg-nar-500/10 text-nar-300 ring-nar-500/25",
    success: "bg-success/10 text-success ring-success/25",
    gold: "bg-gold-500/10 text-gold-400 ring-gold-500/25",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", tones[tone], className)} {...p} />;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-xs font-medium text-ink-200 backdrop-blur", className)}>
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-ink-300">{children}</kbd>;
}
