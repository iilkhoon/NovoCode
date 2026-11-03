"use client";
import { useEffect, useRef, useState } from "react";
import { KNOT_COLORS, type Pattern } from "./patterns";

interface Props {
  pattern: Pattern;
  /** knot size in px when rendered at 1x (SVG scales anyway) */
  className?: string;
  /** reveal row by row like weaving when scrolled into view */
  weave?: boolean;
  /** ms per row */
  speed?: number;
  /** draw tiny gaps between knots (looks like woven wool) */
  gap?: number;
  title?: string;
}

/** Renders a knot pattern as crisp SVG rectangles. */
export function Knots({ pattern, className, weave = false, speed = 45, gap = 0.08, title }: Props) {
  const h = pattern.length;
  const w = pattern[0]?.length ?? 0;
  const ref = useRef<SVGSVGElement>(null);
  const [rows, setRows] = useState(weave ? 0 : h);

  useEffect(() => {
    if (!weave) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setRows(h);
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let r = 0;
        t = setInterval(() => {
          r++;
          setRows(r);
          if (r >= h) clearInterval(t);
        }, speed);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) clearInterval(t);
    };
  }, [weave, h, speed]);

  const rects: React.ReactNode[] = [];
  // weave from the bottom up, like a real loom
  for (let y = h - 1; y >= 0; y--) {
    if (h - 1 - y >= rows) break;
    const row = pattern[y];
    for (let x = 0; x < w; x++) {
      const k = row[x] as keyof typeof KNOT_COLORS | ".";
      if (k === ".") continue;
      rects.push(<rect key={`${x}-${y}`} x={x + gap / 2} y={y + gap / 2} width={1 - gap} height={1 - gap} fill={KNOT_COLORS[k]} />);
    }
  }
  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className={className} shapeRendering="crispEdges" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {rects}
    </svg>
  );
}
