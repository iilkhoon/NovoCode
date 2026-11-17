import { Baby, Gem, ScanSearch, Smile, Sparkles, SquareStack } from "lucide-react";
import { SERVICES } from "../data";

const ICONS = { check: ScanSearch, clean: Sparkles, white: Smile, implant: Gem, aligner: SquareStack, kids: Baby };

export default function Services() {
  return (
    <section id="xidmetler" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Xidmətlər və qiymətlər</p>
        <h2 className="mt-3 text-[clamp(32px,4.5vw,48px)] font-extrabold leading-tight tracking-[-0.03em]">Gizli ödəniş yoxdur. Qiyməti əvvəlcədən bilirsiniz.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => {
          const Icon = ICONS[s.id];
          return (
            <a key={s.id} href="#randevu" className="group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon className="size-6" /></span>
              <h3 className="mt-6 text-lg font-bold">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-sm">
                <span className="text-lg font-extrabold text-primary">{s.price}</span>
                <span className="text-muted-foreground">{s.time}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
