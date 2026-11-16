# NovoCode — yol xəritəsi

Müəllif: Nova Group Azerbaijan · İlkin Rızayev
Məqsəd: Azərbaycanın ilk AI sayt/tətbiq qurucusu. Kod bilməyən də, developer da rahat işləsin. Görünüş və keyfiyyət Lovable / Bolt səviyyəsində, qiymət regiona uyğun.

Prinsip: **əvvəl dizayn, sonra texniki.** Hər addım bitəndə işlək olmalıdır — yarımçıq ekran yoxdur.

Status: ✅ hazır · 🔄 gedir · ⏳ növbədə · 💤 sonra (investordan sonra)

---

## A. Generasiya keyfiyyəti — "slop" görünməyən saytlar
Bolt-un ayaqqabı saytını təhlil etdik. Onu yaxşı edən: mövzuya uyğun real fotolar, bir vurğu rəngi, səliqəli kartlar, endirim/“Çox satan” nişanları, işlək filtr/səbət, çoxsəhifəli quruluş (kateqoriya səhifəsi, breadcrumb), güvən zolağı (çatdırılma, qaytarma, ödəniş).

1. ✅ Mövzuya uyğun real şəkillər (Pexels; açar yoxdursa açar sözlə pulsuz mənbə) — təsadüfi şəkil yox
2. ✅ Dizayn bacarığının (skill) yenilənməsi: "slop" siyahısı, sahə üzrə nümunə quruluşlar, nişanlar, güvən zolağı
3. ⏳ Sahə şablonları: mağaza, restoran, klinika, avto, portfolio, landing, dashboard — hər biri çoxsəhifəli, işlək
4. ⏳ İlk generasiyada "plan → icra" (Bolt kimi checklist addımları ekranda canlı)
5. ⏳ Avtomatik vizual yoxlama: build sonrası ekran görüntüsü → model özü düzəliş təklif edir
6. ✅ Saytların altında "Made with Novo" nişanı (ödənişli planda silinir)

## B. Platformanın dizaynı
7. ✅ Ana səhifə v2: Lovable kimi mərkəzdə böyük söhbət qutusu, canlı qradiyent fon, az mətn, aydın CTA
8. ⏳ Söhbət qutusu: sayt növü (Website · Landing · Web app · +Backend), stil, şəkil/ekran görüntüsü, səs, GitHub/URL import
9. ✅ Daxil olmuş istifadəçi üçün tətbiq qabığı: solda ChatGPT kimi panel — Yeni layihə, Axtarış, Layihələr, Son baxılanlar, Profil/kredit
10. ⏳ Studio v2: solda bağlanan söhbət, sağda önizləmə; üstdə Önizləmə · Kod · Fayllar; mobil/planşet/desktop; yeni tabda aç
11. ✅ Söhbətdə Plan / Build / Chat rejimləri; addım-addım canlı checklist; hər cavabdan sonra 2–3 təklif ("Yayımlayaq?", "Naviqasiyanı da düzəldim?")
12. ✅ Token sayğacı (kontekst dolulu­ğu), 80%-də avtomatik `/compact`, limitdə "Yeni söhbət"; əmrlər: `/compact`, `/new`, `/plan`, `/publish`, `/undo`
13. ✅ Saytda klikləyib seçmək → "bunu dəyiş" (element seçici)
14. ✅ Versiya tarixçəsi (hər cavab = bərpa nöqtəsi)
15. ✅ Upgrade pəncərəsi və qiymət kartları (ödəniş hələ yoxdur — yalnız görünüş)
16. ✅ Boş vəziyyətlər, yüklənmə skeletləri, xəta ekranları, 404 — hamısı eyni dizayn dilində
17. ⏳ İkon dəsti və mikro-animasiyalar cilası (Bolt səviyyəsi)

## C. Dillər və SEO
18. ⏳ İnterfeys dilləri: Azərbaycan, Türk, Rus, İngilis (dil seçici, avtomatik aşkarlama)
19. ⏳ AI cavab dili istifadəçinin dilinə uyğun
20. ⏳ SEO: metadata, OG şəkilləri, sitemap, robots, hreflang, strukturlaşdırılmış data
21. ⏳ Yaradılan saytlara da avtomatik SEO (title, description, OG)

## D. Hesab və məlumat
22. ⏳ Supabase: Google və GitHub ilə giriş
23. ⏳ Layihələr və söhbətlər bulud bazasında (indi brauzerdə — IndexedDB); bir layihədə çoxlu söhbət, köhnə söhbətə qayıtmaq
24. ⏳ Profil, kredit balansı, istifadə tarixçəsi

## E. Import
25. ⏳ GitHub-dan repo gətirmək, redaktə, geri push
26. ⏳ URL-dən sayt oxumaq: HTML + ekran görüntüsü → oxşar dizayn və quruluş
27. 💤 Figma-dan import

## F. Yayım
28. ✅ Bir kliklə yayım: `ad.novocode.app` — öz serverimizdə (wildcard DNS `*.novocode.app` → server); Cloudflare sonra
29. ✅ Paylaşma linki, QR kod (telefonda yoxlamaq)
30. ⏳ Öz domeni bağlamaq (DNS təlimatı + avtomatik SSL)
31. 💤 Yaradılan sayt üçün analitika

## G. AI idarəsi və admin panel
32. 🔄 Admin panel (dizayn hazır, açarlar hələ brauzerdə): API provayder əlavə et (NVIDIA, OpenRouter, Anthropic, OpenAI…), açarlar serverdə şifrəli
33. ⏳ Hansı modellər istifadəçiyə görünsün, standart model, model başına kredit qiyməti
34. ⏳ İstifadəçi model seçimi (Standart / Max)
35. ⏳ Skill yükləmə (istifadəçi və admin) — markdown təlimatlar
36. ⏳ Xərc ölçümü: istifadəçi/layihə başına token və pul
37. 💤 Öz serverimizdə model (GPU alınanda)

## H. Backend imkanları
38. ⏳ İstifadəçi öz Supabase-ini qoşur (verilənlər bazası, auth, storage)
39. 💤 Ödəniş inteqrasiyası yaradılan saytlar üçün
40. 💤 Konnektorlar (e-poçt, Telegram bot, Google Sheets)

## I. Biznes
41. 💤 Kredit sistemi və paketlər (ödəniş: yerli provayder — Payriff/Epoint)
42. 💤 Komanda: dəvət et, eyni layihədə birgə iş
43. 💤 Referal / promo kodlar

## J. Platformalar
44. 💤 Mobil tətbiq yaratmaq (Expo) + QR ilə telefonda sınaq
45. 💤 Desktop tətbiq (Windows/macOS)
46. 💤 Safari/iPhone üçün öz önizləmə mühərriki (WebContainers lisenziyasından asılılığı da aradan qaldırır)

## K. Keyfiyyət və hazırlıq
47. ⏳ Studiyanın ilk açılışı 20–40 s → 5–10 s
48. ⏳ Testlər, xəta monitorinqi, sürət (Lighthouse 95+)
49. ⏳ Investor demosu: ssenari, demo video, nümunə layihələr

---

## Qərarlar

- Canlı önizləmə: WebContainers pulsuz rejimdə qalır; lisenziya yayımdan əvvəl.
- Ödəniş: inkişaf mərhələsində yoxdur.
- Server: əsas tətbiq + yayım üçün ayrı; mövcud Windows server test/hostinq üçün istifadə oluna bilər.
- Ad: hələlik NovoCode, sonra dəyişə bilər.

## Gündəlik qeyd

| Tarix | Nə edildi |
| --- | --- |
| 2026-11-12 | "Nöqtə" redizaynı; runtime, hydration, API qoruması düzəldildi; ilk plan |
| 2026-11-12 (2) | "Şəfəq" dizayn sistemi, yeni loqo, iki tema, Sadə/Developer rejimləri, insan dilində xətalar |
| 2026-11-16 | Tam yol xəritəsi; dizayn sistemi v3 (bənövşəyi + qradiyent, Bricolage Grotesque + Geist, canlı WebGL qradiyent); /app paneli, giriş, admin, bütün pəncərələr və bildirişlər; yeni slogan |
| 2026-11-16 (2) | Generasiya keyfiyyəti: `img.novo` → real şəkillər (Pexels / açarsız ehtiyat), dizayn bacarığına peşəkar sayt nümunələri, "Made with Novo" nişanı |
| 2026-11-16 (3) | Studio: Qur/Planla/Söhbət rejimləri, kontekst sayğacı + 80%-də avtomatik `/compact`, `/` əmrləri, cavabdan sonra təklif düymələri, saytda element seçib dəyişdirmək |
| 2026-11-16 (4) | Bir kliklə yayım: build → serverə yükləmə → `ad.localhost` / `ad.novocode.app`; sahiblik açarı, versiya yeniləmə, SPA dəstəyi; layihə kartında “Canlı” nişanı |
