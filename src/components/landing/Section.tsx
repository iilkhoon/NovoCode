import { Reveal } from "@/components/ui/motion";
import { SplitTitle } from "./SplitTitle";
import { cn } from "@/lib/cn";

/** Chapter header: hairline, mono index, large light serif title, optional lead. */
export function SectionHead({ no, label, lines, text, className, center = false }: { no: string; label: string; lines: string[]; text?: React.ReactNode; className?: string; center?: boolean }) {
  return (
    <div className={cn(center && "text-center", className)}>
      <Reveal className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400", center && "justify-center")}>
        <span className="text-white">{no}</span>
        <span className="h-px w-8 bg-ink-100/25" />
        {label}
      </Reveal>
      <SplitTitle
        lines={lines}
        className={cn("mt-6 text-[clamp(2.1rem,5vw,4.4rem)] leading-[1.06] text-ink [text-shadow:0_2px_40px_rgb(0_0_0/0.6)]", center && "mx-auto")}
      />
      {text && (
        <Reveal delay={0.2} className={cn("mt-6 max-w-xl text-[16.5px] leading-relaxed text-ink-200/85 [text-shadow:0_1px_24px_rgb(0_0_0/0.7)]", center && "mx-auto")}>
          {text}
        </Reveal>
      )}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative mx-auto max-w-[1240px] px-6 sm:px-14", className)}>{children}</div>;
}

export function Glass({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-2xl border border-ink-100/10", className)}>{children}</div>;
}
