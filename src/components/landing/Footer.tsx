"use client";
import { useCopy } from "./copy";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

export function Footer() {
  const c = useCopy();
  const COLS = [
    { t: c.footer.product, l: [[c.footer.links[0], "#necə-işləyir"], [c.extra.studio, "#studio"], [c.footer.links[1], "#nümunələr"], [c.footer.links[2], "#qiymətlər"]] },
    { t: c.extra.resources, l: [[c.extra.faq, "#suallar"], [c.extra.designSystem, "/dizayn"]] },
    { t: c.footer.contact, l: [["salam@novocode.az", "mailto:salam@novocode.az"]] },
  ];
  return (
    <footer className="relative border-t border-ink-100/10 bg-ink-900/50">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 sm:px-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5 text-[17px]">
            <LogoMark className="size-8" />
            <Wordmark />
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-400">{c.footer.tagline}</p>
        </div>
        {COLS.map((c) => (
          <div key={c.t} className="md:col-span-2">
            <div className="mb-4 label-mono text-ink-500">{c.t}</div>
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
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-2 px-6 py-6 label-mono text-ink-500 sm:flex-row sm:px-14">
          <span>© {new Date().getFullYear()} NovoCode · Bakı</span>
          <span>{c.footer.locale}</span>
        </div>
      </div>
    </footer>
  );
}
