import { useState } from "react";
import { CalendarCheck, Check, Clock, MapPin, Phone } from "lucide-react";
import { db } from "@/lib/db";

const today = () => new Date().toISOString().slice(0, 10);
const TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"];

export default function Reservation() {
  const [sent, setSent] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    db.collection("reservations").add(data);
    setSent(data);
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3.5 outline-none transition-colors focus:border-primary";

  return (
    <section id="rezervasiya" className="mx-auto grid max-w-6xl scroll-mt-20 gap-14 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:py-32">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Rezervasiya</p>
        <h2 className="mt-4 font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em]">Sizin üçün masa saxlayaq.</h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">10 nəfərə qədər qruplar üçün. Daha böyük tədbirlər üçün bizə zəng edin.</p>
        <ul className="mt-10 space-y-5">
          {[
            [MapPin, "Nizami küçəsi 42, Bakı"],
            [Clock, "Hər gün 08:00 – 23:00"],
            [Phone, "+994 12 555 42 42"],
          ].map(([Icon, text]) => (
            <li key={text} className="flex items-center gap-4">
              <span className="grid size-11 place-items-center rounded-full bg-card text-primary shadow-sm"><Icon className="size-5" /></span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[2rem] bg-card p-7 shadow-xl shadow-foreground/5 sm:p-10">
        {sent ? (
          <div className="py-14 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary"><Check className="size-7" /></span>
            <h3 className="mt-6 font-display text-3xl">Masanız rezerv olundu!</h3>
            <p className="mt-3 text-muted-foreground">{sent.date} · {sent.time} · {sent.guests}. Təsdiq üçün {sent.phone} nömrəsinə zəng edəcəyik.</p>
            <button onClick={() => setSent(null)} className="mt-8 text-sm font-medium text-primary underline-offset-4 hover:underline">Yeni rezervasiya</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">Adınız<input required name="name" autoComplete="name" placeholder="Məs. Aysel" className={field} /></label>
            <label className="grid gap-2 text-sm font-medium">Telefon<input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium">Tarix<input required name="date" type="date" min={today()} defaultValue={today()} className={field} /></label>
              <label className="grid gap-2 text-sm font-medium">Saat
                <select name="time" className={field} defaultValue="19:00">{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
              </label>
              <label className="grid gap-2 text-sm font-medium">Qonaq
                <select name="guests" className={field} defaultValue="2 nəfər">{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n}>{n} nəfər</option>)}</select>
              </label>
            </div>
            <button className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
              <CalendarCheck className="size-5" /> Masa sifariş et
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
