export default function Footer() {
  return (
    <footer id="elaqe" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <span className="font-display font-semibold text-5xl">gil.</span>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Şəkidə əl ilə hazırlanan keramika. Bakıya və bütün Azərbaycana çatdırılma.</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Əlaqə</p>
          <p className="mt-3 text-muted-foreground">+994 50 321 21 21</p>
          <p className="text-muted-foreground">salam@gil.az</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Emalatxana</p>
          <p className="mt-3 text-muted-foreground">M.F. Axundzadə küç. 18, Şəki</p>
          <p className="text-muted-foreground">Ç.a.–Şənbə, 10:00–18:00</p>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Gil Keramika</p>
    </footer>
  );
}
