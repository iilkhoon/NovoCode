"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { PromptBox } from "@/components/PromptBox";
import { Container } from "./Section";
import { SplitTitle } from "./SplitTitle";
import { EXAMPLES, TYPEWRITER } from "./data";
import { useStartProject } from "./useStart";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const { start, starting } = useStartProject();
  const [value, setValue] = useState("");

  return (
    <section data-stage="hero" id="başla" className="relative flex min-h-svh scroll-mt-0 flex-col justify-end pb-14 pt-28">
      <Container className="w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
          <span className="text-nar-300">01</span> — Azərbaycan dilində AI sayt qurucusu
        </motion.div>

        <SplitTitle
          as="h1"
          immediate
          lines={["Sözlə de,", "sayt *doğulsun.*"]}
          className="mt-6 text-[clamp(3.4rem,10vw,9rem)] leading-[0.9] tracking-[-0.015em] text-ink [text-shadow:0_2px_60px_rgb(0_0_0/0.6)]"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.7 }} className="lg:col-span-6">
            <PromptBox size="lg" typewriter={TYPEWRITER} value={value} onValueChange={setValue} busy={starting} onSubmit={({ text, images, styleId }) => start(text, images, styleId)} />
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12.5px]">
              {EXAMPLES.map((ex) => (
                <button key={ex.label} onClick={() => setValue(ex.prompt)} className="text-ink-300 underline decoration-ink-100/20 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-nar-300">
                  {ex.label}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            className="text-[15.5px] leading-[1.75] text-ink-200/85 [text-shadow:0_1px_24px_rgb(0_0_0/0.8)] lg:col-span-3 lg:col-start-8"
          >
            Fikrinizi Azərbaycan dilində yazın və ya deyin. Novo dizaynı, kodu və məlumat bazasını qurur — xətaları özü tapıb düzəldir.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1 }}
            className="hidden text-[15.5px] leading-[1.75] text-ink-200/85 [text-shadow:0_1px_24px_rgb(0_0_0/0.8)] lg:col-span-2 lg:block"
          >
            Agentlik yox, həftələr yox. Bir söhbət — və tam işlək sayt.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
