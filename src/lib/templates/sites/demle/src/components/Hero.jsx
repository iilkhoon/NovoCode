import { motion } from "motion/react";
import { Clock, MapPin, Star } from "lucide-react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-10 md:grid-cols-[1.05fr_0.95fr] md:pt-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
          <span className="size-1.5 rounded-full bg-primary" /> Bakı · 2019-dan
        </p>
        <h1 className="mt-7 font-display text-[clamp(44px,7vw,84px)] font-normal leading-[0.98] tracking-[-0.03em]">
          Hər qurtumda <em className="text-primary">isti</em> bir hekayə.
        </h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
          Hər səhər təzə qovrulan dənələr, ev şirniyyatları və şəhərin ən rahat küncləri — Nizami küçəsində.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#menyu" className="rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5">Menyuya bax</a>
          <a href="#rezervasiya" className="rounded-full border border-foreground/20 px-7 py-4 font-medium transition-colors hover:bg-foreground/5">Masa sifarişi</a>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}</span>
            <b className="font-semibold text-foreground">4.9</b> · 320+ rəy
          </span>
          <span className="flex items-center gap-2"><MapPin className="size-4" /> Nizami küç. 42</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.1, ease: [0.23, 1, 0.32, 1] }} className="relative">
        <img src={img("1509042239860-f550ce710b93", 1000, 1200)} alt="Latte art ilə iki fincan kofe" className="aspect-[5/6] w-full rounded-[2.25rem] bg-muted object-cover shadow-2xl shadow-foreground/15" />
        <img src={img("1555507036-ab1f4038808a", 400, 400)} alt="Təzə kruassan" className="absolute -left-8 bottom-16 hidden size-36 rounded-3xl border-4 border-background bg-muted object-cover shadow-xl sm:block" />
        <div className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-xl">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><Clock className="size-5" /></span>
          <div>
            <p className="text-xs text-muted-foreground">Bu gün açığıq</p>
            <p className="font-display text-xl">08:00 – 23:00</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
