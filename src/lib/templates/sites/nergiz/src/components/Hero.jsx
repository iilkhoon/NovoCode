import { motion } from "motion/react";
import { img } from "@/lib/img";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 text-center md:pt-20">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Nəsimi · 2015-dən</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }} className="mx-auto mt-6 max-w-3xl font-display text-[clamp(52px,8vw,108px)] font-medium leading-[0.92]">
        Özünüzə <em className="text-primary">bir saat</em> ayırın.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="mx-auto mt-7 max-w-md text-lg text-muted-foreground">Saç, dırnaq və üz baxımı — sevdiyiniz ustalarla, sakit və qayğılı mühitdə.</motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-9 flex justify-center gap-3">
        <a href="#randevu" className="rounded-full bg-primary px-7 py-4 font-medium text-white shadow-lg shadow-primary/25">Randevu al</a>
        <a href="#xidmetler" className="rounded-full border border-foreground/15 bg-card px-7 py-4 font-medium">Qiymətlər</a>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }} className="mt-16 grid grid-cols-3 gap-3 sm:gap-5">
        {[["1522337360788-8b13dee7a37e", "Saç baxımı"], ["1487412947147-5cebf100ffc2", "Makiyaj"], ["1604654894610-df63bc536371", "Manikür"]].map(([id, alt], i) => (
          <img key={id} src={img(id, 700, 900)} alt={alt} className={"aspect-[7/9] w-full rounded-[1.5rem] bg-muted object-cover sm:rounded-[2rem] " + (i === 1 ? "" : "sm:mt-12")} />
        ))}
      </motion.div>
    </section>
  );
}
