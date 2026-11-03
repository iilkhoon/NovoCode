"use client";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { PromptBox } from "@/components/PromptBox";
import { Knots } from "@/components/carpet/Knots";
import { medallion } from "@/components/carpet/patterns";
import { EASE } from "@/components/ui/motion";
import { Container } from "./Section";
import { EXAMPLES, TYPEWRITER } from "./data";
import { useStartProject } from "./useStart";

export function Hero() {
  const { start, starting } = useStartProject();
  const [value, setValue] = useState("");
  const med = useMemo(() => medallion(25), []);

  return (
    <section id="başla" className="relative scroll-mt-20 pb-16 pt-10 sm:pt-14">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-100/15 pb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-400">
          <span>
            <span className="text-nar">№ 01</span> — Azərbaycan dilində AI sayt qurucusu
          </span>
          <span className="hidden sm:inline">Bakı · 2026</span>
        </div>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-[3.1rem] font-medium leading-[0.98] tracking-[-0.03em] text-balance sm:text-[4.6rem] lg:text-[5.4rem] [font-variation-settings:'SOFT'_50,'opsz'_144]"
            >
              Sözlə deyin,
              <br />
              saytınız <em className="font-normal text-nar [font-variation-settings:'SOFT'_100,'WONK'_1]">toxunsun.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              className="mt-7 max-w-xl text-[17.5px] leading-relaxed text-ink-300"
            >
              Xalça düyün-düyün toxunur, sayt isə sətir-sətir. Nə istədiyinizi Azərbaycan dilində yazın və ya deyin — Novo dizaynı, kodu və məlumat bazasını qurur, xətaları özü tapıb düzəldir.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.22 }} className="mt-9 max-w-[620px]">
              <PromptBox
                size="lg"
                typewriter={TYPEWRITER}
                value={value}
                onValueChange={setValue}
                busy={starting}
                onSubmit={({ text, images, styleId }) => start(text, images, styleId)}
              />
              <div className="mt-5 flex flex-wrap items-baseline gap-x-1 gap-y-1.5 text-[14px] text-ink-400">
                <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.14em]">Məsələn:</span>
                {EXAMPLES.map((ex, i) => (
                  <span key={ex.label}>
                    <button onClick={() => setValue(ex.prompt)} className="text-ink-200 underline decoration-ink-100/25 underline-offset-4 transition hover:text-nar hover:decoration-nar">
                      {ex.label}
                    </button>
                    {i < EXAMPLES.length - 1 && <span className="ml-1 text-ink-600">/</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.figure initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="lg:col-span-5">
            <div className="relative border-[1.5px] border-ink bg-ink-1000 p-4 shadow-[6px_6px_0_var(--color-ink-700)] sm:p-6">
              <div className="border border-ink-100/15 bg-wool p-3 sm:p-5">
                <Knots pattern={med} weave speed={70} className="mx-auto block w-full max-w-[420px]" title="Toxunan göl naxışı" />
              </div>
              {/* loom fringe */}
              <div aria-hidden className="mt-3 flex justify-between px-1">
                {Array.from({ length: 26 }).map((_, i) => (
                  <span key={i} className="h-3 w-px bg-ink-500" />
                ))}
              </div>
            </div>
            <figcaption className="mt-4 flex gap-3 font-mono text-[11.5px] leading-relaxed text-ink-400">
              <span className="whitespace-nowrap text-nar">Şək. 1</span>
              <span>Göl naxışı, 25×25 düyün. Xalçada hər düyün bir rəngdir — ekranda isə bir piksel. Novo saytınızı da belə toxuyur.</span>
            </figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  );
}
