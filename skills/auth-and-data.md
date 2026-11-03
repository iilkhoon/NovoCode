---
name: auth-and-data
description: Login/registration, user profiles, CRUD apps and admin panels
triggers: giriş, giris, qeydiyyat, login, istifadeçi, istifadeci, profil, admin, idare, verilenler, baza, crud, hesab, üzv, uzv
always: false
---
# Auth & data playbook
- Use `useAuth()` from `@/lib/auth` — never invent another auth system.
- Pages: `/giris` (sign in), `/qeydiyyat` (sign up) with validation (email format, password ≥ 6 chars, matching confirmation), loading state and Azerbaijani errors from caught `Error.message`.
- Protect private routes with a `<RequireAuth>` component that redirects to `/giris` via `<Navigate>`.
- Data with `useCollection("name")`; always show empty states ("Hələ heç nə yoxdur") and confirm before delete.
- Header shows user name + "Çıxış" when signed in.
- Tell the user (in chat) that the demo database lives in the browser and real server DB comes with publishing.
