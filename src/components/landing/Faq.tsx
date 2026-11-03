"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Container, SectionHead } from "./Section";
import { FAQ } from "./data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="suallar" className="scroll-mt-20 py-24">
      <Container>
        <SectionHead no="08" label="Suallar" title="Tez-tez verilən suallar" />
        <div className="mt-12 border-t-[1.5px] border-ink lg:ml-[41.66%]">
          {FAQ.map((f, i) => (
            <div key={f.q} className="border-b border-ink-100/15">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-baseline gap-5 py-5 text-left">
                <span className="font-mono text-[12px] text-nar">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-display text-[1.3rem] font-medium">{f.q}</span>
                <span className="font-mono text-lg text-ink-400">{open === i ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="max-w-xl pb-6 pl-[2.6rem] text-[15.5px] leading-relaxed text-ink-300">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
