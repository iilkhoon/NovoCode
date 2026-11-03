# Novo Code

**Danış, saytın qurulsun.** İstifadəçi Azərbaycan dilində yazır (və ya ekran görüntüsü / eskiz atır), Novo Code isə bir neçə dəqiqəyə tam işlək veb-sayt qurur.

- 💬 Azərbaycan dilində söhbətlə sayt qurmaq
- ⚡ Canlı önizləmə: sayt brauzerin içindəki Node.js mühitində (WebContainers) işləyir
- 🛠️ Özünü düzəldən AI: terminal və brauzer xətalarını oxuyur, avtomatik təmir edir (3 cəhdə qədər)
- 🖼️ Şəkildən sayt: ekran görüntüsünü və ya əl eskizini atın, AI dizaynı təkrarlasın
- 🧠 Skill sistemi: `skills/` qovluğundakı peşəkar qaydalar sorğuya uyğun seçilir
- 🧑‍💻 Kod redaktoru, fayl ağacı, interaktiv terminal, cihaz ölçüləri (desktop/tablet/mobil), ZIP yükləmə
- 🤖 AI: [build.nvidia.com](https://build.nvidia.com) (GLM, Kimi, DeepSeek, Qwen… — model siyahısı canlı gəlir)

## Başlamaq

```bash
npm install
cp .env.example .env.local   # NVIDIA_API_KEY=nvapi-... yazın
npm run dev                  # http://localhost:3000
```

> Studiya **Chrome, Edge və ya Brave** brauzerində ən yaxşı işləyir (WebContainers üçün cross-origin isolation lazımdır).

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

## Yol xəritəsi
1. ✅ **Nüvə**: AI generator, canlı önizləmə, terminal, avtomatik təmir, şəkildən sayt, skill-lər
2. ⏳ Hesablar, layihələrin serverdə saxlanması, kredit/mesaj kotası
3. ⏳ Bir kliklə yayım: `layihe.novocode.az` + avtomatik SSL
4. ⏳ Real server verilənlər bazası (yaradılan saytlar üçün)
5. ⏳ Ödəniş inteqrasiyası (yerli ödəniş sistemləri)
6. ⏳ Mobil tətbiq istehsalı (Expo + QR), platformanın mobil tətbiqi və səsli əmrlər

> ⚖️ WebContainers prototip və qeyri-kommersiya istifadə üçün pulsuzdur; kommersiya istifadəsində StackBlitz lisenziyası və ya öz server sandbox-u (yol xəritəsi 4) lazımdır.
