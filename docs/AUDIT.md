# Novo Code — ümumi audit (Astryx inteqrasiyası ilə)

Tarix: 2026-11-08 · Budaq: `feat/novo-code-mvp`

## 1. Astryx (meta/astryx) — nə tətbiq olundu

| Sahə | Nə edildi |
| --- | --- |
| Paketlər | `@astryxdesign/core@0.7.11`, `@astryxdesign/theme-neutral`, `@stylexjs/stylex`, `@astryxdesign/cli` (dev) |
| Mövzu | `src/themes/burunc/` — **Bürünc** Astryx mövzusu. CLI ilə palitra yaradıldı (`burunc.palette.ts`), `defineTheme` ilə tokenlər bizim dizayn sistemindən götürüldü (qara səhnə, isti ağ, bürünc vurğu, sapfir info). Fontlar Onest, Cormorant və JetBrains Mono-dur. Hərəkət ease-out-dur. Mövzu `astryx theme build` ilə statik CSS kimi qurulub, ona görə SSR-də ilk kadrda hazırdır. |
| CSS qatları | `globals.css`-də sıra: `theme, reset, base, astryx-base, astryx-theme, components, utilities`. Tailwind utility-ləri həmişə qalib gəlir. Astryx CSS (270 KB) **yalnız** studiya və /dizayn səhifələrində yüklənir. Landing-ə təsiri sıfırdır. |
| Studiya | **Ctrl/⌘+K əmr paleti** (Astryx `CommandPalette`): görünüşlər, yadda saxla, yayımla, versiyanı bərpa et, yeni layihə və fayllar üzrə axtarış. Enter ən yaxşı nəticəni icra edir. **Yayım dialoqu** Astryx `Dialog`-a köçürüldü: native `<dialog>`, fokus tələsi, Esc ilə bağlanma və fokusun geri qayıtması. |
| /dizayn | "06 — Astryx" bölməsi Bürünc mövzusunda düymələr, nişanlar, forma, cədvəl, tooltip və dialoq göstərir. |
| AI generator | Yeni `skills/astryx-ui.md` skill-i dashboard, admin, CRM və anbar sorğularında avtomatik seçilir. Generator Astryx-i quraşdırır və 150+ əlçatan komponentdən istifadə edir. Marketinq saytlarında istifadə olunmur. Reseptin özü real Vite şablonunda yoxlanılıb: build keçir və səhifə render olunur. |
| Agent sənədləri | `.claude/CLAUDE.md` — `astryx init` tərəfindən yazılıb. Gələcək AI işləri komponentləri təxmin etmir, CLI-dən oxuyur. |

## 2. Təhlükəsizlik

| # | Problem | Ciddilik | Status |
| --- | --- | --- | --- |
| S1 | `/api/chat` və `/api/enhance` hər kəs üçün açıq idi: istənilən sayt NVIDIA açarını pulsuz proxy kimi istifadə edə bilərdi | **Yüksək** | ✅ Origin yoxlaması əlavə olundu (başqa saytdan 403) və IP üzrə limit qoyuldu (chat: 10 dəqiqədə 60, enhance: 10 dəqiqədə 20) |
| S2 | Sorğu gövdəsi yoxlanmırdı: səhv JSON 500 xətası verir, ölçü limiti yox idi | Orta | ✅ `readJson` (12 MB / 16 KB limit) əlavə olundu, mesajlar, fayllar və model validasiya olunur |
| S3 | Şəkil sahəsinə istənilən URL göndərmək olurdu (provayder kənar URL-ləri çəkə bilərdi) | Orta | ✅ Yalnız `data:image/*;base64` qəbul olunur, ən çox 4 şəkil |
| S4 | İstənilən model ID ötürülə bilərdi | Aşağı | ✅ Yalnız `/v1/models` siyahısında olan modellər qəbul olunur |
| S5 | Təhlükəsizlik başlıqları yox idi | Aşağı | ✅ `nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` əlavə olundu, `X-Powered-By` söndürüldü |
| S6 | API açarı | — | ✅ Açar yalnız `.env.local`-dadır (gitignore-da). Git tarixçəsində real açar **yoxdur**, yalnız `nvapi-xxxx` nümunəsi var. |
| S7 | `npm audit`: Next 15-in daxilindəki PostCSS-də 2 zəiflik | Aşağı (yalnız build zamanı, bizim CSS-ə aiddir) | ⏳ Düzəlişi yalnız Next 16-da var. Next 15.5.29-a yeniləndi. Next 16-ya keçid ayrıca iş kimi tövsiyə olunur. |
| S8 | Limit yaddaşdadır (bir server nüsxəsi üçün) | Məlumat | ⏳ Prodakşında Upstash/Redis kimi paylanmış limit lazımdır |

## 3. Əlçatanlıq və UX (Vercel Web Interface Guidelines)

| Tapıntı | Status |
| --- | --- |
| Bildirişlər (toast) ekran oxuyucusuna elan olunmurdu | ✅ `role="status" aria-live="polite"` |
| Landing-də "Məzmuna keç" linki yox idi | ✅ Klaviatura ilə görünən skip link → `#main` |
| Mobil fayl seçicisi (`<select>`) etiketsiz idi, fokus halqası söndürülmüşdü | ✅ `aria-label`, açıq fon və rəng (Windows qaranlıq rejimi), qlobal fokus halqası |
| Klik-kənar (backdrop) div-ləri ekran oxuyucusuna görünürdü | ✅ `aria-hidden` |
| Toxunuşda iki dəfə klik zoom gecikməsi | ✅ `touch-action: manipulation` |
| AI yazarkən səhifəni bağlamaq işi itirirdi | ✅ Novo işləyərkən `beforeunload` xəbərdarlığı |
| Dialoqlarda fokus idarəsi əl ilə idi | ✅ Astryx Dialog: fokus tələsi, Esc və fokusun geri qayıtması |
| `prefers-reduced-motion`, `color-scheme: dark`, `theme-color`, ikon düymələrinin `aria-label`-ları | ✓ artıq düzgün idi |
| Studiya tabları URL-də saxlanmır | ⏳ Kiçik. Gələcəkdə `?tab=` əlavə etmək olar |

## 4. Keyfiyyət

- `vitest` konfiqurasiyasında `server-only` modulu test zamanı bütöv test faylını sakitcə sındırırdı. Bu düzəldildi (stub). İndi **10 fayl, 37 test** keçir. Yeni testlər: API guard (origin, limit, ölçü, şəkil) və skill seçimi.
- `tsc --noEmit` təmizdir, `next build` uğurludur.
- E2E (mock AI ilə) yoxlanıldı: landing → studiya → Ctrl+K → "kod" → Enter → Kod tabı → Yayımla dialoqu. Konsol xətası yoxdur.

## 5. Burada yoxlana bilməyənlər

- Real NVIDIA cavabları: `integrate.api.nvidia.com` bu mühitdə bloklanıb, buna görə test mock server ilə aparılıb.
- WebContainer önizləməsi (`stackblitz.com` bloklanıb). Bu, öz kompüterinizdə Chrome/Edge-də yoxlanmalıdır.

## 6. Növbəti addımlar (tövsiyə)

1. Next 16-ya keçid (S7).
2. Paylanmış limit + istifadəçi hesabı + kredit sistemi (S8).
3. Bir kliklə yayım (`*.novocode.az`) üçün backend.
4. Studiyada daha çox Astryx: model seçicisini `Selector`-a, versiya tarixçəsini `Drawer`-ə keçirmək.
