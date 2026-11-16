"use client";
import { useEffect, useRef, useState } from "react";
import type { Template } from "./data";

/**
 * A believable website screenshot: the page is laid out at a real desktop width
 * (1200×900) and scaled down to fit its card, so type, spacing and rhythm read
 * like a finished site instead of a wireframe.
 */
const W = 1200;
const H = 900;

interface Content {
  kicker: string;
  headline: [string, string];
  sub: string;
  cta: [string, string];
  items: { name: string; meta: string }[];
  stats?: [string, string][];
}

const CONTENT: Record<string, Content> = {
  "Dəmlə Kofe": {
    kicker: "Bakı · 2019-dan",
    headline: ["Hər qurtumda", "isti bir hekayə."],
    sub: "Təzə qovrulmuş dənələr, ev şirniyyatları və rahat künclər — Nizami küçəsində.",
    cta: ["Menyuya bax", "Masa sifarişi"],
    items: [{ name: "Kapuçino", meta: "5,50 ₼" }, { name: "Flat white", meta: "6,00 ₼" }, { name: "Paxlava", meta: "4,00 ₼" }],
  },
  "Gil Keramika": {
    kicker: "Əl işi · Şəki emalatxanası",
    headline: ["Gildən gələn", "sakitlik."],
    sub: "Hər parça bir dəfə formalaşır. Kiçik partiyalar, təbii şirlər.",
    cta: ["Kataloq", "Haqqımızda"],
    items: [{ name: "Çay fincanı", meta: "24 ₼" }, { name: "Vaza · Qum", meta: "68 ₼" }, { name: "Boşqab dəsti", meta: "92 ₼" }, { name: "Kasa", meta: "31 ₼" }, { name: "Dolça", meta: "45 ₼" }, { name: "Şamdan", meta: "28 ₼" }],
  },
  "Gülüş Dental": {
    kicker: "Xidmətlər",
    headline: ["Sağlam gülüş", "bir randevu uzaqlığında."],
    sub: "12 il təcrübə, ağrısız müalicə və şəffaf qiymətlər. Onlayn randevu 30 saniyə.",
    cta: ["Randevu al", "Həkimlər"],
    items: [{ name: "Təmizləmə", meta: "40 ₼-dan" }, { name: "İmplant", meta: "650 ₼-dan" }, { name: "Ağartma", meta: "180 ₼" }],
    stats: [["4 800+", "xəstə"], ["4.9", "reytinq"], ["12", "il"]],
  },
  Hesabla: {
    kicker: "Kiçik biznes üçün mühasibat",
    headline: ["Hesablarınız", "özü qaydaya düşür."],
    sub: "Qaimələr, ƏDV və hesabatlar bir paneldə. Bank çıxarışını yükləyin — qalanını Hesabla edir.",
    cta: ["Pulsuz başla", "Demo izlə"],
    items: [{ name: "Avtomatik qaimə", meta: "e-qaimə ilə" }, { name: "ƏDV hesabatı", meta: "1 kliklə" }, { name: "Bank inteqrasiyası", meta: "5 bank" }],
  },
  "Aysel Foto": {
    kicker: "Toy · Nişan · Portret",
    headline: ["Ən gözəl gününüz,", "zamansız kadrlarda."],
    sub: "Bakı və bölgələrdə toy fotoqrafiyası. 2026 tarixləri açıqdır.",
    cta: ["Qalereya", "Paketlər"],
    items: [{ name: "Nişan", meta: "" }, { name: "Toy", meta: "" }, { name: "Portret", meta: "" }, { name: "Xına", meta: "" }, { name: "Love story", meta: "" }, { name: "Ailə", meta: "" }],
  },
  "Satış CRM": {
    kicker: "Panel",
    headline: ["Bu gün", "xoş gəldin, Rəşad"],
    sub: "",
    cta: ["Yeni sövdələşmə", "İxrac"],
    items: [{ name: "Kənan Əliyev", meta: "Danışıqlar" }, { name: "Nur Market", meta: "Təklif" }, { name: "Aqil Həsənov", meta: "Bağlandı" }, { name: "Baku Prints", meta: "Yeni" }],
    stats: [["248", "aktiv müştəri"], ["12,4k ₼", "bu ay"], ["92%", "plan"]],
  },
  "Nərgiz Salon": {
    kicker: "Randevu",
    headline: ["Özünüzə", "bir saat ayırın."],
    sub: "Saç, dırnaq və üz baxımı — Nəsimi rayonunda, sevdiyiniz ustalarla.",
    cta: ["Randevu al", "Xidmətlər"],
    items: [{ name: "Saç düzümü", meta: "35 ₼" }, { name: "Manikür", meta: "25 ₼" }, { name: "Üz baxımı", meta: "60 ₼" }],
  },
  "Plov House": {
    kicker: "Milli mətbəx",
    headline: ["Nənə resepti,", "qapınıza qədər."],
    sub: "Şah plov, dolma və təndir qutabı — 45 dəqiqəyə çatdırılma bütün Bakıda.",
    cta: ["Sifariş et", "Menyu"],
    items: [{ name: "Şah plov", meta: "18 ₼" }, { name: "Yarpaq dolması", meta: "12 ₼" }, { name: "Qutab dəsti", meta: "9 ₼" }],
  },
  "Lingo Akademiya": {
    kicker: "Yeni qrup · 2 dekabr",
    headline: ["Dil öyrənmək", "heç bu qədər asan olmayıb."],
    sub: "İngilis, alman və rus dili. Pulsuz səviyyə testi ilə başlayın.",
    cta: ["Testi keç", "Kurslar"],
    items: [{ name: "İngilis B1", meta: "120 ₼/ay" }, { name: "Alman A1", meta: "110 ₼/ay" }, { name: "Rus A2", meta: "90 ₼/ay" }, { name: "IELTS", meta: "160 ₼/ay" }, { name: "Uşaqlar", meta: "80 ₼/ay" }, { name: "Danışıq klubu", meta: "40 ₼/ay" }],
  },
};

/** Soft, photographic-looking fill built from the palette (no network needed). */
function photo(accent: string, bg: string, seed: number) {
  const a = 20 + ((seed * 37) % 60);
  const b = 30 + ((seed * 53) % 50);
  return {
    background: `radial-gradient(120% 90% at ${a}% ${b}%, ${mix(accent, "#ffffff", 0.35)} 0%, transparent 55%),
      radial-gradient(90% 70% at ${100 - a}% ${100 - b}%, ${mix(accent, "#000000", 0.45)} 0%, transparent 60%),
      linear-gradient(${120 + seed * 25}deg, ${mix(accent, bg, 0.15)}, ${mix(accent, "#000000", 0.25)})`,
  };
}

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
}

function useFitScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

export function TemplatePreview({ t }: { t: Template }) {
  const { ref, scale } = useFitScale();
  const { bg, fg, accent, muted, card } = t.palette;
  const font = t.font === "serif" ? "'Iowan Old Style', Georgia, 'Times New Roman', serif" : "var(--font-display)";
  const c = CONTENT[t.name] ?? CONTENT["Dəmlə Kofe"];
  const brand = t.name.split(" ")[0].toLowerCase();

  const Nav = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 56px" }}>
      <span style={{ fontFamily: font, fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em" }}>{brand}.</span>
      <div style={{ display: "flex", gap: 36, fontSize: 15, color: muted }}>
        <span>Ana səhifə</span>
        <span>Xidmətlər</span>
        <span>Haqqımızda</span>
        <span>Əlaqə</span>
      </div>
      <span style={{ background: fg, color: bg, fontSize: 14, fontWeight: 600, padding: "11px 22px", borderRadius: 999 }}>{c.cta[0]}</span>
    </div>
  );
  const Buttons = (
    <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
      <span style={{ background: accent, color: "#fff", fontSize: 16, fontWeight: 600, padding: "15px 28px", borderRadius: 999 }}>{c.cta[0]} →</span>
      <span style={{ border: `1.5px solid ${mix(fg, bg, 0.75)}`, fontSize: 16, fontWeight: 500, padding: "15px 28px", borderRadius: 999 }}>{c.cta[1]}</span>
    </div>
  );
  const Kicker = <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, fontWeight: 600 }}>{c.kicker}</div>;
  const Headline = (size: number, align: "left" | "center" = "left") => (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: t.font === "serif" ? 500 : 650, lineHeight: 1.02, letterSpacing: "-0.035em", marginTop: 18, textAlign: align }}>
      {c.headline[0]}
      <br />
      <span style={{ color: t.font === "serif" ? accent : undefined, fontStyle: t.font === "serif" ? "italic" : undefined }}>{c.headline[1]}</span>
    </div>
  );
  const Sub = (align: "left" | "center" = "left") => (
    <p style={{ fontSize: 19, lineHeight: 1.55, color: muted, marginTop: 22, maxWidth: 520, textAlign: align, marginInline: align === "center" ? "auto" : undefined }}>{c.sub}</p>
  );

  let body: React.ReactNode;
  if (t.layout === "dashboard") {
    body = (
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", height: H }}>
        <div style={{ background: card, borderRight: `1px solid ${mix(fg, bg, 0.9)}`, padding: "28px 18px" }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 30, paddingLeft: 10 }}>{brand}.</div>
          {["Panel", "Müştərilər", "Sövdələşmələr", "Tapşırıqlar", "Hesabatlar"].map((n, i) => (
            <div key={n} style={{ padding: "11px 12px", borderRadius: 10, fontSize: 15, marginBottom: 4, background: i === 0 ? mix(accent, card, 0.85) : undefined, color: i === 0 ? mix(accent, "#000000", 0.25) : muted, fontWeight: i === 0 ? 600 : 400 }}>{n}</div>
          ))}
        </div>
        <div style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <div>
              <div style={{ fontSize: 14, color: muted }}>{c.headline[0]}</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 4 }}>{c.headline[1]}</div>
            </div>
            <span style={{ background: accent, color: "#fff", fontSize: 14, fontWeight: 600, padding: "11px 20px", borderRadius: 10 }}>+ {c.cta[0]}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 28 }}>
            {(c.stats ?? []).map(([v, l], i) => (
              <div key={l} style={{ background: card, borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgb(0 0 0 / .06)" }}>
                <div style={{ fontSize: 14, color: muted }}>{l}</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8, letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 13, color: accent, marginTop: 6, fontWeight: 600 }}>↑ {[12, 8, 4][i]}% bu həftə</div>
              </div>
            ))}
          </div>
          <div style={{ background: card, borderRadius: 16, padding: 24, marginTop: 18, boxShadow: "0 1px 3px rgb(0 0 0 / .06)" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Gəlir · son 12 həftə</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, marginTop: 18 }}>
              {[38, 52, 45, 60, 55, 70, 64, 78, 72, 85, 80, 96].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 8, background: i === 11 ? accent : mix(accent, card, 0.6) }} />
              ))}
            </div>
          </div>
          <div style={{ background: card, borderRadius: 16, marginTop: 18, boxShadow: "0 1px 3px rgb(0 0 0 / .06)" }}>
            {c.items.map((it, i) => (
              <div key={it.name} style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderTop: i ? `1px solid ${mix(fg, card, 0.92)}` : undefined, fontSize: 15 }}>
                <span style={{ fontWeight: 500 }}>{it.name}</span>
                <span style={{ fontSize: 13, padding: "4px 12px", borderRadius: 999, background: mix(accent, card, 0.85), color: mix(accent, "#000000", 0.3), fontWeight: 600 }}>{it.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (t.layout === "center") {
    body = (
      <>
        {Nav}
        <div style={{ textAlign: "center", padding: "70px 120px 0", position: "relative" }}>
          {t.palette.bg.startsWith("#0") && (
            <div aria-hidden style={{ position: "absolute", left: "50%", top: -40, width: 900, height: 500, transform: "translateX(-50%)", background: `radial-gradient(closest-side, ${mix(accent, bg, 0.4)}, transparent)`, opacity: 0.8 }} />
          )}
          <div style={{ position: "relative" }}>
            <span style={{ display: "inline-block", fontSize: 14, padding: "7px 16px", borderRadius: 999, border: `1px solid ${mix(fg, bg, 0.8)}`, color: muted }}>✦ {c.kicker}</span>
            {Headline(76, "center")}
            {Sub("center")}
            <div style={{ display: "flex", justifyContent: "center" }}>{Buttons}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, padding: "70px 80px 0" }}>
          {c.items.map((it, i) => (
            <div key={it.name} style={{ background: card, borderRadius: 22, padding: 18, boxShadow: "0 10px 30px -12px rgb(0 0 0 / .2)", border: `1px solid ${mix(fg, card, 0.92)}` }}>
              <div style={{ height: 150, borderRadius: 14, ...photo(accent, bg, i + 1) }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 17, fontWeight: 600 }}>
                <span>{it.name}</span>
                <span style={{ color: accent }}>{it.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (t.layout === "grid") {
    body = (
      <>
        {Nav}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", padding: "40px 56px 0" }}>
          <div>
            {Kicker}
            {Headline(64)}
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: muted, maxWidth: 340 }}>{c.sub}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, padding: "44px 56px 0" }}>
          {c.items.map((it, i) => (
            <div key={it.name}>
              <div style={{ height: 230, borderRadius: 16, ...photo(accent, bg, i + 2) }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 16 }}>
                <span style={{ fontWeight: 600 }}>{it.name}</span>
                <span style={{ color: muted }}>{it.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    body = (
      <>
        {Nav}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, padding: "50px 56px 0", alignItems: "center" }}>
          <div>
            {Kicker}
            {Headline(70)}
            {Sub()}
            {Buttons}
            {c.stats && (
              <div style={{ display: "flex", gap: 44, marginTop: 44 }}>
                {c.stats.map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: font, fontSize: 32, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 14, color: muted }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative", height: 480 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, ...photo(accent, bg, 3) }} />
            <div style={{ position: "absolute", left: -36, bottom: 40, background: card, color: fg, borderRadius: 18, padding: "16px 20px", boxShadow: "0 20px 40px -14px rgb(0 0 0 / .35)", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, ...photo(accent, bg, 7) }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>★ 4.9 · 320 rəy</div>
                <div style={{ fontSize: 13, color: muted }}>Google xəritələr</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, padding: "50px 56px 0" }}>
          {c.items.map((it, i) => (
            <div key={it.name} style={{ background: card, borderRadius: 18, padding: 14, display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 70, height: 70, borderRadius: 12, ...photo(accent, bg, i + 4) }} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 15, color: accent, marginTop: 4, fontWeight: 600 }}>{it.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden" style={{ background: bg }}>
      <div aria-hidden className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})`, background: bg, color: fg, fontFamily: "var(--font-sans)" }}>
        {body}
      </div>
    </div>
  );
}
