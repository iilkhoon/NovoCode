"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#necə-işləyir", label: "Necə işləyir" },
  { href: "#studio", label: "Studio" },
  { href: "#nümunələr", label: "Nümunələr" },
  { href: "#qiymətlər", label: "Qiymətlər" },
  { href: "#suallar", label: "Suallar" },
];

export function Navbar({ hasProjects }: { hasProjects: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-50 bg-wool transition-[border-color] duration-300", scrolled ? "border-b border-ink-100/15" : "border-b border-transparent")}>
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[14px] text-ink-300 underline-offset-[6px] transition hover:text-ink hover:underline decoration-nar decoration-2">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {hasProjects && (
            <ButtonLink href="#layihələrim" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Layihələrim
            </ButtonLink>
          )}
          <ButtonLink href="#başla" variant="white" size="sm">
            Başla
          </ButtonLink>
          <Button variant="ghost" size="sm" className="px-2 md:hidden" aria-label="Menyu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-wool md:hidden">
            <div className="flex h-16 items-center justify-between px-5">
              <Logo />
              <Button variant="ghost" size="sm" className="px-2" aria-label="Bağla" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <div className="px-5 pt-4">
              {[...LINKS, ...(hasProjects ? [{ href: "#layihələrim", label: "Layihələrim" }] : [])].map((l, i) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-ink-100/15 py-4">
                  <span className="font-mono text-xs text-nar">0{i + 1}</span>
                  <span className="font-display text-3xl">{l.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
