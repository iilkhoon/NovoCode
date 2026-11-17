import { Leaf, Package, Truck } from "lucide-react";
import { img } from "@/lib/img";

const POINTS = [
  [Leaf, "Təbii materiallar", "Yerli gil və qurğuşunsuz şirlər — qida üçün təhlükəsiz."],
  [Package, "Diqqətli qablaşdırma", "Hər parça ayrıca sarılır, sınma halında pulsuz əvəz."],
  [Truck, "Bakı daxili 1–2 gün", "100 ₼-dan yuxarı sifarişlərdə çatdırılma pulsuzdur."],
];

export default function Story() {
  return (
    <section id="emalatxana" className="scroll-mt-20 bg-muted py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2">
        <img src={img("1493106641515-6b5631de4bb9", 1000, 1100)} alt="Ustanın əlləri çarxda küzə formalaşdırır" loading="lazy" className="aspect-[10/11] w-full rounded-[1.5rem] bg-border object-cover" />
        <div>
          <p className="text-sm text-accent">Emalatxana</p>
          <h2 className="mt-3 font-display font-semibold text-[clamp(40px,5vw,64px)] leading-[0.95]">İki usta, bir çarx və çoxlu səbir.</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">Gil 2021-də Şəkidə kiçik bir emalatxana kimi başladı. Hər parçanı əl ilə formalaşdırır, iki dəfə bişirir və yalnız mükəmməl olanları göndəririk.</p>
          <ul className="mt-10 space-y-6">
            {POINTS.map(([Icon, title, text]) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-accent"><Icon className="size-5" /></span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
