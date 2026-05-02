export const boxShadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  DEFAULT: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
  lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  // BMJ brand shadows
  'logo':    '0 0 0 1px rgba(196,92,20,0.25), 0 24px 80px rgba(196,92,20,0.20), 0 8px 32px rgba(0,0,0,0.50)',
  'card':    '0 4px 24px rgba(0,0,0,0.3)',
  'card-lg': '0 8px 40px rgba(0,0,0,0.4)',
  'copper':  '0 0 24px rgba(196,92,20,0.25)',
  // Legacy glow-success kept; glow-primary replaced with copper variant
  'glow-copper':  '0 0 0 3px rgba(196,92,20,0.3)',
  'glow-success': '0 0 8px rgba(91,168,111,0.4)',
};

export const keyframes = {
  ping: {
    '75%, 100%': { transform: 'scale(2)', opacity: '0' },
  },
};

export const animation = {
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
};
