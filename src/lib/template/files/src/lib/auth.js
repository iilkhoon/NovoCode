/**
 * Novo Auth — demo qeydiyyat/giriş sistemi (brauzerdə, localStorage).
 *   const { user, signUp, signIn, signOut } = useAuth();
 */
import { useEffect, useState } from "react";
import { db } from "./db";

const KEY = "novo:session";
const users = () => db.collection("users");
const hash = async (s) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
const emit = () => window.dispatchEvent(new Event("novo-auth"));

export async function signUp({ name, email, password }) {
  if (users().where((u) => u.email === email).length) throw new Error("Bu e-poçt artıq qeydiyyatdadır");
  const u = users().add({ name, email, password: await hash(password) });
  localStorage.setItem(KEY, u.id);
  emit();
  return u;
}
export async function signIn({ email, password }) {
  const h = await hash(password);
  const u = users().where((x) => x.email === email && x.password === h)[0];
  if (!u) throw new Error("E-poçt və ya şifrə yanlışdır");
  localStorage.setItem(KEY, u.id);
  emit();
  return u;
}
export function signOut() {
  localStorage.removeItem(KEY);
  emit();
}
export function currentUser() {
  const id = localStorage.getItem(KEY);
  return id ? users().get(id) : null;
}
export function useAuth() {
  const [user, setUser] = useState(currentUser);
  useEffect(() => {
    const fn = () => setUser(currentUser());
    window.addEventListener("novo-auth", fn);
    return () => window.removeEventListener("novo-auth", fn);
  }, []);
  return { user, signUp, signIn, signOut };
}
