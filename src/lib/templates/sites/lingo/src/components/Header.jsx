export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="font-display text-xl font-bold">lingo<span className="text-primary">.</span></a>
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#kurslar" className="hover:text-foreground">Kurslar</a>
          <a href="#test" className="hover:text-foreground">Səviyyə testi</a>
          <a href="#muellimler" className="hover:text-foreground">Müəllimlər</a>
        </nav>
        <a href="#qeydiyyat" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5">Qeydiyyat</a>
      </div>
    </header>
  );
}
