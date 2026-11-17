import { useState } from "react";
import { BarChart3, Kanban, LayoutDashboard, LogOut, Menu, Users, X } from "lucide-react";
import { signOut } from "@/lib/auth";

const NAV = [
  ["overview", "Panel", LayoutDashboard],
  ["customers", "Müştərilər", Users],
  ["deals", "Sövdələşmələr", Kanban],
];

export default function Shell({ page, onPage, user, children }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="grid gap-1">
      {NAV.map(([id, label, Icon]) => (
        <button key={id} onClick={() => (onPage(id), setOpen(false))} className={"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " + (page === id ? "bg-primary/10 text-emerald-700" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </nav>
  );
  const me = (
    <div className="flex items-center gap-3 border-t border-border pt-4">
      <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-bold text-emerald-700">{user.name?.[0]?.toUpperCase() ?? "?"}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <button onClick={signOut} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Çıxış" title="Çıxış"><LogOut className="size-4" /></button>
    </div>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-border bg-card p-4 lg:flex">
        <div>
          <div className="mb-8 flex items-center gap-2 px-2 pt-1 text-lg font-bold"><span className="grid size-8 place-items-center rounded-lg bg-primary text-white"><BarChart3 className="size-4" /></span> satış</div>
          {nav}
        </div>
        {me}
      </aside>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <span className="flex items-center gap-2 font-bold"><span className="grid size-7 place-items-center rounded-lg bg-primary text-white"><BarChart3 className="size-3.5" /></span> satış</span>
        <button onClick={() => setOpen(true)} aria-label="Menyu"><Menu /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col justify-between bg-card p-4">
            <div>
              <button onClick={() => setOpen(false)} className="mb-6 ml-auto block" aria-label="Bağla"><X /></button>
              {nav}
            </div>
            {me}
          </div>
        </div>
      )}
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
