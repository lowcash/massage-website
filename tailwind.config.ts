import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontSize: {
        'dancing-lg': ['3rem', { fontFamily: 'var(--font-dancing)' }],
        'dancing-md': ['2.2rem', { fontFamily: 'var(--font-dancing)' }],
        'dancing-sm': ['1.6rem', { fontFamily: 'var(--font-dancing)' }],
      },
    },
  },
};

export default config;
