import Link from "next/link";

/** 7×7 dot-matrix "N": 1 = full dot, 0 = faint grid dot. */
const N_GRID = ["1000001", "1100001", "1010001", "1001001", "1000101", "1000011", "1000001"];

/** Novo mark — a dot-matrix N, drawn in currentColor. */
export function NMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden fill="currentColor">
      {N_GRID.flatMap((row, y) =>
        row.split("").map((c, x) => <circle key={`${x}-${y}`} cx={5 + x * 10} cy={5 + y * 10} r={c === "1" ? 3.6 : 1.2} opacity={c === "1" ? 1 : 0.22} />)
      )}
    </svg>
  );
}

/** Mark on a white disc with a soft shadow (nav, studio, footer). */
export function LogoMark({ className = "size-7" }: { className?: string; animated?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-white text-black shadow-[var(--shadow-nav)] ${className}`} aria-hidden>
      <NMark className="size-[58%]" />
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display text-[17px] tracking-[-0.02em] ${className}`}>Novo&nbsp;Code</span>;
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Novo Code ana səhifə">
      <LogoMark className="size-8" />
      <Wordmark />
    </Link>
  );
}
