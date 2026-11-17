import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";

const LINKS = [["Xidmətlər", "#xidmetler"], ["Həkimlər", "#hekimler"], ["Suallar", "#suallar"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-white">G</span><span>gülüş<span className="text-primary">.</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="hover:text-foreground">{l}</a>)}
          <a href="tel:+994125550101" className="flex items-center gap-2 text-foreground"><Phone className="size-4 text-primary" /> (012) 555 01 01</a>
        </nav>
        <a href="#randevu" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5 md:inline-block">Randevu al</a>
        <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center md:hidden" aria-label="Menyu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="border-t border-border px-5 py-3 md:hidden">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 font-medium">{l}</a>)}
          <a href="#randevu" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-primary py-3 text-center font-semibold text-white">Randevu al</a>
        </nav>
      )}
    </header>
  );
}
