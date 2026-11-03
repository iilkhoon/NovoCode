"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#imkanlar", label: "İmkanlar" },
  { href: "#necə-işləyir", label: "Necə işləyir" },
  { href: "#şablonlar", label: "Şablonlar" },
  { href: "#qiymətlər", label: "Qiymətlər" },
  { href: "#suallar", label: "Suallar" },
];

export function Navbar({ hasProjects }: { hasProjects: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
    >
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-500",
          scrolled ? "border border-white/8 bg-ink-950/80 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl backdrop-saturate-150" : "border border-transparent"
        )}
      >
        <Logo />
        <div className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[13.5px] text-ink-300 transition hover:bg-white/5 hover:text-ink-100">
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
          <ButtonLink href="#başla" variant="white" size="sm" className="hidden sm:inline-flex">
            Pulsuz başla
          </ButtonLink>
          <Button variant="ghost" size="sm" className="px-2 md:hidden" aria-label="Menyu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-17 items-center justify-between px-6 pt-3">
              <Logo />
              <Button variant="ghost" size="sm" className="px-2" aria-label="Bağla" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-1 px-6 pt-6">
              {[...LINKS, ...(hasProjects ? [{ href: "#layihələrim", label: "Layihələrim" }] : [])].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                  className="border-b border-white/5 py-4 font-display text-2xl tracking-tight"
                >
                  {l.label}
                </motion.a>
              ))}
              <ButtonLink href="#başla" onClick={() => setOpen(false)} size="lg" className="mt-8">
                Pulsuz başla
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
