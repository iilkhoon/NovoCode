import { useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useCollection } from "@/lib/db";
import { azn } from "../seed";

const STATUS = { Aktiv: "bg-emerald-50 text-emerald-700", Potensial: "bg-amber-50 text-amber-700", Passiv: "bg-zinc-100 text-zinc-600" };

export default function Customers() {
  const [customers, col] = useCollection("customers");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Hamısı");
  const [adding, setAdding] = useState(false);
  const list = customers.filter((c) => (status === "Hamısı" || c.status === status) && `${c.name} ${c.contact} ${c.city}`.toLowerCase().includes(q.toLowerCase()));

  const add = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    col.add({ ...d, value: Number(d.value) || 0 });
    setAdding(false);
  };

  const field = "w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Müştərilər</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-90"><Plus className="size-4" /> Yeni müştəri</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <label className="flex min-w-60 flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 focus-within:border-primary">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ad, şəxs və ya şəhər…" className="w-full bg-transparent py-2 text-sm outline-none" />
        </label>
        <div className="flex rounded-lg border border-border bg-card p-0.5 text-sm">
          {["Hamısı", "Aktiv", "Potensial", "Passiv"].map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={"rounded-md px-3 py-1.5 font-medium transition-colors " + (status === s ? "bg-muted text-foreground" : "text-muted-foreground")}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-5 py-3 font-medium">Şirkət</th><th className="px-5 py-3 font-medium">Əlaqə</th><th className="px-5 py-3 font-medium">Şəhər</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Dəyər</th><th className="w-12" /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => (
              <tr key={c.id} className="group hover:bg-muted/60">
                <td className="px-5 py-3.5 font-medium">{c.name}</td>
                <td className="px-5 py-3.5"><span className="block">{c.contact}</span><span className="text-xs text-muted-foreground">{c.phone}</span></td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.city}</td>
                <td className="px-5 py-3.5"><span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (STATUS[c.status] ?? STATUS.Passiv)}>{c.status}</span></td>
                <td className="px-5 py-3.5 text-right font-medium tabular-nums">{azn(c.value)}</td>
                <td className="pr-3"><button onClick={() => col.remove(c.id)} className="grid size-8 place-items-center rounded-lg text-muted-foreground opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" aria-label={`${c.name} sil`}><Trash2 className="size-4" /></button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-muted-foreground">Heç nə tapılmadı.</td></tr>}
          </tbody>
        </table>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setAdding(false)}>
          <form onSubmit={add} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Yeni müştəri</h2><button type="button" onClick={() => setAdding(false)} aria-label="Bağla"><X className="size-5" /></button></div>
            <div className="mt-5 grid gap-3">
              <input required name="name" placeholder="Şirkət adı" className={field} />
              <input required name="contact" placeholder="Əlaqə şəxsi" className={field} />
              <div className="grid grid-cols-2 gap-3"><input name="phone" placeholder="Telefon" className={field} /><input name="city" placeholder="Şəhər" defaultValue="Bakı" className={field} /></div>
              <div className="grid grid-cols-2 gap-3">
                <select name="status" className={field}><option>Potensial</option><option>Aktiv</option><option>Passiv</option></select>
                <input name="value" type="number" min="0" placeholder="Dəyər, ₼" className={field} />
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-white">Əlavə et</button>
          </form>
        </div>
      )}
    </div>
  );
}
