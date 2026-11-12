"use client";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#başla", label: "Ana səhifə" },
  { href: "#necə-işləyir", label: "Necə işləyir" },
  { href: "#nümunələr", label: "Nümunələr" },
  { href: "#qiymətlər", label: "Qiymətlər" },
];

/** Highlights the link whose section is currently in view. */
function useActiveSection() {
  const [active, setActive] = useState(LINKS[0].href);
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(decodeURIComponent(l.href.slice(1)))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Navbar({ hasProjects }: { hasProjects: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 720 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileLinks = [...LINKS, ...(hasProjects ? [{ href: "#layihələrim", label: "Layihələrim" }] : [])];

  return (
    <>
      {/* scrim so content scrolling under the floating pills stays out of the way */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 h-32 bg-gradient-to-b from-black via-black/75 to-transparent transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <header className="nv-slide fixed inset-x-0 top-0 z-50 px-[clamp(14px,3vw,32px)] pt-[clamp(16px,2.4vh,28px)]">
        <nav aria-label="Əsas" className="mx-auto flex max-w-[720px] items-center justify-between gap-[clamp(18px,2.8vw,28px)] min-[721px]:justify-center">
          <a href="#başla" aria-label="Novo Code ana səhifə" className="transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.04]">
            <LogoMark className="size-12 min-[721px]:size-[clamp(40px,4.4vw,46px)]" />
          </a>

          <div className="hidden h-[clamp(44px,5.2vw,48px)] max-w-[430px] flex-1 items-center justify-around rounded-full bg-white px-2 py-1 shadow-[var(--shadow-nav)] min-[721px]:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={cn(
                  "relative flex h-full items-center whitespace-nowrap px-[clamp(6px,1vw,12px)] text-[clamp(13px,1.4vw,15px)] font-medium tracking-[-0.01em] text-[#2e2e2e] transition-opacity duration-200",
                  active === l.href ? "nv-dots opacity-100" : "opacity-50 hover:opacity-75"
                )}
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href={hasProjects ? "#layihələrim" : "#başla"}
            className="hidden h-[clamp(44px,5.2vw,48px)] shrink-0 items-center rounded-full bg-pill px-[clamp(18px,2.2vw,24px)] text-[clamp(13px,1.4vw,15px)] font-medium tracking-[-0.01em] text-[#c8c8c8] shadow-[var(--shadow-nav)] transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-[#323234] hover:text-white min-[721px]:inline-flex"
          >
            {hasProjects ? "Layihələrim" : "Başla"}
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
            aria-expanded={open}
            aria-controls="mobil-menyu"
            className={cn(
              "relative z-[60] grid size-12 place-items-center rounded-full shadow-[var(--shadow-nav)] transition-colors duration-300 min-[721px]:hidden",
              open ? "bg-white" : "bg-pill"
            )}
          >
            {[-6, 0, 6].map((y, i) => (
              <span
                key={i}
                className={cn("absolute h-[1.5px] w-[18px] rounded-full transition-[transform,opacity,background-color] duration-300 ease-[var(--ease-out-expo)]", open ? "bg-black" : "bg-white")}
                style={{ transform: open ? (i === 1 ? "scaleX(0)" : `rotate(${i === 0 ? 45 : -45}deg)`) : `translateY(${y}px)`, opacity: open && i === 1 ? 0 : 1 }}
              />
            ))}
          </button>
        </nav>
      </header>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] [animation:nv-fade_0.28s_ease_both] min-[721px]:hidden" onClick={() => setOpen(false)} />
          <nav
            id="mobil-menyu"
            aria-label="Mobil"
            className="fixed left-1/2 top-[calc(clamp(16px,2.4vh,28px)+62px)] z-50 flex w-[min(360px,calc(100%-28px))] -translate-x-1/2 flex-col rounded-[28px] bg-white px-[18px] pb-5 pt-[22px] shadow-[0_20px_60px_rgb(0_0_0/0.45)] min-[721px]:hidden"
          >
            <div className="flex flex-col [animation:nv-menu_0.38s_var(--ease-out-expo)_both]">
              {mobileLinks.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ animation: `nv-line 0.4s var(--ease-out-expo) ${0.08 + i * 0.05}s forwards` }}
                  className={cn(
                    "relative block translate-y-2 pb-[17px] pt-[13px] text-center text-[17px] font-medium tracking-[-0.01em] opacity-0 [&.nv-dots::after]:bottom-2",
                    active === l.href ? "nv-dots text-[#2e2e2e]" : "text-[#2e2e2e]/55"
                  )}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#başla"
                onClick={() => setOpen(false)}
                style={{ animation: `nv-line 0.4s var(--ease-out-expo) ${0.08 + mobileLinks.length * 0.05}s forwards` }}
                className="mt-2.5 flex h-[50px] translate-y-2 items-center justify-center rounded-full bg-pill text-[15px] font-medium text-[#c8c8c8] opacity-0"
              >
                Sayt qurmağa başla
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
