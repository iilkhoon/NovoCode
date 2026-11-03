import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

const COLS = [
  { t: "Məhsul", l: [["İmkanlar", "#imkanlar"], ["Şablonlar", "#şablonlar"], ["Qiymətlər", "#qiymətlər"], ["Dizayn sistemi", "/dizayn"]] },
  { t: "Resurslar", l: [["Necə işləyir", "#necə-işləyir"], ["Suallar", "#suallar"], ["Yol xəritəsi", "#"], ["Bloq (tezliklə)", "#"]] },
  { t: "Şirkət", l: [["Haqqımızda", "#"], ["Əlaqə", "mailto:salam@novocode.az"], ["Məxfilik siyasəti", "#"], ["İstifadə şərtləri", "#"]] },
];

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/6">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="size-8" />
            <Wordmark />
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-400">Azərbaycanın AI sayt qurucusu. Danışın — saytınız qurulsun.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-1.5 text-xs text-ink-400">
            🇦🇿 Bakı, Azərbaycan
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.t}>
            <div className="mb-4 text-[13px] font-medium text-ink-200">{c.t}</div>
            <ul className="space-y-2.5">
              {c.l.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[14px] text-ink-400 transition hover:text-ink-100">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none select-none text-center font-display text-[22vw] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.025]">novo</div>
      </div>
      <div className="border-t border-white/6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-ink-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Novo Code. Bakıda ❤️ ilə hazırlanıb.</span>
          <span>Azərbaycan dili · ₼ AZN</span>
        </div>
      </div>
    </footer>
  );
}
