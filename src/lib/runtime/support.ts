export function previewSupport(context: { isSecureContext: boolean; crossOriginIsolated: boolean }): { title: string; message: string } | null {
  if (!context.isSecureContext) return {
    title: "Önizləmə üçün təhlükəsiz ünvan lazımdır",
    message: "Bu kompüterdə saytı http://localhost:3000 ünvanından açın. Şəbəkə IP-si ilə açırsınızsa HTTPS lazımdır. Ünvan sətrindəki real ünvanı dəyişin; önizləmədəki ünvan sətrini yox.",
  };
  if (!context.crossOriginIsolated) return {
    title: "Önizləmə üçün brauzer izolyasiyası aktiv deyil",
    message: "Serveri dayandırıb npm run dev ilə yenidən başladın və səhifəni Ctrl+Shift+R ilə yeniləyin. Server və ya proksi COOP: same-origin və COEP: credentialless başlıqlarını göndərməlidir. Müasir Chrome və ya Edge istifadə edin.",
  };
  return null;
}
