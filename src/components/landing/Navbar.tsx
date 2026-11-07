"use client";
import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#necə-işləyir", label: "Necə işləyir" },
  { href: "#studio", label: "Studio" },
  { href: "#nümunələr", label: "Nümunələr" },
  { href: "#qiymətlər", label: "Qiymətlər" },
];

export function Navbar({ hasProjects }: { hasProjects: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500", scrolled && "bg-ink-1000/45 backdrop-blur-md")}>
      <nav className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-6 sm:px-14">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && <span className="size-[3px] rounded-full bg-ink-100/25" />}
              <a href={l.href} className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-200 transition-colors duration-200 hover:text-ink">
                {l.label}
              </a>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {hasProjects && (
            <a href="#layihələrim" className="hidden text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-300 hover:text-ink sm:inline">
              Layihələrim
            </a>
          )}
          <a href="#başla" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-1000 transition-transform duration-150 ease-out hover:scale-[1.04] active:scale-[0.97]">
            Başla <span className="size-1.5 rounded-full border border-ink-1000" />
          </a>
          <button className="grid size-9 place-items-center rounded-full text-ink md:hidden" aria-label="Menyu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-ink-1000/95 backdrop-blur-xl md:hidden">
            <div className="flex h-[70px] items-center justify-between px-6">
              <Logo />
              <button className="grid size-9 place-items-center" aria-label="Bağla" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 pt-6">
              {[...LINKS, ...(hasProjects ? [{ href: "#layihələrim", label: "Layihələrim" }] : [])].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-baseline gap-4 border-b border-ink-100/10 py-5"
                >
                  <span className="font-mono text-xs text-nar-300">0{i + 1}</span>
                  <span className="font-display text-4xl font-light">{l.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
