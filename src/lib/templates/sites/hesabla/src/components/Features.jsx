import { Banknote, Bell, FileText, Landmark, PieChart, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: FileText, title: "Qaimə 30 saniyəyə", text: "Şablonu seçin, müştərini yazın — e-qaimə avtomatik yaranır və göndərilir.", wide: true },
  { icon: Landmark, title: "Bank çıxarışı", text: "5 yerli bankın çıxarışını yükləyin, əməliyyatlar özü kateqoriyalanır." },
  { icon: PieChart, title: "ƏDV hesabatı", text: "Rüblük hesabat bir kliklə, vergi portalına hazır formatda." },
  { icon: Bell, title: "Ödəniş xatırlatmaları", text: "Gecikən qaimələr üçün müştəriyə nəzakətli SMS və e-poçt." },
  { icon: Banknote, title: "Pul axını proqnozu", text: "Növbəti 90 günün qalığını görün — sürprizsiz." },
  { icon: ShieldCheck, title: "Bank səviyyəsində təhlükəsizlik", text: "Şifrələnmiş məlumat, iki addımlı giriş, gündəlik ehtiyat nüsxə. Məlumatlarınız Azərbaycandakı serverlərdə saxlanılır.", full: true },
];

export default function Features() {
  return (
    <section id="imkanlar" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <p className="text-sm font-semibold text-accent">İmkanlar</p>
      <h2 className="mt-3 max-w-2xl font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.02] tracking-[-0.03em]">Mühasibin işinin 80%-i. Avtomatik.</h2>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text, wide, full }) => (
          <div key={title} className={"group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors hover:border-primary/50 " + (wide ? "md:col-span-2" : full ? "md:col-span-3" : "")}>
            <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 md:opacity-0" />
            <span className="relative grid size-11 place-items-center rounded-xl border border-border bg-muted text-primary"><Icon className="size-5" /></span>
            <h3 className="relative mt-6 font-display text-xl font-semibold">{title}</h3>
            <p className="relative mt-2 max-w-md text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
