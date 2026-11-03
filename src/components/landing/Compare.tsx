import { Reveal } from "@/components/ui/motion";
import { Container, SectionHead } from "./Section";
import { COMPARISON } from "./data";
import { cn } from "@/lib/cn";

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <span className="font-mono">Bəli</span>;
  if (v === false) return <span className="font-mono text-ink-500">Xeyr</span>;
  return <>{v}</>;
}

export function Compare() {
  return (
    <section className="py-24">
      <Container>
        <SectionHead no="06" label="Müqayisə" title={<>Həftələr yox, dəqiqələr. <em className="text-nar">Minlər yox, manatlar.</em></>} />
        <Reveal className="mt-14">
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-[1.5px] border-ink">
                  <th className="py-4 pr-4 font-normal" />
                  {COMPARISON.columns.map((c, i) => (
                    <th key={c} className={cn("px-5 py-4 font-mono text-[11.5px] font-normal uppercase tracking-[0.14em]", i === 2 ? "bg-nar text-wool" : "text-ink-400")}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((r) => (
                  <tr key={r.label} className="border-b border-ink-100/15">
                    <td className="py-4 pr-4 text-ink-300">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className={cn("px-5 py-4", i === 2 ? "bg-nar/[0.07] font-medium text-ink" : "text-ink-400")}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-6 md:hidden">
            {COMPARISON.rows.map((r) => (
              <div key={r.label} className="border-t border-ink-100/15 pt-4">
                <div className="font-medium">{r.label}</div>
                <dl className="mt-2 grid grid-cols-3 gap-2 text-[13px]">
                  {r.values.map((v, i) => (
                    <div key={i} className={cn("px-2 py-2", i === 2 ? "bg-nar text-wool" : "bg-ink-900 text-ink-300")}>
                      <dt className={cn("font-mono text-[9.5px] uppercase tracking-wider", i === 2 ? "text-wool/75" : "text-ink-500")}>{COMPARISON.columns[i]}</dt>
                      <dd className="mt-1"><Cell v={v} /></dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-ink-500">* Agentlik və freelancer qiymətləri Bakı bazarı üzrə təxmini aralıqlardır.</p>
        </Reveal>
      </Container>
    </section>
  );
}
