import { motion } from "motion/react";
import { Flame, Star, Truck } from "lucide-react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -left-40 top-20 size-[520px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-14 md:grid-cols-2 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><Flame className="size-4" /> Milli mətbəx · odun sobası</p>
          <h1 className="mt-5 font-display text-[clamp(46px,7vw,88px)] font-bold leading-[0.98]">Nənə resepti, <em className="text-primary">qapınıza</em> qədər.</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Şah plov, köz kabab və təndir qutabı — 45 dəqiqəyə bütün Bakıya çatdırırıq.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#menyu" className="rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(227,163,58,0.7)]">Onlayn sifariş</a>
            <a href="#rezerv" className="rounded-full border border-border px-7 py-4 font-semibold hover:bg-muted">Masa sifarişi</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Star className="size-4 fill-primary text-primary" /> 4.8 · 1 200+ rəy</span>
            <span className="flex items-center gap-2"><Truck className="size-4 text-primary" /> 30 ₼-dan pulsuz çatdırılma</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, rotate: -6, scale: 0.9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }} className="relative mx-auto w-full max-w-md">
          <img src={img("1603133872878-684f208fb84b", 900, 900)} alt="Şah plov" className="aspect-square w-full rounded-full border-8 border-muted bg-muted object-cover shadow-2xl" />
          <div className="absolute -bottom-2 left-0 rounded-2xl border border-border bg-card px-5 py-4 shadow-xl">
            <p className="text-xs text-muted-foreground">Günün təklifi</p>
            <p className="font-display text-xl font-semibold">Şah plov · 18 ₼</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
