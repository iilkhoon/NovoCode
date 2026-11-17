import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-sm text-accent">Əl işi · Şəki emalatxanası</p>
          <h1 className="mt-4 font-display font-semibold text-[clamp(56px,9vw,120px)] leading-[0.9] tracking-[-0.02em]">
            Gildən gələn <em className="text-accent">sakitlik.</em>
          </h1>
        </div>
        <div className="max-w-xs">
          <p className="leading-relaxed text-muted-foreground">Hər parça bir dəfə formalaşır. Kiçik partiyalar, təbii şirlər, gündəlik istifadə üçün.</p>
          <a href="#kataloq" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
            Kataloqa bax <ArrowRight className="size-4" />
          </a>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.15 }} className="mt-14 grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <img src={img("1595351298020-038700609878", 1400, 900)} alt="Dulusçu çarxında gil" className="aspect-[16/10] w-full rounded-[1.5rem] bg-muted object-cover md:aspect-auto md:h-[460px]" />
        <img src={img("1610701596061-2ecf227e85b2", 800, 1000)} alt="Mətbəx kolleksiyası masada" className="hidden h-[460px] w-full rounded-[1.5rem] bg-muted object-cover md:block" />
      </motion.div>
    </section>
  );
}
