"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Headline that rises in letter by letter (blur 10px → 0, 0.5em → 0) the first time it
 * enters the viewport. Pass lines as an array; wrap emphasis in *asterisks*.
 */
export function SplitTitle({ lines, as: Tag = "h2", className, immediate = false }: { lines: string[]; as?: "h1" | "h2" | "h3"; className?: string; immediate?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (immediate) {
      const t = setTimeout(() => setOn(true), 80);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  let n = 0;
  return (
    <Tag ref={ref} className={cn("font-display font-normal tracking-[-0.04em]", className)} aria-label={lines.join(" ").replace(/\*/g, "")}>
      {lines.map((line, li) => {
        // tokenise into words, remembering which ones sit inside *emphasis*
        const words: { w: string; em: boolean }[] = [];
        line.split(/(\*[^*]+\*)/).forEach((seg) => {
          const em = seg.startsWith("*") && seg.endsWith("*") && seg.length > 1;
          (em ? seg.slice(1, -1) : seg).split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, em }));
        });
        return (
          <span key={li} className="block" aria-hidden>
            {words.map(({ w, em }, wi) => (
              <span key={wi}>
                <span className={cn("inline-block whitespace-nowrap", em && "text-ink-400")}>
                  {w.split("").map((ch) => {
                    const d = n++ * 28;
                    return (
                      <span
                        key={d}
                        className="inline-block transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                        style={{ transitionDelay: `${d}ms`, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(0.5em)", filter: on ? "none" : "blur(10px)" }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
                {wi < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
