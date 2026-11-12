# Novo Code — 1 aylıq plan

Başlanğıc: 2026-11-12 · Hədəf: investor turuna tam hazır məhsul (~4 həftə, hər gün iş)

Məqsəd: kod bilməyən hər kəs **Bolt qədər rahat** sayt (sonra mobil tətbiq) qursun; developer üçün ayrıca güclü rejim olsun; görünüş dünya standartında və bazardan fərqli olsun; xərclər bizi heç vaxt ziyana salmasın.

---

## 1. Dizayn istiqaməti — "ASCII + isti işıq"

Bazarda hamı eyni görünür: tünd fon, bənövşəyi qradiyent, şüşə kartlar. Biz başqa yolla gedirik.

- **ASCII səhnə.** Ana ekranın fonu simvollardan (`. : * # @`) qurulmuş canlı, axan şəkildir. Kursor və ya barmaq yaxınlaşanda simvollar dalğalanır. İstifadəçi yazmağa başlayanda simvollar yazdığı sözə doğru "axır" — AI-ın düşündüyünü vizual göstərir.
- **İsti qradiyentlər.** Anthropic/Claude stilindən **ilham** (kopya yox): krem/kağız fon, terrakota-narıncı, şaftalı və qum tonları, yavaş hərəkət edən yumşaq işıqlar. Rənglər və adlar öz brendimizdir — başqa brendə bənzəyən kimlik qlobal bazarda problem yaradar.
- **Tipoqrafiya.** Başlıqlar: Fraunces (redaksiya serifi). Mətn: Onest. Etiketlər: Martian Mono. Inter və Geist Pixel çıxarıldı.
- **İki tema.** Gündüz (krem fonda ASCII) və gecə (qara fonda isti işıqlı ASCII).
- **Video fon** ASCII səhnə ilə əvəz olunur — daha unikal, dəfələrlə yüngül, pulsuz.

## 2. İki rejim

### Sadə rejim (standart, hamı üçün)
- Yalnız **söhbət + canlı sayt**. "Terminal", "fayl", "kod" sözləri ekranda yoxdur.
- Xəta olanda texniki mesaj yox: *"Kiçik problem tapdım, düzəldirəm…"* (animasiyalı).
- Saytda istənilən yerə **klikləyib "bunu dəyiş"** demək.
- Böyük **"Yayımla"** düyməsi — basanda link hazırdır.

### Developer rejimi (bir düymə ilə açılır)
- Kod redaktoru, fayl ağacı, terminal, model seçimi, ZIP yükləmə.
- Sadə istifadəçi bu rejimə təsadüfən düşmür.

## 3. Axıcılıq — ölçülən hədəflər

| Hədəf | Dəyər |
| --- | --- |
| Ana ekranın açılması | ≤ 1.5 s, Lighthouse 95+ |
| Animasiyalar | həmişə 60 fps, zəif telefonda da |
| ASCII səhnə | canvas; zəif cihazda simvol sıxlığı avtomatik azalır |
| Hərəkət | 150–400 ms, yumşaq, mənalı; heç nə istifadəçini gözlətmir; "azaldılmış hərəkət" dəstəklənir |
| Studiyanın ilk açılışı | 20–40 s → 5–10 s (paketlər əvvəlcədən hazır) |

## 4. Ucuz və ziyansız iş modeli

Ən böyük xərc AI-dır; server xərci demək olar sıfırdır.

| Xərc | Necə ucuz saxlayırıq |
| --- | --- |
| AI | Ucuz, güclü modellər (NVIDIA: DeepSeek, Qwen…); kiçik düzəlişlərə daha ucuz model; cavab ölçüsü və kontekst limiti |
| Kvota | Hər planın gündəlik/aylıq mesaj limiti — pulsuz istifadəçi heç vaxt ziyana salmır |
| Önizləmə | İstifadəçinin brauzerində işləyir — bizə xərc yoxdur |
| Yayım | Statik hostinq (məs. Cloudflare), sayt başına qəpiklər |
| Nəzarət | Hər istifadəçinin xərci ölçülür; plan qiyməti xərcdən 3–5× yuxarı |

Dəqiq rəqəmlər real sınaqdan sonra ölçülür: bir sayt orta neçə mesaj və neçə tokenə başa gəlir.

## 5. Həftəlik plan

| Həftə | İş | Status |
| --- | --- | --- |
| 1 | Real sınaq problemləri · yeni dizayn sistemi (rəng, tema, tipoqrafiya) · ASCII səhnə | 🔄 dizayn sistemi, loqo, iki tema, zəif ASCII fon hazırdır |
| 2 | Sadə / Developer rejimləri · insan dilində xəta bildirişləri · studiyanın sürətləndirilməsi | 🔄 rejimlər və xəta bildirişləri hazırdır; sürət qalır |
| 3 | Saytda kliklə dəyişmək · bir kliklə yayım (`ad.novocode.az`) · Google ilə giriş | ⏳ |
| 4 | Xərc ölçümü və kvotalar · iPhone/Safari dəstəyi · son cilalama · investor üçün demo video | ⏳ |

Sonra: mobil tətbiq yaratma (Expo, telefonda QR ilə açılır).

## 6. Bizdən asılı olmayanlar

- **StackBlitz (WebContainers) lisenziyası** — kommersiya istifadəsi üçün. Alternativ: öz yüngül brauzer önizləməmiz (esbuild-wasm; lisenziyasız, Safari/iPhone-da işləyir) və ya öz server sandbox-umuz (Docker).
- **Server hesabları** — AI API, domen, verilənlər bazası, hostinq.
- **Ödəniş sistemi** — yerli provayder/bankla müqavilə.

## 7. Açıq qərarlar (sahibkar)

1. ~~ASCII səhnə~~ — qərar: çox az, yalnız hero kənarlarında zəif dalğalanan simvollar.
2. ~~Əsas tema~~ — qərar: açıq (krem) əsas, gecə rejimi düymə ilə.
3. Qiymət planları — xərc ölçüləndən sonra. Hələlik saytda "Beta dövründə pulsuz, qiymətlər tezliklə".

---

## Gündəlik qeyd

| Tarix | Nə edildi |
| --- | --- |
| 2026-11-12 | "Nöqtə" redizaynı (video hero, dot-matrix başlıq, mobil menyu); runtime donması, hydration xətaları, API qoruması düzəldildi; plan yazıldı |
| 2026-11-12 (2) | "Şəfəq" dizayn sistemi: krem/terrakota palitra, gündüz/gecə, Fraunces + Onest + Martian Mono; yeni loqo ("n" + kursor, "Novo**code**"); video yerinə isti işıqlar + zəif simvol sahəsi; studio yenidən dizayn; Sadə/Developer rejimləri; insan dilində xətalar və "Yenidən cəhd et"; qiymətlər gizlədildi |
