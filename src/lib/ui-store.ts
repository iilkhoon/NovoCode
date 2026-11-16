"use client";
import { useSyncExternalStore } from "react";

/** Tiny external stores: which global modal is open, and user preferences (localStorage). */

export type ModalName = "upgrade" | "share" | "settings" | "import" | null;
export type ModalArg = { tab?: string; url?: string; name?: string };

let modal: { name: ModalName; arg: ModalArg } = { name: null, arg: {} };
const mListeners = new Set<() => void>();
export function openModal(name: Exclude<ModalName, null>, arg: ModalArg = {}) {
  modal = { name, arg };
  mListeners.forEach((l) => l());
}
export function closeModal() {
  modal = { name: null, arg: {} };
  mListeners.forEach((l) => l());
}
export function useModal() {
  return useSyncExternalStore(
    (cb) => (mListeners.add(cb), () => mListeners.delete(cb)),
    () => modal,
    () => modal
  );
}

export type Lang = "az" | "tr" | "ru" | "en";
export interface Prefs {
  name: string;
  email: string;
  lang: Lang;
  model: string;
  replyLang: "auto" | Lang;
  autoFix: boolean;
  autoCompact: boolean;
  suggestions: boolean;
  notifyDone: boolean;
  notifyNews: boolean;
  notifyBilling: boolean;
  sound: boolean;
}
export const DEFAULT_PREFS: Prefs = {
  name: "Qonaq",
  email: "",
  lang: "az",
  model: "auto",
  replyLang: "auto",
  autoFix: true,
  autoCompact: true,
  suggestions: true,
  notifyDone: true,
  notifyNews: false,
  notifyBilling: true,
  sound: false,
};
const PKEY = "novo-prefs";
let prefs: Prefs = DEFAULT_PREFS;
let loaded = false;
const pListeners = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    prefs = { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PKEY) ?? "{}") };
  } catch {}
}
export function setPrefs(patch: Partial<Prefs>) {
  load();
  prefs = { ...prefs, ...patch };
  try {
    localStorage.setItem(PKEY, JSON.stringify(prefs));
  } catch {}
  pListeners.forEach((l) => l());
}
export function usePrefs(): Prefs {
  return useSyncExternalStore(
    (cb) => (pListeners.add(cb), () => pListeners.delete(cb)),
    () => (load(), prefs),
    () => DEFAULT_PREFS
  );
}

/** Demo usage numbers until billing exists. */
export const USAGE = { plan: "Pulsuz", used: 3, limit: 5, period: "bu gün", resets: "gecə 00:00-da yenilənir" };

export const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: "az", label: "Azərbaycan", native: "AZ" },
  { id: "tr", label: "Türkçe", native: "TR" },
  { id: "ru", label: "Русский", native: "RU" },
  { id: "en", label: "English", native: "EN" },
];
