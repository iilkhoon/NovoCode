"use client";
import { Check, Minus } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, EASE } from "@/components/ui/motion";
import { LogoMark } from "@/components/Logo";
import { SectionHeading } from "./SectionHeading";
import { COMPARISON } from "./data";
import { cn } from "@/lib/cn";

function Cell({ v, highlight }: { v: string | boolean; highlight?: boolean }) {
  if (v === true) return <Check className={cn("mx-auto size-5", highlight ? "text-success" : "text-ink-300")} />;
  if (v === false) return <Minus className="mx-auto size-5 text-ink-500" />;
  return <span className={cn(highlight && "font-medium text-ink-100")}>{v}</span>;
}

export function Compare() {
  return (
    <section className="relative mx-auto max-w-5xl px-5 py-28">
      <SectionHeading eyebrow="Müqayisə" title={<>Həftələr yox, dəqiqələr.<br /><span className="text-ink-400">Minlər yox, manatlar.</span></>} />
      <Reveal className="mt-14 hidden md:block">
        <table className="w-full border-separate border-spacing-0 text-center text-[14px]">
          <thead>
            <tr>
              <th className="w-[34%]" />
              {COMPARISON.columns.map((c, i) => (
                <th key={c} className={cn("px-4 pb-5 pt-6 font-medium", i === 2 ? "rounded-t-2xl bg-nar-500/[0.07] text-ink-100" : "text-ink-300")}>
                  {i === 2 ? (
                    <span className="inline-flex items-center gap-2">
                      <LogoMark className="size-5" /> {c}
                    </span>
                  ) : (
                    c
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.rows.map((r, ri) => (
              <motion.tr key={r.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ri * 0.06, ease: EASE, duration: 0.6 }}>
                <td className="border-t border-white/6 py-4 pr-4 text-left text-ink-300">{r.label}</td>
                {r.values.map((v, i) => (
                  <td key={i} className={cn("border-t border-white/6 px-4 py-4 text-ink-400", i === 2 && "bg-nar-500/[0.07]", i === 2 && ri === COMPARISON.rows.length - 1 && "rounded-b-2xl")}>
                    <Cell v={v} highlight={i === 2} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      {/* mobile: one card per row */}
      <div className="mt-12 space-y-3 md:hidden">
        {COMPARISON.rows.map((r) => (
          <Reveal key={r.label} className="rounded-2xl border border-white/8 bg-ink-900/60 p-4">
            <div className="mb-3 text-[14px] font-medium">{r.label}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[12px]">
              {r.values.map((v, i) => (
                <div key={i} className={cn("rounded-xl px-1.5 py-2", i === 2 ? "bg-nar-500/10 ring-1 ring-nar-500/30" : "bg-white/[0.03] text-ink-400")}>
                  <div className={cn("mb-1 text-[10px] uppercase tracking-wider", i === 2 ? "text-nar-300" : "text-ink-500")}>{COMPARISON.columns[i]}</div>
                  <Cell v={v} highlight={i === 2} />
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-ink-500">Agentlik və freelancer qiymətləri Bakı bazarı üzrə təxmini aralıqlardır.</p>
    </section>
  );
}
