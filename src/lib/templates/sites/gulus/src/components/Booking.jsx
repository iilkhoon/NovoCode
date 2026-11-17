import { useMemo, useState } from "react";
import { ArrowLeft, Check, CalendarDays } from "lucide-react";
import { img } from "@/lib/img";
import { db } from "@/lib/db";
import { DOCTORS, SERVICES, TIMES } from "../data";

const STEPS = ["Xidmət", "Həkim", "Vaxt", "Əlaqə"];
const DAY = ["B.", "B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş."];

/** Next 10 days, skipping Sundays. */
function nextDays() {
  const out = [];
  const d = new Date();
  while (out.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState({ service: null, doctor: null, date: null, time: null });
  const [done, setDone] = useState(null);
  const days = useMemo(nextDays, []);
  const service = SERVICES.find((s) => s.id === pick.service);
  const doctor = DOCTORS.find((d) => d.id === pick.doctor);

  const choose = (key, value) => {
    setPick((p) => ({ ...p, [key]: value }));
    if (key !== "date") setStep((s) => s + 1);
  };

  const submit = (e) => {
    e.preventDefault();
    const contact = Object.fromEntries(new FormData(e.currentTarget));
    const saved = db.collection("appointments").add({ ...contact, service: service.name, doctor: doctor.name, date: pick.date, time: pick.time });
    setDone(saved);
  };

  const reset = () => {
    setPick({ service: null, doctor: null, date: null, time: null });
    setStep(0);
    setDone(null);
  };

  const card = (active) => "rounded-2xl border p-4 text-left transition-all " + (active ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/40");

  return (
    <section id="randevu" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-24">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Onlayn randevu</p>
        <h2 className="mt-3 text-[clamp(32px,4.5vw,48px)] font-extrabold tracking-[-0.03em]">4 addımda yeriniz hazırdır.</h2>
      </div>

      <div className="mt-12 rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
        {done ? (
          <div className="py-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent/15 text-accent"><Check className="size-8" /></span>
            <h3 className="mt-6 text-2xl font-extrabold">Randevunuz təsdiqləndi!</h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">{done.service} · {done.doctor}<br />{done.date}, saat {done.time}. Bir gün əvvəl SMS ilə xatırladacağıq.</p>
            <button onClick={reset} className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary/40">Yeni randevu</button>
          </div>
        ) : (
          <>
            <ol className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <li key={s} className="flex flex-1 items-center gap-2">
                  <span className={"grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold " + (i < step ? "bg-accent text-white" : i === step ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{i < step ? <Check className="size-4" /> : i + 1}</span>
                  <span className={"hidden text-sm font-semibold sm:block " + (i === step ? "" : "text-muted-foreground")}>{s}</span>
                  {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
                </li>
              ))}
            </ol>

            <div className="mt-10 min-h-72">
              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <button key={s.id} onClick={() => choose("service", s.id)} className={card(pick.service === s.id)}>
                      <span className="flex justify-between gap-3 font-bold"><span>{s.name}</span><span className="text-primary">{s.price}</span></span>
                      <span className="mt-1 block text-sm text-muted-foreground">{s.time}</span>
                    </button>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {DOCTORS.map((d) => (
                    <button key={d.id} onClick={() => choose("doctor", d.id)} className={card(pick.doctor === d.id) + " flex flex-col items-center text-center"}>
                      <img src={img(d.photo, 200, 200)} alt="" className="size-20 rounded-full bg-muted object-cover object-top" />
                      <span className="mt-3 font-bold">{d.name}</span>
                      <span className="mt-1 text-xs text-muted-foreground">{d.role}</span>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold"><CalendarDays className="size-4 text-primary" /> Gün seçin</p>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {days.map((d) => {
                      const key = d.toLocaleDateString("az-AZ");
                      return (
                        <button key={key} onClick={() => choose("date", key)} className={"flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors " + (pick.date === key ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40")}>
                          <span className="text-xs opacity-70">{DAY[d.getDay()]}</span>
                          <span className="text-xl font-extrabold">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                  {pick.date && (
                    <>
                      <p className="mt-6 text-sm font-semibold">Saat seçin</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {TIMES.map((t) => (
                          <button key={t} onClick={() => choose("time", t)} className={"rounded-xl border py-3 text-sm font-semibold transition-colors " + (pick.time === t ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40")}>{t}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              {step === 3 && (
                <form onSubmit={submit} className="grid gap-4">
                  <div className="rounded-2xl bg-muted p-4 text-sm">
                    <b>{service?.name}</b> · {doctor?.name} · {pick.date}, {pick.time}
                  </div>
                  <input required name="name" autoComplete="name" placeholder="Ad və soyad" className="rounded-xl border border-border px-4 py-3.5 outline-none focus:border-primary" />
                  <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className="rounded-xl border border-border px-4 py-3.5 outline-none focus:border-primary" />
                  <button className="rounded-full bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25">Randevunu təsdiqlə</button>
                </form>
              )}
            </div>

            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Geri
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
