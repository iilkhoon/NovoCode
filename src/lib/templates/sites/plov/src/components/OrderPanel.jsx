import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBasket, X } from "lucide-react";
import { DISHES, ZONES } from "../data";
import { useOrder } from "@/lib/order";
import { db } from "@/lib/db";

const FEES = [0, 3, 5];

export default function OrderPanel({ open, onClose, onOpen }) {
  const { order, clear, count } = useOrder();
  const [zone, setZone] = useState(0);
  const [placed, setPlaced] = useState(null);
  const items = DISHES.filter((d) => order[d.id]).map((d) => ({ ...d, qty: order[d.id] }));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = zone === 0 && subtotal >= 30 ? 0 : FEES[zone] || 0;

  const submit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setPlaced(db.collection("orders").add({ ...data, zone: ZONES[zone][0], items: items.map(({ name, qty }) => ({ name, qty })), total: subtotal + fee }));
    clear();
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary";

  return (
    <>
      {count > 0 && !open && (
        <button onClick={onOpen} className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-2xl">
          <ShoppingBasket className="size-5" /> Səbət · {count} · {subtotal} ₼
        </button>
      )}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/60" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 320 }} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card" role="dialog" aria-label="Sifariş">
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-display text-2xl font-bold">Sifarişiniz</h2>
                <button onClick={onClose} aria-label="Bağla"><X /></button>
              </div>
              {placed ? (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-7" /></span>
                  <p className="mt-5 font-display text-3xl font-bold">Sobaya göndərildi!</p>
                  <p className="mt-2 text-muted-foreground">Sifariş №{placed.id.slice(0, 5).toUpperCase()} · {ZONES[zone][1]} ərzində çatdırılacaq.</p>
                  <button onClick={() => (setPlaced(null), onClose())} className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-semibold">Bağla</button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <ShoppingBasket className="size-10" />
                  <p className="mt-4">Səbət boşdur — menyudan yemək seçin.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto">
                  <ul className="divide-y divide-border px-6">
                    {items.map((i) => (
                      <li key={i.id} className="flex justify-between py-3 text-sm"><span>{i.qty} × {i.name}</span><span>{i.qty * i.price} ₼</span></li>
                    ))}
                  </ul>
                  <div className="grid gap-3 px-6 py-5">
                    <select value={zone} onChange={(e) => setZone(Number(e.target.value))} className={field} aria-label="Çatdırılma zonası">
                      {ZONES.map(([area, time], i) => <option key={area} value={i}>{area} · {time}</option>)}
                    </select>
                    <input required name="address" autoComplete="street-address" placeholder="Ünvan" className={field} />
                    <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
                  </div>
                  <div className="mt-auto border-t border-border px-6 py-5">
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Çatdırılma</span><span>{fee ? `${fee} ₼` : "Pulsuz"}</span></div>
                    <div className="mt-1 flex justify-between text-lg font-semibold"><span>Cəmi</span><span>{subtotal + fee} ₼</span></div>
                    <button className="mt-4 w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground">Sifariş et · nağd və ya kartla</button>
                  </div>
                </form>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
