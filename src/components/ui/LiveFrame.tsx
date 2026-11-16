"use client";
import { useEffect, useRef, useState } from "react";

/** A live, non-interactive website thumbnail: the page renders at desktop width and is scaled to fit. */
export function LiveFrame({ src, title, width = 1280 }: { src: string; title: string; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / width));
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "200px" });
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [width]);
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {seen && scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width, height: width * 0.75, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
