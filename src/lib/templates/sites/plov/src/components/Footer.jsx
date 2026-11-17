export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground">
        <span className="font-display text-xl font-bold text-foreground">Plov<span className="text-primary">.</span>House</span>
        <span>Füzuli küç. 51, Bakı · (012) 444 51 51 · Hər gün 11:00–00:00</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
