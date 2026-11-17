import { useEffect, useState } from "react";

const KEY = "plov:order";
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
};
const write = (o) => {
  localStorage.setItem(KEY, JSON.stringify(o));
  window.dispatchEvent(new Event("plov-order"));
};

/** Order as { dishId: quantity }, shared across components and kept after reload. */
export function useOrder() {
  const [order, setOrder] = useState(read);
  useEffect(() => {
    const on = () => setOrder(read());
    window.addEventListener("plov-order", on);
    return () => window.removeEventListener("plov-order", on);
  }, []);
  const set = (id, qty) => {
    const next = { ...read() };
    if (qty > 0) next[id] = qty;
    else delete next[id];
    write(next);
  };
  return { order, set, clear: () => write({}), count: Object.values(order).reduce((a, b) => a + b, 0) };
}
