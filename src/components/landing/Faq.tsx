"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Container, Glass, SectionHead } from "./Section";
import { FAQ } from "./data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="suallar" className="relative scroll-mt-20 py-36">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead no="08" label="Suallar" lines={["Tez-tez", "*verilən suallar.*"]} />
        </div>
        <Glass className="divide-y divide-ink-100/[0.07] lg:col-span-7">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center gap-4 px-6 py-5 text-left">
                <span className="font-label text-[10.5px] text-nar-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[15.5px] font-medium">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="text-ink-400">
                  <Plus className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                    <p className="px-6 pb-6 pl-[3.4rem] text-[14.5px] leading-relaxed text-ink-300">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Glass>
      </Container>
    </section>
  );
}
