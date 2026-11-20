# NovoCode

**Bir cümlə yaz — sayt hazırdır.** İstifadəçi Azərbaycan dilində yazır (və ya ekran görüntüsü / eskiz atır), NovoCode isə bir neçə dəqiqəyə tam işlək veb-sayt qurur.

- 💬 Azərbaycan dilində söhbətlə sayt qurmaq
- ⚡ Canlı önizləmə: sayt brauzerin içindəki Node.js mühitində (WebContainers) işləyir
- 🛠️ Özünü düzəldən AI: terminal və brauzer xətalarını oxuyur, avtomatik təmir edir (3 cəhdə qədər)
- 🖼️ Şəkildən sayt: ekran görüntüsünü və ya əl eskizini atın, AI dizaynı təkrarlasın
- 🧠 Skill sistemi: `skills/` qovluğundakı peşəkar qaydalar sorğuya uyğun seçilir
- 🧑‍💻 Kod redaktoru, fayl ağacı, interaktiv terminal, cihaz ölçüləri (desktop/tablet/mobil), ZIP yükləmə
- 🤖 AI: [build.nvidia.com](https://build.nvidia.com) (GLM, Kimi, DeepSeek, Qwen… — model siyahısı canlı gəlir)

## Dizayn sistemi — "Şəfəq"
İsti kağız fon, mürəkkəb rəngli mətn və tək terrakota "alov" vurğusu. Gündüz və gecə rejimi. Canlı sənəd: **`/dizayn`** səhifəsi.

- **Rənglər:** kağız `#f4efe6`, səth `#fffcf6`, mürəkkəb `#1d1814`, alov `#e0602f`; gecə: `#14110e` fon. Hamısı CSS dəyişənidir (`globals.css`), `<html data-theme="dark">` bütün tətbiqi (Astryx komponentləri daxil) çevirir. Seçim `localStorage`-da saxlanır, səhifə yanlış temada yanıb-sönmür.
- **Şriftlər:** Fraunces (başlıqlar, redaksiya serifi), Onest (mətn, ₼ işarəsi var), Martian Mono (etiketlər), JetBrains Mono (kod). Hamısı Azərbaycan əlifbasını (ə ğ ı ş ç ö ü) tam dəstəkləyir, OFL lisenziyalı, `@fontsource` ilə serverdən verilir.
- **Loqo:** "n" + yanıb-sönən kursor, şəfəq qradiyentli plitədə; yazı — "Novo" serifdə, "code" mono şriftdə (`src/components/Logo.tsx`, `src/app/icon.svg`).
- **Hərəkət:** CSS giriş animasiyaları (`.nv-anim`, `.nv-line`), hero arxasında yavaş üzən isti işıqlar və zəif simvol sahəsi (`AsciiField.tsx`: canvas, 20–30 fps, ekrandan çıxanda dayanır, zəif cihazda sıxlıq azalır). `prefers-reduced-motion`-da hamısı dayanır.
- **Studio:** Sadə rejim (yalnız söhbət + canlı sayt, insan dilində xəta mesajları, "Yenidən cəhd et") və Developer rejimi (kod, terminal, model seçimi, ZIP). Astryx mövzusu eyni CSS dəyişənlərinə istinad edir (`src/themes/burunc/buruncTheme.ts` → `npx astryx theme build ...`).

## Studio imkanları
- Səslə yazma (az-AZ), şəkil/eskiz, 6 dizayn üslubu (+ avtomatik seçim), ✨ sorğunu təkmilləşdirmə
- Versiya tarixçəsi — istənilən AI addımına bir kliklə qayıtmaq
- Yayımla: brauzerdə build edilmiş statik sayt (ZIP → Netlify Drop) və ya mənbə kodu
- Cihaz önizləməsi, tam ekran, qısayollar (`Ctrl+1/2/3`, `Ctrl+S`), layihə adını dəyişmək

## Başlamaq

```bash
npm install
cp .env.example .env.local   # NVIDIA_API_KEY=nvapi-... yazın
npm run dev                  # http://localhost:3000
```

> Studiya **Chrome, Edge və ya Brave** brauzerində ən yaxşı işləyir (WebContainers üçün cross-origin isolation lazımdır).

### Önizləmə açılmırsa

- Lokal kompüterdə brauzerin ünvan sətrində `http://localhost:3000` açın. `http://192.168.x.x:3000` kimi HTTP şəbəkə ünvanları təhlükəsiz kontekst sayılmır; başqa cihazdan giriş üçün HTTPS lazımdır.
- `next.config.ts` COOP (`same-origin`) və COEP (`credentialless`) başlıqlarını verir. Proksi bu başlıqları silməməlidir. Konfiqurasiya dəyişdikdə dev serveri yenidən başladın və səhifəni tam yeniləyin.
- Brauzer konsolunda `window.isSecureContext` və `window.crossOriginIsolated` hər ikisi `true` olmalıdır. Müasir masaüstü Chrome və ya Edge istifadə edin.
- Layihələr brauzerdə ünvan üzrə saxlanılır: IP ünvanından `localhost`-a keçdikdə köhnə layihə görünməyə bilər. Keçməzdən əvvəl layihənin kodunu ixrac edin.

AI modelindən görünən cavab gəlmirsə, yalnız düşünmə siqnalları vaxt limitini söndürmür: NVIDIA üçün 25 saniyə, birbaşa DeepSeek Flash üçün 60 saniyə, Pro üçün 90 saniyə gözlənilir. Flash-dan Pro/reasoning modelinə avtomatik keçilmir. İlk cavab mətni gəldikdən sonra model dəyişdirilmir. Provayderin növbəsi və cavab sürəti ayrıca gecikmə yarada bilər.

Model seçicisində DeepSeek mətn modelləri `Novo Flash`, Pro/reasoning modelləri `Novo V4 Pro` adı ilə göstərilir. Bunlar interfeys adlarıdır; API-yə faktiki model ID-si göndərilir. Köhnə `deepseek-chat` ID-si kataloqda yoxdursa, mövcud Flash modeli Pro-dan əvvəl seçilir.

Önizləmənin yeniləmə düymələri yalnız iframe-i və lazım gəlsə layihənin runtime prosesini yenidən başladır; söhbət səhifəsi yenilənmir.

### DeepSeek qoşmaq

`.env.local` faylında `DEEPSEEK_API_KEY` təyin edin, `DEEPSEEK_MODEL=deepseek-chat` yazın və serveri yenidən başladın. Açarı yalnız serverdə saxlayın. DeepSeek NVIDIA açarı olmadan da işləyir. Model seçicidə `deepseek-chat · DeepSeek` görünəcək; standart seçimi məcbur etmək üçün `NOVO_DEFAULT_MODEL=deepseek::deepseek-chat` istifadə edin. Hesabınız başqa model verirsə, `DEEPSEEK_MODEL` və standart modeldə dəqiq model ID-sini yazın.

Alternativ: `NOVO_ADMIN_PASSWORD` təyin edib `/admin` → Provayderlər → Provayder əlavə et → DeepSeek seçin, açarı daxil edin və yadda saxlayın. Sonra Modellər bölməsindən standart modeli seçin. Admin açarları serverdə şifrələyərək saxlayır; bu yol üçün yazıla bilən, daimi `.data` qovluğu lazımdır. Eyni provayder üçün admin qeydi `.env.local` açarından üstün tutulur.

Sorğular serverdən `https://api.deepseek.com/v1/chat/completions` ünvanına OpenAI uyğun formatda göndərilir. Model siyahısı DeepSeek `/models` endpoint-indən alınır. Mətn modeli seçildikdə şəkilli sorğular üçün ayrıca görüntü modeli lazımdır. `deepseek-chat` üçün cavab limiti 8192, V4 modelləri üçün 16384 tokendir. V4 sorğularında düşünmə rejimi açıq şəkildə söndürülür (`thinking.type=disabled`), çıxış büdcəsi kod üçün saxlanılır. Sayt kiçik, tamamlanmış fayl paketləri ilə qurulur; `<novo-continue>` qalan işləri növbəti sorğuya ötürür. İlk paket işlək səhifə yaratmalıdır. Ən çox 12 paket işlənir; iki ardıcıl paketdə heç bir fayl dəyişikliyi yoxdursa proses dayandırılır. Bağlanmış fayllar saxlanılır, token limitində yarımçıq qalan fayl isə yaddaşa yazılmadan bütöv şəkildə yenidən istənilir. Paketlər provayderdə ayrıca sorğu və token istifadəsi yaradır. İstifadəçi prosesi dayandıranda davam sorğusu göndərilmir.

Sənədlər: https://api-docs.deepseek.com/ · Platforma: https://platform.deepseek.com/

### Pulsuz yayım (Vercel)
1. Repo-nu Vercel-ə qoşun → *Environment Variables* bölməsinə `NVIDIA_API_KEY` əlavə edin.
2. Deploy. Server xərci yoxdur: AI çağırışları Vercel funksiyasından, saytların işə salınması isə istifadəçinin brauzerində olur.

### Mühit dəyişənləri
| Dəyişən | Təsvir |
|---|---|
| `NVIDIA_API_KEY` | build.nvidia.com API açarı (məcburi) |
| `NOVO_DEFAULT_MODEL` | Standart model ID (boş — avtomatik ən yaxşısı seçilir) |
| `NOVO_VISION_MODEL` | Şəkil analizi üçün model (boş — avtomatik) |
| `NVIDIA_BASE_URL` | Default `https://integrate.api.nvidia.com/v1` |

## Arxitektura

```
Brauzer ─ Studio (çat · önizləmə · kod · terminal)
   │  /api/chat (NDJSON stream)            ┌──────────────┐
   ├──────────────────────────────────────▶│ Next.js API  │──▶ build.nvidia.com
   │                                        │ skills + prompt│
   │  <novo-file>/<novo-shell> axını        └──────────────┘
   ▼
ActionParser ─▶ WebContainer (npm install · vite dev · xətalar) ─▶ önizləmə iframe
   ▲                                   │
   └──── avtomatik təmir dövrü ◀────────┘ (terminal + brauzer runtime xətaları)
```

| Qovluq | Məzmun |
|---|---|
| `src/lib/protocol/parser.ts` | AI cavabındakı `<novo-file>`, `<novo-shell>`, `<novo-delete>`, `<novo-plan>` teqlərinin axın parseri |
| `src/lib/ai/` | NVIDIA klienti, model reytinqi, sistem prompt |
| `src/lib/skills/` + `skills/*.md` | Skill kitabxanası və seçim məntiqi |
| `src/lib/runtime/` | WebContainer idarəsi və xəta aşkarlanması |
| `src/lib/agent/` | Bir AI addımının axını, mesaj hissələri |
| `src/lib/template/files/` | Yaradılan saytların başlanğıc şablonu (Vite + React + Tailwind v4 + hazır UI, `db`, `auth`) |
| `src/components/studio/` | Studio interfeysi |

### Yeni skill əlavə etmək
`skills/` qovluğunda yeni `.md` faylı yaradın:

```md
---
name: hotel
description: Otel saytları
triggers: otel, hotel, otaq, bron
always: false
---
# Qaydalar…
```

## Testlər
```bash
npm test        # parser, skill seçimi, xəta aşkarlama, prompt, model reytinqi
npm run build
```

Generasiya axınının deterministik sınaqları hər iki V4 model ID-si üçün paketlərdən sayt qurur (canlı provayder testi deyil). Lokal Chromium və Node axtarış yolunda `playwright` varsa, brauzer smoke testi:

```bash
NOVO_GENERATION_OUT=/tmp/novo-generation-smoke npm test
node scripts/check-generation.mjs
```

## Yol xəritəsi
1. ✅ **Nüvə**: AI generator, canlı önizləmə, terminal, avtomatik təmir, şəkildən sayt, skill-lər
2. ⏳ Hesablar, layihələrin serverdə saxlanması, kredit/mesaj kotası
3. ⏳ Bir kliklə yayım: `layihe.novocode.az` + avtomatik SSL
4. ⏳ Real server verilənlər bazası (yaradılan saytlar üçün)
5. ⏳ Ödəniş inteqrasiyası (yerli ödəniş sistemləri)
6. ⏳ Mobil tətbiq istehsalı (Expo + QR), platformanın mobil tətbiqi və səsli əmrlər

> ⚖️ WebContainers prototip və qeyri-kommersiya istifadə üçün pulsuzdur; kommersiya istifadəsində StackBlitz lisenziyası və ya öz server sandbox-u (yol xəritəsi 4) lazımdır.
