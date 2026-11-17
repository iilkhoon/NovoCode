# İnvestor demosu — ssenari (7–8 dəqiqə)

Məqsəd: “kod bilməyən adam 5 dəqiqəyə işlək, gözəl sayt qurur və yayımlayır” — canlı göstərmək.

## Hazırlıq (demodan 1 gün əvvəl)

- [ ] Chrome (və ya Edge) son versiya; brauzer tam ekran, bildirişlər söndürülüb
- [ ] `.env.local`: `NVIDIA_API_KEY`, `PEXELS_API_KEY` (real şəkillər üçün vacib), `NOVO_ADMIN_PASSWORD`
- [ ] Bir dəfə layihə yaradıb önizləməni açın — paketlər keşə düşür, demoda studiya saniyələrə açılır
- [ ] 2–3 hazır layihə: kofe şop, ayaqqabı mağazası, klinika (biri yayımlanmış, “Canlı” nişanı ilə)
- [ ] Telefonda QR kodu oxuda bilmək üçün eyni Wi-Fi / yayım domeni işləyir
- [ ] `.env.local`-a `NOVO_DEMO=fallback` yazın — AI cavab verməsə, studiya hazır ssenari ilə davam edir (kofe şopu saytı, sonra “Rəylər bölməsi”). İnternetsiz məşq üçün: `NOVO_DEMO=always`
- [ ] Təqdimat: `/pitch` — ← → ilə keçid, **F** tam ekran, **P** PDF. Rəqəmlər `src/lib/pitch.ts`-dədir; `[məbləğ]` və `[SAFE / pay]` sahələrini doldurun
- [ ] Ehtiyat: internet kəsilsə, hazır layihələrin ekran videosu

## Ssenari

0. **Təqdimat (3 dəq).** `/pitch` — problem, həll, bazar (slayderləri investorun gözü qarşısında dəyişin), biznes modeli, sərmayə. Son slayddakı “Canlı demoya keç” düyməsi studiyaya aparır.
1. **Problem (30 san).** Azərbaycanda kiçik biznesin saytı ya bahadır (500–3000 ₼), ya da həftələrlə çəkir. Rəqib AI alətləri ingilis dilindədir və bahadır.
2. **Ana səhifə (30 san).** Canlı qradiyent, “Bir cümlə yaz, sayt hazırdır”. Dil seçicidə AZ → RU → EN keçin.
3. **Sayt qurmaq (2 dəq).** Yazın: *“Bakıda ‘Dəmlə’ kofe şopu üçün sayt: menyu, qiymətlər manatla, masa rezervasiyası”*.
   Göstərin: plan addımları, “Qurulur: Menyu bölməsi…”, real fotolar, canlı önizləmə.
4. **Dəyişiklik (1 dəq).** Önizləmədə **Seç** → başlığa klikləyin → “daha qısa və cəsarətli et”. Sonra təklif düyməsinə basın (məs. “Rəylər bölməsi əlavə et”).
5. **Plan rejimi (30 san).** “Planla” → “onlayn sifariş əlavə edək” — AI əvvəl plan göstərir, “Planı icra et”.
6. **Yayım (1 dəq).** **Yayımla** → `demle-xxxx.novocode.app` → QR kodu telefonla oxudun, sayt telefonda açılır.
7. **Platforma (1 dəq).** `/app` paneli (layihələr, “Canlı” nişanı), `/admin` — modelləri və provayderləri biz idarə edirik, xərci ölçürük.
8. **Biznes (1 dəq).** Freemium → Pro 29 ₼ / Biznes 79 ₼; AI xərci sorğu başına ölçülür (admin → Xərc), marja planı.

## Tez-tez verilən suallar

- **Hansı AI?** Açıq və kommersiya modelləri (NVIDIA, OpenRouter, Anthropic, OpenAI…) — admin paneldən dəyişir; asılılıq yoxdur.
- **Kod kimindir?** İstifadəçinin — ZIP kimi yüklənir, istənilən hostinqə qoyulur.
- **Rəqiblərdən fərq?** Azərbaycan/rus/türk dilləri, yerli qiymət, yerli ödəniş (planda), yerli dəstək.
