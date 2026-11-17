import { useState } from "react";
import { img } from "@/lib/img";
import { db } from "@/lib/db";
import { PACKAGES } from "../data";

export default function Contact() {
  const [sent, setSent] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    db.collection("inquiries").add(data);
    setSent(data);
  };
  const field = "w-full border-b border-border bg-transparent py-3.5 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  return (
    <section id="elaqe" className="mx-auto grid max-w-7xl scroll-mt-10 gap-16 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
      <img src={img("1525258946800-98cfd641d0de", 1000, 1200)} alt="Gəlin buketi" loading="lazy" className="aspect-[5/6] w-full bg-muted object-cover" />
      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Əlaqə</p>
        <h2 className="mt-4 font-display text-[clamp(36px,5vw,60px)] leading-[1.02]">Tarixiniz hələ açıqdır?</h2>
        <p className="mt-5 text-muted-foreground">İldə yalnız 30 toy çəkirəm ki, hər birinə tam diqqət ayıra bilim. 24 saat ərzində cavab verirəm.</p>
        {sent ? (
          <p className="mt-10 border border-primary/40 p-6 font-display text-2xl">Təşəkkürlər, {sent.name}! {sent.date} tarixini yoxlayıb tezliklə yazacağam.</p>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-5">
            <input required name="name" autoComplete="name" placeholder="Adlarınız" className={field} />
            <div className="grid gap-5 sm:grid-cols-2">
              <input required name="date" type="date" className={field} />
              <select name="package" className={field + " bg-background"} defaultValue="Toy">{PACKAGES.map((p) => <option key={p.name}>{p.name}</option>)}</select>
            </div>
            <input required name="phone" type="tel" autoComplete="tel" placeholder="Telefon" className={field} />
            <button className="mt-4 bg-primary py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90">Göndər</button>
          </form>
        )}
      </div>
    </section>
  );
}
