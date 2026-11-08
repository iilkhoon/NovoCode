---
name: astryx-ui
description: Astryx (Meta) design system for dashboards, admin panels and internal tools — accessible ready-made components
triggers: dashboard, panel, admin, crm, analitika, statistika, hesabat, cedvel, inventar, anbar, idareetme, kpi, daxili, astryx, sistem, erp, mektebler, muhasibat, sifarisler
always: false
---
# Astryx UI playbook (app-like products only)
Use Astryx for dashboards, admin panels, CRMs and internal tools. Do NOT use it for marketing/landing pages, portfolios or restaurants: those stay hand-built with Tailwind.

## Setup (do all of this once)
1. `<novo-shell>npm install @astryxdesign/core@0.7.11 @astryxdesign/theme-neutral@0.7.11 @stylexjs/stylex@0.19</novo-shell>`
2. Top of `src/index.css`. Keep the existing `@theme` block below it:
```css
@layer theme, reset, base, astryx-base, astryx-theme, components, utilities;
@import "tailwindcss";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
```
3. In `src/main.jsx`, wrap `<App/>` with the theme:
```jsx
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
<Theme theme={neutralTheme} mode="light"><App /></Theme>
```
Use `mode="dark"` when the brand is dark. To brand it, add `--color-accent` (and if needed `--color-background-body`) overrides inside `[data-astryx-theme] { … }` in `index.css`.

## Imports and APIs
Import each component from its own path, e.g. `import { Button } from "@astryxdesign/core/Button"`.
- Shell: `AppShell` (props `topNav`, `sideNav`, `children`), `TopNav` (`heading`, `startContent`, `endContent`), `SideNav` (`header`, `footer`, children) with `SideNavSection` and `SideNavItem` (`label`, `icon={LucideIcon}`, `isSelected`, `onClick` | `href`), plus `MobileNav`.
- Text: `Heading` (`level={1..6}`, required) and `Text`.
- Layout: `Stack` / `HStack` / `VStack` (`gap={4}` takes a NUMBER, never a string), `Grid`, `Card` (`variant`), `Section`, `Divider`.
- Actions: `Button` (`label` is REQUIRED, `variant` = primary | secondary | ghost | destructive, `icon`, `onClick`) and `IconButton`. Also `DropdownMenu` with `DropdownMenuItem`.
- Data:
  - `Table` (`data`, `columns=[{ key, header, renderCell? }]`, widths via `proportional(n)` / `pixel(n)` from `@astryxdesign/core/Table`);
  - `Pagination`, `Badge` (`label` required; variants are success, warning, error, info, neutral, plus color names), `StatusDot`, `ProgressBar`, `EmptyState`, `Skeleton`, `MetadataList`.
- Forms:
  - `TextInput` (`label` and `value` are required, `onChange={(value) => …}` receives the VALUE, not the event), `TextArea`, `NumberInput`;
  - `Selector` (`label`, `options`, `value`, `onChange`), `CheckboxInput`, `Switch`, `RadioList`, `DateInput`;
  - `FormLayout`, `Field`.
- Overlays: `Dialog` (`isOpen`, `onOpenChange`) with `DialogHeader` (`title`), `AlertDialog` for delete confirmations, `Drawer`, `Popover`, `Tooltip` (`content`), `CommandPalette`, `Toast`.
- Navigation: `TabList` with `Tab`, `SegmentedControl`, `Breadcrumbs`, `Stepper`.
- Icons: `SideNavItem`/`Icon` take a lucide COMPONENT (`icon={Users}`); `Button`/`Badge` take an ELEMENT (`icon={<Users className="size-4" />}`).

## Rules
- Prefer Astryx components over hand-made equivalents when they exist. Use Tailwind only for page layout and spacing around them.
- Every label is Azerbaijani: "Axtar", "Yadda saxla", "Sil", "Ləğv et", "Heç nə tapılmadı".
- Every delete goes through `AlertDialog`. Every list has an `EmptyState`. Every loading state shows a `Skeleton`.
- If an import fails, read the terminal error and fix the import path. Never invent a component that is not listed above.
