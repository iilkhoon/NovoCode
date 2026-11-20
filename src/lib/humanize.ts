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
  if (/\b402\b|insufficient balance|insufficient_quota/.test(s))
    return { title: "AI hesabında balans kifayət etmir", hint: "Provayder hesabının balansını artırın. Yenidən cəhd balansı dəyişmir.", retryable: false };
  if (/\b401\b|invalid api key|authentication/.test(s))
    return { title: "AI açarı qəbul edilmədi", hint: "Serverdəki API açarını yoxlayın və serveri yenidən başladın.", retryable: false };
  if (s.includes("openrouter_api_key") || s.includes("api key") || s.includes("açar"))
    return { title: "AI xidməti hələ qoşulmayıb", hint: "Serverdə AI açarı təyin edilməyib. Administratora bildirin.", retryable: false };
  if (/token limit|yarımçıq/.test(s))
    return { title: "Sayt tam bitmədi", hint: "Hazır hissələr saxlanılıb. \"Davam et\" yazın, qalanını tamamlayım.", retryable: true };
  if (/\b429\b|rate.?limit|çox sorğu/.test(s))
    return { title: "AI modelləri hazırda məşğuldur", hint: "Pulsuz modellər qısa müddətə limitlənib. Bir dəqiqə sonra yenidən cəhd edin.", retryable: true };
  if (s.includes("failed to fetch") || s.includes("network") || s.includes("fetch failed") || s.includes("load failed") || s.includes("bağlantı"))
    return { title: "İnternet bağlantısı kəsildi", hint: "Bağlantını yoxlayıb yenidən cəhd edin.", retryable: true };
  if (/timeout|timed out|cavab vermədi/.test(s))
    return { title: "AI cavabı vaxtında gəlmədi", hint: "Gözləmə müddəti bitdi. Yenidən cəhd edin və ya Novo Flash seçin.", retryable: true };
  if (/\b50[234]\b/.test(s))
    return { title: "AI xidmətinə qoşulmaq alınmadı", hint: "Provayder və ya server bağlantısında xəta var. Təkrarlanarsa Developer rejimində xəta təfərrüatına baxın.", retryable: true };
  if (s.includes("bir neçə cəhddən sonra"))
    return { title: "Bu problemi özüm həll edə bilmədim", hint: "Nəyin işləmədiyini sözlə təsvir edin — birlikdə düzəldək.", retryable: false };
  return { title: "Nəsə alınmadı", hint: "Yenidən cəhd edin. Təkrarlanarsa, istəyinizi bir az fərqli yazın.", retryable: true };
}
