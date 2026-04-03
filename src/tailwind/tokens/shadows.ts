export const boxShadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  DEFAULT: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
  lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  'glow-primary': '0 0 0 3px rgba(99,102,241,0.3)',
  'glow-success': '0 0 8px rgba(34,197,94,0.4)',
};

export const keyframes = {
  ping: {
    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
  },
};

export const animation = {
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
};
