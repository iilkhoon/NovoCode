"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHead } from "./Section";
import { TemplatePreview } from "./TemplatePreview";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "./data";
import { useStartProject } from "./useStart";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

export function Templates() {
  const [cat, setCat] = useState<TemplateCategory>("Hamısı");
  const { start, starting } = useStartProject();
  const list = TEMPLATES.filter((t) => cat === "Hamısı" || t.category === cat);

  return (
    <section id="nümunələr" className="scroll-mt-20 py-24">
      <Container>
        <SectionHead no="05" label="Nümunələr" title={<>Bir ideya seçin, <em className="text-nar">Novo uyğunlaşdırsın.</em></>} text="Hər nümunə real, işlək funksiyalarla qurulur. Kliklə başlayın, sonra öz biznesinizə görə dəyişin." />
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-ink-100/15 pb-3">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("relative pb-3 text-[14.5px] transition", cat === c ? "text-ink" : "text-ink-400 hover:text-ink")}>
              {c}
              {cat === c && <motion.span layoutId="tpl-line" className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-nar" />}
            </button>
          ))}
        </div>
        <motion.div layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((t, i) => (
              <motion.button
                layout
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                disabled={starting}
                onClick={() => start(t.prompt)}
                className="group text-left"
              >
                <div className="aspect-[4/3] border-[1.5px] border-ink bg-ink-1000 p-2 transition-[transform,box-shadow] duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0_var(--color-nar)]">
                  <div className="h-full overflow-hidden border border-ink-100/10">
                    <TemplatePreview t={t} />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] text-ink-400">
                      <span className="text-nar">Şək. 3.{i + 1}</span> · {t.category}
                    </div>
                    <div className="mt-1 font-display text-[1.3rem] font-medium">{t.name}</div>
                    <div className="text-[14px] text-ink-400">{t.tagline}</div>
                  </div>
                  <ArrowUpRight className="mt-5 size-5 text-ink-400 transition group-hover:text-nar" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
