/**
 * Carpet knot patterns. A carpet is a grid of knots — exactly like pixels.
 * Each pattern is a list of rows; every character is one knot:
 *   R = nar (madder red)   I = indigo   S = saffron   C = wool cream   K = ink   G = walnut green   . = empty
 */
export type Knot = "R" | "I" | "S" | "C" | "K" | "G" | ".";
export type Pattern = string[];

export const KNOT_COLORS: Record<Exclude<Knot, ".">, string> = {
  R: "var(--color-nar)",
  I: "var(--color-indigo)",
  S: "var(--color-saffron)",
  C: "var(--color-wool)",
  K: "var(--color-ink)",
  G: "var(--color-walnut)",
};

const md = (x: number, y: number, cx: number, cy: number) => Math.abs(x - cx) + Math.abs(y - cy);

/** Classic stepped-diamond "göl" medallion (Qazax / Şirvan style). */
export function medallion(size = 25): Pattern {
  const c = (size - 1) / 2;
  const rows: string[] = [];
  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      const d = md(x, y, c, c);
      let k: Knot = ".";
      if (d <= 1) k = "S";
      else if (d === 2) k = "R";
      else if (d === 3) k = "C";
      else if (d <= 5) k = (x + y) % 2 === 0 ? "I" : "I";
      else if (d === 6) k = "S";
      else if (d === 7) k = "C";
      else if (d <= 9) k = d === 8 && (x === c || y === c) ? "S" : "R";
      else if (d === 10) k = "C";
      else if (d === 11) k = "I";
      else if (d === 12) {
        // hooks on the outer edge
        k = (x + y) % 4 === 0 ? "I" : ".";
      }
      // corner stars
      const corners = [
        [2, 2],
        [size - 3, 2],
        [2, size - 3],
        [size - 3, size - 3],
      ];
      for (const [qx, qy] of corners) {
        const dq = md(x, y, qx, qy);
        if (dq === 0) k = "R";
        else if (dq === 1) k = "S";
        else if (dq === 2 && k === ".") k = "I";
      }
      row += k;
    }
    rows.push(row);
  }
  return rows;
}

/** Sawtooth border band ("bordür"), tiled horizontally. */
export function borderBand(width = 96): Pattern {
  const h = 9;
  const rows: string[] = [];
  for (let y = 0; y < h; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const w = Math.abs((x % 8) - 4); // 0..4 triangle wave
      let k: Knot;
      if (y === 0 || y === h - 1) k = "I";
      else if (y === 1 || y === h - 2) k = "C";
      else {
        const yy = y - 2; // 0..4
        if (yy === w) k = "R";
        else if (yy > w) k = (x % 8 === 4 && yy === 4) ? "S" : "S";
        else k = "C";
        if (yy === 4 && x % 8 === 0) k = "I";
      }
      row += k;
    }
    rows.push(row);
  }
  return rows;
}

/** 9×9 logo mark: a small göl with a nar seed in the middle. */
export const LOGO: Pattern = (() => {
  const s = 9, c = 4;
  const rows: string[] = [];
  for (let y = 0; y < s; y++) {
    let r = "";
    for (let x = 0; x < s; x++) {
      const d = md(x, y, c, c);
      r += d === 0 ? "R" : d === 1 ? "C" : d === 2 ? "R" : d === 3 ? "I" : d === 4 ? "I" : ".";
    }
    rows.push(r);
  }
  return rows;
})();

/** Tiny 7×7 motifs used as feature glyphs instead of generic icons. */
export const GLYPHS: Record<string, Pattern> = {
  // speech / voice — two stacked bars like a mouth/waves
  voice: [".......", ".R.R.R.", ".R.R.R.", "RRRRRRR", ".R.R.R.", ".R.R.R.", "......."],
  // heal — a cross (plus)
  heal: ["..III..", "..IRI..", "IIIRIII", "IRRRRRI", "IIIRIII", "..IRI..", "..III.."],
  // image — framed square with a diamond
  image: ["IIIIIII", "I.....I", "I..S..I", "I.SRS.I", "I..S..I", "I.....I", "IIIIIII"],
  // devices — two nested frames
  devices: ["IIIIII.", "I....I.", "I..RRRR", "I..R..R", "IIIR..R", "...R..R", "...RRRR"],
  // data — stacked rows (rug rows)
  data: ["RRRRRRR", ".......", "SSSSSSS", ".......", "IIIIIII", ".......", "RRRRRRR"],
  // history — stepped stairs
  history: ["......R", ".....RR", "....RSS", "...RSS.", "..RSS..", ".RSS...", "RSS...."],
  // code — angle brackets
  code: ["..I.I..", ".I...I.", "I.....I", ".I...I.", "..I.I..", "...R...", "..RRR.."],
  // star (8-point) — quality
  star: ["...R...", ".R.R.R.", "..RSR..", "RRSSSRR", "..RSR..", ".R.R.R.", "...R..."],
};
