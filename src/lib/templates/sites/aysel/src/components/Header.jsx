export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#" className="font-display text-xl italic tracking-wide">Aysel Məmmədova</a>
        <nav className="flex gap-6 text-xs uppercase tracking-[0.2em] text-foreground/80 sm:gap-10">
          <a href="#qalereya" className="hover:text-primary">Qalereya</a>
          <a href="#paketler" className="hover:text-primary">Paketlər</a>
          <a href="#elaqe" className="hidden hover:text-primary sm:inline">Əlaqə</a>
        </nav>
      </div>
    </header>
  );
}
