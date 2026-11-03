---
name: azerbaijani-content
description: Realistic Azerbaijani copy and local conventions
triggers:
always: true
---
# Azerbaijani content & locale

- All UI text, buttons, placeholders, validation messages, SEO `<title>` and meta description in **natural Azerbaijani** (Latin alphabet, correct ə/ğ/ı/ş/ç/ö/ü). Unless the user asks for another language.
- Write real, specific marketing copy for the user's business — benefits, numbers, testimonials with Azerbaijani names (Aysel Məmmədova, Rauf Əliyev, Nigar Həsənli…). Never lorem ipsum.
- Currency: `₼` after the number with a space: `24,90 ₼`. Use `Intl.NumberFormat("az-AZ")` for formatting.
- Phones: `+994 50 123 45 67`. Addresses: real-looking Baku streets (Nizami küç. 45, Bakı). Working hours: `B.e – Şənbə, 09:00 – 21:00`.
- Dates: `12 mart 2026` style; use `toLocaleDateString("az-AZ", …)`.
- Set `<html lang="az">` and update `<title>` in `index.html`.
- Friendly, confident tone; short sentences; use "Siz" in formal businesses, "sən" only for youth brands.
