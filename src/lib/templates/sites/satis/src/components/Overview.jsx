import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useCollection } from "@/lib/db";
import { STAGES, azn } from "../seed";

const MONTHS = ["İyn", "İyl", "Avq", "Sen", "Okt", "Noy"];
const REVENUE = [8200, 9600, 8900, 11800, 12100, 14600];

export default function Overview({ onPage, user }) {
  const [customers] = useCollection("customers");
  const [deals] = useCollection("deals");
  const won = deals.filter((d) => d.stage === "Bağlandı").reduce((s, d) => s + Number(d.amount), 0);
  const pipeline = deals.filter((d) => d.stage !== "Bağlandı").reduce((s, d) => s + Number(d.amount), 0);
  const max = Math.max(...REVENUE);

  const kpis = [
    ["Müştərilər", customers.length, "+3 bu ay"],
    ["Açıq sövdələşmələr", azn(pipeline), `${deals.filter((d) => d.stage !== "Bağlandı").length} sövdələşmə`],
    ["Bağlanmış", azn(won), "bu rüb"],
    ["Konversiya", `${deals.length ? Math.round((deals.filter((d) => d.stage === "Bağlandı").length / deals.length) * 100) : 0}%`, "+4% ötən aya görə"],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-muted-foreground">Bu gün</p>
      <h1 className="text-2xl font-bold tracking-tight">Xoş gəldin, {user.name?.split(" ")[0]} 👋</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, hint]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp className="size-3" />{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Gəlir · son 6 ay</p>
            <p className="text-sm text-muted-foreground">{azn(REVENUE.reduce((a, b) => a + b, 0))}</p>
          </div>
          <div className="mt-6 flex h-52 items-end gap-3">
            {REVENUE.map((v, i) => (
              <div key={MONTHS[i]} className="group flex h-full flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{azn(v)}</span>
                <div className="flex w-full flex-1 items-end">
                  <div className={"w-full rounded-md transition-colors " + (i === REVENUE.length - 1 ? "bg-primary" : "bg-primary/25 group-hover:bg-primary/50")} style={{ height: `${(v / max) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Mərhələlər</p>
            <button onClick={() => onPage("deals")} className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">Lövhə <ArrowUpRight className="size-3.5" /></button>
          </div>
          <ul className="mt-5 space-y-4">
            {STAGES.map((s) => {
              const list = deals.filter((d) => d.stage === s);
              const sum = list.reduce((a, d) => a + Number(d.amount), 0);
              return (
                <li key={s}>
                  <div className="flex justify-between text-sm"><span>{s} <span className="text-muted-foreground">· {list.length}</span></span><span className="font-medium tabular-nums">{azn(sum)}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (sum / Math.max(1, won + pipeline)) * 100)}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 pt-5">
          <p className="font-semibold">Son müştərilər</p>
          <button onClick={() => onPage("customers")} className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">Hamısı <ArrowUpRight className="size-3.5" /></button>
        </div>
        <ul className="mt-3 divide-y divide-border">
          {[...customers].reverse().slice(0, 4).map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted font-semibold">{c.name[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{c.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{c.contact} · {c.city}</span>
              </span>
              <span className="font-medium tabular-nums">{azn(c.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
