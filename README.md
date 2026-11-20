# NovoCode

**Bir cümlə yaz — sayt hazırdır.** İstifadəçi Azərbaycan dilində yazır (və ya ekran görüntüsü / eskiz atır), NovoCode isə bir neçə dəqiqəyə tam işlək veb-sayt qurur.

- 💬 Azərbaycan dilində söhbətlə sayt qurmaq
- ⚡ Canlı önizləmə: sayt brauzerin içindəki Node.js mühitində (WebContainers) işləyir
- 🛠️ Özünü düzəldən AI: terminal və brauzer xətalarını oxuyur, avtomatik təmir edir (3 cəhdə qədər)
- 🖼️ Şəkildən sayt: ekran görüntüsünü və ya əl eskizini atın, AI dizaynı təkrarlasın
- 🧠 Skill sistemi: `skills/` qovluğundakı peşəkar qaydalar sorğuya uyğun seçilir
- 🧑‍💻 Kod redaktoru, fayl ağacı, interaktiv terminal, cihaz ölçüləri (desktop/tablet/mobil), ZIP yükləmə
- 🤖 AI: yalnız [OpenRouter](https://openrouter.ai) — bir açar bütün model ailələrinə (Claude, GPT, Gemini, DeepSeek, Qwen…)

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
cp .env.example .env.local   # OPENROUTER_API_KEY=sk-or-... yazın
npm run dev                  # http://localhost:3000
```

> Studiya **Chrome, Edge və ya Brave** brauzerində ən yaxşı işləyir (WebContainers üçün cross-origin isolation lazımdır).

### Önizləmə açılmırsa

- Lokal kompüterdə brauzerin ünvan sətrində `http://localhost:3000` açın. `http://192.168.x.x:3000` kimi HTTP şəbəkə ünvanları təhlükəsiz kontekst sayılmır; başqa cihazdan giriş üçün HTTPS lazımdır.
- `next.config.ts` COOP (`same-origin`) və COEP (`credentialless`) başlıqlarını verir. Proksi bu başlıqları silməməlidir. Konfiqurasiya dəyişdikdə dev serveri yenidən başladın və səhifəni tam yeniləyin.
- Brauzer konsolunda `window.isSecureContext` və `window.crossOriginIsolated` hər ikisi `true` olmalıdır. Müasir masaüstü Chrome və ya Edge istifadə edin.
- Layihələr brauzerdə ünvan üzrə saxlanılır: IP ünvanından `localhost`-a keçdikdə köhnə layihə görünməyə bilər. Keçməzdən əvvəl layihənin kodunu ixrac edin.

### AI: OpenRouter

Bütün sorğular serverdən `https://openrouter.ai/api/v1/chat/completions` ünvanına gedir; açar yalnız `.env.local`-dadır. Modellər `NOVO_MODELS`-də sadalanır (boşdursa pulsuz modellər: ERNIE 5.5 Flash → Nemotron Super VL → Nemotron Ultra → Gemma 4). Seçicidə `Novo Flash`, `Novo Vision`, `Novo Ultra`, `Novo Lite` adları görünür. Model limitlənsə (429) və ya 75 saniyədə yazmağa başlamasa, növbəti modelə səssizcə keçilir; ilk mətn gəldikdən sonra model dəyişdirilmir. Admin panelin Modellər bölməsindən OpenRouter-in istənilən modelini açmaq olar.

Sayt böyük paketlərlə (bir cavabda 10 fayla qədər) yazılır. Paket qırılsa (bağlantı kəsilməsi, model xətası, faylın ortasında dayanma), hazır fayllar saxlanılır, yarımçıq fayl yenidən istənilir və proses avtomatik davam edir — istifadəçiyə xəta göstərilmir. Pulsuz OpenRouter açarı gündə 50 sorğu verir; hər paket bir sorğudur.

### Pulsuz yayım (Vercel)
1. Repo-nu Vercel-ə qoşun → *Environment Variables* bölməsinə `OPENROUTER_API_KEY` əlavə edin.
2. Deploy. Server xərci yoxdur: AI çağırışları Vercel funksiyasından, saytların işə salınması isə istifadəçinin brauzerində olur.

### Mühit dəyişənləri
| Dəyişən | Təsvir |
|---|---|
| `OPENROUTER_API_KEY` | openrouter.ai API açarı (məcburi) |
| `NOVO_MODELS` | Vergüllə OpenRouter model ID-ləri (birincisi standart) |
| `NOVO_DEFAULT_MODEL` | Standart model ID (boş — avtomatik ən yaxşısı seçilir) |
| `NOVO_VISION_MODEL` | Şəkil analizi üçün model (boş — avtomatik) |

## Arxitektura

```
Brauzer ─ Studio (çat · önizləmə · kod · terminal)
   │  /api/chat (NDJSON stream)            ┌──────────────┐
   ├──────────────────────────────────────▶│ Next.js API  │──▶ openrouter.ai
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
| `src/lib/ai/` | OpenRouter klienti, model kataloqu, sistem prompt |
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
