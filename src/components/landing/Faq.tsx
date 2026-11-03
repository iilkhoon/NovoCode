"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "./SectionHeading";
import { FAQ } from "./data";
import { cn } from "@/lib/cn";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="suallar" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-28">
      <SectionHeading eyebrow="Suallar" title="Tez-tez verilən suallar" />
      <div className="mt-12 space-y-3">
        {FAQ.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className={cn("overflow-hidden rounded-2xl border transition-colors duration-300", open === i ? "border-white/15 bg-white/[0.03]" : "border-white/8 hover:border-white/12")}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15.5px] font-medium" aria-expanded={open === i}>
                {f.q}
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="grid size-7 shrink-0 place-items-center rounded-full bg-white/5">
                  <Plus className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-ink-300">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
