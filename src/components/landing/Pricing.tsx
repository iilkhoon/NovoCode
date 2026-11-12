"use client";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";
import { PLANS } from "./data";
import { cn } from "@/lib/cn";

export function Pricing() {
  return (
    <section id="qiymətlər" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:w-[60%]">
          <SectionHead no="07" label="Qiymətlər" lines={["Sadə qiymət.", "*Gizli ödəniş yoxdur.*"]} text="Pulsuz başlayın, biznesiniz böyüdükcə yüksəldin. Gizli ödəniş, uzunmüddətli müqavilə yoxdur." />
        </div>
        <Reveal className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-nar/30 bg-nar/[0.06] px-4 py-2 text-[13.5px] text-ink-200">
          <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-nar/60" /><span className="relative size-2 rounded-full bg-nar" /></span>
          Beta dövründə bütün imkanlar pulsuzdur. Ödənişli planların qiyməti tezliklə açıqlanacaq.
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            return (
              <Reveal key={p.name} delay={i * 0.08} className="h-full">
                <div className={cn("surface flex h-full flex-col rounded-[22px] border p-7", p.highlight ? "border-nar/40 shadow-[var(--shadow-glow)]" : "border-ink-100/[0.08]")}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-3xl">{p.name}</h3>
                    {p.highlight && <span className="rounded-full bg-nar px-2.5 py-1 font-label text-[9.5px] uppercase tracking-[0.06em] text-white">Tövsiyə</span>}
                  </div>
                  <p className="mt-1 text-[14px] text-ink-400">{p.description}</p>
                  <div className="mt-8 flex h-[60px] items-baseline gap-2">
                    {p.price.monthly === 0 ? (
                      <>
                        <span className="font-display text-6xl tabular-nums">0</span>
                        <span className="text-ink-400">₼ / ay</span>
                      </>
                    ) : (
                      <span className="font-display text-[40px] italic leading-[60px] text-ink-400">Tezliklə</span>
                    )}
                  </div>
                  <div className="mt-6 rounded-xl bg-ink-900 px-3.5 py-2.5 text-[13px] text-ink-200">{p.credits}</div>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[14px] text-ink-300">
                        <Check className={cn("mt-0.5 size-4 shrink-0", p.highlight ? "text-nar-600" : "text-ink-500")} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="#başla" variant={p.highlight ? "white" : "secondary"} size="lg" className="mt-8 w-full">
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
