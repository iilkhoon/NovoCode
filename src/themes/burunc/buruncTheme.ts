/**
 * Novo Code-un Astryx mövzusu — "Nöqtə" (yalnız qaranlıq).
 *
 * Qara səhnə, ağ mətn, qrafit səthlər; vurğu rəng yox, ağ işıqdır.
 * Tokenlər src/app/globals.css-dəki "Nöqtə" dizayn sistemi ilə eynidir,
 * beləliklə Astryx komponentləri Tailwind ilə yazılmış hissələrlə bir dildə danışır.
 * (Fayl/slug adı "burunc" tarixi səbəbdən qalıb.)
 */
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';
import {palette} from './burunc.palette';

const {bronze, neutral, sapphire, green, red, yellow} = palette;
const a = (hex: string, alpha: string) => `${hex}${alpha}`;

const INK = '#ffffff';
const STAGE = '#000000';
const ACCENT = '#ffffff';

export const buruncTheme = defineTheme({
  name: 'burunc',
  extends: neutralTheme,

  typography: {
    scale: {base: 15, ratio: 1.2},
    body: {family: 'Inter Variable', fallbacks: 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif'},
    heading: {family: 'Inter Variable', fallbacks: 'Inter, "Segoe UI", system-ui, sans-serif', weights: {1: '600', 2: '600', 3: '600', 4: '500'}},
    code: {family: 'JetBrains Mono Variable', fallbacks: '"JetBrains Mono", ui-monospace, Menlo, monospace'},
  },

  // Emil Kowalski qaydaları: qısa, ease-out, heç vaxt ləng deyil.
  motion: {fast: 150, medium: 250, slow: 400, ratio: 0.8, easing: 'cubic-bezier(0.23, 1, 0.32, 1)'},

  tokens: {
    '--color-accent': ACCENT,
    '--color-accent-muted': a(ACCENT, '1f'),
    '--color-text-accent': '#ffffff',
    '--color-icon-accent': '#ffffff',
    '--color-on-accent': '#000000',

    '--color-background-body': STAGE,
    '--color-background-surface': '#0c0c0d',
    '--color-background-card': '#141415',
    '--color-background-popover': '#1c1c1e',
    '--color-background-muted': '#28282a',
    '--color-background-inverted': INK,
    '--color-neutral': a(INK, '12'),
    '--color-overlay': 'rgb(0 0 0 / 0.72)',
    '--color-overlay-hover': a(INK, '0d'),
    '--color-overlay-pressed': a(INK, '1a'),

    '--color-text-primary': INK,
    '--color-text-secondary': '#8e8e8e',
    '--color-text-disabled': '#5f5f64',
    '--color-icon-primary': INK,
    '--color-icon-secondary': '#8e8e8e',
    '--color-icon-disabled': '#5f5f64',
    '--color-on-dark': INK,
    '--color-on-light': '#000000',

    '--color-border': a(INK, '1a'),
    '--color-border-emphasized': a(INK, '33'),
    '--color-skeleton': a(INK, '14'),
    '--color-shadow': 'rgb(0 0 0 / 0.6)',
    '--color-tint-hover': INK,

    '--color-info': sapphire.dark[65],
    '--color-info-muted': a(sapphire.dark[50], '33'),
    '--color-on-info': '#000000',
    '--color-on-info-muted': sapphire.dark[85],
    '--color-text-info': sapphire.dark[75],

    '--color-success': green.dark[65],
    '--color-success-muted': a(green.dark[50], '2e'),
    '--color-on-success': '#000000',
    '--color-on-success-muted': green.dark[85],
    '--color-text-success': green.dark[75],

    '--color-warning': yellow.dark[75],
    '--color-warning-muted': a(yellow.dark[60], '2e'),
    '--color-on-warning': '#000000',
    '--color-on-warning-muted': yellow.dark[90],
    '--color-text-warning': yellow.dark[80],

    '--color-error': red.dark[60],
    '--color-error-muted': a(red.dark[50], '2e'),
    '--color-on-error': '#000000',
    '--color-on-error-muted': red.dark[85],
    '--color-text-error': red.dark[75],

    '--color-background-gray': a(INK, '14'),
    '--color-border-gray': a(INK, '26'),
    '--color-icon-gray': '#8e8e8e',
    '--color-text-gray': INK,
    '--color-background-orange': a(bronze.dark[60], '2e'),
    '--color-border-orange': a(bronze.dark[60], '66'),
    '--color-icon-orange': bronze.dark[75],
    '--color-text-orange': bronze.dark[85],
    '--color-background-blue': a(sapphire.dark[55], '33'),
    '--color-border-blue': a(sapphire.dark[60], '66'),
    '--color-icon-blue': sapphire.dark[75],
    '--color-text-blue': sapphire.dark[85],
    '--color-background-green': a(green.dark[55], '2e'),
    '--color-border-green': a(green.dark[60], '66'),
    '--color-icon-green': green.dark[75],
    '--color-text-green': green.dark[85],
    '--color-background-red': a(red.dark[55], '2e'),
    '--color-border-red': a(red.dark[60], '66'),
    '--color-icon-red': red.dark[75],
    '--color-text-red': red.dark[85],
    '--color-background-yellow': a(yellow.dark[60], '2e'),
    '--color-border-yellow': a(yellow.dark[60], '66'),
    '--color-icon-yellow': yellow.dark[80],
    '--color-text-yellow': yellow.dark[90],

    '--radius-none': '0px',
    '--radius-inner': '6px',
    '--radius-element': '10px',
    '--radius-container': '18px',
    '--radius-page': '26px',
    '--radius-full': '9999px',

    '--shadow-low': '0 1px 2px rgb(0 0 0 / 0.5), 0 4px 12px rgb(0 0 0 / 0.35)',
    '--shadow-med': '0 2px 6px rgb(0 0 0 / 0.5), 0 12px 32px rgb(0 0 0 / 0.45)',
    '--shadow-high': `0 0 0 1px ${a(INK, '14')}, 0 30px 80px -20px rgb(0 0 0 / 0.8)`,
    '--shadow-inset-hover': `inset 0 0 0 1px ${a(INK, '26')}`,
    '--shadow-inset-selected': `inset 0 0 0 1px ${ACCENT}`,
    '--shadow-inset-success': `inset 0 0 0 1px ${a(green.dark[60], '80')}`,
    '--shadow-inset-warning': `inset 0 0 0 1px ${a(yellow.dark[70], '80')}`,
    '--shadow-inset-error': `inset 0 0 0 1px ${a(red.dark[60], '80')}`,
  },

  components: {
    button: {
      base: {borderRadius: '9999px'},
      'variant:secondary': {
        backgroundColor: 'rgb(255 255 255 / 0.06)',
        color: 'var(--color-text-primary)',
        borderColor: 'rgb(255 255 255 / 0.12)',
      },
    },
    badge: {base: {borderRadius: '9999px'}},
    card: {base: {borderRadius: 'var(--radius-container)'}},
  },
});
