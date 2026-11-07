"use client";
import { useEffect, useRef } from "react";

const LINES = 5;
const DASHES = 4;

/** Hairline grid with drifting dots, stories-style progress, and a double-ring cursor. */
export function Overlay() {
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const inner = useRef<HTMLDivElement>(null);
  const outer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2, ox = cx, oy = cy;
    let raf = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (inner.current) inner.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      const el = e.target as HTMLElement | null;
      const h = !!el?.closest("a, button, [role=button]");
      if (h !== hovering && outer.current) {
        hovering = h;
        outer.current.dataset.hover = h ? "true" : "false";
      }
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let cur = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const goal = max > 0 ? window.scrollY / max : 0;
      cur = reduce ? goal : cur + (goal - cur) * 0.12;

      dots.current.forEach((dot, i) => {
        if (!dot) return;
        const start = ((i * 17) % 80) + 10;
        let speed = 90 + ((i * 55) % 180);
        if (i % 2 === 0) speed = -speed;
        const y = (((start + cur * speed) % 100) + 100) % 100;
        dot.style.top = `${y}%`;
      });
      fills.current.forEach((f, i) => {
        if (f) f.style.transform = `scaleY(${Math.max(0, Math.min(1, (cur - i / DASHES) * DASHES))})`;
      });
      if (fine && outer.current) {
        ox += (cx - ox) * 0.2;
        oy += (cy - oy) * 0.2;
        outer.current.style.transform = `translate3d(${ox}px, ${oy}px, 0) translate(-50%, -50%)`;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none">
      <div className="fixed inset-x-0 top-[70px] z-[5] h-px bg-ink-100/10" />
      <div className="fixed inset-y-0 left-5 right-5 z-[5] flex justify-between sm:left-10 sm:right-10">
        {Array.from({ length: LINES }).map((_, i) => (
          <div key={i} className={`relative w-px bg-ink-100/10 ${i === 2 ? "mt-[70px]" : ""} ${i === 1 || i === 3 ? "hidden md:block" : ""}`}>
            {[0, 1].map((k) => (
              <span
                key={k}
                ref={(el) => {
                  dots.current[i * 2 + k] = el;
                }}
                className="absolute left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-100/35"
              />
            ))}
            {i === LINES - 1 && (
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-3">
                {Array.from({ length: DASHES }).map((_, d) => (
                  <span key={d} className="relative block h-10 w-[2px] overflow-hidden rounded-full bg-ink-100/15">
                    <span
                      ref={(el) => {
                        fills.current[d] = el;
                      }}
                      className="absolute inset-0 origin-top rounded-full bg-ink-100"
                      style={{ transform: "scaleY(0)" }}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
        <div ref={inner} className="fixed left-0 top-0 z-[9999] size-[6px] rounded-full border-2 border-ink-100" style={{ transform: "translate3d(-100px,-100px,0)" }} />
        <div
          ref={outer}
          data-hover="false"
          className="fixed left-0 top-0 z-[9998] size-10 rounded-full border-[1.5px] border-ink-100/70 transition-[width,height,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-[hover=true]:size-16 data-[hover=true]:bg-ink-100/10"
          style={{ transform: "translate3d(-100px,-100px,0)" }}
        />
      </div>
    </div>
  );
}
