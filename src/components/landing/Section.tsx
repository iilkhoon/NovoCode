import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

/** Editorial section header: rule, number, label, serif title. */
export function SectionHead({ no, label, title, text, className }: { no: string; label: string; title: React.ReactNode; text?: React.ReactNode; className?: string }) {
  return (
    <Reveal className={cn("border-t-[1.5px] border-ink pt-5", className)}>
      <div className="flex items-baseline justify-between font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-400">
        <span>
          <span className="text-nar">№ {no}</span> — {label}
        </span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <h2 className="font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.025em] text-balance sm:text-[3.4rem] lg:col-span-7 [font-variation-settings:'SOFT'_50,'opsz'_144]">{title}</h2>
        {text && <p className="max-w-md text-[16px] leading-relaxed text-ink-300 lg:col-span-4 lg:col-start-9 lg:self-end">{text}</p>}
      </div>
    </Reveal>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}
