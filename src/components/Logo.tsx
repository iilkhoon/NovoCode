import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * NovoCode mark — a lowercase "n" arch followed by a text caret, on a dawn-gradient tile.
 * Reads as "n_": a sentence being typed. Pure SVG (no font), so it renders the same in
 * the favicon, the app and print.
 */
export function NMark({ className = "size-5", blink = false }: { className?: string; blink?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <path d="M17 46V30a10.5 10.5 0 0 1 21 0v16" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44.5" y="37" width="7.5" height="9.5" rx="1.6" fill="currentColor" className={blink ? "animate-blink" : undefined} />
    </svg>
  );
}

/** The tile: warm gradient + inner highlight. */
export function LogoMark({ className = "size-7", blink = false }: { className?: string; animated?: boolean; blink?: boolean }) {
  const id = "nv-g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", className)} aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={id} x1="6" y1="4" x2="58" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffc595" />
            <stop offset="0.45" stopColor="#f07a46" />
            <stop offset="1" stopColor="#c2402a" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="62" height="62" rx="19" fill={`url(#${id})`} />
        <rect x="1.5" y="1.5" width="61" height="61" rx="18.5" fill="none" stroke="#fff" strokeOpacity=".35" />
      </svg>
      <NMark className="relative size-[78%] text-[#fffaf2]" blink={blink} />
    </span>
  );
}

/** "Novo" in the serif (human words) + "code" in mono (machine) + a live caret. */
export function Wordmark({ className = "", caret = true }: { className?: string; caret?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline whitespace-nowrap leading-none text-ink-100", className)} aria-label="NovoCode">
      <span aria-hidden className="font-display text-[1.25em] font-[600] tracking-[-0.03em] [font-variation-settings:'opsz'_72]">
        Novo
      </span>
      <span aria-hidden className="ml-[0.08em] font-label text-[0.82em] font-[500] tracking-[-0.04em] text-ink-400">
        code
      </span>
      {caret && <span aria-hidden className="nv-caret !h-[0.78em] !w-[0.36em]" />}
    </span>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5 text-[17px]", className)} aria-label="NovoCode ana səhifə">
      <LogoMark className="size-8 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6" />
      <Wordmark />
    </Link>
  );
}
