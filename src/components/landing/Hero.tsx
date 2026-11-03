"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { PromptBox } from "@/components/PromptBox";
import { Eyebrow } from "@/components/ui/badge";
import { EASE } from "@/components/ui/motion";
import { AuroraBackground } from "./Background";
import { DemoWindow } from "./DemoWindow";
import { EXAMPLES, ROTATING_WORDS, TYPEWRITER } from "./data";
import { useStartProject } from "./useStart";

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-grid overflow-hidden pb-[0.14em] align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ROTATING_WORDS[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-nar-gradient col-start-1 row-start-1 animate-gradient whitespace-nowrap"
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const { start, starting } = useStartProject();
  const [value, setValue] = useState("");

  return (
    <section id="başla" className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
      <AuroraBackground />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <a href="#imkanlar" className="group inline-block">
            <Eyebrow>
              <span className="rounded-full bg-nar-gradient px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Yeni</span>
              Səslə və şəkildən sayt qurmaq
              <ArrowRight className="size-3.5 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ink-100" />
            </Eyebrow>
          </a>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          className="mt-7 text-balance font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl"
        >
          Danış,
          <br />
          <RotatingWord />
          <br className="sm:hidden" /> saytı hazır olsun.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-[17px] leading-relaxed text-ink-300 sm:text-lg"
        >
          Fikrinizi Azərbaycan dilində yazın və ya deyin. Novo dizaynı, kodu və məlumat bazasını özü qurur, xətaları özü düzəldir — tam işlək sayt dəqiqələr içində.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          className="mx-auto mt-10 max-w-2xl text-left"
        >
          <PromptBox
            size="lg"
            typewriter={TYPEWRITER}
            value={value}
            onValueChange={setValue}
            busy={starting}
            onSubmit={({ text, images, styleId }) => start(text, images, styleId)}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.6 } } }}
          className="mt-5 flex flex-wrap justify-center gap-2"
        >
          {EXAMPLES.map((ex) => (
            <motion.button
              key={ex.label}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.6 } } }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setValue(ex.prompt)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-ink-300 backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-ink-100"
            >
              <span>{ex.emoji}</span>
              {ex.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-400"
        >
          {["Kart tələb olunmur", "Kod sizə məxsusdur", "100% Azərbaycan dilində"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-success" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 18 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.55 }}
        style={{ transformPerspective: 1600 }}
        className="relative mx-auto mt-20 max-w-6xl px-3 sm:px-5"
      >
        <DemoWindow />
      </motion.div>
    </section>
  );
}
