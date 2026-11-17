import { PACKAGES } from "../data";

export default function Packages() {
  return (
    <section id="paketler" className="scroll-mt-10 border-y border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Paketlər</p>
        <h2 className="mt-4 font-display text-[clamp(36px,5vw,64px)] leading-none">Hər hekayəyə uyğun.</h2>
        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {PACKAGES.map((p) => (
            <div key={p.name} className={"flex flex-col p-10 " + (p.best ? "bg-muted" : "bg-card")}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-3xl">{p.name}</h3>
                {p.best && <span className="border border-primary px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">Seçilən</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.hours}</p>
              <p className="mt-8 font-display text-5xl">{String(p.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <span className="text-2xl text-muted-foreground">₼</span></p>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-foreground/85">
                {p.items.map((i) => <li key={i} className="border-b border-border pb-3">{i}</li>)}
              </ul>
              <a href="#elaqe" className={"mt-10 py-4 text-center text-xs uppercase tracking-[0.2em] transition-colors " + (p.best ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:border-primary hover:text-primary")}>Bron et</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
