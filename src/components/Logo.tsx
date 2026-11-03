import Link from "next/link";
import { LOGO, KNOT_COLORS } from "./carpet/patterns";

/** Novo mark — a 9×9 woven göl with a nar seed in the centre. Pure knots, no gradients. */
export function LogoMark({ className = "size-7" }: { className?: string; animated?: boolean }) {
  const rects: React.ReactNode[] = [];
  LOGO.forEach((row, y) =>
    row.split("").forEach((k, x) => {
      if (k === ".") return;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={KNOT_COLORS[k as keyof typeof KNOT_COLORS]} />);
    })
  );
  return (
    <svg viewBox="0 0 9 9" className={className} shapeRendering="crispEdges" aria-hidden>
      {rects}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[21px] font-semibold leading-none tracking-[-0.02em] [font-variation-settings:'SOFT'_100,'WONK'_1] ${className}`}>
      novo<span className="font-normal italic text-nar">code</span>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Novo Code ana səhifə">
      <LogoMark className="size-7" />
      <Wordmark />
    </Link>
  );
}
