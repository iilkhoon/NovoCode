import Link from "next/link";

/** Novo mark — a bronze disc with an N, circled by a thin orbit. */
export function LogoMark({ className = "size-7" }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <circle cx="16" cy="16" r="9.5" fill="#c98a52" />
      <path d="M12.4 20.5v-9l7.2 9v-9" stroke="#050505" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="16" cy="16" rx="15" ry="5.2" transform="rotate(-24 16 16)" stroke="#fff6ed" strokeOpacity=".55" strokeWidth=".9" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`text-[13px] font-semibold uppercase tracking-[0.32em] ${className}`}>Novo&nbsp;Code</span>;
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Novo Code ana səhifə">
      <LogoMark className="size-7" />
      <Wordmark />
    </Link>
  );
}
