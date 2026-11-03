"use client";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";
import { PLANS } from "./data";
import { cn } from "@/lib/cn";

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="qiymətlər" className="scroll-mt-20 py-24">
      <Container>
        <SectionHead no="07" label="Qiymətlər" title={<>Sadə qiymət. <em className="text-nar">Gizli ödəniş yoxdur.</em></>} text="Pulsuz başlayın, biznesiniz böyüdükcə yüksəldin. İstənilən vaxt ləğv edə bilərsiniz." />
        <div className="mt-10 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em]">
          {[
            { k: false, l: "Aylıq" },
            { k: true, l: "İllik −20%" },
          ].map((o) => (
            <button key={o.l} onClick={() => setYearly(o.k)} className={cn("border-[1.5px] px-3 py-1.5 transition", yearly === o.k ? "border-ink bg-ink text-wool" : "border-ink-100/25 text-ink-400 hover:border-ink")}>
              {o.l}
            </button>
          ))}
        </div>
        <div className="mt-8 grid border-t-[1.5px] border-ink lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? p.price.yearly : p.price.monthly;
            return (
              <Reveal key={p.name} delay={i * 0.06} className={cn("relative flex flex-col border-b border-ink-100/15 py-8 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:[&:not(:last-child)]:border-r", p.highlight && "lg:bg-ink-1000")}>
                {p.highlight && <div className="absolute inset-x-0 -top-[1.5px] h-[5px] bg-nar" />}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-[1.7rem] font-medium">{p.name}</h3>
                  {p.highlight && <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-nar">Ən çox seçilən</span>}
                </div>
                <p className="mt-1 text-[14.5px] text-ink-400">{p.description}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-display text-[4rem] font-light leading-none tracking-[-0.03em] [font-variation-settings:'opsz'_144]">{price}</span>
                  <span className="text-ink-400">₼ / ay</span>
                </div>
                <div className="mt-2 h-5 font-mono text-[11.5px] text-ink-500">{yearly && price > 0 ? `İllik ödənişlə ${price * 12} ₼` : ""}</div>
                <div className="mt-6 border-y border-ink-100/15 py-3 font-mono text-[12.5px] text-ink-200">{p.credits}</div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[14.5px] text-ink-300">
                      <span className="mt-[9px] size-[5px] shrink-0 bg-nar" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="#başla" variant={p.highlight ? "primary" : "outline"} size="lg" className="mt-8 w-full">
                  {p.cta}
                </ButtonLink>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
