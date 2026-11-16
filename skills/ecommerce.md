---
name: ecommerce
description: Online shops, product catalogs, carts and checkout
triggers: magaza, mehsul, sebet, satış, satis, onlayn, shop, katalog, geyim, ayaqqabı, ayaqqabi, kosmetika, elektronika, sifariş, sifaris
always: false
---
# E-commerce playbook
- Pages (react-router): Home, Catalog (`/mehsullar`) with category filter + search + sort, Product detail (`/mehsul/:id`), Cart (`/sebet`), Checkout (`/sifaris`).
- Cart state in a React context (`src/context/CartContext.jsx`) persisted with `db` or localStorage; header shows item count badge.
- Products seeded via `db.collection("products").seed([...])` — 12+ items, price in ₼, each with its own matching photo `https://img.novo/800x1000/<specific-product-keywords>`, brand, rating + review count, optional oldPrice and badges, rating, stock.
- Checkout: name, phone, address, delivery method, payment "Qapıda nağd / Kartla" → `db.collection("orders").add(...)`, order number and thank-you screen.
- Admin (`/admin`): products CRUD table and orders list, protected by `useAuth()`.
