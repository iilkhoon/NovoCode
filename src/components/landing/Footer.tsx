import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { Border } from "./Border";

const COLS = [
  { t: "Məhsul", l: [["Necə işləyir", "#necə-işləyir"], ["Studio", "#studio"], ["Nümunələr", "#nümunələr"], ["Qiymətlər", "#qiymətlər"]] },
  { t: "Resurslar", l: [["Suallar", "#suallar"], ["Dizayn sistemi", "/dizayn"]] },
  { t: "Əlaqə", l: [["salam@novocode.az", "mailto:salam@novocode.az"]] },
];

export function Footer() {
  return (
    <footer className="mt-0">
      <Border weave={false} />
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <Wordmark />
          </div>
          <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-ink-400">Azərbaycan dilində AI sayt qurucusu. Sözlə deyin, saytınız toxunsun.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.t} className="md:col-span-2">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">{c.t}</div>
            <ul className="space-y-2">
              {c.l.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[14.5px] text-ink-200 underline-offset-4 hover:text-nar hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100/15">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-2 px-5 py-6 font-mono text-[11px] text-ink-500 sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} Novo Code · Bakı</span>
          <span>Azərbaycan dili · AZN</span>
        </div>
      </div>
    </footer>
  );
}
