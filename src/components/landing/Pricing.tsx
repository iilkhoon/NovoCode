"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "./SectionHeading";
import { PLANS } from "./data";
import { cn } from "@/lib/cn";

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="qiymətlər" className="relative scroll-mt-24 py-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-[500px] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(255_59_92/0.12),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow="Qiymətlər" title={<>Sadə qiymət. Gizli ödəniş yoxdur.</>} text="Pulsuz başlayın, biznesiniz böyüdükcə yüksəldin. İstənilən vaxt ləğv edə bilərsiniz." />
        <Reveal className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.02] p-1 text-[13px]">
            {[
              { k: false, l: "Aylıq" },
              { k: true, l: "İllik" },
            ].map((o) => (
              <button key={o.l} onClick={() => setYearly(o.k)} className={cn("relative rounded-full px-4 py-1.5 transition-colors", yearly === o.k ? "text-ink-950" : "text-ink-300")}>
                {yearly === o.k && <motion.span layoutId="bill-pill" className="absolute inset-0 rounded-full bg-ink-100" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{o.l}</span>
              </button>
            ))}
            <span className="ml-1 mr-2 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">−20%</span>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? p.price.yearly : p.price.monthly;
            return (
              <Reveal key={p.name} delay={i * 0.08} className="h-full">
                <div className={cn("relative h-full rounded-3xl p-px", p.highlight ? "bg-[linear-gradient(160deg,#ff5c7a,#ff7a45_40%,rgb(255_255_255/0.08)_70%)]" : "bg-white/8")}>
                  {p.highlight && <div aria-hidden className="absolute -inset-4 -z-10 rounded-[40px] bg-nar-500/20 blur-3xl" />}
                  <div className="flex h-full flex-col rounded-[23px] bg-ink-900 p-7">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-medium tracking-tight">{p.name}</h3>
                      {p.highlight && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-nar-gradient px-2.5 py-1 text-[11px] font-semibold text-white">
                          <Sparkles className="size-3" /> Ən populyar
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[14px] text-ink-400">{p.description}</p>
                    <div className="mt-6 flex items-end gap-1.5">
                      <span className="font-display text-5xl font-semibold tracking-tight">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={price} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-block">
                            {price}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="mb-1.5 text-ink-400">₼ / ay</span>
                    </div>
                    <div className="mt-1 h-5 text-[12px] text-ink-500">{yearly && price > 0 ? `İllik ödənişlə: ${price * 12} ₼` : ""}</div>
                    <div className="mt-5 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-ink-200">{p.credits}</div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-300">
                          <Check className={cn("mt-0.5 size-4 shrink-0", p.highlight ? "text-nar-400" : "text-ink-400")} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#başla" className="mt-8 block">
                      <Button variant={p.highlight ? "primary" : "secondary"} size="lg" className="w-full">
                        {p.cta}
                      </Button>
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
