import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rausch: {
          DEFAULT: '#ff385c',
          active: '#e00b41',
          disabled: '#ffd1da',
        },
        ink: '#222222',
        body: '#3f3f3f',
        canvas: '#ffffff',
        hairline: '#dddddd',
        'hairline-soft': '#ebebeb',
        'surface-soft': '#f7f7f7',
        'surface-strong': '#f2f2f2',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
