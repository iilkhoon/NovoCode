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
- Images: use `https://picsum.photos/seed/<english-keyword>/<w>/<h>` with descriptive `alt`, `object-cover`, and fixed aspect ratios (`aspect-[4/3]`). Decorative shapes via CSS gradients / inline SVG.
- Sticky translucent header (`backdrop-blur`), meaningful footer (contacts, links, socials, ©️ year).
- Accessibility: semantic tags, `alt` text, contrast ≥ 4.5:1, labels on inputs, `aria-label` on icon buttons.

## Avoid
- Lorem ipsum, "Your Company", emojis as icons, purple-to-blue default gradients on everything, walls of centered text, tiny tap targets.
