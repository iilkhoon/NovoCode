import { useState } from "react";
import { SERVICES } from "../data";

export default function Services() {
  const [tab, setTab] = useState(SERVICES[0].cat);
  const current = SERVICES.find((s) => s.cat === tab);
  return (
    <section id="xidmetler" className="scroll-mt-20 bg-card py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center font-display text-[clamp(40px,5.5vw,64px)] font-medium leading-none">Xidmətlər və qiymətlər</h2>
        <div className="mt-10 flex justify-center gap-2">
          {SERVICES.map((s) => (
            <button key={s.cat} onClick={() => setTab(s.cat)} className={"rounded-full px-5 py-2 text-sm font-medium transition-colors " + (tab === s.cat ? "bg-foreground text-white" : "bg-muted text-muted-foreground hover:text-foreground")}>{s.cat}</button>
          ))}
        </div>
        <ul className="mt-10">
          {current.items.map(([name, price, min]) => (
            <li key={name} className="flex items-baseline gap-4 border-b border-border py-5">
              <span className="text-lg">{name}</span>
              <span className="flex-1 border-b border-dotted border-muted-foreground/40" />
              <span className="text-sm text-muted-foreground">{min} dəq</span>
              <span className="w-20 text-right font-display text-2xl font-semibold">{price} ₼</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
