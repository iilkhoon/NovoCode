import { Star } from "lucide-react";
import { img } from "@/lib/img";

const REVIEWS = [
  { who: "Leyla Məmmədova", role: "Dizayner", text: "Şəhərin ən yaxşı flat white-ı. Səhərlərim artıq burada başlayır.", photo: "1494790108377-be9c29b29330" },
  { who: "Orxan Əliyev", role: "Proqramçı", text: "İşləmək üçün sakit, Wi-Fi sürətli, kruassan isə Parisdəki kimi.", photo: "1500648767791-00dcc994a43e" },
  { who: "Aynur Həsənova", role: "Müəllim", text: "Masanı onlayn sifariş etdim — gələndə hər şey hazır idi. Çox təşəkkürlər!", photo: "1438761681033-6461ffad8d80" },
];

export default function Reviews() {
  return (
    <section id="reyler" className="scroll-mt-20 bg-foreground py-24 text-background md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Rəylər</p>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.02em]">Qonaqlarımız nə deyir?</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.who} className="flex flex-col rounded-[1.5rem] bg-background/[0.06] p-7 ring-1 ring-background/10">
              <div className="flex text-accent">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}</div>
              <blockquote className="mt-5 flex-1 font-display text-xl leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <img src={img(r.photo, 120, 120)} alt="" loading="lazy" className="size-11 rounded-full bg-background/10 object-cover" />
                <span>
                  <span className="block font-medium">{r.who}</span>
                  <span className="block text-sm text-background/60">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
