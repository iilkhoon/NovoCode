export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="font-display text-3xl font-semibold italic leading-none">Nərgiz</a>
        <nav className="hidden gap-9 text-sm text-muted-foreground md:flex">
          <a href="#xidmetler" className="hover:text-foreground">Xidmətlər</a>
          <a href="#ustalar" className="hover:text-foreground">Ustalar</a>
          <a href="#qalereya" className="hover:text-foreground">Qalereya</a>
        </nav>
        <a href="#randevu" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5">Randevu al</a>
      </div>
    </header>
  );
}
