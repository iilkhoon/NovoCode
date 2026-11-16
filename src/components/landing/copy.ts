"use client";
import { usePrefs, type Lang } from "@/lib/ui-store";
import { COMPARISON, FAQ, PLANS, STEPS, TEMPLATE_CATEGORIES, type Plan, type TemplateCategory } from "./data";

/** Landing-page copy per language. Azerbaijani is built from data.ts (the source of truth). */

type Head = { label: string; lines: [string, string]; text?: string };
export interface LandingCopy {
  how: Head;
  steps: { n: string; title: string; text: string }[];
  studio: Head;
  caps: Head & { items: { t: string; d: string }[] };
  templates: Head & { cats: Record<TemplateCategory, string> };
  compare: Head & { columns: string[]; rows: { label: string; values: (string | boolean)[] }[]; note: string };
  pricing: Head & { plans: Plan[]; recommended: string; perMonth: string; soon: string };
  faq: Head & { items: { q: string; a: string }[] };
  closing: { kicker: string; lines: [string, string] };
  footer: { tagline: string; product: string; contact: string; locale: string; links: [string, string, string] };
  extra: { closingSub: string; closingCta: string; beta: string; resources: string; faq: string; designSystem: string; studio: string };
}

const az: LandingCopy = {
  how: { label: "Necə işləyir", lines: ["Fikirdən", "*canlı sayta.*"], text: "Brif yazmaq, dizayner axtarmaq, həftələrlə gözləmək yoxdur. Bütün proses bir söhbətdir." },
  steps: STEPS,
  studio: { label: "Studio", lines: ["Siz danışırsınız.", "*Novo qurur.*"], text: "Solda söhbət, sağda canlı sayt. Kod yazılır, paketlər yüklənir — xəta çıxsa, Novo terminalı oxuyub özü düzəldir." },
  caps: {
    label: "Bacarıqlar",
    lines: ["Agentliyin işi —", "*söhbət sürətində.*"],
    items: [
      { t: "Ana dilinizdə danışın", d: "Yazın və ya mikrofonu basıb deyin. Novo Azərbaycan dilini anlayır — texniki termin lazım deyil." },
      { t: "Xətanı özü düzəldir", d: "Hər dəyişiklikdən sonra terminalı və brauzeri yoxlayır, xətanın səbəbini tapıb düzəldir." },
      { t: "Şəkildən sayt", d: "Bəyəndiyiniz saytın ekran görüntüsünü və ya kağızdakı eskizi atın — eyni üslubda işlək sayt alın." },
      { t: "Görüntü yox, məhsul", d: "Formalar göndərilir, səbət hesablayır, istifadəçilər qeydiyyatdan keçir, rezervlər yadda qalır." },
      { t: "Hər addım yadda qalır", d: "Bəyənmədiniz? İstənilən əvvəlki versiyaya bir kliklə qayıdın." },
      { t: "Kod sizindir", d: "Təmiz React və Tailwind. ZIP yükləyin, developerə verin, istənilən hostinqə qoyun." },
    ],
  },
  templates: {
    label: "Nümunələr",
    lines: ["Bir ideya seçin,", "*Novo uyğunlaşdırsın.*"],
    text: "Hər nümunə real, işlək funksiyalarla qurulur. Kliklə başlayın, sonra öz biznesinizə görə dəyişin.",
    cats: Object.fromEntries(TEMPLATE_CATEGORIES.map((c) => [c, c])) as Record<TemplateCategory, string>,
  },
  compare: { label: "Müqayisə", lines: ["Həftələr yox, dəqiqələr.", "*Minlər yox, manatlar.*"], columns: COMPARISON.columns, rows: COMPARISON.rows, note: "* Agentlik və freelancer qiymətləri Bakı bazarı üzrə təxmini aralıqlardır." },
  pricing: { label: "Qiymətlər", lines: ["Sadə qiymət.", "*Gizli ödəniş yoxdur.*"], text: "Pulsuz başlayın, biznesiniz böyüdükcə yüksəldin. Gizli ödəniş, uzunmüddətli müqavilə yoxdur.", plans: PLANS, recommended: "Tövsiyə", perMonth: "₼ / ay", soon: "Tezliklə" },
  faq: { label: "Suallar", lines: ["Tez-tez", "*verilən suallar.*"], items: FAQ },
  closing: { kicker: "Başlayın", lines: ["Növbəti saytınız", "*bir cümlə uzaqlığındadır.*"] },
  footer: { tagline: "Azərbaycan dilində AI sayt qurucusu. Bir cümlə yaz — sayt hazırdır.", product: "Məhsul", contact: "Əlaqə", locale: "Azərbaycan dili · AZN", links: ["Necə işləyir", "Nümunələr", "Qiymətlər"] },
  extra: { closingSub: "Pulsuz başlayın, kart tələb olunmur. İlk versiya çayınız soyumadan hazır olacaq.", closingCta: "İndi qurmağa başla", beta: "Beta dövründə bütün imkanlar pulsuzdur. Ödənişli planların qiyməti tezliklə açıqlanacaq.", resources: "Resurslar", faq: "Suallar", designSystem: "Dizayn sistemi", studio: "Studio" },
};

const tr: LandingCopy = {
  how: { label: "Nasıl çalışır", lines: ["Fikirden", "*canlı siteye.*"], text: "Brif yazmak, tasarımcı aramak, haftalarca beklemek yok. Tüm süreç tek bir sohbet." },
  steps: [
    { n: "01", title: "Anlatın", text: "Yazın, söyleyin ya da beğendiğiniz sitenin ekran görüntüsünü atın. Stili seçin — gerisini Novo düşünür." },
    { n: "02", title: "Novo kurar", text: "Yapay zekâ plan yapar, tasarım sistemini seçer, kodu yazar ve siteyi çalıştırır. Hata olursa kendisi bulup düzeltir." },
    { n: "03", title: "Sohbetle geliştirin", text: "\"Renkleri sıcak yap\", \"kayıt ekle\" deyin. Her değişiklik saniyeler içinde önizlemede; istediğiniz sürüme dönebilirsiniz." },
    { n: "04", title: "Dünyaya açın", text: "Tek tıkla yayınlayın — siteniz kendi adresinde canlı. Kodu ZIP olarak da indirebilirsiniz." },
  ],
  studio: { label: "Stüdyo", lines: ["Siz konuşursunuz.", "*Novo kurar.*"], text: "Solda sohbet, sağda canlı site. Kod yazılır, paketler yüklenir — hata çıkarsa Novo terminali okuyup kendisi düzeltir." },
  caps: {
    label: "Yetenekler",
    lines: ["Ajansın işi —", "*sohbet hızında.*"],
    items: [
      { t: "Kendi dilinizde konuşun", d: "Yazın ya da mikrofona söyleyin. Türkçe, Azerice, Rusça, İngilizce — teknik terim gerekmez." },
      { t: "Hatayı kendisi düzeltir", d: "Her değişiklikten sonra terminali ve tarayıcıyı kontrol eder, hatanın nedenini bulup düzeltir." },
      { t: "Görselden site", d: "Beğendiğiniz sitenin ekran görüntüsünü ya da kâğıttaki eskizi atın — aynı stilde çalışan site alın." },
      { t: "Görüntü değil, ürün", d: "Formlar gönderilir, sepet hesaplar, kullanıcılar kaydolur, rezervasyonlar saklanır." },
      { t: "Her adım kaydedilir", d: "Beğenmediniz mi? Önceki herhangi bir sürüme tek tıkla dönün." },
      { t: "Kod sizin", d: "Temiz React ve Tailwind. ZIP indirin, geliştiricinize verin, istediğiniz yerde barındırın." },
    ],
  },
  templates: { label: "Örnekler", lines: ["Bir fikir seçin,", "*Novo uyarlasın.*"], text: "Her örnek gerçek, çalışan özelliklerle kurulur. Tıklayıp başlayın, sonra işinize göre değiştirin.", cats: { Hamısı: "Tümü", Biznes: "İş", Yemək: "Yemek", Sağlamlıq: "Sağlık", Mağaza: "Mağaza", Şəxsi: "Kişisel" } },
  compare: {
    label: "Karşılaştırma",
    lines: ["Haftalar değil, dakikalar.", "*Binler değil, birkaç yüz.*"],
    columns: ["Web ajansı", "Freelancer", "NovoCode"],
    rows: [
      { label: "Başlangıç fiyatı (tahmini)", values: ["1 500 – 5 000 ₼", "400 – 1 500 ₼", "0 ₼'den"] },
      { label: "İlk sürüm süresi", values: ["3 – 8 hafta", "1 – 4 hafta", "Dakikalar"] },
      { label: "Değişiklik yapmak", values: ["Ek ücret", "Bekleme", "Anında, sohbetle"] },
      { label: "Gece 3'te çalışır", values: [false, false, true] },
      { label: "Kod size ait", values: ["Sözleşmeye bağlı", "Genellikle", true] },
      { label: "Yerel dilde", values: [true, true, true] },
    ],
    note: "* Ajans ve freelancer fiyatları Bakü pazarına göre tahmini aralıklardır.",
  },
  pricing: {
    label: "Fiyatlar",
    lines: ["Basit fiyat.", "*Gizli ücret yok.*"],
    text: "Ücretsiz başlayın, işiniz büyüdükçe yükseltin. Gizli ücret ve uzun süreli sözleşme yok.",
    plans: [
      { ...PLANS[0], name: "Ücretsiz", credits: "Günde 5 mesaj", description: "Novo'yu denemek ve ilk sitenizi kurmak için.", features: ["Sınırsız proje", "Canlı önizleme ve kod", "Görselden site", "ZIP indirme"], cta: "Ücretsiz başla" },
      { ...PLANS[1], credits: "Ayda 250 mesaj", description: "Serbest çalışanlar ve küçük işletmeler için.", features: ["Ücretsiz plandaki her şey", "En güçlü AI modelleri", "Tek tıkla yayın", "Kendi alan adınız (yakında)", "Öncelikli sıra"], cta: "Beta'da ücretsiz dene" },
      { ...PLANS[2], name: "İşletme", credits: "Ayda 1 000 mesaj", description: "Ajanslar ve ekipler için.", features: ["Pro plandaki her şey", "Ekip üyeleri (yakında)", "Gerçek veritabanı", "Özel beceriler", "Öncelikli destek"], cta: "Beta'da ücretsiz dene" },
    ],
    recommended: "Önerilen",
    perMonth: "₼ / ay",
    soon: "Yakında",
  },
  faq: {
    label: "Sorular",
    lines: ["Sıkça", "*sorulan sorular.*"],
    items: [
      { q: "Programlama bilmem gerekir mi?", a: "Hayır. Ne istediğinizi günlük dille yazar ya da söylersiniz — Novo kodu kendisi yazar, çalıştırır ve hataları düzeltir. İsterseniz kodu görüp düzenleyebilirsiniz." },
      { q: "Novo hangi siteleri kurabilir?", a: "Landing sayfalar, restoran ve kafe siteleri, online mağazalar, randevu sistemleri, portfolyolar, yönetim panelleri ve CRM gibi iç araçlar. Formlar, sepet, kayıt/giriş gerçekten çalışır." },
      { q: "Ekran görüntüsünden site nasıl çalışır?", a: "Beğendiğiniz sitenin ekran görüntüsünü ya da eskizinizin fotoğrafını atın. AI renkleri, yazı tiplerini ve düzeni analiz edip aynı stilde çalışan bir site kurar." },
      { q: "Hata çıkarsa ne olur?", a: "Novo terminali ve tarayıcı hatalarını izler; hatayı kendisi okur ve insan müdahalesi olmadan 3 kereye kadar otomatik düzeltmeyi dener." },
      { q: "Kod kime ait?", a: "Size. Projeyi istediğiniz zaman ZIP olarak indirip geliştiricinize verebilir ya da istediğiniz yerde barındırabilirsiniz." },
      { q: "Mesaj/kredi nasıl hesaplanır?", a: "AI'ya gönderdiğiniz her istek bir mesaj sayılır. Otomatik hata düzeltmeleri ayrıca sayılmaz." },
      { q: "Telefondan kullanılabilir mi?", a: "Evet — mobil tarayıcıya uyumludur ve sesle yazmayı destekler. Site kurarken en iyi sonuç için Chrome ya da Edge önerilir." },
    ],
  },
  closing: { kicker: "Başlayın", lines: ["Bir sonraki siteniz", "*bir cümle uzağınızda.*"] },
  footer: { tagline: "Yapay zekâ ile site kurucu. Bir cümle yaz — siten hazır.", product: "Ürün", contact: "İletişim", locale: "Türkçe · AZN", links: ["Nasıl çalışır", "Örnekler", "Fiyatlar"] },
  extra: { closingSub: "Ücretsiz başlayın, kart gerekmez. İlk sürüm çayınız soğumadan hazır.", closingCta: "Hemen kurmaya başla", beta: "Beta süresince tüm özellikler ücretsiz. Ücretli planların fiyatları yakında açıklanacak.", resources: "Kaynaklar", faq: "Sorular", designSystem: "Tasarım sistemi", studio: "Stüdyo" },
};

const ru: LandingCopy = {
  how: { label: "Как это работает", lines: ["От идеи —", "*к живому сайту.*"], text: "Не нужно писать ТЗ, искать дизайнера и ждать неделями. Весь процесс — один диалог." },
  steps: [
    { n: "01", title: "Опишите", text: "Напишите, скажите голосом или пришлите скриншот понравившегося сайта. Выберите стиль — остальное Novo продумает." },
    { n: "02", title: "Novo создаёт", text: "AI составляет план, выбирает дизайн-систему, пишет код и запускает сайт. Если есть ошибка — сам находит и исправляет." },
    { n: "03", title: "Дорабатывайте в чате", text: "Скажите «сделай цвета теплее», «добавь регистрацию». Изменения видны за секунды, к любой версии можно вернуться." },
    { n: "04", title: "Покажите миру", text: "Публикация в один клик — сайт работает на своём адресе. Код можно скачать архивом." },
  ],
  studio: { label: "Студия", lines: ["Вы говорите.", "*Novo строит.*"], text: "Слева чат, справа живой сайт. Код пишется, пакеты ставятся — если что-то сломалось, Novo читает терминал и чинит сам." },
  caps: {
    label: "Возможности",
    lines: ["Работа агентства —", "*со скоростью чата.*"],
    items: [
      { t: "Говорите на своём языке", d: "Пишите или диктуйте. Русский, азербайджанский, турецкий, английский — технические термины не нужны." },
      { t: "Сам исправляет ошибки", d: "После каждого изменения проверяет терминал и браузер, находит причину ошибки и исправляет." },
      { t: "Сайт из картинки", d: "Пришлите скриншот или фото эскиза — получите рабочий сайт в том же стиле." },
      { t: "Не картинка, а продукт", d: "Формы отправляются, корзина считает, пользователи регистрируются, брони сохраняются." },
      { t: "Каждый шаг сохранён", d: "Не понравилось? Вернитесь к любой версии в один клик." },
      { t: "Код ваш", d: "Чистый React и Tailwind. Скачайте архив, отдайте разработчику, разместите где угодно." },
    ],
  },
  templates: { label: "Примеры", lines: ["Выберите идею —", "*Novo адаптирует.*"], text: "Каждый пример собран с реальными работающими функциями. Начните в один клик и измените под свой бизнес.", cats: { Hamısı: "Все", Biznes: "Бизнес", Yemək: "Еда", Sağlamlıq: "Здоровье", Mağaza: "Магазин", Şəxsi: "Личное" } },
  compare: {
    label: "Сравнение",
    lines: ["Минуты, а не недели.", "*Манаты, а не тысячи.*"],
    columns: ["Веб-агентство", "Фрилансер", "NovoCode"],
    rows: [
      { label: "Стартовая цена (примерно)", values: ["1 500 – 5 000 ₼", "400 – 1 500 ₼", "от 0 ₼"] },
      { label: "Срок первой версии", values: ["3 – 8 недель", "1 – 4 недели", "Минуты"] },
      { label: "Внести изменения", values: ["Доплата", "Ожидание", "Сразу, в чате"] },
      { label: "Работает в 3 часа ночи", values: [false, false, true] },
      { label: "Код принадлежит вам", values: ["По договору", "Обычно", true] },
      { label: "На вашем языке", values: [true, true, true] },
    ],
    note: "* Цены агентств и фрилансеров — примерные диапазоны по рынку Баку.",
  },
  pricing: {
    label: "Цены",
    lines: ["Простые цены.", "*Без скрытых платежей.*"],
    text: "Начните бесплатно и переходите на старшие планы по мере роста. Без скрытых платежей и долгих контрактов.",
    plans: [
      { ...PLANS[0], name: "Бесплатный", credits: "5 сообщений в день", description: "Чтобы попробовать Novo и создать первый сайт.", features: ["Безлимит проектов", "Живой предпросмотр и код", "Сайт из картинки", "Скачивание архивом"], cta: "Начать бесплатно" },
      { ...PLANS[1], credits: "250 сообщений в месяц", description: "Для фрилансеров и небольшого бизнеса.", features: ["Всё из бесплатного", "Самые мощные модели AI", "Публикация в один клик", "Свой домен (скоро)", "Приоритетная очередь"], cta: "Бесплатно в бете" },
      { ...PLANS[2], name: "Бизнес", credits: "1 000 сообщений в месяц", description: "Для агентств и команд.", features: ["Всё из Pro", "Участники команды (скоро)", "Настоящая база данных", "Свои навыки (skills)", "Приоритетная поддержка"], cta: "Бесплатно в бете" },
    ],
    recommended: "Рекомендуем",
    perMonth: "₼ / мес",
    soon: "Скоро",
  },
  faq: {
    label: "Вопросы",
    lines: ["Частые", "*вопросы.*"],
    items: [
      { q: "Нужно ли уметь программировать?", a: "Нет. Вы пишете или говорите, что нужно, обычными словами — Novo сам пишет код, запускает его и исправляет ошибки. При желании код можно посмотреть и отредактировать." },
      { q: "Какие сайты может создать Novo?", a: "Лендинги, сайты ресторанов и кафе, интернет-магазины, системы записи, портфолио, админ-панели и CRM. Формы, корзина, регистрация и вход работают по-настоящему." },
      { q: "Как работает «сайт из скриншота»?", a: "Пришлите скриншот понравившегося сайта или фото эскиза. AI анализирует цвета, шрифты и сетку и собирает рабочий сайт в том же стиле." },
      { q: "Что если появится ошибка?", a: "Novo следит за терминалом и ошибками браузера, сам их читает и до 3 раз пытается исправить автоматически." },
      { q: "Кому принадлежит код?", a: "Вам. Проект можно в любой момент скачать архивом, передать разработчику или разместить на любом хостинге." },
      { q: "Как считаются сообщения?", a: "Каждый запрос к AI — одно сообщение. Автоматические исправления ошибок отдельно не считаются." },
      { q: "Можно ли с телефона?", a: "Да — Novo адаптирован под мобильный браузер и поддерживает голосовой ввод. Для лучшего результата при создании сайта рекомендуем Chrome или Edge." },
    ],
  },
  closing: { kicker: "Начните", lines: ["Ваш следующий сайт —", "*в одной фразе отсюда.*"] },
  footer: { tagline: "AI-конструктор сайтов. Напиши одну фразу — сайт готов.", product: "Продукт", contact: "Контакты", locale: "Русский · AZN", links: ["Как это работает", "Примеры", "Цены"] },
  extra: { closingSub: "Начните бесплатно, карта не нужна. Первая версия будет готова, пока не остыл чай.", closingCta: "Начать создавать", beta: "В бета-версии все возможности бесплатны. Цены платных планов объявим скоро.", resources: "Ресурсы", faq: "Вопросы", designSystem: "Дизайн-система", studio: "Студия" },
};

const en: LandingCopy = {
  how: { label: "How it works", lines: ["From idea", "*to a live site.*"], text: "No briefs, no hunting for designers, no waiting for weeks. The whole process is one conversation." },
  steps: [
    { n: "01", title: "Describe it", text: "Type it, say it, or drop a screenshot of a site you like. Pick a style — Novo thinks through the rest." },
    { n: "02", title: "Novo builds", text: "The AI plans, picks a design system, writes the code and runs the site. If something breaks, it finds and fixes it." },
    { n: "03", title: "Refine by chatting", text: "Say \"make the colours warmer\" or \"add sign-up\". Every change shows up in seconds, and you can go back to any version." },
    { n: "04", title: "Go live", text: "Publish in one click — your site is live on its own address. Or download the code as a ZIP." },
  ],
  studio: { label: "Studio", lines: ["You talk.", "*Novo builds.*"], text: "Chat on the left, live site on the right. Code gets written, packages installed — and if something fails, Novo reads the terminal and fixes it." },
  caps: {
    label: "Capabilities",
    lines: ["An agency's work —", "*at chat speed.*"],
    items: [
      { t: "Speak your language", d: "Type or dictate in English, Azerbaijani, Turkish or Russian — no technical terms needed." },
      { t: "Fixes its own errors", d: "After every change it checks the terminal and browser, finds the cause and fixes it." },
      { t: "Site from a screenshot", d: "Drop a screenshot or a photo of a sketch — get a working site in the same style." },
      { t: "A product, not a picture", d: "Forms submit, carts add up, users sign up, bookings are saved." },
      { t: "Every step is saved", d: "Don't like it? Jump back to any earlier version in one click." },
      { t: "You own the code", d: "Clean React and Tailwind. Download a ZIP, hand it to a developer, host it anywhere." },
    ],
  },
  templates: { label: "Examples", lines: ["Pick an idea,", "*Novo makes it yours.*"], text: "Every example is built with real, working features. Start with a click, then tailor it to your business.", cats: { Hamısı: "All", Biznes: "Business", Yemək: "Food", Sağlamlıq: "Health", Mağaza: "Store", Şəxsi: "Personal" } },
  compare: {
    label: "Compare",
    lines: ["Minutes, not weeks.", "*Tens, not thousands.*"],
    columns: ["Web agency", "Freelancer", "NovoCode"],
    rows: [
      { label: "Starting price (approx.)", values: ["1,500 – 5,000 ₼", "400 – 1,500 ₼", "from 0 ₼"] },
      { label: "Time to first version", values: ["3 – 8 weeks", "1 – 4 weeks", "Minutes"] },
      { label: "Making changes", values: ["Extra cost", "Waiting", "Instantly, by chat"] },
      { label: "Works at 3 a.m.", values: [false, false, true] },
      { label: "You own the code", values: ["Depends on contract", "Usually", true] },
      { label: "In your language", values: [true, true, true] },
    ],
    note: "* Agency and freelancer prices are approximate ranges for the Baku market.",
  },
  pricing: {
    label: "Pricing",
    lines: ["Simple pricing.", "*No hidden fees.*"],
    text: "Start free and upgrade as your business grows. No hidden fees, no long contracts.",
    plans: [
      { ...PLANS[0], name: "Free", credits: "5 messages a day", description: "Try Novo and build your first site.", features: ["Unlimited projects", "Live preview and code", "Site from a screenshot", "ZIP download"], cta: "Start free" },
      { ...PLANS[1], credits: "250 messages a month", description: "For freelancers and small businesses.", features: ["Everything in Free", "The strongest AI models", "One-click publish", "Custom domain (soon)", "Priority queue"], cta: "Try free in beta" },
      { ...PLANS[2], name: "Business", credits: "1,000 messages a month", description: "For agencies and teams.", features: ["Everything in Pro", "Team members (soon)", "Real database", "Custom skills", "Priority support"], cta: "Try free in beta" },
    ],
    recommended: "Recommended",
    perMonth: "₼ / mo",
    soon: "Soon",
  },
  faq: {
    label: "Questions",
    lines: ["Frequently", "*asked questions.*"],
    items: [
      { q: "Do I need to know how to code?", a: "No. You write or say what you want in plain words — Novo writes the code, runs it and fixes errors. You can still view and edit the code if you like." },
      { q: "What can Novo build?", a: "Landing pages, restaurant and café sites, online stores, booking systems, portfolios, admin panels and internal tools like CRMs. Forms, carts and sign-up/login really work." },
      { q: "How does 'site from a screenshot' work?", a: "Drop a screenshot of a site you like or a photo of a sketch. The AI analyses colours, fonts and layout and builds a working site in the same style." },
      { q: "What if there's an error?", a: "Novo watches the terminal and browser errors, reads them itself and tries up to 3 automatic fixes — no human needed." },
      { q: "Who owns the code?", a: "You do. Download the whole project as a ZIP any time, hand it to your developer or host it anywhere." },
      { q: "How are messages counted?", a: "Every request you send to the AI is one message. Automatic error fixes don't count." },
      { q: "Can I use it on my phone?", a: "Yes — Novo works in mobile browsers and supports voice input. For building, Chrome or Edge on a computer gives the best results." },
    ],
  },
  closing: { kicker: "Get started", lines: ["Your next website", "*is one sentence away.*"] },
  footer: { tagline: "AI website builder. Write one sentence — your site is ready.", product: "Product", contact: "Contact", locale: "English · AZN", links: ["How it works", "Examples", "Pricing"] },
  extra: { closingSub: "Start free, no card required. Your first version is ready before your tea gets cold.", closingCta: "Start building now", beta: "Everything is free during the beta. Paid plan prices will be announced soon.", resources: "Resources", faq: "Questions", designSystem: "Design system", studio: "Studio" },
};

export const LANDING_COPY: Record<Lang, LandingCopy> = { az, tr, ru, en };

export function useCopy(): LandingCopy {
  return LANDING_COPY[usePrefs().lang] ?? az;
}
