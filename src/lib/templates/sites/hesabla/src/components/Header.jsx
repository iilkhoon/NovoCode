import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [["İmkanlar", "#imkanlar"], ["Qiymətlər", "#qiymetler"], ["Suallar", "#suallar"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm text-white">H</span>
          hesabla
        </a>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground">Daxil ol</a>
          <a href="#demo" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">Pulsuz başla</a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menyu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="border-t border-border px-5 py-3 md:hidden">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3">{l}</a>)}
          <a href="#demo" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-primary py-3 text-center font-semibold">Pulsuz başla</a>
        </nav>
      )}
    </header>
  );
}
