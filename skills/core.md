---
name: core
description: Stack, file layout and coding rules every generated site follows
triggers:
always: true
---
# Core engineering rules

## Stack (fixed — never switch)
- Vite 6 + React 19, **JavaScript/JSX only** (`.jsx` / `.js`, no TypeScript files).
- Tailwind CSS v4 via `@tailwindcss/vite`. Configuration lives in `src/index.css` inside `@theme { … }` — there is NO `tailwind.config.js`; never create one.
- Icons: `lucide-react`. Animation: `motion` (`import { motion } from "motion/react"`). Routing: `react-router-dom` v7 (`BrowserRouter`, `Routes`, `Route`, `Link`).
- Path alias `@/` → `src/`.

## Already in the project (reuse, don't rewrite)
- `src/components/ui/button.jsx` → `<Button variant="primary|secondary|outline|ghost" size="sm|md|lg" as={Link}>`
- `src/components/ui/card.jsx` → `<Card>`; `src/components/ui/input.jsx` → `<Input>`, `<Textarea>`; `src/components/ui/badge.jsx` → `<Badge>`
- `src/lib/utils.js` → `cn(...)`
- `src/lib/db.js` → `db.collection(name)` with `all/get/where/add/update/remove/seed/subscribe`, and the hook `useCollection(name)` → `[items, collection]`.
- `src/lib/auth.js` → `useAuth()` → `{ user, signUp, signIn, signOut }` (async, throws Error with Azerbaijani message).

## File rules
- One component per file under `src/components/` (sections: `src/components/sections/`), pages under `src/pages/`.
- Keep files under ~200 lines; split when bigger.
- Every import must point to a file that exists or that you create in the same answer. Every named import must be exported.
- Always write the COMPLETE file content. Never write "...rest unchanged" or placeholders.
- Only add npm packages when really needed; if you do, emit `<novo-shell>npm install pkg</novo-shell>` BEFORE files that use it. Prefer what is already installed.
- No `localStorage` access during module import time other than through `db`/`auth` helpers.
- Forms must work: controlled inputs, validation messages in Azerbaijani, success state.
- Links that are not implemented go to `#` anchors of real sections — no dead pages.
