export const COURSES = {
  İngilis: [
    { name: "General English", level: "A1 → C1", price: 120, weeks: 12, seats: 4 },
    { name: "IELTS hazırlığı", level: "B1+ · 7.0 hədəf", price: 160, weeks: 10, seats: 2 },
    { name: "Business English", level: "B1 → C1", price: 140, weeks: 8, seats: 6 },
  ],
  Alman: [
    { name: "Deutsch A1–A2", level: "Sıfırdan", price: 110, weeks: 12, seats: 5 },
    { name: "Goethe B1 hazırlığı", level: "A2+", price: 140, weeks: 10, seats: 3 },
  ],
  Rus: [
    { name: "Русский язык", level: "A1 → B2", price: 90, weeks: 12, seats: 7 },
    { name: "Danışıq klubu", level: "B1+", price: 40, weeks: 4, seats: 8 },
  ],
};

export const TEACHERS = [
  { name: "Elnur Səfərov", lang: "İngilis · IELTS 8.5", photo: "1507003211169-0a1dd7228f2d" },
  { name: "Ləman Mirzəyeva", lang: "İngilis · CELTA", photo: "1494790108377-be9c29b29330" },
  { name: "Murad Kazımov", lang: "Alman · Goethe C2", photo: "1506794778202-cad84cf45f1d" },
];

export const QUIZ = [
  { q: "She ___ to work every day.", options: ["go", "goes", "going"], a: 1 },
  { q: "I have lived here ___ 2019.", options: ["since", "for", "from"], a: 0 },
  { q: "If I ___ more time, I would travel.", options: ["have", "had", "will have"], a: 1 },
  { q: "The report ___ by Friday.", options: ["must finish", "must be finished", "must finishing"], a: 1 },
  { q: "Hardly ___ the meeting started when the lights went out.", options: ["had", "did", "has"], a: 0 },
];

export const LEVELS = ["A1 · Başlanğıc", "A2 · Elementar", "B1 · Orta", "B2 · Orta-yuxarı", "C1 · İrəli", "C1+ · Peşəkar"];
