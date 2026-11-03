import Link from "next/link";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  // Nar (pomegranate) inspired mark: a rounded seed with a code caret.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="nar-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6b78" />
          <stop offset="1" stopColor="#e5384a" />
        </linearGradient>
      </defs>
      <path d="M13 3.5h6l-1.2 3.2a12 12 0 1 1-3.6 0z" fill="url(#nar-g)" />
      <path d="M12 15.5l-3 3 3 3M20 15.5l3 3-3 3" stroke="#0e0e12" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark />
      <span className="text-[15px]">
        Novo<span className="text-ink-300 font-normal"> Code</span>
      </span>
    </Link>
  );
}
