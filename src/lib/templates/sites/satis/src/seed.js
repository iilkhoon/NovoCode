import { db } from "@/lib/db";

export const STAGES = ["Yeni", "Danışıq", "Təklif", "Bağlandı"];

/** Demo data on first run so the dashboard is never empty. */
export function seed() {
  db.collection("customers").seed([
    { name: "Nur Market MMC", contact: "Kənan Əliyev", phone: "+994 50 211 34 56", city: "Bakı", value: 4200, status: "Aktiv" },
    { name: "Baku Prints", contact: "Səbinə Quliyeva", phone: "+994 55 340 12 90", city: "Bakı", value: 1850, status: "Aktiv" },
    { name: "Gəncə Tekstil", contact: "Rauf Məmmədov", phone: "+994 70 455 67 01", city: "Gəncə", value: 7300, status: "Potensial" },
    { name: "Şəki Halva Evi", contact: "Aygün İsmayılova", phone: "+994 51 600 77 43", city: "Şəki", value: 960, status: "Aktiv" },
    { name: "Xəzər Logistika", contact: "Tural Həsənli", phone: "+994 50 777 18 25", city: "Sumqayıt", value: 12400, status: "Potensial" },
    { name: "Lənkəran Çay", contact: "Nigar Abbasova", phone: "+994 55 812 40 66", city: "Lənkəran", value: 3100, status: "Passiv" },
  ]);
  db.collection("deals").seed([
    { title: "Kassa sistemi · 3 filial", company: "Nur Market MMC", amount: 4200, stage: "Danışıq" },
    { title: "Çap avadanlığı", company: "Baku Prints", amount: 1850, stage: "Bağlandı" },
    { title: "İllik müqavilə", company: "Xəzər Logistika", amount: 12400, stage: "Təklif" },
    { title: "Pilot layihə", company: "Gəncə Tekstil", amount: 7300, stage: "Yeni" },
    { title: "Onlayn mağaza", company: "Şəki Halva Evi", amount: 960, stage: "Danışıq" },
  ]);
}

export const azn = (n) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₼`;
