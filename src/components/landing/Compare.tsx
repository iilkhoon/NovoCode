import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Container, Glass, SectionHead } from "./Section";
import { COMPARISON } from "./data";
import { cn } from "@/lib/cn";

function Cell({ v, hi }: { v: string | boolean; hi?: boolean }) {
  if (v === true) return <Check className={cn("size-4", hi ? "text-nar-300" : "text-ink-300")} />;
  if (v === false) return <Minus className="size-4 text-ink-500" />;
  return <>{v}</>;
}

export function Compare() {
  return (
    <section data-stage="far" className="relative py-36">
      <Container>
        <div className="lg:w-[60%]">
          <SectionHead no="06" label="Müqayisə" lines={["Həftələr yox, dəqiqələr.", "*Minlər yox, manatlar.*"]} />
        </div>
        <Reveal className="mt-14">
          <Glass className="hidden overflow-hidden md:block">
            <table className="w-full text-left text-[14.5px]">
              <thead>
                <tr className="border-b border-ink-100/10">
                  <th className="p-5" />
                  {COMPARISON.columns.map((c, i) => (
                    <th key={c} className={cn("p-5 font-mono text-[10.5px] font-normal uppercase tracking-[0.18em]", i === 2 ? "bg-nar/10 text-nar-300" : "text-ink-400")}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((r) => (
                  <tr key={r.label} className="border-b border-ink-100/[0.06] last:border-0">
                    <td className="p-5 text-ink-200">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className={cn("p-5", i === 2 ? "bg-nar/10 font-medium text-ink" : "text-ink-400")}>
                        <Cell v={v} hi={i === 2} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Glass>
          <div className="space-y-3 md:hidden">
            {COMPARISON.rows.map((r) => (
              <Glass key={r.label} className="p-4">
                <div className="text-[14.5px] font-medium">{r.label}</div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[12.5px]">
                  {r.values.map((v, i) => (
                    <div key={i} className={cn("rounded-lg px-2 py-2", i === 2 ? "bg-nar/15 text-ink" : "bg-ink-100/[0.04] text-ink-300")}>
                      <div className={cn("mb-1 font-mono text-[9px] uppercase tracking-wider", i === 2 ? "text-nar-300" : "text-ink-500")}>{COMPARISON.columns[i]}</div>
                      <Cell v={v} hi={i === 2} />
                    </div>
                  ))}
                </div>
              </Glass>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10.5px] text-ink-500">* Agentlik və freelancer qiymətləri Bakı bazarı üzrə təxmini aralıqlardır.</p>
        </Reveal>
      </Container>
    </section>
  );
}
