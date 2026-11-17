import { useEffect, useState } from "react";

const KEY = "gil:cart";
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
};
const write = (c) => {
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new Event("gil-cart"));
};

/** Cart as { productId: quantity }, shared across components and kept after reload. */
export function useCart() {
  const [cart, setCart] = useState(read);
  useEffect(() => {
    const on = () => setCart(read());
    window.addEventListener("gil-cart", on);
    return () => window.removeEventListener("gil-cart", on);
  }, []);
  const set = (id, qty) => {
    const next = { ...read() };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    write(next);
  };
  return {
    cart,
    add: (id) => set(id, (read()[id] || 0) + 1),
    set,
    clear: () => write({}),
    count: Object.values(cart).reduce((a, b) => a + b, 0),
  };
}
