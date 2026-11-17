import { Minus, Plus } from "lucide-react";
import { img } from "@/lib/img";
import { DISHES } from "../data";
import { useOrder } from "@/lib/order";

export default function Menu() {
  const { order, set } = useOrder();
  return (
    <section id="menyu" className="scroll-mt-20 border-t border-border bg-muted/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-sm font-medium text-primary">Menyu</p>
        <h2 className="mt-3 font-display text-[clamp(38px,5vw,60px)] font-bold">Bu gün sobadan çıxanlar</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((d) => {
            const qty = order[d.id] || 0;
            return (
              <article key={d.id} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative overflow-hidden">
                  <img src={img(d.photo, 700, 520)} alt={d.name} loading="lazy" className="aspect-[7/5.2] w-full bg-muted object-cover transition-transform duration-700 group-hover:scale-105" />
                  {d.tag && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{d.tag}</span>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold">{d.name}</h3>
                    <span className="text-lg font-semibold text-primary">{d.price} ₼</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.text}</p>
                  {qty === 0 ? (
                    <button onClick={() => set(d.id, 1)} className="mt-5 flex items-center justify-center gap-2 rounded-full border border-primary/50 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Plus className="size-4" /> Səbətə</button>
                  ) : (
                    <div className="mt-5 flex items-center justify-between rounded-full bg-primary p-1 text-primary-foreground">
                      <button onClick={() => set(d.id, qty - 1)} className="grid size-9 place-items-center rounded-full hover:bg-black/10" aria-label="Azalt"><Minus className="size-4" /></button>
                      <span className="text-sm font-semibold">{qty} əd. · {qty * d.price} ₼</span>
                      <button onClick={() => set(d.id, qty + 1)} className="grid size-9 place-items-center rounded-full hover:bg-black/10" aria-label="Artır"><Plus className="size-4" /></button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
