export const keyframes = {
  ping: {
    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
  },
  'pulse-subtle': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
};

export const animation = {
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
};
