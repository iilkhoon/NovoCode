export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
        <p className="font-display text-4xl font-semibold italic">Nərgiz</p>
        <p className="text-sm text-white/70">Nizami küç. 77, Nəsimi, Bakı<br />+994 55 777 07 07</p>
        <p className="text-sm text-white/70">Hər gün 10:00 – 20:00<br />Bazar ertəsi — 12:00-dan</p>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">© {new Date().getFullYear()} Nərgiz Gözəllik Salonu</p>
    </footer>
  );
}
