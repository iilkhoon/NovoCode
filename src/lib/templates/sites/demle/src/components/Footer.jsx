export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground">
        <span className="font-display text-2xl italic text-foreground">dəmlə.</span>
        <span>Nizami küçəsi 42, Bakı · Hər gün 08:00–23:00</span>
        <span>© {new Date().getFullYear()} Dəmlə</span>
      </div>
    </footer>
  );
}
