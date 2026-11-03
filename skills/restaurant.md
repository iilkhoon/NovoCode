---
name: restaurant
description: Restaurants, cafes, bakeries, coffee shops with menus and reservations
triggers: restoran, kafe, menyu, yemek, kofe, qehve, cörek, corek, sirniyyat, pizza, burger, şadlıq, sadliq, mətbəx, metbex, catering
always: false
---
# Restaurant / cafe playbook
- Appetite-driven visuals: large food photography (`picsum.photos/seed/food-…`), warm palette, elegant serif display font.
- Menu: categories as tabs (`useState`), items with name, short description, price in ₼, tags (🌶️ not allowed — use Badge "Acılı", "Vegan"). Seed menu via `db.collection("menu").seed([...])` with 12+ realistic Azerbaijani dishes (Plov, Dolma, Qutab, Lülə kabab, Düşbərə, Paxlava…) when cuisine fits.
- Reservation form: name, phone, date, time, guests → `db.collection("reservations").add(...)`, confirmation card.
- Info: address with embedded map placeholder card, working hours, phone `tel:` link, WhatsApp link `https://wa.me/994…`.
- Optional admin page `/admin` listing reservations with status toggle.
