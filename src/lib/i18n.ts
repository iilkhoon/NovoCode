"use client";
import { useEffect } from "react";
import { usePrefs, type Lang } from "./ui-store";

/**
 * Interface translations. Each key holds [az, tr, ru, en]. Azerbaijani is the source;
 * missing translations fall back to it. `{n}`-style placeholders are filled by t(key, vars).
 */
const D = {
  // nav
  "nav.skip": ["Məzmuna keç", "İçeriğe geç", "Перейти к содержимому", "Skip to content"],
  "nav.how": ["Necə işləyir", "Nasıl çalışır", "Как это работает", "How it works"],
  "nav.studio": ["Studio", "Stüdyo", "Студия", "Studio"],
  "nav.examples": ["Nümunələr", "Örnekler", "Примеры", "Examples"],
  "nav.pricing": ["Qiymətlər", "Fiyatlar", "Цены", "Pricing"],
  "nav.login": ["Daxil ol", "Giriş yap", "Войти", "Log in"],
  "nav.start": ["Pulsuz başla", "Ücretsiz başla", "Начать бесплатно", "Start free"],
  "nav.projects": ["Layihələrim", "Projelerim", "Мои проекты", "My projects"],
  "nav.startBuilding": ["Sayt qurmağa başla", "Site kurmaya başla", "Создать сайт", "Start building"],
  "nav.openMenu": ["Menyunu aç", "Menüyü aç", "Открыть меню", "Open menu"],
  "nav.closeMenu": ["Menyunu bağla", "Menüyü kapat", "Закрыть меню", "Close menu"],
  "nav.language": ["Dil", "Dil", "Язык", "Language"],
  // hero
  "hero.badge": ["Azərbaycan dilində AI sayt qurucusu", "Yapay zekâ ile site kurucu", "AI-конструктор сайтов", "AI website builder"],
  "hero.title1": ["Bir cümlə yaz,", "Bir cümle yaz,", "Напиши одну фразу —", "Write one sentence,"],
  "hero.title2": ["sayt hazırdır.", "siten hazır.", "сайт готов.", "your site is ready."],
  "hero.sub": [
    "Fikrinizi yazın, deyin və ya şəklini atın. NovoCode dizaynı, kodu və məlumat bazasını qurur — xətaları özü tapıb düzəldir.",
    "Fikrinizi yazın, söyleyin ya da görselini atın. NovoCode tasarımı, kodu ve veritabanını kurar — hataları kendisi bulup düzeltir.",
    "Опишите идею текстом, голосом или картинкой. NovoCode создаст дизайн, код и базу данных — и сам найдёт и исправит ошибки.",
    "Type it, say it or drop a screenshot. NovoCode builds the design, code and database — and finds and fixes its own errors.",
  ],
  "stat.fix": ["Xətanı özü düzəldir", "Hatayı kendisi düzeltir", "Сам исправляет ошибки", "Fixes its own errors"],
  "stat.skills": ["Peşəkar skill", "Profesyonel beceri", "Профессиональных навыков", "Expert skills"],
  "stat.styles": ["Dizayn üslubu", "Tasarım stili", "Стилей дизайна", "Design styles"],
  "stat.own": ["Kod sizindir", "Kod sizin", "Код ваш", "You own the code"],
  "stat.tries": [" cəhd", " deneme", " попытки", " tries"],
  // app shell
  "app.new": ["Yeni layihə", "Yeni proje", "Новый проект", "New project"],
  "app.search": ["Axtar", "Ara", "Поиск", "Search"],
  "app.home": ["Ana səhifə", "Ana sayfa", "Главная", "Home"],
  "app.projects": ["Layihələr", "Projeler", "Проекты", "Projects"],
  "app.templates": ["Şablonlar", "Şablonlar", "Шаблоны", "Templates"],
  "app.import": ["Layihə gətir", "Proje içe aktar", "Импорт проекта", "Import project"],
  "app.recent": ["Son layihələr", "Son projeler", "Недавние", "Recent"],
  "app.noProjects": ["Hələ layihə yoxdur", "Henüz proje yok", "Проектов пока нет", "No projects yet"],
  "app.notFound": ["Heç nə tapılmadı", "Sonuç yok", "Ничего не найдено", "Nothing found"],
  "app.plan": ["{plan} plan", "{plan} plan", "План «{plan}»", "{plan} plan"],
  "app.resets": ["Mesajlar gecə 00:00-da yenilənir", "Mesajlar gece 00:00'da yenilenir", "Сообщения обновляются в 00:00", "Messages reset at midnight"],
  "app.betaNote": ["Beta dövründə pulsuz · gündəlik limit", "Beta süresince ücretsiz · günlük limit", "Бесплатно в бета-версии · дневной лимит", "Free during beta · daily allowance"],
  "app.upgrade": ["Yüksəlt", "Yükselt", "Улучшить", "Upgrade"],
  "app.settings": ["Parametrlər", "Ayarlar", "Настройки", "Settings"],
  "app.theme": ["Tema", "Tema", "Тема", "Theme"],
  "app.upgradePlan": ["Planı yüksəlt", "Planı yükselt", "Улучшить план", "Upgrade plan"],
  "app.admin": ["Admin panel", "Yönetim paneli", "Админ-панель", "Admin panel"],
  "app.guest": ["Qonaq", "Misafir", "Гость", "Guest"],
  "app.guestMode": ["Qonaq rejimi", "Misafir modu", "Гостевой режим", "Guest mode"],
  "app.collapse": ["Paneli yığ", "Paneli daralt", "Свернуть панель", "Collapse sidebar"],
  "app.expand": ["Paneli aç", "Paneli aç", "Развернуть панель", "Expand sidebar"],
  "greet.night": ["Gecəniz xeyrə", "İyi geceler", "Доброй ночи", "Good night"],
  "greet.morning": ["Sabahınız xeyir", "Günaydın", "Доброе утро", "Good morning"],
  "greet.day": ["Günortanız xeyir", "Tünaydın", "Добрый день", "Good afternoon"],
  "greet.evening": ["Axşamınız xeyir", "İyi akşamlar", "Добрый вечер", "Good evening"],
  "app.ask": ["Bu gün nə quraq?", "Bugün ne kuralım?", "Что создадим сегодня?", "What shall we build today?"],
  "kind.site": ["Sayt", "Site", "Сайт", "Website"],
  "kind.landing": ["Landing", "Landing", "Лендинг", "Landing"],
  "kind.app": ["Web tətbiq", "Web uygulama", "Веб-приложение", "Web app"],
  "kind.full": ["+ Backend", "+ Backend", "+ Бэкенд", "+ Backend"],
  "app.fromGithub": ["GitHub-dan", "GitHub'dan", "Из GitHub", "From GitHub"],
  "app.cloneSite": ["Saytdan kopyala", "Siteden kopyala", "Скопировать сайт", "Clone a site"],
  "app.myProjects": ["Layihələrim", "Projelerim", "Мои проекты", "My projects"],
  "app.count": ["{n} layihə · bu brauzerdə saxlanılır", "{n} proje · bu tarayıcıda saklanır", "Проектов: {n} · хранятся в этом браузере", "{n} projects · stored in this browser"],
  "app.loading": ["Yüklənir…", "Yükleniyor…", "Загрузка…", "Loading…"],
  "app.emptyTitle": ["İlk layihənizi yaradın", "İlk projenizi oluşturun", "Создайте первый проект", "Create your first project"],
  "app.emptyBody": [
    "Yuxarıdakı qutuya biznesinizi bir-iki cümlə ilə yazın — Novo dizaynı, mətnləri və kodu özü hazırlayacaq.",
    "Yukarıdaki kutuya işinizi bir iki cümleyle yazın — Novo tasarımı, metinleri ve kodu kendisi hazırlar.",
    "Опишите бизнес в паре предложений в поле выше — Novo подготовит дизайн, тексты и код.",
    "Describe your business in a sentence or two above — Novo prepares the design, copy and code.",
  ],
  "app.startTyping": ["Yazmağa başla", "Yazmaya başla", "Начать", "Start typing"],
  "app.edited": ["Dəyişdirilib {t}", "Düzenlendi {t}", "Изменён {t}", "Edited {t}"],
  "app.live": ["Canlı", "Yayında", "Онлайн", "Live"],
  "menu.open": ["Studioda aç", "Stüdyoda aç", "Открыть в студии", "Open in studio"],
  "menu.rename": ["Adını dəyiş", "Yeniden adlandır", "Переименовать", "Rename"],
  "menu.duplicate": ["Surətini çıxar", "Kopyasını oluştur", "Дублировать", "Duplicate"],
  "menu.share": ["Paylaş", "Paylaş", "Поделиться", "Share"],
  "menu.delete": ["Sil", "Sil", "Удалить", "Delete"],
  // prompt box
  "pb.enhance": ["Təkmilləşdir", "Geliştir", "Улучшить", "Enhance"],
  "pb.enhanceTitle": ["Sorğunu AI ilə təkmilləşdir", "İsteği yapay zekâ ile geliştir", "Улучшить запрос с помощью AI", "Improve the prompt with AI"],
  "pb.placeholder": ["Necə sayt istəyirsiniz?", "Nasıl bir site istiyorsunuz?", "Какой сайт вам нужен?", "What would you like to build?"],
  "pb.auto": ["Avtomatik", "Otomatik", "Авто", "Auto"],
  "pb.style": ["Dizayn üslubu", "Tasarım stili", "Стиль дизайна", "Design style"],
  "pb.addImage": ["Şəkil / eskiz əlavə et", "Görsel / eskiz ekle", "Добавить изображение / эскиз", "Add image / sketch"],
  "pb.voice": ["Səslə yaz", "Sesle yaz", "Голосовой ввод", "Dictate"],
  "pb.stopVoice": ["Dinləməni dayandır", "Dinlemeyi durdur", "Остановить запись", "Stop listening"],
  "pb.send": ["Göndər", "Gönder", "Отправить", "Send"],
  "pb.stop": ["Dayandır", "Durdur", "Остановить", "Stop"],
  "plan.free": ["Pulsuz", "Ücretsiz", "Бесплатный", "Free"],
  // auth
  "auth.welcomeBack": ["Yenidən xoş gəldiniz", "Tekrar hoş geldiniz", "С возвращением", "Welcome back"],
  "auth.startFree": ["Pulsuz başlayın", "Ücretsiz başlayın", "Начните бесплатно", "Start for free"],
  "auth.loginSub": ["Layihələrinizə qayıtmaq üçün daxil olun.", "Projelerinize dönmek için giriş yapın.", "Войдите, чтобы вернуться к проектам.", "Log in to get back to your projects."],
  "auth.signupSub": ["Kart tələb olunmur. İlk saytınız bir neçə dəqiqəyə hazır.", "Kart gerekmez. İlk siteniz birkaç dakikada hazır.", "Карта не нужна. Первый сайт — за несколько минут.", "No card required. Your first site in minutes."],
  "auth.google": ["Google ilə davam et", "Google ile devam et", "Продолжить с Google", "Continue with Google"],
  "auth.github": ["GitHub ilə davam et", "GitHub ile devam et", "Продолжить с GitHub", "Continue with GitHub"],
  "auth.orEmail": ["və ya e-poçtla", "veya e-postayla", "или по e-mail", "or with email"],
  "auth.email": ["E-poçt", "E-posta", "E-mail", "Email"],
  "auth.badEmail": ["E-poçt ünvanı düzgün deyil", "E-posta adresi geçersiz", "Неверный адрес e-mail", "That email doesn't look right"],
  "auth.sendLink": ["Giriş linki göndər", "Giriş bağlantısı gönder", "Отправить ссылку для входа", "Send login link"],
  "auth.sending": ["Göndərilir…", "Gönderiliyor…", "Отправляем…", "Sending…"],
  "auth.noAccount": ["Hesabınız yoxdur?", "Hesabınız yok mu?", "Нет аккаунта?", "No account?"],
  "auth.haveAccount": ["Artıq hesabınız var?", "Zaten hesabınız var mı?", "Уже есть аккаунт?", "Already have an account?"],
  "auth.signup": ["Qeydiyyatdan keçin", "Kaydolun", "Зарегистрируйтесь", "Sign up"],
  "auth.login": ["Daxil olun", "Giriş yapın", "Войдите", "Log in"],
  "auth.guest": ["Qonaq kimi davam et", "Misafir olarak devam et", "Продолжить как гость", "Continue as guest"],
  "auth.checkMail": ["Poçtunuzu yoxlayın", "E-postanızı kontrol edin", "Проверьте почту", "Check your inbox"],
  "auth.sent": ["{email} ünvanına giriş linki göndərdik. Link 15 dəqiqə etibarlıdır.", "{email} adresine giriş bağlantısı gönderdik. 15 dakika geçerlidir.", "Мы отправили ссылку на {email}. Она действует 15 минут.", "We sent a login link to {email}. It's valid for 15 minutes."],
  "auth.otherEmail": ["Başqa ünvan", "Başka adres", "Другой адрес", "Use another email"],
  "auth.tagline1": ["Fikrinizi yazın.", "Fikrinizi yazın.", "Опишите идею.", "Describe your idea."],
  "auth.tagline2": ["Saytınız dəqiqələr içində hazırdır.", "Siteniz dakikalar içinde hazır.", "Сайт готов за минуты.", "Your site is ready in minutes."],
  "auth.f1": ["Azərbaycan, Türk, Rus, İngilis dilləri", "Azerice, Türkçe, Rusça, İngilizce", "Азербайджанский, турецкий, русский, английский", "Azerbaijani, Turkish, Russian, English"],
  "auth.f2": ["Canlı önizləmə", "Canlı önizleme", "Живой предпросмотр", "Live preview"],
  "auth.f3": ["Bir kliklə yayım", "Tek tıkla yayın", "Публикация в один клик", "One-click publish"],
  "auth.soonTitle": ["Hesablar tezliklə", "Hesaplar yakında", "Аккаунты скоро", "Accounts coming soon"],
  "auth.soonBody": ["Hələlik qonaq kimi davam edin — layihələr bu brauzerdə saxlanılır.", "Şimdilik misafir olarak devam edin — projeler bu tarayıcıda saklanır.", "Пока продолжайте как гость — проекты хранятся в этом браузере.", "Continue as a guest for now — projects are kept in this browser."],
  "auth.failed": ["Giriş alınmadı", "Giriş başarısız", "Не удалось войти", "Sign-in failed"],
  "auth.logout": ["Çıxış", "Çıkış", "Выйти", "Log out"],
  "auth.terms": ["Davam etməklə İstifadə şərtləri və Məxfilik siyasəti ilə razılaşırsınız.", "Devam ederek Kullanım koşullarını ve Gizlilik politikasını kabul edersiniz.", "Продолжая, вы принимаете Условия использования и Политику конфиденциальности.", "By continuing you agree to the Terms of use and Privacy policy."],
} as const satisfies Record<string, readonly [string, string, string, string]>;

export type TKey = keyof typeof D;
const IDX: Record<Lang, number> = { az: 0, tr: 1, ru: 2, en: 3 };

export function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>): string {
  let s: string = D[key][IDX[lang] ?? 0] || D[key][0];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** `const t = useT(); t("nav.login")` — follows the language chosen in settings. */
export function useT() {
  const { lang } = usePrefs();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key: TKey, vars?: Record<string, string | number>) => translate(lang, key, vars);
  t.lang = lang;
  return t;
}

/** Localised example prompts for the hero chips and typewriter. */
export const EXAMPLES_I18N: Record<Lang, { label: string; prompt: string }[]> = {
  az: [],
  tr: [
    { label: "Kahve dükkanı", prompt: "İstanbul'da 'Demle' adlı kahve dükkanı için site: menü kategorileri, TL fiyatlar, masa rezervasyonu ve iletişim. Sıcak, premium tasarım." },
    { label: "Online mağaza", prompt: "El yapımı seramik satan 'Kil' mağazası: katalog, filtre, sepet, sipariş formu ve yönetim paneli." },
    { label: "Klinik", prompt: "Diş kliniği için site: hizmetler, doktorlar, online randevu (tarih ve saat seçimi) ve yorumlar." },
    { label: "Startup", prompt: "Küçük işletmeler için muhasebe uygulaması 'Hesapla' landing sayfası: hero, özellikler, fiyat planları, SSS ve başvuru formu." },
    { label: "Portfolyo", prompt: "Düğün fotoğrafçısı için minimal, zarif portfolyo: galeri, paketler, yorumlar, iletişim." },
    { label: "CRM panel", prompt: "Küçük satış ekibi için CRM: giriş/kayıt, müşteri tablosu, anlaşma aşamaları ve istatistik paneli." },
  ],
  ru: [
    { label: "Кофейня", prompt: "Сайт для кофейни «Дамла» в Баку: категории меню, цены в манатах, бронирование столиков и контакты. Тёплый премиальный дизайн." },
    { label: "Интернет-магазин", prompt: "Магазин керамики ручной работы «Гил»: каталог, фильтры, корзина, оформление заказа и админ-панель." },
    { label: "Клиника", prompt: "Сайт стоматологической клиники: услуги, врачи, онлайн-запись (выбор даты и времени) и отзывы." },
    { label: "Стартап", prompt: "Лендинг для бухгалтерского приложения «Hesabla»: hero, возможности, тарифы, FAQ и форма заявки." },
    { label: "Портфолио", prompt: "Минималистичное портфолио свадебного фотографа: галерея, пакеты, отзывы, контакты." },
    { label: "CRM", prompt: "CRM для небольшой команды продаж: вход/регистрация, таблица клиентов, этапы сделок и панель статистики." },
  ],
  en: [
    { label: "Coffee shop", prompt: "Website for 'Damla', a coffee shop in Baku: menu categories, prices, table booking and contact section. Warm, premium design." },
    { label: "Online store", prompt: "'Gil', a handmade ceramics store: catalog, filters, cart, checkout form and admin panel." },
    { label: "Clinic", prompt: "Dental clinic website: services, doctors, online booking (date and time picker) and reviews." },
    { label: "Startup", prompt: "Landing page for 'Hesabla', an accounting app for small businesses: hero, features, pricing, FAQ and signup form." },
    { label: "Portfolio", prompt: "Minimal, elegant portfolio for a wedding photographer: gallery, packages, reviews, contact." },
    { label: "CRM", prompt: "CRM for a small sales team: login/signup, customers table, deal stages and a stats dashboard." },
  ],
};
