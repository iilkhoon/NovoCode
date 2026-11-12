"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#necə-işləyir", label: "Necə işləyir" },
  { href: "#studio", label: "Studio" },
  { href: "#nümunələr", label: "Nümunələr" },
  { href: "#qiymətlər", label: "Qiymətlər" },
];

/** Highlights the link whose section is currently in view. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(decodeURIComponent(l.href.slice(1)))).filter((e): e is HTMLElement => !!e);
    const hero = document.getElementById("başla");
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id === "başla" ? null : `#${hit.target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    [...els, ...(hero ? [hero] : [])].forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Navbar({ hasProjects }: { hasProjects: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 820 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileLinks = [...LINKS, ...(hasProjects ? [{ href: "#layihələrim", label: "Layihələrim" }] : [])];
  const cta = hasProjects ? { href: "#layihələrim", label: "Layihələrim" } : { href: "#başla", label: "Pulsuz başla" };

  return (
    <>
      <header className="nv-slide fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Əsas"
          className={cn(
            "mx-auto flex h-14 max-w-[1120px] items-center gap-3 rounded-full pl-4 pr-2 transition-[background-color,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)]",
            scrolled || open ? "glass border border-ink-100/10 shadow-[var(--shadow-nav)]" : "border border-transparent"
          )}
        >
          <Logo href="#başla" className="mr-auto text-[16px] min-[821px]:mr-0" />

          <div className="mx-auto hidden items-center gap-1 min-[821px]:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[14px] transition-colors duration-200",
                  active === l.href ? "text-ink-100" : "text-ink-400 hover:text-ink-100"
                )}
              >
                {active === l.href && <span className="absolute inset-0 -z-10 rounded-full bg-ink-100/[0.06] [animation:nv-fade_0.3s_ease_both]" />}
                {l.label}
              </a>
            ))}
          </div>

          <ThemeToggle />
          <a
            href={cta.href}
            className="group hidden h-10 items-center gap-1.5 rounded-full bg-pill pl-4 pr-3.5 text-[14px] font-medium text-wool transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-glow)] active:scale-[0.97] min-[821px]:inline-flex"
          >
            {cta.label}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
            aria-expanded={open}
            aria-controls="mobil-menyu"
            className="relative grid size-10 place-items-center rounded-full bg-pill min-[821px]:hidden"
          >
            {[-4, 4].map((y, i) => (
              <span
                key={i}
                className="absolute h-[1.5px] w-4 rounded-full bg-wool transition-transform duration-300 ease-[var(--ease-out-expo)]"
                style={{ transform: open ? `rotate(${i ? -45 : 45}deg)` : `translateY(${y}px)` }}
              />
            ))}
          </button>
        </nav>
      </header>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40 bg-wool/70 backdrop-blur-md [animation:nv-fade_0.28s_ease_both] min-[821px]:hidden" onClick={() => setOpen(false)} />
          <nav
            id="mobil-menyu"
            aria-label="Mobil"
            className="fixed inset-x-3 top-[76px] z-50 flex flex-col rounded-[28px] border border-ink-100/10 bg-ink-1000 p-3 shadow-[var(--shadow-panel)] [animation:nv-menu_0.38s_var(--ease-out-expo)_both] min-[821px]:hidden"
          >
            {mobileLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ animation: `nv-line 0.45s var(--ease-out-expo) ${0.05 + i * 0.045}s forwards` }}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-[22px] tracking-[-0.02em] opacity-0",
                  active === l.href ? "bg-ink-100/[0.05] text-ink-100" : "text-ink-300"
                )}
              >
                {l.label}
                <span className="font-label text-[10px] text-ink-500">0{i + 1}</span>
              </a>
            ))}
            <a
              href="#başla"
              onClick={() => setOpen(false)}
              style={{ animation: `nv-line 0.45s var(--ease-out-expo) ${0.05 + mobileLinks.length * 0.045}s forwards` }}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-pill text-[15px] font-medium text-wool opacity-0"
            >
              Sayt qurmağa başla <ArrowRight className="size-4" />
            </a>
          </nav>
        </>
      )}
    </>
  );
}
