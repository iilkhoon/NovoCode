import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { img } from "@/lib/img";
import { db } from "@/lib/db";
import { COURSES, LEVELS } from "../data";

export default function Signup() {
  const [sent, setSent] = useState(null);
  const [level, setLevel] = useState("");
  useEffect(() => {
    const sync = () => setLevel(sessionStorage.getItem("lingo:level") || "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    db.collection("students").add(data);
    setSent(data);
  };

  const field = "w-full rounded-2xl border-2 border-foreground/15 bg-background px-4 py-3.5 outline-none focus:border-foreground";
  return (
    <section id="qeydiyyat" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-12 px-5 py-24 md:grid-cols-2">
      <img src={img("1523240795612-9a054b0db644", 900, 800)} alt="Kitabxanada tələbələr" loading="lazy" className="aspect-[9/8] w-full rounded-[2rem] border-2 border-foreground bg-muted object-cover" />
      <div>
        <h2 className="font-display text-[clamp(30px,4.5vw,52px)] font-bold tracking-[-0.02em]">Yerinizi tutun</h2>
        <p className="mt-3 text-muted-foreground">İlk dərs pulsuzdur. Bəyənməsəniz, heç nə ödəmirsiniz.</p>
        {sent ? (
          <div className="mt-8 rounded-3xl border-2 border-foreground bg-primary p-8">
            <PartyPopper className="size-8" />
            <p className="mt-4 font-display text-2xl font-bold">Təbriklər, {sent.name}!</p>
            <p className="mt-2">{sent.course} üçün müraciətiniz qəbul olundu. Pulsuz dərsin vaxtını SMS ilə göndərəcəyik.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-3">
            <input required name="name" autoComplete="name" placeholder="Ad və soyad" className={field} />
            <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="course" className={field}>{Object.values(COURSES).flat().map((c) => <option key={c.name}>{c.name}</option>)}</select>
              <select name="level" value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
                <option value="">Səviyyəm: bilmirəm</option>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button className="mt-2 rounded-full bg-foreground py-4 font-semibold text-background">Pulsuz dərsə yazıl</button>
          </form>
        )}
      </div>
    </section>
  );
}
