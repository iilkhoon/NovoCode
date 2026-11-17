import type { ChatMessage } from "@/lib/types";

/** What Novo says when a project starts from a ready-made template, plus next-step ideas. */
const NEXT: Record<string, string> = {
  demle: "Loqomu və rəngləri dəyiş | Onlayn sifariş əlavə et | Menyuya yeni içkilər əlavə et",
  gil: "Məhsulları dəyiş | Ödəniş üsulları əlavə et | Admin paneli qur",
  gulus: "Həkimləri dəyiş | Qiymətləri yenilə | Rəylər bölməsi əlavə et",
  hesabla: "Brend rəngini dəyiş | Müştəri rəyləri əlavə et | Blog bölməsi qur",
  aysel: "Öz fotolarımı yerləşdir | Paketləri dəyiş | Rəylər əlavə et",
  satis: "Tapşırıqlar səhifəsi əlavə et | Hesabatı Excel-ə ixrac et | Komanda üzvləri əlavə et",
  nergiz: "Xidmətləri dəyiş | Ustaları dəyiş | Hədiyyə kartı əlavə et",
  plov: "Menyunu dəyiş | Promo kod əlavə et | Admin üçün sifarişlər paneli qur",
  lingo: "Kursları dəyiş | Alman dili testi əlavə et | Tələbə kabineti qur",
};

export function welcomeMessage(id: string, name: string): ChatMessage {
  const text = `“${name}” şablonu hazırdır — bütün bölmələr işləyir. Mətnləri, rəngləri, fotoları və ya funksiyaları dəyişmək üçün sadəcə yazın, məsələn: “adı Mənim Biznesim et, ünvanı dəyiş”.`;
  return {
    id: `welcome-${id}`,
    role: "assistant",
    content: `${text}\n<novo-next>${NEXT[id] ?? "Mətnləri dəyiş | Rəngləri dəyiş | Yayımla"}</novo-next>`,
    parts: [{ kind: "text", text }],
    createdAt: Date.now(),
  };
}
