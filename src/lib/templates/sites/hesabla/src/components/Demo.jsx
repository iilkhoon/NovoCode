import { useState } from "react";
import { Check } from "lucide-react";
import { db } from "@/lib/db";

export default function Demo() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    db.collection("leads").add(Object.fromEntries(new FormData(e.currentTarget)));
    setSent(true);
  };
  const field = "w-full rounded-xl border border-border bg-background px-4 py-3.5 outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";
  return (
    <section id="demo" className="scroll-mt-20 px-5 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/25 via-card to-card p-8 sm:p-14">
        <div aria-hidden className="absolute -right-32 -top-32 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.02] tracking-[-0.03em]">15 dəqiqəlik demo. Suallarınıza cavab.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Məsləhətçimiz sizə zəng edib panelinizi birlikdə quracaq.</p>
          </div>
          {sent ? (
            <div className="rounded-2xl border border-border bg-background/60 p-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent"><Check /></span>
              <p className="mt-4 font-display text-xl font-semibold">Müraciətiniz qəbul olundu</p>
              <p className="mt-1 text-sm text-muted-foreground">Bu gün ərzində sizinlə əlaqə saxlayacağıq.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3">
              <input required name="name" autoComplete="name" placeholder="Adınız" className={field} />
              <input required name="company" placeholder="Şirkət" className={field} />
              <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
              <button className="rounded-full bg-primary py-3.5 font-semibold transition-colors hover:bg-primary/90">Demo istə</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
