import { MapPin } from "lucide-react";
import { ZONES } from "../data";

export default function Delivery() {
  return (
    <section id="catdirilma" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium text-primary">Çatdırılma</p>
          <h2 className="mt-3 font-display text-[clamp(38px,5vw,56px)] font-bold leading-tight">İsti gəlir. Söz veririk.</h2>
          <p className="mt-5 text-muted-foreground">Termo çantalarda daşıyırıq. 30 ₼-dan yuxarı sifarişlərdə birinci zonaya çatdırılma pulsuzdur.</p>
        </div>
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {ZONES.map(([area, time, price], i) => (
            <li key={area} className="flex items-center gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary">{i + 1}</span>
              <span className="flex-1">
                <span className="flex items-center gap-1.5 font-medium"><MapPin className="size-4 text-muted-foreground" />{area}</span>
                <span className="text-sm text-muted-foreground">{time}</span>
              </span>
              <span className="font-semibold text-primary">{price}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
