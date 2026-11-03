import Link from "next/link";
import { useId } from "react";

/**
 * Novo mark — a pomegranate (nar) with its crown; the body carries a bold "N"
 * whose diagonal is a single seed-shaped highlight. Works from 16px to 512px.
 */
export function LogoMark({ className = "size-8", animated = false }: { className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={`b${id}`} x1="8" y1="10" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff5c7a" />
          <stop offset="0.55" stopColor="#ff3b5c" />
          <stop offset="1" stopColor="#ff7a45" />
        </linearGradient>
        <linearGradient id={`c${id}`} x1="16" y1="2" x2="32" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd16b" />
          <stop offset="1" stopColor="#ff7a45" />
        </linearGradient>
        <radialGradient id={`h${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17 20) rotate(50) scale(16 12)">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* crown */}
      <path d="M17.5 13.5 16.6 5.2l4.2 3.4L24 3l3.2 5.6 4.2-3.4-.9 8.3z" fill={`url(#c${id})`} />
      {/* body */}
      <circle cx="24" cy="28.5" r="17" fill={`url(#b${id})`} />
      <circle cx="24" cy="28.5" r="17" fill={`url(#h${id})`} />
      {/* N */}
      <path d="M17 36V21.5l14 15V21" stroke="#0d0c13" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      {animated && (
        <circle cx="24" cy="28.5" r="17" stroke="#ff3b5c" strokeOpacity="0.6" className="origin-center animate-pulse-ring" style={{ transformBox: "fill-box" }} />
      )}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[17px] font-semibold tracking-[-0.03em] ${className}`}>
      novo<span className="font-normal text-ink-300">code</span>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2" aria-label="Novo Code ana səhifə">
      <LogoMark className="size-8 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110" />
      <Wordmark />
    </Link>
  );
}
