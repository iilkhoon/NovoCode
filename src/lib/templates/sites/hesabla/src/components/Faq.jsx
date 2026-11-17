import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = [
  ["Mühasib olmadan istifadə edə bilərəm?", "Bəli. Hesabla sahibkarlar üçün qurulub — terminlər sadədir, hər addımda izah var. İstəsəniz mühasibinizi də dəvət edə bilərsiniz."],
  ["Məlumatlarım təhlükəsizdir?", "Bütün məlumat şifrələnir və Azərbaycandakı serverlərdə saxlanılır. Gündəlik ehtiyat nüsxə alınır."],
  ["Vergi portalı ilə işləyir?", "ƏDV və gəlir hesabatları vergi portalının tələb etdiyi formatda hazırlanır — yalnız yükləyirsiniz."],
  ["Sınaq müddəti bitəndə nə olur?", "Avtomatik ödəniş yoxdur. Plan seçməsəniz, hesabınız pulsuz Başlanğıc planına keçir."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="suallar" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24">
      <h2 className="text-center font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.03em]">Suallar</h2>
      <div className="mt-12 space-y-3">
        {FAQ.map(([q, a], i) => (
          <div key={q} className="rounded-2xl border border-border bg-card">
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium">
              {q}
              <ChevronDown className={"size-5 shrink-0 text-muted-foreground transition-transform duration-300 " + (open === i ? "rotate-180" : "")} />
            </button>
            {open === i && <p className="px-6 pb-6 text-muted-foreground">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
