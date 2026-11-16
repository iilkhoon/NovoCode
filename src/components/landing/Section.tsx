import { Reveal } from "@/components/ui/motion";
import { SplitTitle } from "./SplitTitle";
import { cn } from "@/lib/cn";

/** Chapter header: mono index + label, large serif title, optional lead. */
export function SectionHead({ no, label, lines, text, className, center = false }: { no: string; label: string; lines: string[]; text?: React.ReactNode; className?: string; center?: boolean }) {
  return (
    <div className={cn(center && "text-center", className)}>
      <Reveal className={cn("label-mono flex items-center gap-3 text-ink-400", center && "justify-center")}>
        <span className="text-nar-600">{no}</span>
        <span className="h-px w-8 bg-ink-100/20" />
        {label}
      </Reveal>
      <SplitTitle lines={lines} className={cn("mt-6 text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[1.04] text-ink-100", center && "mx-auto")} />
      {text && (
        <Reveal delay={0.2} className={cn("mt-6 max-w-xl text-[17px] leading-relaxed text-ink-400", center && "mx-auto")}>
          {text}
        </Reveal>
      )}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative mx-auto max-w-[1200px] px-5 sm:px-10", className)}>{children}</div>;
}

/** Raised paper card. (Name kept from v1.) */
export function Glass({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("surface rounded-[22px] border border-ink-100/[0.08]", className)}>{children}</div>;
}
