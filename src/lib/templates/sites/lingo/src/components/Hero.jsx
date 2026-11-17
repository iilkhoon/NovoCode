import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pt-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-sm font-semibold text-accent"><Sparkles className="size-4" /> Yeni qruplar · 2 dekabr</span>
        <h1 className="mt-6 font-display text-[clamp(36px,5.6vw,68px)] font-bold leading-[1.05] tracking-[-0.02em]">
          Dil öyrənmək <span className="relative whitespace-nowrap"><span className="relative z-10">heç bu qədər</span><span className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded bg-primary/60" /></span> asan olmayıb.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">İngilis, alman və rus dili — kiçik qruplar, danışıq yönümlü dərslər və pulsuz səviyyə testi.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#test" className="rounded-full bg-primary px-7 py-4 font-semibold shadow-[0_8px_0_0_#1f1a0e] transition-all hover:translate-y-0.5 hover:shadow-[0_5px_0_0_#1f1a0e]">Pulsuz testi keç</a>
          <a href="#kurslar" className="rounded-full border-2 border-foreground px-7 py-[14px] font-semibold">Kurslar</a>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {["1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e"].map((id) => (
              <img key={id} src={img(id, 96, 96)} alt="" className="size-10 rounded-full border-2 border-background bg-muted object-cover" />
            ))}
          </div>
          <p className="text-sm"><b>2 400+</b> məzun · <b>92%</b> imtahandan keçir</p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.1 }} className="relative">
        <div className="absolute -right-4 -top-4 size-full rounded-[2rem] bg-primary" />
        <img src={img("1522202176988-66273c2fd55f", 900, 1000)} alt="Tələbələr dərsdə" className="relative aspect-[9/10] w-full rounded-[2rem] border-2 border-foreground bg-muted object-cover" />
        <div className="absolute -bottom-5 -left-5 rounded-2xl border-2 border-foreground bg-card px-5 py-3 font-display text-sm font-bold shadow-[4px_4px_0_0_#1f1a0e]">Max 8 nəfər qrupda</div>
      </motion.div>
    </section>
  );
}
