import type { Config } from 'tailwindcss';
import { colors } from './tokens/colors';
import { fontFamily, fontSize } from './tokens/typography';
import { boxShadow } from './tokens/shadows';
import { keyframes, animation } from './tokens/animations';

const preset: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      boxShadow,
      keyframes,
      animation,
      borderRadius: {
        DEFAULT: '4px',
        none: '0',
        sm: '2px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default preset;
