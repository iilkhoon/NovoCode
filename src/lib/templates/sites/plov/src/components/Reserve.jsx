import { useState } from "react";
import { Check } from "lucide-react";
import { img } from "@/lib/img";
import { db } from "@/lib/db";

export default function Reserve() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    db.collection("reservations").add(Object.fromEntries(new FormData(e.currentTarget)));
    setSent(true);
  };
  const field = "w-full rounded-xl border border-border bg-background px-4 py-3.5 outline-none focus:border-primary";
  return (
    <section id="rezerv" className="relative scroll-mt-20 overflow-hidden">
      <img src={img("1555396273-367ea4eb4db5", 1800, 900)} alt="Restoranın zalı" loading="lazy" className="absolute inset-0 size-full bg-muted object-cover" />
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-28 md:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(38px,5vw,60px)] font-bold leading-tight">Ailənizlə gəlin.</h2>
          <p className="mt-4 max-w-sm text-lg text-muted-foreground">120 yerlik zal, VIP otaqlar və canlı muğam — hər cümə və şənbə.</p>
        </div>
        <div className="rounded-3xl border border-border bg-card/95 p-7 backdrop-blur">
          {sent ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-primary"><Check /></span>
              <p className="mt-5 font-display text-2xl font-semibold">Masanız hazır olacaq!</p>
              <p className="mt-2 text-sm text-muted-foreground">Təsdiq üçün sizə zəng edəcəyik.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3">
              <input required name="name" autoComplete="name" placeholder="Adınız" className={field} />
              <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
              <div className="grid grid-cols-2 gap-3">
                <input required name="date" type="date" className={field} />
                <select name="guests" className={field} defaultValue="4 nəfər">{[2, 4, 6, 8, 10, 15, 20].map((n) => <option key={n}>{n} nəfər</option>)}</select>
              </div>
              <button className="mt-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground">Masa sifariş et</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
