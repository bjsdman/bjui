import type { Config } from 'tailwindcss';
import { colors } from './tokens/colors';
import { fontFamily, fontSize } from './tokens/typography';
import { boxShadow } from './tokens/shadows';
import { keyframes, animation } from './tokens/animations';
import plugin from 'tailwindcss/plugin';

const preset: Config = {
  // v2.0: dark is the only mode — direct token classes replace html.dark toggle
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      boxShadow,
      keyframes,
      animation,
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',   // buttons, inputs, small elements
        md: '8px',
        lg: '12px',       // cards
        xl: '16px',       // hero logo, large images
        '2xl': '20px',
        full: '9999px',
      },
      letterSpacing: {
        eyebrow: '0.14em',
        label:   '0.18em',
        nav:     '0.06em',
        btn:     '0.04em',
        form:    '0.10em',
      },
      lineHeight: {
        heading: '1.08',
        body:    '1.75',
        'body-lg': '1.80',
        loose:   '1.65',
      },
    },
  },
  plugins: [
    // Inject semantic CSS variables into :root
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--color-bg':            '#080f1a',
          '--color-surface':       '#0d1624',
          '--color-surface-2':     '#132035',
          '--color-border':        '#1c2e4a',
          '--color-border-subtle': '#243a5e',
          '--color-text':          '#f5ede0',
          '--color-text-muted':    '#94a3b8',
          '--color-text-faint':    '#64748b',
          '--color-accent':        '#c45c14',
          '--color-accent-hi':     '#d97030',
        },
      });
    }),
  ],
};

export default preset;
