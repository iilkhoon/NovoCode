/**
 * Verified Unsplash photos for the no-API-key fallback. Every id here was downloaded
 * and checked by eye for its topic. Add new ids only after doing the same.
 */
export const PHOTO_LIBRARY: { words: string[]; ids: string[] }[] = [
  { words: ["coffee", "cafe", "latte", "espresso", "cappuccino", "barista", "tea", "drink"], ids: ["1509042239860-f550ce710b93", "1495474472287-4d71bcdd2085", "1442512595331-e89e73853f31", "1514432324607-a09d9b4aefdd", "1511920170033-f8396924c348", "1461023058943-07fcbe16d735", "1517701604599-bb29b565090c", "1501339847302-ac426a4a7cbb", "1554118811-1e0d58224f24"] },
  { words: ["bakery", "bread", "croissant", "pastry", "dessert", "cake", "tart", "sweet"], ids: ["1555507036-ab1f4038808a", "1509440159596-0249088772ff", "1519915028121-7d3463d20b13"] },
  { words: ["restaurant", "food", "dish", "dinner", "kebab", "meat", "grill", "plov", "pilaf", "rice", "salad", "menu", "lunch", "chef", "doner"], ids: ["1603133872878-684f208fb84b", "1599487488170-d11ec9c172f0", "1529006557810-274b9b2fc783", "1544025162-d76694265947", "1596797038530-2c107229654b", "1540189549336-e6e99c3679fe", "1504674900247-0877df9cc836", "1555396273-367ea4eb4db5", "1517248135467-4c7edcad34c4"] },
  { words: ["pottery", "ceramic", "ceramics", "vase", "bowl", "plate", "cup", "mug", "handmade", "craft", "clay"], ids: ["1610701596007-11502861dcfa", "1612196808214-b8e1d6145a8c", "1578749556568-bc2c40e68b61", "1610701596061-2ecf227e85b2", "1565193566173-7a0ee3dbe261", "1493106641515-6b5631de4bb9", "1595351298020-038700609878"] },
  { words: ["dental", "dentist", "teeth", "tooth", "clinic", "doctor", "medical", "health", "hospital", "smile"], ids: ["1629909613654-28e377c37b09", "1598256989800-fe5f95da9787", "1606811971618-4486d14f3f99", "1609840114035-3c981b782dfe", "1559839734-2b71ea197ec2", "1612349317150-e413f6a5b16d", "1622253692010-333f2da6031d", "1588776814546-1ffcf47267a5"] },
  { words: ["wedding", "bride", "groom", "couple", "love", "engagement", "ring", "bouquet", "flowers", "photographer", "photography"], ids: ["1519741497674-611481863552", "1465495976277-4387d4b0b4c6", "1583939003579-730e3918a45a", "1537633552985-df8429e8048b", "1520854221256-17451cc331bf", "1525258946800-98cfd641d0de", "1606216794074-735e91aa2c92", "1469371670807-013ccf25f16a", "1511285560929-80b456fea0bc"] },
  { words: ["salon", "beauty", "hair", "nail", "nails", "manicure", "makeup", "spa", "facial", "cosmetics", "skincare", "barber"], ids: ["1560066984-138dadb4c035", "1522337360788-8b13dee7a37e", "1604654894610-df63bc536371", "1570172619644-dfd03ed5d881", "1487412947147-5cebf100ffc2", "1521590832167-7bcbfaa6381f"] },
  { words: ["school", "student", "students", "class", "classroom", "education", "course", "learning", "university", "language", "teacher", "study", "books"], ids: ["1523240795612-9a054b0db644", "1522202176988-66273c2fd55f", "1524178232363-1fb2b075b655", "1503676260728-1c00da094a0b", "1509062522246-3755977927d7", "1546410531-bb4caa6b424d"] },
  { words: ["office", "business", "team", "startup", "meeting", "laptop", "work", "dashboard", "analytics", "saas", "software", "app", "finance", "data"], ids: ["1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1556761175-5973dc0f32e7", "1522071820081-009f0129c71c", "1573496359142-b8d87734a5a2"] },
  { words: ["person", "portrait", "woman", "man", "face", "customer", "avatar", "profile", "testimonial", "review", "user"], ids: ["1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1438761681033-6461ffad8d80", "1507003211169-0a1dd7228f2d", "1544005313-94ddf0286df2", "1472099645785-5658abf4ff4e", "1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d"] },
];

const GENERIC = ["1556761175-5973dc0f32e7", "1554118811-1e0d58224f24", "1522071820081-009f0129c71c", "1460925895917-afdab827c52f", "1517248135467-4c7edcad34c4"];

/** Picks the best-matching group for a hyphenated query; earlier words weigh more. */
export function libraryIds(q: string): string[] {
  const words = q.toLowerCase().split("-").filter(Boolean);
  let best: string[] = GENERIC;
  let bestScore = 0;
  for (const g of PHOTO_LIBRARY) {
    const score = words.reduce((s, w, i) => s + (g.words.some((k) => w === k || w.startsWith(k) || k.startsWith(w) && w.length > 3) ? 10 - Math.min(i, 9) : 0), 0);
    if (score > bestScore) (best = g.ids), (bestScore = score);
  }
  return best;
}

export const unsplashUrl = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;
