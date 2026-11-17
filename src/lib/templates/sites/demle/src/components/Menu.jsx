import { useState } from "react";
import { img } from "@/lib/img";

const MENU = {
  Kofe: [
    { name: "Kapuçino", note: "Espresso, məxməri süd köpüyü", price: "5,50", photo: "1495474472287-4d71bcdd2085" },
    { name: "Flat white", note: "Qoşa ristretto, nazik köpük", price: "6,00", photo: "1514432324607-a09d9b4aefdd" },
    { name: "V60 filtr", note: "Efiopiya, çiçək və bergamot", price: "7,00", photo: "1442512595331-e89e73853f31" },
    { name: "Espresso", note: "Ev qarışığımız, şokolad notları", price: "3,50", photo: "1511920170033-f8396924c348" },
  ],
  Soyuq: [
    { name: "Ays latte", note: "Espresso, süd, buz", price: "6,50", photo: "1517701604599-bb29b565090c" },
    { name: "Soyuq brü", note: "18 saat dəmlənmiş", price: "6,50", photo: "1461023058943-07fcbe16d735" },
  ],
  Şirniyyat: [
    { name: "Kərə yağlı kruassan", note: "Hər səhər təzə", price: "4,50", photo: "1555507036-ab1f4038808a" },
    { name: "Limonlu tart", note: "Beze ilə", price: "6,50", photo: "1519915028121-7d3463d20b13" },
    { name: "Ev çörəyi", note: "Turş xəmir, toxumlu", price: "5,00", photo: "1509440159596-0249088772ff" },
  ],
};

export default function Menu() {
  const tabs = Object.keys(MENU);
  const [tab, setTab] = useState(tabs[0]);

  return (
    <section id="menyu" className="scroll-mt-20 bg-muted/70 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Menyu</p>
            <h2 className="mt-4 font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em]">Bu gün nə içirik?</h2>
          </div>
          <div role="tablist" className="flex gap-1 rounded-full bg-card p-1.5 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={"rounded-full px-5 py-2.5 text-sm font-medium transition-colors " + (tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MENU[tab].map((item) => (
            <article key={item.name} className="group overflow-hidden rounded-[1.5rem] bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <div className="overflow-hidden">
                <img src={img(item.photo, 600, 480)} alt={item.name} loading="lazy" className="aspect-[5/4] w-full bg-muted object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  <span className="shrink-0 font-semibold text-primary">{item.price} ₼</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
