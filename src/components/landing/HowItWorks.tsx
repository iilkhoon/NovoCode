"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "./SectionHeading";
import { STEPS } from "./data";

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <section id="necə-işləyir" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Necə işləyir"
            title={<>Fikirdən canlı sayta<br /><span className="text-nar-gradient">dörd addımda.</span></>}
            text="Brif yazmaq, dizayner axtarmaq, həftələrlə gözləmək yoxdur. Novo ilə bütün proses bir söhbətdir."
          />
        </div>
        <div ref={ref} className="relative pl-10">
          <div className="absolute bottom-3 left-[15px] top-3 w-px bg-white/8" />
          <motion.div style={{ scaleY }} className="absolute bottom-3 left-[15px] top-3 w-px origin-top bg-gradient-to-b from-nar-500 via-saffron-500 to-gold-500" />
          <div className="space-y-14">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} className="relative">
                <span className="absolute -left-10 top-0 grid size-8 place-items-center rounded-full border border-white/10 bg-ink-900 font-mono text-[11px] text-nar-300 shadow-[0_0_0_6px_var(--color-ink-950)]">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-ink-300">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
