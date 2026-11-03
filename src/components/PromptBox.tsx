"use client";
import { useRef, useState } from "react";
import { ArrowUp, ImagePlus, Square, X } from "lucide-react";
import { fileToDataUrl } from "@/lib/image";

interface Props {
  onSubmit: (text: string, images: string[]) => void;
  onStop?: () => void;
  busy?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "lg" | "md";
}

export function PromptBox({ onSubmit, onStop, busy, placeholder, autoFocus, size = "md" }: Props) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | File[]) {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 3);
    const urls = await Promise.all(imgs.map((f) => fileToDataUrl(f)));
    setImages((prev) => [...prev, ...urls].slice(0, 3));
  }

  function submit() {
    if (busy || (!text.trim() && images.length === 0)) return;
    onSubmit(text.trim() || "Bu şəkildəki dizaynı işlək sayt kimi qur.", images);
    setText("");
    setImages([]);
  }

  const lg = size === "lg";
  return (
    <div
      className="group relative rounded-2xl border border-ink-700 bg-ink-850/90 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_-20px_rgba(0,0,0,0.6)] transition focus-within:border-ink-600 focus-within:shadow-[0_0_0_4px_rgba(255,77,94,0.08)]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
      }}
    >
      {images.length > 0 && (
        <div className="flex gap-2 px-3 pt-3">
          {images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Əlavə edilmiş şəkil" className="size-16 rounded-lg object-cover ring-1 ring-ink-600" />
              <button
                aria-label="Şəkli sil"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink-600 text-ink-100 hover:bg-nar-500"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <textarea
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        onPaste={(e) => {
          const files = Array.from(e.clipboardData.files);
          if (files.length) {
            e.preventDefault();
            addFiles(files);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder ?? "Necə sayt istəyirsiniz? Məsələn: Bakıda kofe şopu üçün menyu və rezervasiyalı sayt…"}
        rows={lg ? 3 : 2}
        className={`block w-full resize-none bg-transparent px-4 pt-4 text-ink-100 placeholder:text-ink-400 outline-none scroll-thin ${lg ? "min-h-28 text-[16px]" : "max-h-48 min-h-16 text-[14px]"}`}
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-ink-300 hover:bg-ink-700 hover:text-ink-100"
            title="Ekran görüntüsü və ya eskiz əlavə edin"
          >
            <ImagePlus className="size-4" />
            <span className="hidden sm:inline">Şəkil / eskiz</span>
          </button>
        </div>
        {busy ? (
          <button
            onClick={onStop}
            aria-label="Dayandır"
            className="grid size-9 place-items-center rounded-xl bg-ink-600 text-ink-100 hover:bg-ink-400"
          >
            <Square className="size-3.5 fill-current" />
          </button>
        ) : (
          <button
            onClick={submit}
            aria-label="Göndər"
            disabled={!text.trim() && images.length === 0}
            className="grid size-9 place-items-center rounded-xl bg-nar-500 text-white transition hover:bg-nar-400 disabled:bg-ink-700 disabled:text-ink-400"
          >
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
