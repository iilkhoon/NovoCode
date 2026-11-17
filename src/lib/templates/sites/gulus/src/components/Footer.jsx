import { Clock, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-2xl font-extrabold">gülüş<span className="text-accent">.</span></p>
          <p className="mt-3 max-w-sm text-sm text-white/60">Ailəvi stomatologiya klinikası. 2012-dən bəri Bakıda.</p>
        </div>
        <ul className="space-y-3 text-sm text-white/80">
          <li className="flex gap-2"><MapPin className="size-4 shrink-0 text-accent" /> Nərimanov pr. 24, Bakı</li>
          <li className="flex gap-2"><Phone className="size-4 shrink-0 text-accent" /> (012) 555 01 01</li>
        </ul>
        <ul className="space-y-3 text-sm text-white/80">
          <li className="flex gap-2"><Clock className="size-4 shrink-0 text-accent" /> B.e.–Şənbə 09:00–19:00</li>
          <li className="pl-6 text-white/50">Bazar — təcili hallar</li>
        </ul>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-white/40">© {new Date().getFullYear()} Gülüş Dental</p>
    </footer>
  );
}
