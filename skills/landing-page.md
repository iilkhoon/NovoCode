---
name: landing-page
description: High-converting business / startup / service landing pages
triggers: landing, aciliş, acilis, sayt, startup, xidmet, şirket, sirket, biznes, agentlik, mehsul sehifesi, tanıtım, tanitim, kurs, akademiya
always: false
---
# Landing page playbook

Section order (adapt, don't copy blindly):
1. Header — logo wordmark, 3–5 anchor links, primary CTA.
2. Hero — specific promise headline, 1–2 sentence subline, primary + secondary CTA, visual (image, product mock, or abstract shape), trust row (logos / rating / numbers).
3. Problem → solution or "Necə işləyir" in 3 steps.
4. Features / services — bento grid or cards with lucide icons.
5. Social proof — testimonials with names, roles, avatars (picsum seed), numbers (`500+ müştəri`).
6. Pricing (if relevant) — 3 tiers, highlight middle, prices in ₼.
7. FAQ — accordion built with `useState`.
8. Final CTA band + contact form that saves to `db.collection("leads")` and shows a success message.
9. Footer.
