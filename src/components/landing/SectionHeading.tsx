import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

export function SectionHeading({ eyebrow, title, text, align = "center", className }: { eyebrow: string; title: React.ReactNode; text?: string; align?: "center" | "left"; className?: string }) {
  return (
    <Reveal className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      <div className={cn("mb-5 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-nar-400", align === "center" && "justify-center")}>
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-nar-400" />
        {eyebrow}
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-nar-400" />
      </div>
      <h2 className="text-balance font-display text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{title}</h2>
      {text && <p className={cn("mt-5 text-balance text-[17px] leading-relaxed text-ink-300", align === "center" && "mx-auto max-w-2xl")}>{text}</p>}
    </Reveal>
  );
}
