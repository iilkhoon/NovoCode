# Novo Code — Nüvə (alt-layihə 1) dizaynı

## Məqsəd
Kod bilməyən istifadəçi Azərbaycan dilində yazaraq (və ya şəkil ataraq) bir neçə dəqiqəyə yüksək keyfiyyətli, işlək veb-sayt qursun. Mobil tətbiq istehsalı, hesablar, ödəniş və yayım sonrakı alt-layihələrdir.

## Qərarlar
- **AI**: build.nvidia.com (OpenAI uyğun API). Modellər `/v1/models`-dən canlı alınır və reytinqlənir (GLM-5 → Kimi K2 → DeepSeek → Qwen3 Coder…). Şəkil olduqda avtomatik vision model seçilir. Açar yalnız serverdədir.
- **Sandbox**: WebContainers (brauzerdə Node.js) — server xərci yoxdur, real `npm install`, Vite dev server və terminal. Runtime `ProjectRuntime` sinfi arxasında gizlədilib ki, gələcəkdə server sandbox-u ilə əvəzlənə bilsin.
- **Yaradılan saytların steki** (sabit): Vite + React 19 (JSX) + Tailwind v4 + lucide + motion + react-router; hazır UI komponentləri, `db` (localStorage kolleksiyaları) və `auth` (demo qeydiyyat/giriş).
- **Protokol**: model sərbəst mətn + `<novo-plan>`, `<novo-file path>`, `<novo-delete path/>`, `<novo-shell>` teqləri yazır. Tool-calling əvəzinə teqlər seçildi — müxtəlif açıq modellərdə daha etibarlıdır və axınla (stream) işləyir.
- **Skill-lər**: `skills/*.md` frontmatter (`name`, `description`, `triggers`, `always`). 3 həmişə-aktiv (core, design-excellence, azerbaijani-content) + sorğuya uyğun ən çox 3 skill (Azərbaycan hərfləri normallaşdırılaraq açar söz uyğunluğu).
- **Avtomatik təmir**: hər AI addımından sonra dev server sakitləşənə qədər gözlənilir, terminal (ANSI təmizlənmiş) və iframe runtime xətaları toplanır; xəta varsa model avtomatik "təmir" mesajı alır, ən çox 3 cəhd.
- **Saxlama**: layihələr IndexedDB-də (hesablar alt-layihə 2-də serverə köçəcək).
- **Platformanın dizaynı — "Nar"**: tünd mürəkkəb fon (#08080a), nar qırmızısı vurğu (#ff4d5e), zəfəran (#ffb547) ikinci vurğu, Geist şrifti, nar formalı loqo.

## Xəta halları
- API açarı yoxdur / NVIDIA əlçatmazdır → model seçicisi qırmızı, mesajda xəta göstərilir.
- Brauzer cross-origin isolation dəstəkləmir və ya WebContainer 60 saniyəyə açılmır → önizləmədə xəta, terminalda səbəb.
- Dev server çökür → status "error", növbəti fayl yazılışında avtomatik yenidən başladılır.
- İstifadəçi "Dayandır" → axın kəsilir, yazılmış fayllar qalır.

## Test
Vitest: parser (chunk sərhədləri, fence təmizləmə), skill seçimi, xəta aşkarlama, prompt qurucusu, model reytinqi, NDJSON oxuyucu, mesaj hissələri. Playwright ilə mock NVIDIA serverinə qarşı UI axını yoxlanıldı.
