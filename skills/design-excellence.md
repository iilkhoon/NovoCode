---
name: design-excellence
description: Visual quality bar so sites look premium, not generic
triggers:
always: true
---
# Design excellence — "möhtəşəm" quality bar

Before writing code, decide a **design direction** in one sentence (e.g. "warm editorial, cream background, deep pomegranate accent, serif headlines") and stay consistent.

## Tokens first
- Rewrite the `@theme` block in `src/index.css` for each project: background, foreground, muted, primary, accent, border, card, fonts. Use `oklch()` colors.
- Pick a font pair and update the Google Fonts `<link>` in `index.html` (display + text, e.g. "Fraunces + Inter", "Space Grotesk + Inter", "Playfair Display + Manrope", "Unbounded + Onest"). Fonts must support Azerbaijani letters (ə, ğ, ı, ş, ç, ö, ü).
- Use only token colors (`bg-primary`, `text-muted-foreground`…) plus at most one deliberate gradient. No random hex colors in components.

## Layout & typography
- Container: `mx-auto max-w-6xl px-5 md:px-8`. Section spacing: `py-20 md:py-28`.
- Strong hierarchy: hero headline `text-4xl md:text-6xl lg:text-7xl` with `tracking-tight` and `text-balance`; body `text-lg text-muted-foreground leading-relaxed`; eyebrow labels `text-xs uppercase tracking-[0.25em]`.
- Vary section layouts (split, bento grid, full-bleed image, cards, timeline). Never stack five identical centered sections.
- Mobile first: everything must look right at 375px. Use `grid md:grid-cols-2 lg:grid-cols-3`, hide decoration on small screens if needed. Include a working mobile menu.

## Detail
- Rounded corners consistent (`rounded-2xl` cards, `rounded-full` buttons). Soft borders + subtle shadows, generous whitespace.
- Hover/focus states on every interactive element; `transition` on buttons/cards.
- Tasteful motion with `motion/react`: fade/slide-in on scroll (`whileInView`, `viewport={{ once: true }}`), duration 0.5–0.7s. No endless distracting animation.
- Images — ALWAYS real, on-topic photos via `https://img.novo/<w>x<h>/<english-keywords-hyphenated>` (the platform swaps it for a matching stock photo). Be specific: `https://img.novo/1600x900/white-sneakers-on-wooden-shelf`, `https://img.novo/800x800/black-leather-ankle-boots`, `https://img.novo/800x600/latte-art-coffee-cup`. Need several different photos of the same thing? Add `?n=1`, `?n=2`… Every product/card/category gets its own matching photo. Use descriptive Azerbaijani `alt`, `object-cover`, fixed aspect ratios (`aspect-[4/5]`, `aspect-[4/3]`). Never picsum, never empty grey boxes. Decorative shapes via CSS gradients / inline SVG.
- Sticky translucent header (`backdrop-blur`), meaningful footer (contacts, links, socials, ©️ year).
- Accessibility: semantic tags, `alt` text, contrast ≥ 4.5:1, labels on inputs, `aria-label` on icon buttons.

## What makes a site look professional (do these)
- Full-bleed hero photo with a dark gradient overlay (`bg-gradient-to-r from-black/70 to-black/10`) and white text, OR a split hero with a large photo — not a plain coloured block.
- A small pill badge above the headline ("Yeni sezon endirimi", "2015-dən bəri"), a bold 2–3 line headline, one-sentence subline, primary + secondary button.
- A trust strip right under the hero: 3 items with icon + bold title + small text (e.g. "Pulsuz çatdırılma / 50 ₼-dan yuxarı", "14 gün qaytarma", "Təhlükəsiz ödəniş").
- Category tiles as tall photo cards with the name + "Kəşf et →" over a bottom gradient.
- Product/service cards: photo with rounded corners, small brand/category label, name, rating (★ 4.8 (73)), price with old price struck through, corner badges ("−24%", "Çox satan", "Yeni"), a heart/favourite button.
- Section headers: title + short muted subtitle on the left, "Hamısına bax →" link on the right.
- Real, specific content: Azerbaijani names, realistic prices in ₼, addresses in Bakı, phone `+994 …`. No "Product 1".
- Working interactions: filters (checkbox categories, price ranges, brands), sort select, cart with count badge, favourites, search — all with real state.
- Multi-page with react-router when the site has more than one natural page (catalog, detail, cart, about, contact), with breadcrumbs on inner pages.

## Avoid
- Lorem ipsum, "Your Company", emojis as icons, purple-to-blue default gradients on everything, walls of centered text, tiny tap targets.
