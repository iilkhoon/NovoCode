import type { Template } from "./data";

/** Renders a tiny, believable website thumbnail from a template's palette + layout. */
export function TemplatePreview({ t }: { t: Template }) {
  const { bg, fg, accent, muted, card } = t.palette;
  const font = t.font === "serif" ? "Georgia, 'Times New Roman', serif" : t.font === "display" ? "var(--font-display)" : "var(--font-sans)";
  const bar = (w: string, c = fg, h = 6, o = 1) => <div style={{ width: w, height: h, background: c, opacity: o, borderRadius: 3 }} />;

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: bg, color: fg }}>
      <div className="flex items-center justify-between px-4 py-3">
        <span style={{ fontFamily: font, fontWeight: 700, fontSize: 12, letterSpacing: "-0.02em" }}>{t.name.split(" ")[0].toLowerCase()}.</span>
        <div className="flex gap-2">{bar("18px", muted, 4, 0.6)}{bar("18px", muted, 4, 0.6)}{bar("18px", muted, 4, 0.6)}</div>
        <span style={{ background: accent, color: bg, fontSize: 7, padding: "3px 8px", borderRadius: 99 }}>Başla</span>
      </div>

      {t.layout === "dashboard" ? (
        <div className="grid flex-1 grid-cols-[48px_1fr] gap-2 p-2">
          <div className="space-y-2 rounded-lg p-2" style={{ background: card }}>
            {[0, 1, 2, 3].map((i) => bar("100%", i === 0 ? accent : muted, 5, i === 0 ? 1 : 0.4))}
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1.5 rounded-lg p-2" style={{ background: card }}>
                  {bar("50%", muted, 4, 0.5)}
                  <div style={{ fontFamily: font, fontWeight: 700, fontSize: 12 }}>{["248", "12,4k ₼", "92%"][i]}</div>
                </div>
              ))}
            </div>
            <div className="flex h-16 items-end gap-1 rounded-lg p-2" style={{ background: card }}>
              {[40, 65, 50, 80, 60, 90, 75, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: accent, opacity: 0.35 + i * 0.08 }} />
              ))}
            </div>
            <div className="space-y-1.5 rounded-lg p-2" style={{ background: card }}>
              {[0, 1, 2].map((i) => <div key={i} className="flex justify-between">{bar("40%", fg, 4, 0.6)}{bar("14%", accent, 4)}</div>)}
            </div>
          </div>
        </div>
      ) : t.layout === "center" ? (
        <div className="flex flex-1 flex-col items-center px-6 pt-4 text-center">
          <span style={{ fontSize: 7, color: accent, letterSpacing: "0.2em" }}>{t.tagline.split(" · ")[0]}</span>
          <div style={{ fontFamily: font, fontSize: 20, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", marginTop: 6 }}>{t.name}</div>
          <div className="mt-2 space-y-1">{bar("120px", muted, 4, 0.5)}{bar("90px", muted, 4, 0.5)}</div>
          <div className="mt-3 flex gap-1.5">
            <span style={{ background: accent, color: bg, fontSize: 7, padding: "4px 10px", borderRadius: 99 }}>Başla</span>
            <span style={{ border: `1px solid ${muted}55`, fontSize: 7, padding: "4px 10px", borderRadius: 99 }}>Ətraflı</span>
          </div>
          <div className="mt-4 grid w-full grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-lg" style={{ background: card, boxShadow: "0 1px 3px rgb(0 0 0 / 0.08)" }} />)}
          </div>
        </div>
      ) : t.layout === "grid" ? (
        <div className="flex-1 px-4">
          <div style={{ fontFamily: font, fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{t.name}</div>
          <div className="mb-3 mt-1.5">{bar("110px", muted, 4, 0.5)}</div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="aspect-square rounded-md" style={{ background: `linear-gradient(135deg, ${accent}${i % 2 ? "55" : "99"}, ${muted}44)` }} />
                {bar("70%", fg, 3, 0.6)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-5 gap-3 px-4 pt-2">
          <div className="col-span-3 space-y-2">
            <span style={{ fontSize: 7, color: accent, letterSpacing: "0.2em" }}>{t.tagline.split(" · ")[0]}</span>
            <div style={{ fontFamily: font, fontSize: 19, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{t.name}</div>
            <div className="space-y-1">{bar("90%", muted, 4, 0.5)}{bar("70%", muted, 4, 0.5)}</div>
            <span style={{ display: "inline-block", background: accent, color: bg, fontSize: 7, padding: "4px 10px", borderRadius: 99 }}>Rezerv et</span>
          </div>
          <div className="col-span-2 rounded-xl" style={{ background: `radial-gradient(circle at 30% 30%, ${accent}, ${fg})`, opacity: 0.9 }} />
        </div>
      )}
    </div>
  );
}
