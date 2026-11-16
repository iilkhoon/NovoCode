"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal typing for the Web Speech API (not in TS DOM lib everywhere). */
interface SR extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}

const LOCALE: Record<string, string> = { az: "az-AZ", tr: "tr-TR", ru: "ru-RU", en: "en-US" };

/** Voice dictation via the browser's speech recognition, in the interface language. */
export function useSpeech(onText: (text: string, final: boolean) => void, lang = "az") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const rec = useRef<SR | null>(null);
  const cb = useRef(onText);
  cb.current = onText;

  useEffect(() => {
    const W = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) return;
    setSupported(true);
    const r = new Ctor();
    r.lang = LOCALE[lang] ?? "az-AZ";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e) => {
      let text = "";
      let final = true;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (!e.results[i].isFinal) final = false;
      }
      cb.current(text, final);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    return () => r.stop();
  }, [lang]);

  const toggle = useCallback(() => {
    if (!rec.current) return;
    if (listening) rec.current.stop();
    else {
      rec.current.start();
      setListening(true);
    }
  }, [listening]);

  return { supported, listening, toggle };
}
