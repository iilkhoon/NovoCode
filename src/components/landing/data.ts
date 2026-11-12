/** All marketing copy for the landing page lives here so it is easy to edit. */

export const ROTATING_WORDS = ["restoranının", "mağazanın", "klinikanın", "startapının", "salonunun", "portfoliosunun"];

export const TYPEWRITER = [
  "Bakıda kofe şopu üçün menyu və masa rezervasiyalı sayt…",
  "Əl işi zərgərlik mağazası: kataloq, səbət və sifariş…",
  "Stomatologiya klinikası üçün onlayn randevu sistemi…",
  "İngilis dili kursu üçün qeydiyyat və qiymət planları…",
  "Toy fotoqrafı üçün zərif, minimal portfolio…",
];

/** Hero metrics — every number is a real product fact (see README / src). */
export const HERO_STATS = [
  { glyph: "<", target: 3, suffix: " cəhd", decimals: 0, label: "Xətanı özü düzəldir" },
  { glyph: "*", target: 12, suffix: "", decimals: 0, label: "Peşəkar skill" },
  { glyph: "#", target: 6, suffix: "", decimals: 0, label: "Dizayn üslubu" },
  { glyph: "%", target: 100, suffix: "%", decimals: 0, label: "Kod sizindir" },
];

export const EXAMPLES = [
  { label: "Kofe şop", prompt: "Bakıda 'Dəmlə' adlı kofe şopu üçün sayt: menyu kateqoriyaları, qiymətlər manatla, masa rezervasiyası və əlaqə bölməsi. İsti, premium dizayn." },
  { label: "Onlayn mağaza", prompt: "Əl işi keramika satan 'Gil' mağazası: kataloq, filtr, səbət, sifariş forması və admin panel." },
  { label: "Klinika", prompt: "Stomatologiya klinikası üçün sayt: xidmətlər, həkimlər, onlayn randevu (tarix və saat seçimi) və rəylər." },
  { label: "Startap", prompt: "Kiçik bizneslər üçün mühasibat tətbiqi 'Hesabla' üçün landing: hero, imkanlar, qiymət planları, FAQ və müraciət forması." },
  { label: "Portfolio", prompt: "Toy fotoqrafı Aysel Məmmədova üçün minimal, zərif portfolio: qalereya, paketlər, rəylər, əlaqə." },
  { label: "CRM panel", prompt: "Kiçik satış komandası üçün CRM: giriş/qeydiyyat, müştərilər cədvəli, sövdələşmə mərhələləri və statistika paneli." },
];

export const INDUSTRIES = [
  "Restoranlar", "Kofe şoplar", "Klinikalar", "Gözəllik salonları", "Onlayn mağazalar", "Startaplar",
  "Fotoqraflar", "Tədris mərkəzləri", "Otellər", "Daşınmaz əmlak", "Fitness klublar", "Tədbir agentlikləri",
  "Hüquq firmaları", "Avtoservislər", "Turizm şirkətləri", "Çiçək mağazaları",
];

export type TemplateCategory = "Hamısı" | "Biznes" | "Yemək" | "Sağlamlıq" | "Mağaza" | "Şəxsi";
export const TEMPLATE_CATEGORIES: TemplateCategory[] = ["Hamısı", "Biznes", "Yemək", "Sağlamlıq", "Mağaza", "Şəxsi"];

export interface Template {
  name: string;
  category: Exclude<TemplateCategory, "Hamısı">;
  tagline: string;
  palette: { bg: string; fg: string; accent: string; muted: string; card: string };
  font: "serif" | "sans" | "display";
  layout: "split" | "center" | "grid" | "dashboard";
  prompt: string;
}

export const TEMPLATES: Template[] = [
  {
    name: "Dəmlə Kofe",
    category: "Yemək",
    tagline: "Menyu · Rezervasiya",
    palette: { bg: "#f5ede3", fg: "#2b1d14", accent: "#b4532a", muted: "#8c7464", card: "#fffaf3" },
    font: "serif",
    layout: "split",
    prompt: "Bakıda 'Dəmlə' adlı kofe şopu üçün isti, premium sayt: hero, menyu kateqoriyaları və manatla qiymətlər, masa rezervasiyası, qalereya, əlaqə və xəritə.",
  },
  {
    name: "Gil Keramika",
    category: "Mağaza",
    tagline: "Kataloq · Səbət · Sifariş",
    palette: { bg: "#fbfaf7", fg: "#1c1b19", accent: "#7a8b5c", muted: "#8a877f", card: "#ffffff" },
    font: "sans",
    layout: "grid",
    prompt: "Əl işi keramika mağazası 'Gil': minimal dizayn, kataloq, kateqoriya filtri, məhsul səhifəsi, səbət, sifariş forması və admin panel.",
  },
  {
    name: "Gülüş Dental",
    category: "Sağlamlıq",
    tagline: "Xidmətlər · Onlayn randevu",
    palette: { bg: "#f2f7fb", fg: "#0d2a3f", accent: "#1d8fd8", muted: "#6a8399", card: "#ffffff" },
    font: "sans",
    layout: "split",
    prompt: "'Gülüş Dental' stomatologiya klinikası: etibarlı mavi dizayn, xidmətlər və qiymətlər, həkimlər, addım-addım onlayn randevu, rəylər və FAQ.",
  },
  {
    name: "Hesabla",
    category: "Biznes",
    tagline: "SaaS landing · Qiymətlər",
    palette: { bg: "#0b0b14", fg: "#f4f4ff", accent: "#7c5cff", muted: "#8b8ba7", card: "#15152a" },
    font: "display",
    layout: "center",
    prompt: "Kiçik bizneslər üçün mühasibat tətbiqi 'Hesabla': tünd tech dizayn, hero, imkanlar bento grid, inteqrasiyalar, 3 qiymət planı, FAQ və demo müraciət forması.",
  },
  {
    name: "Aysel Foto",
    category: "Şəxsi",
    tagline: "Portfolio · Paketlər",
    palette: { bg: "#111111", fg: "#f2efe9", accent: "#d6b98c", muted: "#8f8a80", card: "#1b1b1b" },
    font: "serif",
    layout: "grid",
    prompt: "Toy fotoqrafı Aysel Məmmədova üçün lüks, minimal portfolio: tam ekran qalereya, foto paketləri manatla, rəylər və əlaqə forması.",
  },
  {
    name: "Satış CRM",
    category: "Biznes",
    tagline: "Giriş · Müştərilər · Statistika",
    palette: { bg: "#f7f7f8", fg: "#18181b", accent: "#10b981", muted: "#71717a", card: "#ffffff" },
    font: "sans",
    layout: "dashboard",
    prompt: "Kiçik satış komandası üçün CRM: giriş/qeydiyyat, KPI kartları, müştərilər cədvəli (axtarış, filtr), sövdələşmə kanban lövhəsi və statistika qrafiki.",
  },
  {
    name: "Nərgiz Salon",
    category: "Sağlamlıq",
    tagline: "Randevu · Ustalar",
    palette: { bg: "#fdf2f4", fg: "#3b1220", accent: "#d9467a", muted: "#a0707f", card: "#ffffff" },
    font: "serif",
    layout: "center",
    prompt: "'Nərgiz' gözəllik salonu: zərif çəhrayı dizayn, xidmətlər və qiymətlər, ustalar, usta və saat seçimi ilə randevu, Instagram qalereyası.",
  },
  {
    name: "Plov House",
    category: "Yemək",
    tagline: "Milli mətbəx · Çatdırılma",
    palette: { bg: "#1a120b", fg: "#f7ecd9", accent: "#e0a43a", muted: "#a8977d", card: "#251a10" },
    font: "display",
    layout: "split",
    prompt: "'Plov House' Azərbaycan milli mətbəxi restoranı: tünd isti dizayn, menyu (plov, dolma, qutab, kabablar), onlayn sifariş səbəti, çatdırılma zonaları və rezervasiya.",
  },
  {
    name: "Lingo Akademiya",
    category: "Biznes",
    tagline: "Kurslar · Qeydiyyat",
    palette: { bg: "#fffbeb", fg: "#1f1a0e", accent: "#f59e0b", muted: "#857a5f", card: "#ffffff" },
    font: "display",
    layout: "grid",
    prompt: "'Lingo' dil akademiyası: canlı, enerjili dizayn, kurslar (ingilis, alman, rus), müəllimlər, səviyyə testi, qiymətlər və onlayn qeydiyyat forması.",
  },
];

export const STEPS = [
  { n: "01", title: "Təsvir edin", text: "Azərbaycan dilində yazın, danışın və ya bəyəndiyiniz saytın ekran görüntüsünü atın. Üslub seçin — qalanını Novo düşünür." },
  { n: "02", title: "Novo qurur", text: "AI plan qurur, dizayn sistemi seçir, kodu yazır, paketləri yükləyir və saytı işə salır. Xəta olsa — özü tapıb düzəldir." },
  { n: "03", title: "Söhbətlə təkmilləşdirin", text: "\"Rəngləri isti et\", \"qeydiyyat əlavə et\" deyin. Hər dəyişiklik saniyələr içində önizləmədə görünür, istənilən versiyaya qayıda bilərsiniz." },
  { n: "04", title: "Dünyaya göstərin", text: "Kodu ZIP olaraq yükləyin və ya hazır statik saytı bir kliklə endirib istənilən hostinqə qoyun. layihe.novocode.az tezliklə." },
];

export const PERSONAS = [
  { title: "Kiçik biznes sahibləri", text: "Restoran, salon, mağaza — agentliyə minlərlə manat vermədən peşəkar sayt.", icon: "store" },
  { title: "Fərdi sahibkarlar", text: "Portfolio, xidmət saytı, rezume — bir axşamda hazır.", icon: "user" },
  { title: "Startaplar", text: "İdeyanı yoxlamaq üçün landing və işlək prototip — dəqiqələr içində.", icon: "rocket" },
  { title: "Agentliklər və freelancerlər", text: "Müştəriyə ilk görüşdə canlı prototip göstərin, sonra kodu inkişaf etdirin.", icon: "briefcase" },
  { title: "Tələbələr və müəllimlər", text: "Layihələr, kurs saytları və veb inkişafı öyrənmək üçün canlı kod.", icon: "graduation" },
  { title: "Marketoloqlar", text: "Kampaniya səhifələri, tədbir saytları — developer gözləmədən.", icon: "megaphone" },
];

export const COMPARISON = {
  columns: ["Veb agentlik", "Freelancer", "NovoCode"],
  rows: [
    { label: "Başlanğıc qiyməti (təxmini)", values: ["1 500 – 5 000 ₼", "400 – 1 500 ₼", "0 ₼-dan"] },
    { label: "İlk versiyanın müddəti", values: ["3 – 8 həftə", "1 – 4 həftə", "Dəqiqələr"] },
    { label: "Dəyişiklik etmək", values: ["Əlavə ödəniş", "Gözləmə", "Dərhal, söhbətlə"] },
    { label: "Gecə saat 3-də işləyir", values: [false, false, true] },
    { label: "Kod sizə məxsusdur", values: ["Müqavilədən asılı", "Adətən", true] },
    { label: "Azərbaycan dilində", values: [true, true, true] },
  ],
};

export interface Plan {
  name: string;
  price: { monthly: number; yearly: number };
  credits: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Pulsuz",
    price: { monthly: 0, yearly: 0 },
    credits: "Gündə 5 mesaj",
    description: "Novo-nu sınamaq və ilk saytınızı qurmaq üçün.",
    features: ["Limitsiz layihə", "Canlı önizləmə və kod", "Şəkildən sayt", "ZIP yükləmə"],
    cta: "Pulsuz başla",
  },
  {
    name: "Pro",
    price: { monthly: 29, yearly: 23 },
    credits: "Ayda 250 mesaj",
    description: "Fərdi sahibkarlar və freelancerlər üçün.",
    features: ["Pulsuz plandakı hər şey", "Ən güclü AI modelləri", "Bir kliklə yayım (tezliklə)", "Öz domeniniz (tezliklə)", "Prioritet növbə"],
    cta: "Beta-da pulsuz sına",
    highlight: true,
  },
  {
    name: "Biznes",
    price: { monthly: 79, yearly: 63 },
    credits: "Ayda 1 000 mesaj",
    description: "Agentliklər və komandalar üçün.",
    features: ["Pro plandakı hər şey", "Komanda üzvləri (tezliklə)", "Real verilənlər bazası (tezliklə)", "Fərdi skill-lər", "Prioritet dəstək"],
    cta: "Beta-da pulsuz sına",
  },
];

export const FAQ = [
  { q: "Proqramlaşdırma bilməliyəm?", a: "Xeyr. Nə istədiyinizi adi Azərbaycan dilində yazırsınız və ya deyirsiniz — Novo kodu özü yazır, işə salır və xətaları düzəldir. İstəsəniz kodu görüb redaktə də edə bilərsiniz." },
  { q: "Novo hansı saytları qura bilər?", a: "Landing səhifələr, restoran və kafe saytları, onlayn mağazalar, randevu sistemləri, portfoliolar, admin panellər və CRM kimi daxili alətlər. Formalar, səbət, qeydiyyat/giriş kimi funksiyalar real işləyir." },
  { q: "Ekran görüntüsündən sayt necə işləyir?", a: "Bəyəndiyiniz saytın ekran görüntüsünü və ya kağızda çəkdiyiniz eskizin fotosunu atın. AI rəngləri, şriftləri, düzülüşü təhlil edir və eyni üslubda işlək sayt qurur." },
  { q: "Xəta çıxsa nə olur?", a: "Novo terminalı və brauzer xətalarını izləyir. Xəta tapanda onu özü oxuyur və insan müdaxiləsi olmadan 3 dəfəyə qədər avtomatik düzəltməyə çalışır." },
  { q: "Kod kimə məxsusdur?", a: "Sizə. İstənilən vaxt bütün layihəni ZIP olaraq yükləyə, öz developerinizə verə və ya istənilən hostinqdə yerləşdirə bilərsiniz." },
  { q: "Mesaj/kredit necə hesablanır?", a: "AI-a göndərdiyiniz hər sorğu bir mesaj sayılır. Avtomatik xəta düzəlişləri ayrıca hesablanmır." },
  { q: "Telefondan istifadə etmək olar?", a: "Bəli — Novo mobil brauzerə uyğunlaşdırılıb və səslə yazmanı dəstəkləyir. Ən yaxşı nəticə üçün sayt qurarkən Chrome və ya Edge tövsiyə olunur." },
];
