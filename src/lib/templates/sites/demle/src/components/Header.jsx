import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  ["Menyu", "#menyu"],
  ["Hekayəmiz", "#hekaye"],
  ["Rəylər", "#reyler"],
  ["Əlaqə", "#rezervasiya"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={"sticky top-0 z-40 transition-colors duration-300 " + (scrolled ? "border-b border-border/70 bg-background/85 backdrop-blur-md" : "bg-transparent")}>
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4">
        <a href="#" className="font-display text-[28px] italic leading-none tracking-tight">dəmlə.</a>
        <nav className="hidden items-center gap-9 text-[15px] text-muted-foreground md:flex">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-foreground">{label}</a>
          ))}
        </nav>
        <a href="#rezervasiya" className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 md:inline-flex">
          Masa sifarişi
        </a>
        <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full md:hidden" aria-label={open ? "Menyunu bağla" : "Menyunu aç"}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3.5 text-lg">{label}</a>
          ))}
          <a href="#rezervasiya" onClick={() => setOpen(false)} className="mt-5 block rounded-full bg-primary py-3.5 text-center font-medium text-primary-foreground">Masa sifarişi</a>
        </nav>
      )}
    </header>
  );
}
