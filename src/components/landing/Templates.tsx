"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHead } from "./Section";
import { TemplatePreview } from "./TemplatePreview";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "./data";
import { useStartProject } from "./useStart";
import { cn } from "@/lib/cn";

export function Templates() {
  const [cat, setCat] = useState<TemplateCategory>("Hamısı");
  const { start, starting } = useStartProject();
  const list = TEMPLATES.filter((t) => cat === "Hamısı" || t.category === cat);

  return (
    <section data-stage="far" id="nümunələr" className="relative scroll-mt-20 py-36">
      <Container>
        <div className="lg:ml-auto lg:w-[58%]">
          <SectionHead no="05" label="Nümunələr" lines={["Bir ideya seçin,", "*Novo uyğunlaşdırsın.*"]} text="Hər nümunə real, işlək funksiyalarla qurulur. Kliklə başlayın, sonra öz biznesinizə görə dəyişin." />
        </div>
        <div className="glass mt-14 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-ink-100/10 p-1 lg:ml-auto">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("relative whitespace-nowrap rounded-full px-4 py-1.5 text-[12.5px] transition-colors duration-200", cat === c ? "text-ink-1000" : "text-ink-300 hover:text-ink")}>
              {cat === c && <motion.span layoutId="tpl-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.45, bounce: 0.15 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((t) => (
              <motion.button
                layout
                key={t.name}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                disabled={starting}
                onClick={() => start(t.prompt)}
                className="glass group rounded-2xl border border-ink-100/10 p-2 text-left transition-[border-color] duration-300 hover:border-nar/40"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <div className="h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]">
                    <TemplatePreview t={t} />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 pb-2 pt-4">
                  <div>
                    <div className="text-[15px] font-medium">{t.name}</div>
                    <div className="text-[12.5px] text-ink-400">{t.tagline}</div>
                  </div>
                  <ArrowUpRight className="size-4 text-ink-400 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-nar-300" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
