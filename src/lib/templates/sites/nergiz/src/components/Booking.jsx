import { useState } from "react";
import { Check } from "lucide-react";
import { img } from "@/lib/img";
import { useCollection } from "@/lib/db";
import { MASTERS, SERVICES, SLOTS } from "../data";

const today = () => new Date().toISOString().slice(0, 10);

export default function Booking() {
  const [bookings, col] = useCollection("bookings");
  const [master, setMaster] = useState(MASTERS[0].id);
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState("");
  const [done, setDone] = useState(null);
  const taken = new Set(bookings.filter((b) => b.master === master && b.date === date).map((b) => b.slot));

  const submit = (e) => {
    e.preventDefault();
    if (!slot) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setDone(col.add({ ...data, master, date, slot }));
    setSlot("");
  };

  const field = "w-full rounded-2xl border border-border bg-background px-4 py-3.5 outline-none focus:border-primary";

  return (
    <section id="randevu" className="scroll-mt-20 bg-muted py-24">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="text-center font-display text-[clamp(40px,5.5vw,64px)] font-medium leading-none">Randevu</h2>
        <p className="mt-4 text-center text-muted-foreground">Usta və saatı seçin — boş saatlar dərhal görünür.</p>

        <div className="mt-12 rounded-[2rem] bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
          {done ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary"><Check className="size-7" /></span>
              <p className="mt-6 font-display text-4xl font-semibold">Sizi gözləyirik, {done.name}!</p>
              <p className="mt-3 text-muted-foreground">{done.date} · {done.slot} · {MASTERS.find((m) => m.id === done.master)?.name}</p>
              <button onClick={() => setDone(null)} className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-medium">Başqa randevu</button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-8">
              <fieldset>
                <legend className="text-sm font-medium">Usta</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {MASTERS.map((m) => (
                    <button type="button" key={m.id} onClick={() => (setMaster(m.id), setSlot(""))} className={"flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors " + (master === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                      <img src={img(m.photo, 120, 120)} alt="" className="size-11 rounded-full bg-muted object-cover" />
                      <span className="min-w-0"><span className="block truncate text-sm font-medium">{m.name}</span><span className="block truncate text-xs text-muted-foreground">{m.role}</span></span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                <label className="grid content-start gap-3 text-sm font-medium">Tarix<input type="date" min={today()} value={date} onChange={(e) => (setDate(e.target.value), setSlot(""))} className={field} /></label>
                <fieldset>
                  <legend className="text-sm font-medium">Saat</legend>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {SLOTS.map((s) => {
                      const busy = taken.has(s);
                      return (
                        <button type="button" key={s} disabled={busy} onClick={() => setSlot(s)} className={"rounded-xl border py-2.5 text-sm font-medium transition-colors " + (busy ? "cursor-not-allowed border-transparent bg-muted text-muted-foreground line-through" : slot === s ? "border-primary bg-primary text-white" : "border-border hover:border-primary/50")}>{s}</button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <select name="service" className={field}>{SERVICES.flatMap((c) => c.items.map(([n]) => <option key={n}>{n}</option>))}</select>
                <input required name="name" autoComplete="name" placeholder="Adınız" className={field} />
                <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
              </div>
              <button disabled={!slot} className="rounded-full bg-primary py-4 font-medium text-white shadow-lg shadow-primary/25 transition-opacity disabled:opacity-40">{slot ? `${slot} üçün təsdiqlə` : "Saat seçin"}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
