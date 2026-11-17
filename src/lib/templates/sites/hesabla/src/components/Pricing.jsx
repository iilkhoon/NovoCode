import { useState } from "react";
import { Check } from "lucide-react";

const PLANS = [
  { name: "Başlanğıc", monthly: 0, text: "Fərdi sahibkarlar üçün", features: ["Ayda 10 qaimə", "1 bank hesabı", "Əsas hesabatlar"] },
  { name: "Biznes", monthly: 39, text: "Kiçik komandalar üçün", features: ["Limitsiz qaimə", "5 bank hesabı", "ƏDV hesabatı", "3 istifadəçi", "Ödəniş xatırlatmaları"], best: true },
  { name: "Pro", monthly: 89, text: "Böyüyən şirkətlər üçün", features: ["Biznesdəki hər şey", "Limitsiz istifadəçi", "Pul axını proqnozu", "API və inteqrasiyalar", "Şəxsi menecer"] },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="qiymetler" className="scroll-mt-20 border-y border-border bg-card/40 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="text-sm font-semibold text-accent">Qiymətlər</p>
          <h2 className="mt-3 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.03em]">Sadə və şəffaf.</h2>
          <div className="mt-8 inline-flex rounded-full border border-border bg-muted p-1 text-sm">
            {[["Aylıq", false], ["İllik · 2 ay pulsuz", true]].map(([l, v]) => (
              <button key={l} onClick={() => setYearly(v)} className={"rounded-full px-5 py-2 font-medium transition-colors " + (yearly === v ? "bg-foreground text-background" : "text-muted-foreground")}>{l}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? Math.round((p.monthly * 10) / 12) : p.monthly;
            return (
              <div key={p.name} className={"relative flex flex-col rounded-3xl border p-8 " + (p.best ? "border-primary bg-gradient-to-b from-primary/15 to-card shadow-[0_0_60px_-20px_rgba(124,92,255,0.7)]" : "border-border bg-card")}>
                {p.best && <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold">Ən populyar</span>}
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                <p className="mt-6 font-display text-5xl font-bold tracking-tight">{price} ₼<span className="text-base font-normal text-muted-foreground"> / ay</span></p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => <li key={f} className="flex gap-2.5"><Check className="size-4 shrink-0 text-accent" />{f}</li>)}
                </ul>
                <a href="#demo" className={"mt-8 rounded-full py-3 text-center font-semibold transition-colors " + (p.best ? "bg-primary hover:bg-primary/90" : "border border-border hover:bg-muted")}>{p.monthly ? "14 gün pulsuz" : "Pulsuz başla"}</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
