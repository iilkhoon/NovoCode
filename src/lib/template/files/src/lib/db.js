/**
 * Novo DB — brauzerdə işləyən sadə verilənlər bazası (localStorage).
 * İstifadə:
 *   import { db } from "@/lib/db";
 *   const posts = db.collection("posts");
 *   posts.add({ title: "Salam" }); posts.all(); posts.update(id, {...}); posts.remove(id);
 *   const unsub = posts.subscribe((items) => setItems(items));
 */
import { useEffect, useState } from "react";

const listeners = new Map();
const read = (name) => {
  try { return JSON.parse(localStorage.getItem("novo:" + name) || "[]"); } catch { return []; }
};
const write = (name, items) => {
  localStorage.setItem("novo:" + name, JSON.stringify(items));
  (listeners.get(name) || []).forEach((fn) => fn(items));
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const db = {
  collection(name) {
    return {
      all: () => read(name),
      get: (id) => read(name).find((x) => x.id === id) || null,
      where: (fn) => read(name).filter(fn),
      add(data) {
        const item = { id: uid(), createdAt: new Date().toISOString(), ...data };
        write(name, [...read(name), item]);
        return item;
      },
      update(id, patch) {
        write(name, read(name).map((x) => (x.id === id ? { ...x, ...patch } : x)));
      },
      remove(id) {
        write(name, read(name).filter((x) => x.id !== id));
      },
      seed(items) {
        if (read(name).length === 0) write(name, items.map((d) => ({ id: uid(), createdAt: new Date().toISOString(), ...d })));
      },
      subscribe(fn) {
        const arr = listeners.get(name) || [];
        listeners.set(name, [...arr, fn]);
        return () => listeners.set(name, (listeners.get(name) || []).filter((f) => f !== fn));
      },
    };
  },
};

/** React hook: const [items, col] = useCollection("posts"); */
export function useCollection(name) {
  const col = db.collection(name);
  const [items, setItems] = useState(() => col.all());
  useEffect(() => col.subscribe(setItems), [name]);
  return [items, col];
}
