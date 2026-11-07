"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";
import { PLANS } from "./data";
import { cn } from "@/lib/cn";

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section data-stage="far" id="qiymətlər" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:ml-auto lg:w-[58%]">
          <SectionHead no="07" label="Qiymətlər" lines={["Sadə qiymət.", "*Gizli ödəniş yoxdur.*"]} text="Pulsuz başlayın, biznesiniz böyüdükcə yüksəldin. İstənilən vaxt ləğv edə bilərsiniz." />
        </div>
        <Reveal className="mt-12 flex lg:justify-end">
          <div className="glass flex items-center gap-1 rounded-full border border-ink-100/10 p-1 text-[12.5px]">
            {[
              { k: false, l: "Aylıq" },
              { k: true, l: "İllik · −20%" },
            ].map((o) => (
              <button key={o.l} onClick={() => setYearly(o.k)} className={cn("relative rounded-full px-4 py-1.5 transition-colors duration-200", yearly === o.k ? "text-ink-1000" : "text-ink-300")}>
                {yearly === o.k && <motion.span layoutId="bill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />}
                <span className="relative">{o.l}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? p.price.yearly : p.price.monthly;
            return (
              <Reveal key={p.name} delay={i * 0.08} className="h-full">
                <div className={cn("glass flex h-full flex-col rounded-[22px] border p-7", p.highlight ? "border-nar/50" : "border-ink-100/10")}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-3xl font-light">{p.name}</h3>
                    {p.highlight && <span className="rounded-full bg-nar/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-nar-300">Ən çox seçilən</span>}
                  </div>
                  <p className="mt-1 text-[14px] text-ink-400">{p.description}</p>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="font-display text-6xl font-light tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={price} initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="inline-block">
                          {price}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="text-ink-400">₼ / ay</span>
                  </div>
                  <div className="mt-1 h-5 font-mono text-[11px] text-ink-500">{yearly && price > 0 ? `İllik ödənişlə ${price * 12} ₼` : ""}</div>
                  <div className="mt-6 rounded-xl bg-ink-100/[0.05] px-3.5 py-2.5 text-[13px] text-ink-200">{p.credits}</div>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[14px] text-ink-300">
                        <Check className={cn("mt-0.5 size-4 shrink-0", p.highlight ? "text-nar-300" : "text-ink-500")} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="#başla" variant={p.highlight ? "primary" : "secondary"} size="lg" className="mt-8 w-full">
                    {p.cta}
                  </ButtonLink>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
