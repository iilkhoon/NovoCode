---
name: booking
description: Appointment and booking sites — salons, clinics, hotels, tutors, gyms
triggers: rezerv, randevu, bron, salon, klinika, hekim, otel, stomatoloq, gozellik, idman, fitness, muellim, telim
always: false
---
# Booking playbook
- Services list with duration and price in ₼; staff cards.
- Booking flow (multi-step with progress indicator): service → specialist → date (next 14 days grid) → time slots (09:00–19:00, 30 min, already-booked slots disabled using `db`) → contact details → confirmation.
- Save to `db.collection("bookings")`; `/admin` page lists bookings by day with status (Gözləyir / Təsdiqləndi / Ləğv edildi).
