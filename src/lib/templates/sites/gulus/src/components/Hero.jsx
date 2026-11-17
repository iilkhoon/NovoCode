import { motion } from "motion/react";
import { ShieldCheck, Star } from "lucide-react";
import { img } from "@/lib/img";

const STATS = [["4 800+", "xəstə"], ["4.9", "Google reytinqi"], ["14", "il təcrübə"]];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <ShieldCheck className="size-4" /> Ağrısız müalicə zəmanəti
          </span>
          <h1 className="mt-6 text-[clamp(40px,6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Sağlam gülüş <span className="text-primary">bir randevu</span> uzaqlığında.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">Müasir avadanlıq, təcrübəli həkimlər və şəffaf qiymətlər. Onlayn randevu 30 saniyə çəkir.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#randevu" className="rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5">Onlayn randevu</a>
            <a href="#xidmetler" className="rounded-full border border-border bg-white px-7 py-4 font-semibold transition-colors hover:border-primary/40">Qiymətlər</a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-10">
            {STATS.map(([v, l]) => (
              <div key={l}>
                <dt className="text-3xl font-extrabold tracking-tight">{v}</dt>
                <dd className="text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
          <img src={img("1629909613654-28e377c37b09", 1000, 1150)} alt="Gülüş Dental müalicə otağı" className="aspect-[20/23] w-full rounded-[2rem] bg-muted object-cover shadow-2xl shadow-primary/15" />
          <div className="absolute -left-6 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
            <img src={img("1609840114035-3c981b782dfe", 120, 120)} alt="" className="size-12 rounded-xl object-cover" />
            <div>
              <p className="flex items-center gap-1 text-sm font-bold"><Star className="size-4 fill-amber-400 text-amber-400" /> 4.9 · 640 rəy</p>
              <p className="text-xs text-muted-foreground">Google xəritələr</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
