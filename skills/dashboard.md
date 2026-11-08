---
name: dashboard
description: Dashboards, admin panels, CRM, analytics and internal tools
triggers: dashboard, panel, statistika, hesabat, crm, analitika, idareetme, kpi, cedvel, inventar, anbar
always: false
---
# Dashboard playbook
- App shell: collapsible sidebar (lucide icons) + topbar with search and user menu; mobile: sidebar becomes a drawer.
- Overview: 4 KPI cards (value, change % with up/down color), a chart, recent activity table.
- Charts: build simple bar/line charts with inline SVG or CSS (no chart library unless asked; if needed `npm install recharts`).
- Tables: sortable headers, search filter, pagination of 10, status badges, row actions.
- Use a neutral, calm palette with one accent; dense but readable (`text-sm`).
- If the `astryx-ui` playbook is also loaded, build the shell, tables, forms and dialogs with Astryx components instead of by hand.
