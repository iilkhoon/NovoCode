import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { img } from "@/lib/img";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function Catalog({ onAdded }) {
  const [cat, setCat] = useState("Hamısı");
  const [justAdded, setJustAdded] = useState(null);
  const { add } = useCart();
  const list = PRODUCTS.filter((p) => cat === "Hamısı" || p.category === cat);

  const addToCart = (p) => {
    add(p.id);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 1200);
    onAdded?.();
  };

  return (
    <section id="kataloq" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display font-semibold text-[clamp(44px,6vw,72px)] leading-none">Kataloq</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={"rounded-full border px-4 py-2 text-sm transition-colors " + (cat === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="group">
              <div className="relative overflow-hidden rounded-[1.25rem] bg-muted">
                <img src={img(p.photo, 700, 820)} alt={p.name} loading="lazy" className="aspect-[6/7] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <button
                  onClick={() => addToCart(p)}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-card px-4 py-2.5 text-sm font-medium shadow-lg transition-all hover:bg-foreground hover:text-background md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  {justAdded === p.id ? <><Check className="size-4" /> Əlavə olundu</> : <><Plus className="size-4" /> Səbətə at</>}
                </button>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.note}</p>
                </div>
                <span className="font-display font-semibold text-2xl">{p.price} ₼</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
