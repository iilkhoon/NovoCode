# İnvestor sualları — hazır cavablar

Görüşdən əvvəl oxuyun. Rəqəmləri öz real məlumatınızla yeniləyin; **[ ]** içindəkilər sizin doldurmanız üçündür.

## Bazar və rəqabət

**Lovable / Bolt Azərbaycana gəlsə nə olacaq?**
Onların fokusu ingilis dilli, dollarla ödəyən bazardır. Bizim üstünlüyümüz texnologiya yox, yerlilikdir: Azərbaycan dilində interfeys və dəstək, manatla qiymət, yerli ödəniş (Payriff / Epoint), yerli hostinq və tərəfdaşlıqlar (banklar, KOBİA). Böyük oyunçular kiçik bazara ayrıca komanda qoymur — bu, bizə 2–3 il pəncərə verir.

**Bazar kifayət qədər böyükdürmü?**
Azərbaycanda ~822 000 KOS vergi ödəyicisi var (Dövlət Vergi Xidməti). Onların 3%-i ayda orta 35 ₼ ödəsə, illik ~10M ₼ gəlirdir — `/pitch`-də slayderlə göstərin. Bu, yalnız başlanğıcdır: məhsul artıq türk və rus dilindədir, Türkiyə və Mərkəzi Asiya növbəti addımdır.

**Rəqib kimdir?**
Birbaşa: qlobal AI qurucular (Lovable, Bolt, v0). Dolayı: veb agentliklər və freelancerlər (1 500–5 000 ₼, həftələrlə), Tilda/Wix kimi konstruktorlar (özün qurmalısan). Biz agentliyin nəticəsini konstruktorun qiymətinə veririk.

## Məhsul və texnologiya

**Öz AI modeliniz var?**
Hələ yox — bu, şüurlu qərardır. Platforma çox provayderlidir (NVIDIA, OpenRouter, Anthropic, OpenAI, DeepSeek…), model admin paneldən dəyişir. Ən yaxşı/ucuz model hansıdırsa, onu istifadə edirik. Öz modelimiz (fine-tune) 9–12 ayda, xərci azaltmaq üçün planlaşdırılır.

**Müdafiə (moat) nədir?**
1) Yerli brend və paylanma kanalları; 2) Azərbaycan dilinə uyğunlaşdırılmış skill-lər və şablonlar; 3) “Made with Novo” nişanı ilə hər yayımlanan saytdan gələn virallıq; 4) yerli ödəniş və domen inteqrasiyaları; 5) istifadəçi saytlarının bizdə host olunması (keçid xərci).

**AI xərci marjanı yeyərmi?**
Hər mesajın xərci admin → Xərc bölməsində real ölçülür. Pro planda (29 ₼, ~180 mesaj/ay) mesaj başına 0,04 ₼ xərclə brüt marja ~75%-dir (`/pitch` → Biznes modeli). Model qiymətləri hər il düşür; limitlər və kredit paketləri ilə nəzarət edirik. Canlı önizləmə istifadəçinin brauzerində işləyir — server xərci yoxdur.

**Canlı önizləmə texnologiyası kimindir?**
StackBlitz WebContainers. Beta dövründə pulsuz istifadə olunur; kommersiya buraxılışından əvvəl lisenziya alınacaq və ya alternativ (öz sandbox serverimiz) qurulacaq — xərc planında nəzərə alınıb **[lisenziya danışığının statusu]**.

**Kod kimə məxsusdur?**
İstifadəçiyə. React + Tailwind kodu ZIP kimi yüklənir, istənilən hostinqə qoyulur.

## Biznes

**Qiymətlər necədir?**
Pulsuz (gündə 5 mesaj) → Pro 29 ₼/ay → Biznes 79 ₼/ay. Əlavə gəlir: kredit paketləri, öz domen, agentlik planı, şablon mağazası. Beta dövründə hamısı pulsuzdur.

**Traksiya var?**
**[beta istifadəçi sayı, yaradılan layihə sayı, yayımlanan sayt sayı, gözləmə siyahısı]**. Hələ rəqəm azdırsa: “Məhsul tam işləyir; bu sərmayə açıq beta və ilk 1 000 istifadəçi üçündür” deyin. Admin → Xərc bölməsi gündəlik istifadəni göstərir.

**Vəsaiti nəyə xərcləyəcəksiniz?**
40% məhsul və AI infrastrukturu, 30% böyümə və marketinq, 20% komanda, 10% hüquqi/ödəniş/server (`src/lib/pitch.ts`-də dəyişin). Müddət: 18 ay.

**Növbəti 12 ayın hədəfləri?**
1–3 ay: açıq beta, yerli ödəniş, öz domen. 4–8 ay: mobil tətbiq, mağaza və rezervasiya modulları, agentlik planı. 9–12 ay: Türkiyə və Mərkəzi Asiya, şablon mağazası, öz modelimiz.

## Risklər (soruşulmadan qabaqcadan deyin)

- **AI provayder asılılığı** → çox provayderli arxitektura, bir kliklə keçid.
- **Demo zamanı internet/AI kəsilməsi** → `NOVO_DEMO=fallback` ehtiyat rejimi.
- **Hüquqi** → istifadəçi məzmunu və şəxsi məlumat üçün istifadə şərtləri və məxfilik siyasəti **[hazırlanmalıdır]**.

## Mənbələr

- DataReportal, Digital 2025: Azerbaijan — 9.23M internet istifadəçisi (89%)
- Report.az / Dövlət Vergi Xidməti — ~822 000 KOS vergi ödəyicisi
- TechRepublic — Lovable $400M, $13.3B dəyər (avqust 2026)
- Startup Fortune — Lovable ~$500M illik gəlir tempi (2026 ortası)
