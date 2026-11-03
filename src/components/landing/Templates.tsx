"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { TemplatePreview } from "./TemplatePreview";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "./data";
import { useStartProject } from "./useStart";
import { EASE, Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";

export function Templates() {
  const [cat, setCat] = useState<TemplateCategory>("Hamısı");
  const { start, starting } = useStartProject();
  const list = TEMPLATES.filter((t) => cat === "Hamısı" || t.category === cat);

  return (
    <section id="şablonlar" className="relative scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Şablonlar"
          title={<>Sıfırdan başlamaq istəmirsiniz?</>}
          text="Hazır ideyalardan birini seçin — Novo onu sizin biznesinizə uyğunlaşdırsın. Hər şablon real, işlək funksiyalarla gəlir."
        />
        <Reveal className="mt-10 flex justify-center">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/8 bg-white/[0.02] p-1 scroll-thin">
            {TEMPLATE_CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("relative whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] transition-colors", cat === c ? "text-ink-950" : "text-ink-300 hover:text-ink-100")}>
                {cat === c && <motion.span layoutId="tpl-pill" className="absolute inset-0 rounded-full bg-ink-100" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((t) => (
              <motion.button
                layout
                key={t.name}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, ease: EASE }}
                disabled={starting}
                onClick={() => start(t.prompt)}
                className="group text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/8 bg-ink-900 p-2 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-white/20 group-hover:shadow-[0_30px_60px_-20px_rgb(255_59_92/0.35)]">
                  <div className="h-full overflow-hidden rounded-xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
                    <TemplatePreview t={t} />
                  </div>
                  <div className="absolute inset-2 grid place-items-center rounded-xl bg-ink-950/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full bg-ink-100 px-4 py-2 text-sm font-medium text-ink-950 shadow-xl">
                      Bu ideya ilə başla <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[13px] text-ink-400">{t.tagline}</div>
                  </div>
                  <span className="rounded-full border border-white/8 px-2.5 py-0.5 text-[11px] text-ink-400">{t.category}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
