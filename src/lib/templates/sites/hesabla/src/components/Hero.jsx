import { motion } from "motion/react";
import { ArrowRight, Check, TrendingUp } from "lucide-react";

const ROWS = [
  ["Nur Market MMC", "Qaimə #1042", "+1 240,00 ₼", true],
  ["Bakı Elektrik", "Kommunal", "−186,40 ₼", false],
  ["Aqil Həsənov", "Qaimə #1041", "+860,00 ₼", true],
  ["Ofis icarəsi", "Noyabr", "−1 200,00 ₼", false],
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute left-1/2 top-[-260px] -z-10 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.45),transparent)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center md:pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
          <a href="#imkanlar" className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">Yeni</span> e-qaimə inteqrasiyası <ArrowRight className="size-3.5" />
          </a>
          <h1 className="mx-auto mt-8 max-w-4xl font-display text-[clamp(44px,7vw,84px)] font-bold leading-[0.98] tracking-[-0.04em]">
            Hesablarınız <span className="bg-gradient-to-r from-primary via-[#b18cff] to-accent bg-clip-text text-transparent">özü qaydaya</span> düşür.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Qaimələr, xərclər, ƏDV və hesabatlar bir paneldə. Bank çıxarışını yükləyin — qalanını Hesabla edir.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#demo" className="rounded-full bg-primary px-7 py-3.5 font-semibold shadow-[0_0_40px_-8px_rgba(124,92,255,0.8)] transition-transform hover:-translate-y-0.5">14 gün pulsuz sına</a>
            <a href="#qiymetler" className="rounded-full border border-border px-7 py-3.5 font-semibold transition-colors hover:bg-muted">Qiymətlər</a>
          </div>
          <p className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["Kart tələb olunmur", "2 dəqiqəyə qurulum", "İstənilən vaxt ləğv"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check className="size-4 text-accent" />{t}</span>
            ))}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }} className="mx-auto mt-16 max-w-4xl rounded-[1.75rem] border border-border bg-card/80 p-2 text-left shadow-[0_40px_120px_-40px_rgba(124,92,255,0.6)] backdrop-blur">
          <div className="rounded-[1.4rem] border border-border bg-background p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Bu ay gəlir", "18 420 ₼", "+12%"], ["Xərclər", "6 210 ₼", "−4%"], ["ƏDV öhdəliyi", "2 196 ₼", "20 dek."]].map(([l, v, d]) => (
                <div key={l} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{l}</p>
                  <p className="mt-2 font-display text-2xl font-bold">{v}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-accent"><TrendingUp className="size-3" />{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {ROWS.map(([who, what, amount, inc]) => (
                <div key={what + who} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{who}</p>
                    <p className="text-xs text-muted-foreground">{what}</p>
                  </div>
                  <span className={"shrink-0 font-display font-semibold tabular-nums " + (inc ? "text-accent" : "text-muted-foreground")}>{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
