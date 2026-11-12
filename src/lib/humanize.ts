/**
 * Simple mode never shows paths, commands or stack traces. These helpers turn the
 * machine's words into plain Azerbaijani.
 */

const SPECIAL: Record<string, string> = {
  "src/App.jsx": "Səhifə quruluşu",
  "src/App.tsx": "Səhifə quruluşu",
  "src/main.jsx": "Başlanğıc",
  "src/main.tsx": "Başlanğıc",
  "src/index.css": "Rənglər və şriftlər",
  "index.html": "Sayt başlığı",
  "package.json": "Paketlər",
  "tailwind.config.js": "Dizayn tənzimləmələri",
  "vite.config.js": "Tənzimləmələr",
};

/** "src/components/MenuSection.jsx" → "Menu section" (+ " bölməsi" for components). */
export function friendlyFile(path: string): string {
  if (SPECIAL[path]) return SPECIAL[path];
  const base = path.split("/").pop() ?? path;
  const stem = base.replace(/\.[a-z0-9]+$/i, "");
  const words = stem
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
  const nice = words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
  if (/\/pages?\//.test(path)) return `${nice} səhifəsi`;
  if (/\/components?\//.test(path)) return `${nice} bölməsi`;
  if (/\.(css|scss)$/.test(base)) return "Stillər";
  if (/\/(lib|utils|hooks|data)\//.test(path)) return `${nice} (məntiq)`;
  return nice;
}

export interface HumanError {
  title: string;
  /** what the user can do about it */
  hint?: string;
  /** whether pressing "retry" has a real chance of helping */
  retryable: boolean;
}

/** Maps raw server/network errors to something a non-developer understands. */
export function humanizeError(raw: string): HumanError {
  const s = raw.toLowerCase();
  if (raw === "Dayandırıldı.") return { title: "Dayandırıldı", hint: "İstədiyiniz vaxt davam edə bilərsiniz.", retryable: true };
  if (s.includes("nvidia_api_key") || s.includes("api key") || s.includes("açar"))
    return { title: "AI xidməti hələ qoşulmayıb", hint: "Serverdə AI açarı təyin edilməyib. Administratora bildirin.", retryable: false };
  if (s.includes("429") || s.includes("rate") || s.includes("çox sorğu") || s.includes("limit"))
    return { title: "Bir az çox sürətli getdik", hint: "Bir dəqiqə gözləyib yenidən cəhd edin.", retryable: true };
  if (s.includes("failed to fetch") || s.includes("network") || s.includes("fetch failed") || s.includes("load failed") || s.includes("bağlantı"))
    return { title: "İnternet bağlantısı kəsildi", hint: "Bağlantını yoxlayıb yenidən cəhd edin.", retryable: true };
  if (s.includes("timeout") || s.includes("timed out") || s.includes("502") || s.includes("503") || s.includes("504") || s.includes("cavab vermədi"))
    return { title: "AI hazırda çox məşğuldur", hint: "Bir az sonra yenidən cəhd edin.", retryable: true };
  if (s.includes("bir neçə cəhddən sonra"))
    return { title: "Bu problemi özüm həll edə bilmədim", hint: "Nəyin işləmədiyini sözlə təsvir edin — birlikdə düzəldək.", retryable: false };
  return { title: "Nəsə alınmadı", hint: "Yenidən cəhd edin. Təkrarlanarsa, istəyinizi bir az fərqli yazın.", retryable: true };
}
