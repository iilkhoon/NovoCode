export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground">
        <span className="font-display text-lg font-bold text-foreground">hesabla</span>
        <span>Bakı · salam@hesabla.az</span>
        <span>© {new Date().getFullYear()} Hesabla</span>
      </div>
    </footer>
  );
}
