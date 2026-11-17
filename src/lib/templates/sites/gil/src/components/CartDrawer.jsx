import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { img } from "@/lib/img";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { db } from "@/lib/db";

const FREE_SHIPPING = 100;
const SHIPPING = 5;

export default function CartDrawer({ open, onClose }) {
  const { cart, set, clear } = useCart();
  const [step, setStep] = useState("cart"); // cart → checkout → done
  const [order, setOrder] = useState(null);
  const items = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })).filter((i) => i.name);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const placeOrder = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const saved = db.collection("orders").add({ ...data, items: items.map(({ id, name, qty, price }) => ({ id, name, qty, price })), total: subtotal + shipping, status: "yeni" });
    setOrder(saved);
    clear();
    setStep("done");
  };

  const close = () => {
    onClose();
    setTimeout(() => setStep("cart"), 300);
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-foreground";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px]" />
          <motion.aside
            role="dialog"
            aria-label="Səbət"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display font-semibold text-3xl">{step === "checkout" ? "Sifariş" : "Səbət"}</h2>
              <button onClick={close} className="grid size-9 place-items-center rounded-full hover:bg-muted" aria-label="Bağla"><X className="size-5" /></button>
            </div>

            {step === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent"><Check className="size-7" /></span>
                <h3 className="mt-6 font-display font-semibold text-3xl">Sifarişiniz qəbul olundu</h3>
                <p className="mt-3 text-muted-foreground">Sifariş №{order?.id.slice(0, 6).toUpperCase()}. Təsdiq üçün 1 saat ərzində zəng edəcəyik.</p>
                <button onClick={close} className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Alış-verişə davam et</button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-muted-foreground">
                <ShoppingBag className="size-10" />
                <p className="mt-4">Səbətiniz boşdur.</p>
                <button onClick={close} className="mt-6 text-sm font-medium text-foreground underline underline-offset-4">Kataloqa qayıt</button>
              </div>
            ) : step === "cart" ? (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
                  {items.map((i) => (
                    <li key={i.id} className="flex gap-4 py-5">
                      <img src={img(i.photo, 200, 200)} alt={i.name} className="size-20 rounded-xl bg-muted object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <span className="font-medium">{i.name}</span>
                          <span>{i.price * i.qty} ₼</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{i.note}</span>
                        <div className="mt-auto flex items-center gap-1 pt-2">
                          <button onClick={() => set(i.id, i.qty - 1)} className="grid size-8 place-items-center rounded-full border border-border hover:bg-muted" aria-label="Azalt"><Minus className="size-3.5" /></button>
                          <span className="w-8 text-center text-sm tabular-nums">{i.qty}</span>
                          <button onClick={() => set(i.id, i.qty + 1)} className="grid size-8 place-items-center rounded-full border border-border hover:bg-muted" aria-label="Artır"><Plus className="size-3.5" /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Totals subtotal={subtotal} shipping={shipping}>
                  <button onClick={() => setStep("checkout")} className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground">Sifarişi rəsmiləşdir</button>
                </Totals>
              </>
            ) : (
              <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto">
                <div className="grid gap-4 px-6 py-6">
                  <input required name="name" autoComplete="name" placeholder="Ad və soyad" className={field} />
                  <input required name="phone" type="tel" autoComplete="tel" placeholder="+994 50 000 00 00" className={field} />
                  <input required name="address" autoComplete="street-address" placeholder="Ünvan (Bakı)" className={field} />
                  <textarea name="note" rows={3} placeholder="Qeyd (istəyə görə)" className={field} />
                  <p className="text-sm text-muted-foreground">Ödəniş çatdırılma zamanı — nağd və ya kartla.</p>
                </div>
                <div className="mt-auto">
                  <Totals subtotal={subtotal} shipping={shipping}>
                    <button className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground">Sifariş et · {subtotal + shipping} ₼</button>
                    <button type="button" onClick={() => setStep("cart")} className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground">Səbətə qayıt</button>
                  </Totals>
                </div>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Totals({ subtotal, shipping, children }) {
  return (
    <div className="border-t border-border bg-muted/50 px-6 py-5">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Məhsullar</span><span>{subtotal} ₼</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Çatdırılma</span><span>{shipping ? `${shipping} ₼` : "Pulsuz"}</span></div>
        <div className="flex justify-between pt-2 text-base font-semibold"><span>Cəmi</span><span>{subtotal + shipping} ₼</span></div>
      </div>
      {subtotal < FREE_SHIPPING && <p className="mt-3 text-xs text-accent">Pulsuz çatdırılma üçün daha {FREE_SHIPPING - subtotal} ₼.</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}
