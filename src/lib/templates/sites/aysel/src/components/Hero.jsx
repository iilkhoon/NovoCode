import { motion } from "motion/react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.img
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.23, 1, 0.32, 1] }}
        src={img("1606216794074-735e91aa2c92", 2000)}
        alt="Toy günü gülən cütlük"
        className="absolute inset-0 size-full bg-muted object-cover object-[65%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="text-xs uppercase tracking-[0.3em] text-primary">Toy · Nişan · Love story</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1.2, ease: [0.23, 1, 0.32, 1] }} className="mt-5 max-w-4xl font-display text-[clamp(44px,7.5vw,104px)] leading-[0.98]">
          Ən gözəl gününüz, <em className="text-primary">zamansız</em> kadrlarda.
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }} className="mt-10 flex flex-wrap items-center gap-6">
          <a href="#elaqe" className="border border-primary bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-transparent hover:text-primary">Tarixi yoxla</a>
          <span className="text-sm text-foreground/70">2026–2027 tarixləri açıqdır</span>
        </motion.div>
      </div>
    </section>
  );
}
