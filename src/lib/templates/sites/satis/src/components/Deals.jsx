import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCollection } from "@/lib/db";
import { STAGES, azn } from "../seed";

export default function Deals() {
  const [deals, col] = useCollection("deals");
  const move = (d, dir) => col.update(d.id, { stage: STAGES[STAGES.indexOf(d.stage) + dir] });

  const add = (stage) => {
    const title = window.prompt("Sövdələşmənin adı");
    if (!title) return;
    const amount = Number(window.prompt("Məbləğ (₼)", "1000")) || 0;
    col.add({ title, company: "—", amount, stage });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold tracking-tight">Sövdələşmələr</h1>
      <p className="mt-1 text-sm text-muted-foreground">Kartı oxlarla mərhələlər arasında keçirin.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage, si) => {
          const list = deals.filter((d) => d.stage === stage);
          return (
            <section key={stage} className="flex flex-col rounded-xl bg-muted p-3">
              <header className="flex items-center justify-between px-1 pb-3">
                <h2 className="text-sm font-semibold">{stage} <span className="ml-1 rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">{list.length}</span></h2>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">{azn(list.reduce((s, d) => s + Number(d.amount), 0))}</span>
              </header>
              <div className="grid gap-2">
                {list.map((d) => (
                  <article key={d.id} className="rounded-lg border border-border bg-card p-3 shadow-sm">
                    <p className="text-sm font-semibold">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.company}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold tabular-nums">{azn(d.amount)}</span>
                      <span className="flex gap-1">
                        <button disabled={si === 0} onClick={() => move(d, -1)} className="grid size-7 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-30" aria-label="Geri mərhələ"><ChevronLeft className="size-4" /></button>
                        <button disabled={si === STAGES.length - 1} onClick={() => move(d, 1)} className="grid size-7 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-30" aria-label="Növbəti mərhələ"><ChevronRight className="size-4" /></button>
                      </span>
                    </div>
                  </article>
                ))}
                <button onClick={() => add(stage)} className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground hover:border-primary hover:text-emerald-700"><Plus className="size-4" /> Əlavə et</button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
