/** Real stock photos (Unsplash). img("1509042239860-f550ce710b93", 800) → optimised URL. */
export const img = (id, w = 1200, h) =>
  `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ""}&q=80&auto=format&fit=crop`;
