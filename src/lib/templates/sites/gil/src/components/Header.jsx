import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function Header({ onCart }) {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="font-display font-semibold text-3xl leading-none">gil.</a>
        <nav className="hidden gap-9 text-sm text-muted-foreground md:flex">
          <a href="#kataloq" className="hover:text-foreground">Kataloq</a>
          <a href="#emalatxana" className="hover:text-foreground">Emalatxana</a>
          <a href="#elaqe" className="hover:text-foreground">Əlaqə</a>
        </nav>
        <button onClick={onCart} className="relative flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted" aria-label={`Səbət, ${count} məhsul`}>
          <ShoppingBag className="size-4" />
          <span className="hidden sm:inline">Səbət</span>
          {count > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white">{count}</span>}
        </button>
      </div>
    </header>
  );
}
