/**
 * NovoCode-un Astryx mövzusu — "Şəfəq" (gündüz + gecə).
 *
 * Tokenlər birbaşa src/app/globals.css-dəki CSS dəyişənlərinə istinad edir, ona görə də
 * <html data-theme> dəyişəndə Astryx komponentləri (dialoq, əmr paleti) də avtomatik dəyişir.
 * Adı Tailwind tokenləri ilə üst-üstə düşən statuslar (success/warning/info) üçün
 * [gündüz, gecə] cütlüyü istifadə olunur ki, dövri istinad yaranmasın.
 * (Fayl/slug adı "burunc" tarixi səbəbdən qalıb.)
 */
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';
import {palette} from './burunc.palette';

const {bronze, sapphire, green, red, yellow} = palette;
const a = (hex: string, alpha: string) => `${hex}${alpha}`;
const mix = (v: string, pct: number) => `color-mix(in oklab, var(${v}) ${pct}%, transparent)`;

const INK = 'var(--color-ink-100)';
const ACCENT = 'var(--color-nar)';

export const buruncTheme = defineTheme({
  name: 'burunc',
  extends: neutralTheme,

  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: 'Onest Variable', fallbacks: 'Onest, "Segoe UI", system-ui, -apple-system, sans-serif'},
    heading: {family: 'Fraunces Variable', fallbacks: 'Fraunces, Georgia, serif', weights: {1: '500', 2: '500', 3: '500', 4: '500'}},
    code: {family: 'JetBrains Mono Variable', fallbacks: '"JetBrains Mono", ui-monospace, Menlo, monospace'},
  },

  // Emil Kowalski qaydaları: qısa, ease-out, heç vaxt ləng deyil.
  motion: {fast: 150, medium: 250, slow: 400, ratio: 0.8, easing: 'cubic-bezier(0.23, 1, 0.32, 1)'},

  tokens: {
    '--color-accent': ACCENT,
    '--color-accent-muted': mix('--color-nar', 14),
    '--color-text-accent': 'var(--color-nar-600)',
    '--color-icon-accent': 'var(--color-nar)',
    '--color-on-accent': '#ffffff',

    '--color-background-body': 'var(--color-ink-950)',
    '--color-background-surface': 'var(--color-ink-1000)',
    '--color-background-card': 'var(--color-ink-1000)',
    '--color-background-popover': 'var(--color-ink-1000)',
    '--color-background-muted': 'var(--color-ink-900)',
    '--color-background-inverted': INK,
    '--color-neutral': mix('--color-ink-100', 7),
    '--color-overlay': ['rgb(40 25 12 / 0.32)', 'rgb(0 0 0 / 0.66)'],
    '--color-overlay-hover': mix('--color-ink-100', 5),
    '--color-overlay-pressed': mix('--color-ink-100', 10),

    '--color-text-primary': INK,
    '--color-text-secondary': 'var(--color-ink-400)',
    '--color-text-disabled': 'var(--color-ink-600)',
    '--color-icon-primary': INK,
    '--color-icon-secondary': 'var(--color-ink-400)',
    '--color-icon-disabled': 'var(--color-ink-600)',
    '--color-on-dark': '#f5eee4',
    '--color-on-light': '#1d1814',

    '--color-border': mix('--color-ink-100', 9),
    '--color-border-emphasized': mix('--color-ink-100', 18),
    '--color-skeleton': mix('--color-ink-100', 7),
    '--color-shadow': ['rgb(60 35 15 / 0.18)', 'rgb(0 0 0 / 0.6)'],
    '--color-tint-hover': INK,

    '--color-info': [sapphire.light[45], sapphire.dark[65]],
    '--color-info-muted': [a(sapphire.light[50], '1f'), a(sapphire.dark[50], '33')],
    '--color-on-info': ['#ffffff', '#000000'],
    '--color-on-info-muted': [sapphire.light[30], sapphire.dark[85]],
    '--color-text-info': [sapphire.light[40], sapphire.dark[75]],

    '--color-success': [green.light[45], green.dark[65]],
    '--color-success-muted': [a(green.light[50], '1f'), a(green.dark[50], '2e')],
    '--color-on-success': ['#ffffff', '#000000'],
    '--color-on-success-muted': [green.light[30], green.dark[85]],
    '--color-text-success': [green.light[40], green.dark[75]],

    '--color-warning': [yellow.light[55], yellow.dark[75]],
    '--color-warning-muted': [a(yellow.light[60], '26'), a(yellow.dark[60], '2e')],
    '--color-on-warning': ['#000000', '#000000'],
    '--color-on-warning-muted': [yellow.light[30], yellow.dark[90]],
    '--color-text-warning': [yellow.light[40], yellow.dark[80]],

    '--color-error': [red.light[50], red.dark[60]],
    '--color-error-muted': [a(red.light[50], '1f'), a(red.dark[50], '2e')],
    '--color-on-error': ['#ffffff', '#000000'],
    '--color-on-error-muted': [red.light[30], red.dark[85]],
    '--color-text-error': [red.light[45], red.dark[75]],

    '--color-background-gray': mix('--color-ink-100', 7),
    '--color-border-gray': mix('--color-ink-100', 14),
    '--color-icon-gray': 'var(--color-ink-400)',
    '--color-text-gray': INK,
    '--color-background-orange': mix('--color-nar', 14),
    '--color-border-orange': mix('--color-nar', 40),
    '--color-icon-orange': 'var(--color-nar)',
    '--color-text-orange': 'var(--color-nar-600)',
    '--color-background-blue': [a(sapphire.light[50], '1f'), a(sapphire.dark[55], '33')],
    '--color-border-blue': [a(sapphire.light[50], '55'), a(sapphire.dark[60], '66')],
    '--color-icon-blue': [sapphire.light[45], sapphire.dark[75]],
    '--color-text-blue': [sapphire.light[35], sapphire.dark[85]],
    '--color-background-green': [a(green.light[50], '1f'), a(green.dark[55], '2e')],
    '--color-border-green': [a(green.light[50], '55'), a(green.dark[60], '66')],
    '--color-icon-green': [green.light[45], green.dark[75]],
    '--color-text-green': [green.light[35], green.dark[85]],
    '--color-background-red': [a(red.light[50], '1f'), a(red.dark[55], '2e')],
    '--color-border-red': [a(red.light[50], '55'), a(red.dark[60], '66')],
    '--color-icon-red': [red.light[45], red.dark[75]],
    '--color-text-red': [red.light[35], red.dark[85]],
    '--color-background-yellow': [a(yellow.light[60], '26'), a(yellow.dark[60], '2e')],
    '--color-border-yellow': [a(yellow.light[60], '66'), a(yellow.dark[60], '66')],
    '--color-icon-yellow': [yellow.light[50], yellow.dark[80]],
    '--color-text-yellow': [yellow.light[35], yellow.dark[90]],

    '--radius-none': '0px',
    '--radius-inner': '8px',
    '--radius-element': '12px',
    '--radius-container': '20px',
    '--radius-page': '28px',
    '--radius-full': '9999px',

    '--shadow-low': 'var(--shadow-card)',
    '--shadow-med': 'var(--shadow-panel)',
    '--shadow-high': `0 0 0 1px ${mix('--color-ink-100', 8)}, var(--shadow-panel)`,
    '--shadow-inset-hover': `inset 0 0 0 1px ${mix('--color-ink-100', 16)}`,
    '--shadow-inset-selected': `inset 0 0 0 1px ${ACCENT}`,
    '--shadow-inset-success': `inset 0 0 0 1px ${a(green.dark[60], '80')}`,
    '--shadow-inset-warning': `inset 0 0 0 1px ${a(yellow.dark[70], '80')}`,
    '--shadow-inset-error': `inset 0 0 0 1px ${a(red.dark[60], '80')}`,
  },

  components: {
    button: {
      base: {borderRadius: '9999px'},
      'variant:secondary': {
        backgroundColor: 'var(--color-ink-1000)',
        color: 'var(--color-text-primary)',
        borderColor: mix('--color-ink-100', 12),
      },
    },
    badge: {base: {borderRadius: '9999px'}},
    card: {base: {borderRadius: 'var(--radius-container)'}},
  },
});
