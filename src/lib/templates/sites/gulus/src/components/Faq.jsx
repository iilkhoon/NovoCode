import { useState } from "react";
import { Plus } from "lucide-react";

const FAQ = [
  ["Müayinə həqiqətən pulsuzdur?", "Bəli. İlk müayinə, rəqəmsal rentgen və müalicə planı pulsuzdur — heç bir öhdəlik yoxdur."],
  ["Müalicə ağrılıdır?", "Müasir anesteziya ilə müalicə ağrısızdır. Həssas xəstələr üçün sedasiya da təklif edirik."],
  ["Hissə-hissə ödəniş mümkündür?", "Bəli, 500 ₼-dan yuxarı müalicələr üçün 12 aya qədər faizsiz taksit var."],
  ["Uşaqları neçə yaşdan qəbul edirsiniz?", "3 yaşdan. Uşaq kabinetimiz oyun otağı kimi qurulub ki, ilk ziyarət qorxusuz keçsin."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="suallar" className="scroll-mt-20 bg-muted py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-[clamp(32px,4.5vw,48px)] font-extrabold leading-tight tracking-[-0.03em]">Tez-tez verilən suallar</h2>
        <div className="divide-y divide-border rounded-3xl bg-card px-6">
          {FAQ.map(([q, a], i) => (
            <div key={q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold">
                {q}
                <Plus className={"size-5 shrink-0 text-primary transition-transform duration-300 " + (open === i ? "rotate-45" : "")} />
              </button>
              <div className={"grid transition-[grid-template-rows] duration-300 " + (open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <p className="overflow-hidden text-muted-foreground"><span className="block pb-5">{a}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
