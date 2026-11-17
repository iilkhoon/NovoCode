import { ShoppingBasket } from "lucide-react";
import { useOrder } from "@/lib/order";

export default function Header({ onOrder }) {
  const { count } = useOrder();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="font-display text-2xl font-bold">Plov<span className="text-primary">.</span>House</a>
        <nav className="hidden gap-9 text-sm text-muted-foreground md:flex">
          <a href="#menyu" className="hover:text-foreground">Menyu</a>
          <a href="#catdirilma" className="hover:text-foreground">Çatdırılma</a>
          <a href="#rezerv" className="hover:text-foreground">Rezervasiya</a>
        </nav>
        <button onClick={onOrder} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <ShoppingBasket className="size-4" /> Sifariş{count > 0 && <span className="rounded-full bg-primary-foreground px-1.5 text-xs text-primary">{count}</span>}
        </button>
      </div>
    </header>
  );
}
