import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

const COLS = [
  { t: "Məhsul", l: [["Necə işləyir", "#necə-işləyir"], ["Studio", "#studio"], ["Nümunələr", "#nümunələr"], ["Qiymətlər", "#qiymətlər"]] },
  { t: "Resurslar", l: [["Suallar", "#suallar"], ["Dizayn sistemi", "/dizayn"]] },
  { t: "Əlaqə", l: [["salam@novocode.az", "mailto:salam@novocode.az"]] },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink-100/10 bg-ink-1000/70 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 sm:px-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-7" />
            <Wordmark />
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-400">Azərbaycan dilində AI sayt qurucusu. Sözlə de — sayt doğulsun.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.t} className="md:col-span-2">
            <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500">{c.t}</div>
            <ul className="space-y-2.5">
              {c.l.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[14px] text-ink-300 transition-colors duration-200 hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100/[0.06]">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-2 px-6 py-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-500 sm:flex-row sm:px-14">
          <span>© {new Date().getFullYear()} Novo Code · Bakı</span>
          <span>Azərbaycan dili · AZN</span>
        </div>
      </div>
    </footer>
  );
}
